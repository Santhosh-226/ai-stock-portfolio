import { NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: Request) {
  try {
    const { messages, portfolioData } = await req.json()

    const stream = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // ✅ fast and working model
      messages: [
        {
          role: "system",
          content:
            "You are an AI portfolio assistant. Use the portfolio data if available to give smart, clear investment insights.",
        },
        ...messages,
      ],
      stream: true,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || ""
          if (text) {
            controller.enqueue(encoder.encode(`0: ${JSON.stringify({ content: text })}\n`))
          }
        }
        controller.close()
      },
    })

    return new Response(readable, {
      headers: { "Content-Type": "text/event-stream" },
    })
  } catch (error) {
    console.error("Chat API Error:", error)
    return NextResponse.json({ error: "Failed to connect to AI service" }, { status: 500 })
  }
}
