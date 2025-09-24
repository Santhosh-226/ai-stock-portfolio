"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface PortfolioChartsProps {
  portfolioData: any
}

export function PortfolioCharts({ portfolioData }: PortfolioChartsProps) {
  if (!portfolioData?.holdings) {
    return null
  }

  const { holdings, metrics } = portfolioData

  // Prepare data for sector allocation pie chart
  const sectorData = holdings.reduce((acc: any, holding: any) => {
    const sector = holding.sector || "Other"
    acc[sector] = (acc[sector] || 0) + holding.value
    return acc
  }, {})

  const pieData = Object.entries(sectorData).map(([sector, value]) => ({
    name: sector,
    value: value as number,
    percentage: (((value as number) / metrics.totalValue) * 100).toFixed(1),
  }))

  // Prepare data for top holdings bar chart
  const topHoldings = holdings
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 10)
    .map((holding: any) => ({
      symbol: holding.symbol,
      value: holding.value,
      percentage: ((holding.value / metrics.totalValue) * 100).toFixed(1),
    }))

  const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#84cc16"]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sector Allocation */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Sector Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, "Value"]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Holdings */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Top Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topHoldings} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="symbol" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                formatter={(value: any) => [`$${value.toLocaleString()}`, "Value"]}
                labelStyle={{ color: "#000" }}
                contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
              />
              <Bar dataKey="value" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
