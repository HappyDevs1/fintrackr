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
4. Install Node dependencies
5. Run the application
   ```bash
   # Start backend
   cd server && npm run dev
   # In another terminal, start frontend
   cd client && npm run dev
   
