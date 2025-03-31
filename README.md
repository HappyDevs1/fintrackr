# 💰 Fintrackr

![Dashboard Preview](https://github.com/HappyDevs1/fintrackr/blob/main/Screenshot%20(163).png?raw=true)  
*Visualize your spending patterns and predict future balances*

## 🌟 Features

- **Transaction Analysis** - Categorize and visualize spending habits
- **Balance Forecasting** - Predict account balances 30 days into the future
- **Smart Alerts** - Get warnings before low-balance situations occur
- **Spending Insights** - Identify top spending categories with interactive charts

## 🛠️ Tech Stack

| Component          | Technology               |
|--------------------|--------------------------|
| Frontend           | Next.js 14, TypeScript   |
| Backend            | Express.js, Node.js      |
| Machine Learning   | Python, scikit-learn     |
| Visualization      | Chart.js, Matplotlib     |
| API Integration    | Investec OpenAPI         |

## 📦 Installation

### Prerequisites
- Node.js 18+
- Python 3.9+
- Investec API credentials

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/HappyDevs1/fintrackr.git
   cd fintrackr
2. **Set up environment variables**
   Create .env in the root of the server folder
   ```bash
   PORT=4000
   CLIENT_ID=<your_investec_client_id>
   CLIENT_SECRET=<your_investec_secret>
   API_KEY=<your_investec_api_key>
   ACCOUNT_ID=<your_account_number>
3. **Install Python dependencies**
   ```bash
   cd server/model
   pip install -r requirements.txt
   
5. Install Node dependencies
   ```bash
   Start by, cd server
   npm i
   For front end dependencies, cd client
   npm i
6. Run the application
   ```bash
   # Start backend
   cd server && npm run dev
   # In another terminal, start frontend
   cd client && npm run dev


## 🧠 Machine Learning Model
**Model Architecture**
Algorithm: Random Forest Regressor

**Features Engineered:**
- Daily balance trends
- Day-of-the week spending patterns
- 7/30-day rolling average
- Transaction type indication

**Key Metrics**
- Mean Absolute Error: R84.51
- Forecast Horizon: 30 days
- Training Data: 6 monts of transaction history


## 🤝 Contributing
1. Fork teh project
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m "Add some amazing feature")
4. Push to the branch(git push origin feature/AmazingFeature)
5. Open a Pull Request
