import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
import numpy as np
import matplotlib.pyplot as plt
import json
from datetime import datetime
from io import BytesIO
import base64
import sys

# Data preparation

def json_to_dataframe(json_input):
    # Load the data based on input type
    if isinstance(json_input, str) and json_input.endswith('.json'):
        # Input is a file path
        try:
            with open(json_input, 'r') as f:
                data = json.load(f)
        except FileNotFoundError:
            raise FileNotFoundError(f"File not found: {json_input}")
        except json.JSONDecodeError:
            raise ValueError(f"Invalid JSON in file: {json_input}")
    elif isinstance(json_input, str):
        # Input is a JSON string
        try:
            data = json.loads(json_input)
        except json.JSONDecodeError:
            raise ValueError("Invalid JSON string provided")
    elif isinstance(json_input, dict):
        # Input is already a dictionary
        data = json_input
    else:
        raise ValueError("Input must be either a file path, JSON string, or dictionary")
    
    # Extract transactions from the nested structure
    try:
        transactions = data['data']['transactions']
    except KeyError:
        raise ValueError("JSON structure doesn't contain data->transactions")
    
    # Create DataFrame
    df = pd.DataFrame(transactions)
    
    # Convert dates to datetime objects
    date_cols = ['postingDate', 'valueDate', 'actionDate', 'transactionDate']
    for col in date_cols:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors='coerce')  # coerce handles invalid dates
    
    # Create features from dates
    if 'postingDate' in df.columns and 'transactionDate' in df.columns:
        df['days_since_transaction'] = (df['postingDate'] - df['transactionDate']).dt.days
    
    if 'transactionDate' in df.columns:
        df['day_of_week'] = df['transactionDate'].dt.dayofweek
        df['day_of_month'] = df['transactionDate'].dt.day
        df['month'] = df['transactionDate'].dt.month
        df['year'] = df['transactionDate'].dt.year
        df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
    
    # Convert amount to numeric (positive for credits, negative for debits)
    if 'amount' in df.columns and 'type' in df.columns:
        df['amount'] = df.apply(
            lambda x: x['amount'] if x['type'] == 'CREDIT' else -x['amount'], 
            axis=1
        )
    
    # Sort by date if available
    if 'transactionDate' in df.columns:
        df = df.sort_values('transactionDate')
    
    # Calculate running balance if not available
    if 'runningBalance' not in df.columns and 'amount' in df.columns:
        df['runningBalance'] = df['amount'].cumsum()
    
    # Add useful metadata
    df['is_income'] = df['type'] == 'CREDIT'
    df['is_expense'] = df['type'] == 'DEBIT'
    
    return df

# df = json_to_dataframe()  # Replace with your JSON input
# df

# feature engineering

def create_features(df, forecast_days=30):
    # Create a complete date range
    min_date = df['transactionDate'].min()
    max_date = df['transactionDate'].max() + pd.Timedelta(days=forecast_days)
    all_dates = pd.date_range(min_date, max_date, freq='D')
    
    # Create daily balance dataframe
    daily_balances = pd.DataFrame(index=all_dates)
    
    # Calculate running balance for each day
    daily_balances['balance'] = df.groupby('transactionDate')['amount'].sum().reindex(all_dates).cumsum().ffill()
    
    # Add the initial balance (you'll need to get this from the API)
    # For example, if the first runningBalance is 28451.28 (from your sample)
    initial_balance = df.iloc[0]['runningBalance'] - df.iloc[0]['amount']
    daily_balances['balance'] += initial_balance
    
    # Create features
    daily_balances['day_of_week'] = daily_balances.index.dayofweek
    daily_balances['day_of_month'] = daily_balances.index.day
    daily_balances['month'] = daily_balances.index.month
    daily_balances['is_weekend'] = daily_balances['day_of_week'].isin([5, 6]).astype(int)
    
    # Lag features
    for lag in [1, 7, 14, 30]:
        daily_balances[f'balance_lag_{lag}'] = daily_balances['balance'].shift(lag)
    
    # Rolling features
    daily_balances['rolling_7_mean'] = daily_balances['balance'].rolling(7).mean()
    daily_balances['rolling_30_mean'] = daily_balances['balance'].rolling(30).mean()
    
    return daily_balances.dropna()

# create_features(df, forecast_days=30)

# Model building

def train_model(daily_balances, forecast_days=30):
    # Prepare data
    X = daily_balances.drop(columns=['balance'])
    y = daily_balances['balance']
    
    # Split into train and test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
    
    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate
    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    # print(f"Mean Absolute Error: R{mae:.2f}")
    
    return model

# daily_balances = create_features(df)
# model = train_model(daily_balances)

# Forecasting future balance

