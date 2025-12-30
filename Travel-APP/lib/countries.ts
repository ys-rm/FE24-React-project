export interface Country {
  cca3: string
  name: {
    common: string
    official: string
  }
  flags: {
    svg: string
    png: string
  }
  region: string
  subregion?: string
  capital?: string[]
  capitalInfo?: {
    latlng?: number[]
  }
  latlng?: number[]
  population: number
  languages?: Record<string, string>
  currencies?: Record<
    string,
    {
      name: string
      symbol: string
    }
  >
}

interface GetCountriesParams {
  page: number
  pageSize: number
  query: string
  region: string
}

interface GetCountriesResult {
  countries: Country[]
  totalPages: number
  totalCount: number
}

export async function getCountries({ page, pageSize, query, region }: GetCountriesParams): Promise<GetCountriesResult> {
  try {
    // Fetch all countries from REST Countries API
    const url =
      "https://restcountries.com/v3.1/all?fields=cca3,name,flags,region,subregion,capital,capitalInfo,latlng,population,languages"
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error("Failed to fetch countries")
    }

    let countries: Country[] = await response.json()

    // Filter by query (search by country name)
    if (query) {
      const lowerQuery = query.toLowerCase()
      countries = countries.filter((country) => country.name.common.toLowerCase().includes(lowerQuery))
    }

    // Filter by region
    if (region) {
      countries = countries.filter((country) => country.region === region)
    }

    // Sort alphabetically
    countries.sort((a, b) => a.name.common.localeCompare(b.name.common))

    // Calculate pagination
    const totalCount = countries.length
    const totalPages = Math.ceil(totalCount / pageSize)
    const start = (page - 1) * pageSize
    const end = start + pageSize

    return {
      countries: countries.slice(start, end),
      totalPages,
      totalCount,
    }
  } catch (error) {
    console.error("Error fetching countries:", error)
    throw error
  }
}

export async function getCountryByCode(code: string): Promise<Country | null> {
  try {
    console.log("[v0] Fetching country with code:", code)
    const response = await fetch(
      `https://restcountries.com/v3.1/alpha/${code}?fields=cca3,name,flags,region,subregion,capital,capitalInfo,latlng,population,languages`,
      {
        next: { revalidate: 3600 },
      },
    )

    console.log("[v0] Response status:", response.status)

    if (!response.ok) {
      console.log("[v0] Response not OK, returning null")
      return null
    }

    const data = await response.json()
    console.log("[v0] Raw data type:", Array.isArray(data) ? "array" : typeof data)
    console.log("[v0] Raw data:", JSON.stringify(data).substring(0, 200))

    // The API might return an array or a single object depending on the endpoint
    const country = Array.isArray(data) ? data[0] : data
    console.log("[v0] Parsed country:", country ? "found" : "not found")

    return country || null
  } catch (error) {
    console.error("[v0] Error fetching country:", error)
    return null
  }
}
