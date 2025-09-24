"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import type { StockHolding } from "@/lib/csv-parser"
import { TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, CheckCircle } from "lucide-react"

interface PortfolioVisualizationsProps {
  holdings: StockHolding[]
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00", "#ff00ff", "#00ffff", "#ff0000"]

export function PortfolioVisualizations({ holdings }: PortfolioVisualizationsProps) {
  const stocks = holdings.filter((h) => h.type === "stock")
  const mutualFunds = holdings.filter((h) => h.type === "mutual_fund")

  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0)
  const totalPnL = holdings.reduce((sum, h) => sum + h.pnl, 0)
  const totalInvested = holdings.reduce((sum, h) => sum + h.invested, 0)

  const generateRecommendations = () => {
    const recommendations = []

    // Diversification analysis
    const sectors = [...new Set(holdings.map((h) => h.sector))]
    if (sectors.length < 5) {
      recommendations.push({
        type: "warning",
        title: "Diversification",
        message: "Consider diversifying across more sectors to reduce risk",
      })
    }

    // P&L analysis
    const losers = holdings.filter((h) => h.pnl < 0)
    if (losers.length > holdings.length * 0.6) {
      recommendations.push({
        type: "alert",
        title: "Portfolio Performance",
        message: "More than 60% of holdings are in loss. Consider reviewing your strategy",
      })
    }

    // Concentration risk
    const topHolding = holdings.reduce((max, h) => (h.percentage > max.percentage ? h : max), holdings[0])
    if (topHolding && topHolding.percentage > 25) {
      recommendations.push({
        type: "warning",
        title: "Concentration Risk",
        message: `${topHolding.instrument} represents ${topHolding.percentage.toFixed(1)}% of portfolio. Consider rebalancing`,
      })
    }

    // Positive recommendations
    if (totalPnL > 0) {
      recommendations.push({
        type: "success",
        title: "Portfolio Growth",
        message: `Your portfolio is up ₹${totalPnL.toFixed(2)}. Consider booking some profits`,
      })
    }

    return recommendations
  }

  const recommendations = generateRecommendations()

  const sectorData = holdings.reduce(
    (acc, holding) => {
      const existing = acc.find((item) => item.sector === holding.sector)
      if (existing) {
        existing.value += holding.currentValue
        existing.percentage += holding.percentage
      } else {
        acc.push({
          sector: holding.sector,
          value: holding.currentValue,
          percentage: holding.percentage,
        })
      }
      return acc
    },
    [] as Array<{ sector: string; value: number; percentage: number }>,
  )

  const performanceData = holdings
    .map((h) => ({
      name: h.instrument.length > 10 ? h.instrument.substring(0, 10) + "..." : h.instrument,
      pnl: h.pnl,
      percentage: ((h.pnl / h.invested) * 100).toFixed(2),
    }))
    .sort((a, b) => b.pnl - a.pnl)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">₹{totalValue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Invested</p>
                <p className="text-2xl font-bold">₹{totalInvested.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              {totalPnL >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <div>
                <p className="text-sm text-muted-foreground">P&L</p>
                <p className={`text-2xl font-bold ${totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ₹{totalPnL.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Return %</p>
                <p className={`text-2xl font-bold ${totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {((totalPnL / totalInvested) * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                {rec.type === "success" && <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />}
                {rec.type === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />}
                {rec.type === "alert" && <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />}
                <div>
                  <h4 className="font-medium">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground">{rec.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stocks">Stocks ({stocks.length})</TabsTrigger>
          <TabsTrigger value="mutual-funds">Mutual Funds ({mutualFunds.length})</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sectorData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ sector, percentage }) => `${sector}: ${percentage.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sectorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`₹${value.toFixed(2)}`, "Value"]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {holdings
                    .sort((a, b) => b.currentValue - a.currentValue)
                    .slice(0, 5)
                    .map((holding, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium">{holding.instrument}</p>
                          <p className="text-sm text-muted-foreground">{holding.sector}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{holding.currentValue.toFixed(2)}</p>
                          <Badge variant={holding.pnl >= 0 ? "default" : "destructive"}>
                            {holding.pnl >= 0 ? "+" : ""}₹{holding.pnl.toFixed(2)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stocks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stocks.map((stock, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{stock.instrument}</h3>
                          <Badge variant="outline">{stock.sector}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Qty</p>
                            <p className="font-medium">{stock.quantity}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">LTP</p>
                            <p className="font-medium">₹{stock.ltp}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Invested</p>
                            <p className="font-medium">₹{stock.invested.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Current</p>
                            <p className="font-medium">₹{stock.currentValue.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">P&L</span>
                            <Badge variant={stock.pnl >= 0 ? "default" : "destructive"}>
                              {stock.pnl >= 0 ? "+" : ""}₹{stock.pnl.toFixed(2)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mutual-funds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mutual Fund Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mutualFunds.map((fund, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-sm">{fund.instrument}</h3>
                          <Badge variant="outline">{fund.sector}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Units</p>
                            <p className="font-medium">{fund.quantity.toFixed(3)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">NAV</p>
                            <p className="font-medium">₹{fund.ltp.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Invested</p>
                            <p className="font-medium">₹{fund.invested.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Current</p>
                            <p className="font-medium">₹{fund.currentValue.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Returns</span>
                            <Badge variant={fund.pnl >= 0 ? "default" : "destructive"}>
                              {fund.pnl >= 0 ? "+" : ""}₹{fund.pnl.toFixed(2)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === "pnl" ? `₹${value.toFixed(2)}` : `${value}%`,
                      name === "pnl" ? "P&L" : "Return %",
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="pnl" fill="#8884d8" name="P&L (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
