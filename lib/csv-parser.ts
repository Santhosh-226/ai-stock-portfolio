export interface StockHolding {
  instrument: string
  quantity: number
  avgCost: number
  ltp: number
  invested: number
  currentValue: number
  pnl: number
  netChange: number
  dayChange: number
  percentage?: number
  sector?: string
  type?: "stock" | "mutual_fund"
}

export function parseCSV(csvText: string): StockHolding[] {
  const lines = csvText.trim().split("\n")
  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

  console.log("[v0] CSV Headers:", headers)

  const holdings: StockHolding[] = []

  const SECTOR_MAP: { [key: string]: string } = {
    "HDFC Large Cap Fund": "Large Cap Equity",
    "ICICI Prudential Bluechip Fund": "Large Cap Equity",
    "SBI Small Cap Fund": "Small Cap Equity",
    "Axis Midcap Fund": "Mid Cap Equity",
    "Mirae Asset Large Cap Fund": "Large Cap Equity",
    "Kotak Standard Multicap Fund": "Multi Cap Equity",
    "UTI Nifty Fund": "Index Fund",
    "HDFC Index Fund": "Index Fund",
    "Parag Parikh Flexi Cap Fund": "Flexi Cap Equity",
    "Axis Long Term Equity Fund": "ELSS",
    BHEL: "Public Sector",
    ETERNAL: "Manufacturing",
    IOB: "Banking",
    RELIANCE: "Oil & Gas",
    TCS: "IT Services",
    INFY: "IT Services",
  }

  const isMutualFund = (name: string): boolean => {
    return (
      name.toLowerCase().includes("fund") || name.toLowerCase().includes("mutual") || name.toLowerCase().includes("sip")
    )
  }

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))

    if (values.length < 8 || !values[0]) continue

    const instrument = values[0] || ""
    const quantity = Number.parseFloat(values[1]) || 0
    const avgCost = Number.parseFloat(values[2]) || 0
    const ltp = Number.parseFloat(values[3]) || 0
    const invested = Number.parseFloat(values[4]) || 0
    const currentValue = Number.parseFloat(values[5]) || 0
    const pnl = Number.parseFloat(values[6]) || 0
    const netChange = Number.parseFloat(values[7]) || 0
    const dayChange = Number.parseFloat(values[8]) || 0

    holdings.push({
      instrument,
      quantity,
      avgCost,
      ltp,
      invested,
      currentValue,
      pnl,
      netChange,
      dayChange,
      sector: SECTOR_MAP[instrument] || "Other",
      type: isMutualFund(instrument) ? "mutual_fund" : "stock",
    })
  }

  // Calculate percentages
  const totalValue = holdings.reduce((sum, holding) => sum + holding.currentValue, 0)
  holdings.forEach((holding) => {
    holding.percentage = totalValue > 0 ? (holding.currentValue / totalValue) * 100 : 0
  })

  console.log("[v0] Parsed holdings:", holdings)
  return holdings
}

export async function fetchAndParseCSV(url: string): Promise<StockHolding[]> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`)
    }
    const csvText = await response.text()
    return parseCSV(csvText)
  } catch (error) {
    console.error("[v0] Error fetching CSV:", error)
    throw error
  }
}
