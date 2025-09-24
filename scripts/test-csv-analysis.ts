import { fetchAndParseCSV } from "../lib/csv-parser"
import { analyzePortfolio, generateInsights } from "../lib/portfolio-analyzer"

async function testCSVAnalysis() {
  try {
    console.log("[v0] Starting CSV analysis test...")

    const csvUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/holdings-gF8KZLRXjVSLNaGQcaRwWP2xEBbtyV.csv"

    console.log("[v0] Fetching CSV from:", csvUrl)
    const holdings = await fetchAndParseCSV(csvUrl)

    console.log("[v0] Parsed holdings:", holdings.length, "funds")
    console.log("[v0] Sample holding:", holdings[0])

    console.log("[v0] Analyzing portfolio...")
    const metrics = analyzePortfolio(holdings)

    console.log("[v0] Portfolio metrics:")
    console.log("- Total Value:", metrics.totalValue.toFixed(2))
    console.log("- Total Invested:", metrics.totalInvested.toFixed(2))
    console.log("- Total P&L:", metrics.totalPnL.toFixed(2))
    console.log("- P&L Percentage:", metrics.pnlPercentage.toFixed(2) + "%")
    console.log("- Number of Holdings:", metrics.totalHoldings)
    console.log("- Concentration Risk:", metrics.concentrationRisk.toFixed(2) + "%")

    console.log("[v0] Sector Allocation:")
    Object.entries(metrics.sectorAllocation).forEach(([sector, percentage]) => {
      console.log(`- ${sector}: ${percentage.toFixed(1)}%`)
    })

    console.log("[v0] Generating insights...")
    const insights = generateInsights(metrics)

    console.log("[v0] Portfolio Insights:")
    console.log("Risk Level:", insights.riskLevel)
    console.log("Strengths:", insights.strengths)
    console.log("Weaknesses:", insights.weaknesses)
    console.log("Recommendations:", insights.recommendations)
  } catch (error) {
    console.error("[v0] Error in CSV analysis test:", error)
  }
}

testCSVAnalysis()
