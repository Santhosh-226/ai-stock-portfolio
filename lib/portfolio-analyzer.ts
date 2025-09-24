import type { StockHolding } from "./csv-parser"

export interface PortfolioMetrics {
  totalValue: number
  totalInvested: number
  totalPnL: number
  totalHoldings: number
  averagePosition: number
  concentrationRisk: number
  topHoldings: StockHolding[]
  sectorAllocation: { [sector: string]: number }
  riskMetrics: {
    concentration: number
    diversificationScore: number
  }
  pnlPercentage: number
}

export interface PortfolioInsights {
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  riskLevel: "Low" | "Medium" | "High"
}

export function analyzePortfolio(holdings: StockHolding[]): PortfolioMetrics {
  const totalValue = holdings.reduce((sum, holding) => sum + holding.currentValue, 0)
  const totalInvested = holdings.reduce((sum, holding) => sum + holding.invested, 0)
  const totalPnL = holdings.reduce((sum, holding) => sum + holding.pnl, 0)
  const averagePosition = totalValue / holdings.length
  const pnlPercentage = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0

  // Sort by current value for top holdings
  const sortedHoldings = [...holdings].sort((a, b) => b.currentValue - a.currentValue)
  const topHoldings = sortedHoldings.slice(0, 5)

  // Calculate concentration risk (largest position as percentage)
  const concentrationRisk = sortedHoldings.length > 0 ? (sortedHoldings[0].currentValue / totalValue) * 100 : 0

  // Calculate sector allocation
  const sectorAllocation: { [sector: string]: number } = {}
  holdings.forEach((holding) => {
    const sector = holding.sector || "Other"
    sectorAllocation[sector] = (sectorAllocation[sector] || 0) + holding.currentValue
  })

  // Convert to percentages
  Object.keys(sectorAllocation).forEach((sector) => {
    sectorAllocation[sector] = (sectorAllocation[sector] / totalValue) * 100
  })

  // Calculate risk metrics
  const concentration = Math.max(...holdings.map((h) => h.percentage || 0))
  const diversificationScore = calculateDiversificationScore(holdings)

  return {
    totalValue,
    totalInvested,
    totalPnL,
    totalHoldings: holdings.length,
    averagePosition,
    concentrationRisk,
    topHoldings,
    sectorAllocation,
    riskMetrics: {
      concentration,
      diversificationScore,
    },
    pnlPercentage,
  }
}

export function generateInsights(metrics: PortfolioMetrics): PortfolioInsights {
  const strengths: string[] = []
  const weaknesses: string[] = []
  const recommendations: string[] = []

  // Analyze diversification
  if (metrics.totalHoldings >= 8) {
    strengths.push("Well-diversified mutual fund portfolio")
  } else if (metrics.totalHoldings < 5) {
    weaknesses.push("Limited diversification with few fund holdings")
    recommendations.push("Consider adding more mutual funds across different categories")
  }

  // Analyze concentration risk
  if (metrics.riskMetrics.concentration > 30) {
    weaknesses.push("High concentration risk in single fund")
    recommendations.push("Consider reducing allocation to largest fund")
  } else if (metrics.riskMetrics.concentration < 20) {
    strengths.push("Good fund allocation with balanced position sizing")
  }

  // Analyze sector/category allocation
  const categoryCount = Object.keys(metrics.sectorAllocation).length
  if (categoryCount >= 4) {
    strengths.push("Good category diversification across fund types")
  } else {
    weaknesses.push("Limited fund category diversification")
    recommendations.push("Consider adding exposure to different fund categories (Large Cap, Mid Cap, Small Cap, etc.)")
  }

  // Check for equity concentration
  const equityAllocation =
    (metrics.sectorAllocation["Large Cap Equity"] || 0) +
    (metrics.sectorAllocation["Mid Cap Equity"] || 0) +
    (metrics.sectorAllocation["Small Cap Equity"] || 0)
  if (equityAllocation > 80) {
    weaknesses.push("High concentration in equity funds")
    recommendations.push("Consider adding debt or hybrid funds for better risk management")
  }

  // Analyze performance
  if (metrics.pnlPercentage > 10) {
    strengths.push("Strong portfolio performance with good returns")
  } else if (metrics.pnlPercentage < -5) {
    weaknesses.push("Portfolio showing negative returns")
    recommendations.push("Review fund performance and consider rebalancing")
  }

  // Determine risk level
  let riskLevel: "Low" | "Medium" | "High" = "Medium"
  if (metrics.riskMetrics.concentration > 35 || equityAllocation > 90) {
    riskLevel = "High"
  } else if (metrics.riskMetrics.concentration < 20 && categoryCount >= 4) {
    riskLevel = "Low"
  }

  return {
    strengths,
    weaknesses,
    recommendations,
    riskLevel,
  }
}

function calculateDiversificationScore(holdings: StockHolding[]): number {
  // Simple diversification score based on number of holdings and concentration
  const numberOfHoldings = holdings.length
  const maxConcentration = Math.max(...holdings.map((h) => h.percentage || 0))

  let score = Math.min(numberOfHoldings * 8, 60) // Max 60 points for number of holdings (mutual funds need fewer holdings)
  score += Math.max(0, 40 - maxConcentration * 1.5) // Penalty for concentration

  return Math.min(100, score)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPercentage(percentage: number): string {
  return `${percentage.toFixed(1)}%`
}
