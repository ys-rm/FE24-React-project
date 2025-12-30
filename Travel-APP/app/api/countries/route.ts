import type { NextRequest } from "next/server"
import { getCountries } from "@/lib/countries"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "12", 10)
    const query = searchParams.get("query") || ""
    const region = searchParams.get("region") || ""

    const data = await getCountries({ page, pageSize, query, region })

    return Response.json(data)
  } catch (error) {
    console.error("API error:", error)
    return Response.json({ error: "Failed to fetch countries" }, { status: 500 })
  }
}
