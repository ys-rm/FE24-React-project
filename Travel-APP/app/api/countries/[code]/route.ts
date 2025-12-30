import type { NextRequest } from "next/server"
import { getCountryByCode } from "@/lib/countries"

export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params
    const country = await getCountryByCode(code)

    if (!country) {
      return Response.json({ error: "Country not found" }, { status: 404 })
    }

    return Response.json(country)
  } catch (error) {
    console.error("API error:", error)
    return Response.json({ error: "Failed to fetch country" }, { status: 500 })
  }
}
