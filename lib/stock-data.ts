// Mock stock data service - in production, integrate with real APIs like Alpha Vantage, Yahoo Finance, etc.

export interface StockQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
  pe?: number
  dividend?: number
}

export interface StockNews {
  title: string
  summary: string
  url: string
  publishedAt: Date
  source: string
}

// Mock data for demonstration
const MOCK_QUOTES: { [symbol: string]: StockQuote } = {
  AAPL: {
    symbol: "AAPL",
    price: 175.43,
    change: 2.15,
    changePercent: 1.24,
    volume: 45234567,
    marketCap: 2800000000000,
    pe: 28.5,
    dividend: 0.96,
  },
  MSFT: {
    symbol: "MSFT",
    price: 378.85,
    change: -1.23,
    changePercent: -0.32,
    volume: 23456789,
    marketCap: 2900000000000,
    pe: 32.1,
    dividend: 2.72,
  },
  GOOGL: {
    symbol: "GOOGL",
    price: 142.56,
    change: 0.87,
    changePercent: 0.61,
    volume: 18765432,
    marketCap: 1800000000000,
    pe: 25.3,
    dividend: 0,
  },
  AMZN: {
    symbol: "AMZN",
    price: 155.89,
    change: -2.45,
    changePercent: -1.55,
    volume: 34567890,
    marketCap: 1600000000000,
    pe: 45.2,
    dividend: 0,
  },
  TSLA: {
    symbol: "TSLA",
    price: 248.42,
    change: 5.67,
    changePercent: 2.34,
    volume: 67890123,
    marketCap: 800000000000,
    pe: 65.4,
    dividend: 0,
  },
}

export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return (
    MOCK_QUOTES[symbol] || {
      symbol,
      price: Math.random() * 200 + 50,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
      volume: Math.floor(Math.random() * 50000000) + 1000000,
    }
  )
}

export async function getMultipleQuotes(symbols: string[]): Promise<StockQuote[]> {
  const quotes = await Promise.all(symbols.map((symbol) => getStockQuote(symbol)))
  return quotes.filter((quote) => quote !== null) as StockQuote[]
}

export async function getStockNews(symbol: string): Promise<StockNews[]> {
  // Mock news data
  return [
    {
      title: `${symbol} Reports Strong Quarterly Earnings`,
      summary: `${symbol} exceeded analyst expectations with strong revenue growth and improved margins.`,
      url: "#",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      source: "Financial News",
    },
    {
      title: `Analysts Upgrade ${symbol} Price Target`,
      summary: `Multiple analysts have raised their price targets following recent developments.`,
      url: "#",
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      source: "Market Watch",
    },
  ]
}
