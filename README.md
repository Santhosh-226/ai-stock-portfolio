<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=200&section=header&text=Smart%20Stock%20Analyzer&fontSize=46&fontColor=fff&animation=twinkling&fontAlignY=35&desc=AI-Powered%20Stock%20Portfolio%20Analysis%20%7C%20Flask%20%2B%20React%20%7C%20Groq%20API&descAlignY=62&descSize=15" width="100%"/>

<br/>

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Flask](https://img.shields.io/badge/Flask-3.x-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![Groq](https://img.shields.io/badge/Groq%20API-Powered-00A67E?style=flat-square&logoColor=white)](https://groq.com)
[![Status](https://img.shields.io/badge/Status-Active-38bdae?style=flat-square)]()

<br/>

> **A full-stack AI-powered stock portfolio analyzer with real-time data visualization and intelligent investment insights powered by Groq LLM.**

<br/>

[🚀 Live Demo](#) • [📖 Docs](#installation) • [🐛 Issues](https://github.com/Santhosh-226/ai-stock-portfolio/issues) • [🤝 Contribute](#contributing)

</div>

---

## 📸 Preview

<div align="center">

| Dashboard | AI Insights | Charts |
|:---------:|:-----------:|:------:|
| Portfolio overview with P&L | Groq-powered investment advice | Matplotlib + Pandas visualizations |

</div>

---

## ✨ Features

- 📊 **Interactive Portfolio Dashboard** — Track stocks, P&L, and portfolio allocation at a glance
- 🤖 **AI Investment Insights** — Groq LLM analyzes your portfolio and provides personalized recommendations
- 📈 **Data Visualization** — Rich charts built with Matplotlib and rendered in React
- 🔍 **Stock Analysis** — Detailed breakdown of individual stock performance using Pandas
- 💡 **Smart Suggestions** — AI-driven buy/hold/sell signals based on portfolio composition
- ⚡ **Fast API Backend** — Flask REST API serving data efficiently to the React frontend
- 📱 **Responsive UI** — Clean, modern interface that works across devices

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|:------|:-----------|
| **Frontend** | React.js, JavaScript, CSS3 |
| **Backend** | Python, Flask |
| **Data Processing** | Pandas, NumPy |
| **Visualization** | Matplotlib, Chart.js |
| **AI / LLM** | Groq API (LLaMA 3) |
| **Dev Tools** | Git, GitHub, VS Code |

</div>

---

## 🗂️ Project Structure

```
ai-stock-portfolio/
│
├── backend/
│   ├── app.py                  # Flask entry point & API routes
│   ├── analyzer.py             # Portfolio analysis logic (Pandas)
│   ├── groq_insights.py        # Groq API integration for AI insights
│   ├── visualizer.py           # Matplotlib chart generation
│   └── requirements.txt        # Python dependencies
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx   # Main portfolio dashboard
│   │   │   ├── StockCard.jsx   # Individual stock display
│   │   │   ├── ChartView.jsx   # Visualization components
│   │   │   └── AIInsights.jsx  # Groq AI recommendations panel
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
│
├── data/
│   └── sample_portfolio.csv    # Sample portfolio data
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- A [Groq API Key](https://console.groq.com) (free tier available)

### 1. Clone the Repository

```bash
git clone https://github.com/Santhosh-226/ai-stock-portfolio.git
cd ai-stock-portfolio
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set your Groq API key
export GROQ_API_KEY="your_groq_api_key_here"
# On Windows: set GROQ_API_KEY=your_groq_api_key_here

# Start Flask server
python app.py
```

Flask will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Open a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

React app will open at `http://localhost:3000`

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
GROQ_API_KEY=your_groq_api_key_here
FLASK_ENV=development
FLASK_PORT=5000
```

> ⚠️ **Never commit your `.env` file.** It's already in `.gitignore`.

---

## 🚀 Usage

1. **Add your portfolio** — Enter stock tickers and quantities in the dashboard
2. **View Analytics** — See real-time P&L, allocation charts, and performance metrics
3. **Get AI Insights** — Click "Analyze with AI" to get Groq-powered investment recommendations
4. **Explore Charts** — Interactive Matplotlib visualizations rendered as images in the React UI

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|:------:|:---------|:------------|
| `GET` | `/api/portfolio` | Fetch current portfolio data |
| `POST` | `/api/portfolio/add` | Add a stock to portfolio |
| `DELETE` | `/api/portfolio/remove/:ticker` | Remove a stock |
| `GET` | `/api/analysis` | Run Pandas portfolio analysis |
| `GET` | `/api/insights` | Get Groq AI investment insights |
| `GET` | `/api/chart/:type` | Fetch generated chart image |

---

## 🧠 How the AI Works

```
User Portfolio Data
      │
      ▼
┌─────────────────┐
│  Pandas Engine  │  ← Calculates returns, allocation, risk metrics
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Groq LLM API  │  ← LLaMA 3 model analyzes portfolio context
│  (LLaMA 3 70B)  │    and generates investment recommendations
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  React Frontend │  ← Displays structured AI insights to user
└─────────────────┘
```

The Groq API is prompted with structured portfolio data — including holdings, P&L percentages, sector exposure, and risk scores — and returns actionable insights such as diversification tips, over-concentration warnings, and suggested rebalancing strategies.

---

## 📊 Sample Output

```
📈 Portfolio Summary
─────────────────────────────────────────
  Total Invested  : ₹1,25,000
  Current Value   : ₹1,38,450
  Overall Return  : +10.76% 🟢
  Best Performer  : INFY  (+18.3%)
  Worst Performer : TATAMOTORS (-4.1%)

🤖 AI Insight (Groq)
─────────────────────────────────────────
  ⚠️  High concentration in IT sector (62%)
  💡  Consider diversifying into FMCG or Pharma
  ✅  HDFC Bank holding shows strong fundamentals
  📉  Review TATAMOTORS position — below support
```

---

## 🔮 Roadmap

- [ ] Live stock price integration (Yahoo Finance / NSE API)
- [ ] User authentication & saved portfolios
- [ ] Mobile app (React Native)
- [ ] Historical backtesting engine
- [ ] WhatsApp / Email alerts for portfolio events
- [ ] Support for mutual funds & crypto

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# 1. Fork the repo
# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m "Add AmazingFeature"

# 4. Push to branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request
```

---

## 👨‍💻 Author

<div align="center">

**Santhosh K**
B.Tech AIML | Kongu Engineering College

[![GitHub](https://img.shields.io/badge/GitHub-Santhosh--226-181717?style=flat-square&logo=github)](https://github.com/Santhosh-226)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Santhosh%20K-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/santhosh-k-2341aa331)
[![Email](https://img.shields.io/badge/Email-santhoshkalivarathan%40gmail.com-D14836?style=flat-square&logo=gmail)](mailto:santhoshkalivarathan@gmail.com)

</div>
---

## ⭐ Show Your Support

If this project helped you, please give it a **⭐ Star** — it means a lot!

<div align="center">

[![Star History](https://img.shields.io/github/stars/Santhosh-226/ai-stock-portfolio?style=social)](https://github.com/Santhosh-226/ai-stock-portfolio/stargazers)

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=120&section=footer&animation=twinkling" width="100%"/>

</div>
