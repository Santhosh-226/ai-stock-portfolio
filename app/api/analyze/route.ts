import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { portfolioData } = await req.json()

    if (!portfolioData || !portfolioData.length) {
      return new Response(
        JSON.stringify({ error: "No portfolio data provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt: `Analyze this stock portfolio and provide insights:

Portfolio Data:
${JSON.stringify(portfolioData, null, 2)}

Please provide:
1. Overall portfolio health score (1-10)
2. Diversification analysis
3. Risk assessment
4. Top 3 recommendations
5. Sector allocation summary

Format the response as JSON with these fields: healthScore, diversification, riskLevel, recommendations, sectorAllocation, summary`,
    })

    let analysis

    try {
      analysis = JSON.parse(text) // expect proper JSON
    } catch {
      // fallback structured response
      analysis = {
        healthScore: 7,
        diversification: "Moderate",
        riskLevel: "Medium",
        recommendations: [
          "Consider diversifying across more sectors",
          "Review high-risk positions",
          "Maintain current allocation strategy",
        ],
        sectorAllocation: "Mixed allocation across technology and finance sectors",
        summary: text, // keep raw AI text
      }
    }

    return new Response(JSON.stringify(analysis), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return new Response(
      JSON.stringify({ error: "Failed to analyze portfolio" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
