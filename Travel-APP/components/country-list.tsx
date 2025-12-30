"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { Pagination } from "@/components/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import type { Country } from "@/lib/countries"

interface GetCountriesResult {
  countries: Country[]
  totalPages: number
  totalCount: number
}

async function fetchCountries(
  page: number,
  pageSize: number,
  query: string,
  region: string,
): Promise<GetCountriesResult> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    query,
    region,
  })

  const response = await fetch(`/api/countries?${params}`)

  if (!response.ok) {
    throw new Error("Failed to fetch countries")
  }

  return response.json()
}

export function CountryList() {
  const searchParams = useSearchParams()
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const pageSize = Number.parseInt(searchParams.get("pageSize") || "12", 10)
  const query = searchParams.get("query") || ""
  const region = searchParams.get("region") || ""

  const { data, isLoading, error } = useQuery({
    queryKey: ["countries", page, pageSize, query, region],
    queryFn: () => fetchCountries(page, pageSize, query, region),
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: pageSize }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <p className="text-destructive font-medium">Failed to load countries. Please try again.</p>
            <button onClick={() => window.location.reload()} className="text-sm text-primary hover:underline">
              Try again
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.countries.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No countries match your criteria</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.countries.map((country) => (
          <Link key={country.cca3} href={`/country/${country.cca3}`} className="group">
            <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02]">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={country.flags.svg || "/placeholder.svg"}
                    alt={`Flag of ${country.name.common}`}
                    className="w-16 h-12 object-cover rounded shadow-sm"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {country.name.common}
                  </h2>
                  <div className="text-sm text-muted-foreground space-y-0.5">
                    <p className="line-clamp-1">
                      <span className="font-medium">Region:</span> {country.region}
                    </p>
                    {country.capital && country.capital[0] && (
                      <p className="line-clamp-1">
                        <span className="font-medium">Capital:</span> {country.capital[0]}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Pagination currentPage={page} totalPages={data.totalPages} pageSize={pageSize} />
    </div>
  )
}
