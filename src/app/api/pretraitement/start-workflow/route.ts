import { NextResponse } from "next/server"

const N8N_API_URL = process.env.N8N_API_URL
const N8N_API_KEY = process.env.N8N_API_KEY

export async function POST(req: Request) {
  try {
    const { fileName, fileType } = await req.json()

    // Appel à l'API n8n pour démarrer le workflow
    const response = await fetch(`${N8N_API_URL}/workflows/trigger`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-N8N-API-KEY": N8N_API_KEY || "",
      },
      body: JSON.stringify({
        workflowId: process.env.N8N_WORKFLOW_ID,
        data: {
          fileName,
          fileType,
          timestamp: new Date().toISOString(),
        },
      }),
    })

    if (!response.ok) {
      throw new Error("Erreur lors de l'appel à n8n")
    }

    const data = await response.json()

    return NextResponse.json({
      workflowId: data.id,
      status: "started",
    })
  } catch (error) {
    console.error("Erreur lors du démarrage du workflow:", error)
    return NextResponse.json(
      { error: "Erreur lors du démarrage du workflow" },
      { status: 500 }
    )
  }
} 