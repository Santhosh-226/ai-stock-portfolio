"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, MessageCircle, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { PortfolioUpload } from "@/components/portfolio-upload"
import { ChatBot } from "@/components/chat-bot"
import { PortfolioVisualizations } from "@/components/portfolio-visualizations"

export default function HomePage() {
  const { theme, setTheme } = useTheme()
  const [uploadedData, setUploadedData] = useState(null)
  const [showChat, setShowChat] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Ensure theme is loaded on client to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700">
      {/* Header */}
      <header className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">AI Portfolio Advisor</h1>
              <p className="text-white/80 text-lg">Intelligent analysis for smarter investment decisions</p>
            </div>
          </div>

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-white hover:bg-white/20"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 text-white">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Portfolio Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <PortfolioUpload onDataUploaded={setUploadedData} />
            </CardContent>
          </Card>

          {uploadedData && (
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 text-white">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Portfolio Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <PortfolioVisualizations holdings={uploadedData} />
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Floating Chat Button */}
      <Button
        onClick={() => setShowChat(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Chat Bot */}
      {showChat && (
        <ChatBot portfolioData={uploadedData} onClose={() => setShowChat(false)} />
      )}
    </div>
  )
}
