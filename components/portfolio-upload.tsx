"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, AlertCircle, CheckCircle, BarChart, Link } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { parseCSV, fetchAndParseCSV, type StockHolding } from "@/lib/csv-parser"

interface PortfolioUploadProps {
  onDataUploaded: (data: StockHolding[]) => void
}

export function PortfolioUpload({ onDataUploaded }: PortfolioUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [parsedData, setParsedData] = useState<StockHolding[] | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const loadSampleCSV = async () => {
    setIsUploading(true)
    setError(null)
    setParsedData(null)

    try {
      const holdings = await fetchAndParseCSV(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/holdings-gF8KZLRXjVSLNaGQcaRwWP2xEBbtyV.csv",
      )
      setParsedData(holdings)
      setUploadedFile(new File([""], "holdings.csv", { type: "text/csv" }))
      setError(null)
    } catch (err) {
      console.error("[v0] Error loading sample CSV:", err)
      setError("Error loading sample CSV file. Please try uploading your own file.")
    } finally {
      setIsUploading(false)
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (!file.name.endsWith(".csv")) {
      setError("Please upload a CSV file")
      return
    }

    setIsUploading(true)
    setError(null)
    setUploadedFile(file)
    setParsedData(null)

    try {
      const text = await file.text()
      const parsed = parseCSV(text)
      setParsedData(parsed)
      setError(null)
    } catch (err) {
      console.error("[v0] CSV parsing error:", err)
      setError(
        "Error parsing CSV file. Please ensure it has the correct format with Instrument, Qty, Avg. cost, LTP, Invested, Cur. val columns.",
      )
      setParsedData(null)
    } finally {
      setIsUploading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    multiple: false,
  })

  const handleAnalyze = async () => {
    if (!parsedData) return

    setIsAnalyzing(true)

    try {
      onDataUploaded(parsedData)
    } catch (err) {
      console.error("[v0] Analysis error:", err)
      setError("Error analyzing portfolio data")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-white mb-2">Upload Portfolio CSV</h3>

        <Card
          {...getRootProps()}
          className={`border-2 border-dashed cursor-pointer transition-colors ${
            isDragActive ? "border-indigo-400 bg-indigo-50/10" : "border-slate-600 hover:border-slate-500"
          } bg-slate-700/30`}
        >
          <CardContent className="flex flex-col items-center justify-center py-12">
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-slate-400 mb-4" />
            <div className="text-center">
              <p className="text-white font-medium mb-2">
                {isDragActive ? "Drop your CSV file here" : "Choose CSV file"}
              </p>
              <p className="text-slate-400 text-sm">Upload your portfolio holdings in CSV format</p>
              <p className="text-slate-500 text-xs mt-2">
                Expected columns: Instrument, Qty., Avg. cost, LTP, Invested, Cur. val, P&L
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center">
          <Button
            onClick={loadSampleCSV}
            variant="outline"
            disabled={isUploading}
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            <Link className="w-4 h-4 mr-2" />
            Load Sample Holdings CSV
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 bg-red-900/20 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {uploadedFile && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-700/50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-white font-medium">{uploadedFile.name}</p>
                <p className="text-slate-400 text-sm">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>

            {parsedData && (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">{parsedData.length} holdings parsed</span>
              </div>
            )}
          </div>

          {parsedData && (
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-3">Portfolio Preview</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-slate-400 text-sm">Total Holdings</p>
                  <p className="text-white font-semibold">{parsedData.length}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Total Value</p>
                  <p className="text-white font-semibold">
                    ₹{parsedData.reduce((sum, h) => sum + h.currentValue, 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Total P&L</p>
                  <p
                    className={`font-semibold ${
                      parsedData.reduce((sum, h) => sum + h.pnl, 0) >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    ₹{parsedData.reduce((sum, h) => sum + h.pnl, 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Top Holding</p>
                  <p className="text-white font-semibold text-xs">
                    {parsedData.sort((a, b) => b.currentValue - a.currentValue)[0]?.instrument.split(" ")[0] || "N/A"}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={isUploading || isAnalyzing}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {isAnalyzing ? (
                  <>
                    <BarChart className="w-4 h-4 mr-2 animate-pulse" />
                    Analyzing Portfolio...
                  </>
                ) : (
                  <>
                    <BarChart className="w-4 h-4 mr-2" />
                    Analyze Portfolio
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
