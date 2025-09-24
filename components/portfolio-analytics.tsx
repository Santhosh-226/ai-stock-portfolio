"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Shield, Target, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"

interface PortfolioAnalyticsProps {
  portfolioData: any
}

export function PortfolioAnalytics({ portfolioData }: PortfolioAnalyticsProps) {
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (portfolioData?.holdings) {
      analyzeWithAI()
    }
  }, [portfolioData])

  const analyzeWithAI = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolioData: portfolioData.holdings }),
      })
      const analysis = await response.json()
      setAiAnalysis(analysis)
    } catch (error) {
      console.error("Failed to get AI analysis:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!portfolioData?.metrics) {
    return null
  }

  const { metrics } = portfolioData

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "low":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "high":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 8) return "text-green-400"
    if (score >= 6) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Value</p>
                <p className="text-white text-xl font-bold">${metrics.totalValue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Holdings</p>
                <p className="text-white text-xl font-bold">{metrics.totalHoldings}</p>
              </div>
              <Target className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Avg Position</p>
                <p className="text-white text-xl font-bold">${metrics.averagePosition.toLocaleString()}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Largest Position</p>
                <p className="text-white text-xl font-bold">{metrics.concentrationRisk.toFixed(1)}%</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis */}
      {isLoading ? (
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
              <span className="ml-3 text-white">Analyzing portfolio with AI...</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        aiAnalysis && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">AI Portfolio Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Health Score</span>
                  <span className={`text-2xl font-bold ${getHealthScoreColor(aiAnalysis.healthScore)}`}>
                    {aiAnalysis.healthScore}/10
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Risk Level</span>
                  <Badge className={getRiskColor(aiAnalysis.riskLevel)}>{aiAnalysis.riskLevel}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Diversification</span>
                  <span className="text-white">{aiAnalysis.diversification}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {aiAnalysis.recommendations?.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-slate-300">
                      <span className="text-indigo-400 mt-1">•</span>
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )
      )}
    </div>
  )
}