def forecast_future(model, daily_balances, forecast_days=30):
    last_date = daily_balances.index[-1]
    forecast_dates = pd.date_range(last_date + pd.Timedelta(days=1), 
                              last_date + pd.Timedelta(days=forecast_days))
    
    forecast_df = pd.DataFrame(index=forecast_dates)
    
    # Initialize with last known values
    last_known = daily_balances.iloc[-1].copy()
    
    for date in forecast_dates:
        # Update date-related features
        last_known['day_of_week'] = date.dayofweek
        last_known['day_of_month'] = date.day
        last_known['month'] = date.month
        last_known['is_weekend'] = 1 if date.dayofweek in [5, 6] else 0
        
        # Predict balance for this day
        features = last_known.drop('balance').values.reshape(1, -1)
        predicted_balance = model.predict(features)[0]
        
        # Update forecast_df
        forecast_df.loc[date, 'balance'] = predicted_balance
        
        # Update last_known for next iteration
        last_known['balance'] = predicted_balance
        for lag in [1, 7, 14, 30]:
            if lag == 1:
                last_known[f'balance_lag_{lag}'] = daily_balances['balance'].iloc[-1] if date == forecast_dates[0] else forecast_df['balance'].iloc[-2]
            else:
                if (date - pd.Timedelta(days=lag-1)) in daily_balances.index:
                    last_known[f'balance_lag_{lag}'] = daily_balances.loc[date - pd.Timedelta(days=lag-1), 'balance']
                elif (date - pd.Timedelta(days=lag-1)) in forecast_df.index:
                    idx = forecast_df.index.get_loc(date - pd.Timedelta(days=lag-1))
                    last_known[f'balance_lag_{lag}'] = forecast_df.iloc[idx]['balance']
        
        # Update rolling means
        past_7 = daily_balances['balance'].iloc[-7:].tolist() + forecast_df['balance'].tolist()
        last_known['rolling_7_mean'] = np.mean(past_7[-7:])
        
        past_30 = daily_balances['balance'].iloc[-30:].tolist() + forecast_df['balance'].tolist()
        last_known['rolling_30_mean'] = np.mean(past_30[-30:])
    
    return forecast_df

# forecast_df = forecast_future(model, daily_balances, forecast_days=30)
# forecast_df

def plot_forecast(daily_balances, forecast_df):
    plt.figure(figsize=(12, 6))
    plt.plot(daily_balances.index, daily_balances['balance'], label='Historical Balance')
    plt.plot(forecast_df.index, forecast_df['balance'], label='Forecasted Balance', linestyle='--')
    
    # Highlight when balance goes below a threshold (e.g., R1000)
    threshold = 1000
    below_threshold = forecast_df[forecast_df['balance'] < threshold]
    if not below_threshold.empty:
        first_below = below_threshold.index[0]
        plt.axvline(first_below, color='red', linestyle=':', label=f'First below R{threshold}')
        plt.axhline(threshold, color='gray', linestyle=':')
        plt.text(first_below, threshold*1.1, f"Balance drops below R{threshold}\non {first_below.strftime('%Y-%m-%d')}", 
                 ha='left', va='bottom')
    
    plt.title('Account Balance Forecast')
    plt.xlabel('Date')
    plt.ylabel('Balance (R)')
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.show()

def generate_alerts(forecast_df, threshold=1000):
    alerts = []
    below_threshold = forecast_df[forecast_df['balance'] < threshold]
    
    if not below_threshold.empty:
        first_below = below_threshold.index[0]
        days_until = (first_below - pd.Timestamp.today()).days
        min_balance = forecast_df['balance'].min()
        
        alerts.append({
            'type': 'low_balance',
            'message': f"You will have less than R{threshold} in {days_until} days",
            'date': first_below.strftime('%Y-%m-%d'),
            'projected_min_balance': round(min_balance, 2)
        })
    
    return alerts

# plot_forecast(daily_balances, forecast_df)

# Main function to run all the functions
def main():
    try:
        # Read JSON from stdin
        json_input = sys.stdin.read()
        if not json_input:
            raise ValueError("No input data received")
        
        # Process data
        df = json_to_dataframe(json.loads(json_input))
        daily_balances = create_features(df)
        model = train_model(daily_balances)
        forecast = forecast_future(model, daily_balances, 30)
        
        # Generate plot
        plt.figure(figsize=(12, 6))
        plt.plot(daily_balances.index, daily_balances['balance'], label='Historical')
        plt.plot(forecast.index, forecast['balance'], label='Forecast')
        plt.legend()
        plt.title('Account Balance Forecast')
        plt.xlabel('Date')
        plt.ylabel('Balance (R)')
        
        # Convert plot to base64
        buf = BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight')
        plt.close()
        plot_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
        
        # Generate alerts
        alerts = generate_alerts(forecast)
        
        # Output JSON
        print(json.dumps({
            "forecast": forecast.to_dict(orient='records'),  # Changed to 'records' for better frontend handling
            "alerts": alerts,
            "lowest_balance": forecast['balance'].min(),
            "lowest_balance_date": forecast['balance'].idxmin().strftime('%Y-%m-%d'),
            "plot": plot_base64,
        }))
        sys.exit(0)  # Explicit success exit
        
    except Exception as e:
        print(f"Python Error: {str(e)}", file=sys.stderr)
        sys.exit(1)  # Explicit error exit

if __name__ == "__main__":
    main()