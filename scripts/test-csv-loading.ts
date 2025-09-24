import { fetchAndParseCSV } from "../lib/csv-parser"

async function testCSVLoading() {
  console.log("[v0] Testing CSV loading from provided URL...")

  try {
    const holdings = await fetchAndParseCSV(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/holdings-gF8KZLRXjVSLNaGQcaRwWP2xEBbtyV.csv",
    )

    console.log("[v0] Successfully loaded CSV!")
    console.log("[v0] Number of holdings:", holdings.length)
    console.log("[v0] Sample holdings:")

    holdings.slice(0, 3).forEach((holding, index) => {
      console.log(`[v0] ${index + 1}. ${holding.instrument}`)
      console.log(`    Type: ${holding.type}`)
      console.log(`    Current Value: ₹${holding.currentValue.toFixed(2)}`)
      console.log(`    P&L: ₹${holding.pnl.toFixed(2)}`)
      console.log(`    Sector: ${holding.sector}`)
    })

    // Analyze portfolio composition
    const stocks = holdings.filter((h) => h.type === "stock")
    const mutualFunds = holdings.filter((h) => h.type === "mutual_fund")
    const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0)
    const totalPnL = holdings.reduce((sum, h) => sum + h.pnl, 0)

    console.log("\n[v0] Portfolio Analysis:")
    console.log(`    Total Holdings: ${holdings.length}`)
    console.log(`    Stocks: ${stocks.length}`)
    console.log(`    Mutual Funds: ${mutualFunds.length}`)
    console.log(`    Total Value: ₹${totalValue.toFixed(2)}`)
    console.log(`    Total P&L: ₹${totalPnL.toFixed(2)}`)
    console.log(`    Return %: ${((totalPnL / (totalValue - totalPnL)) * 100).toFixed(2)}%`)
  } catch (error) {
    console.error("[v0] Error testing CSV loading:", error)
  }
}

testCSVLoading()
