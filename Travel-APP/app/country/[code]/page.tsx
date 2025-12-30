import { notFound } from "next/navigation"
import { ArrowLeft, Globe, Users, MapPin, Languages } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCountryByCode } from "@/lib/countries"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { WeatherCard } from "@/components/weather-card"
import { CountryGallery } from "@/components/country-gallery"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Metadata } from "next"

interface CountryPageProps {
  params: Promise<{
    code: string
  }>
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { code } = await params
  const country = await getCountryByCode(code)

  if (!country) {
    return {
      title: "Country Not Found",
    }
  }

  return {
    title: `${country.name.common} - Country Details`,
    description: `Explore detailed information about ${country.name.common} including population, capital, languages, and current weather.`,
  }
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { code } = await params
  const country = await getCountryByCode(code)

  if (!country) {
    notFound()
  }

  // Format population with commas
  const formattedPopulation = country.population.toLocaleString()

  // Get languages
  const languages = country.languages ? Object.values(country.languages).join(", ") : "N/A"

  // Get currencies
  // const currencies = country.currencies
  //   ? Object.entries(country.currencies)
  //       .map(([code, curr]) => `${curr.name} (${curr.symbol || code})`)
  //       .join(", ")
  //   : "N/A"

  const weatherLat = country.capitalInfo?.latlng?.[0] || country.latlng?.[0]
  const weatherLon = country.capitalInfo?.latlng?.[1] || country.latlng?.[1]
  const weatherLocation = country.capital?.[0] || country.name.common

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back button */}
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/" className="gap-2">
              <ArrowLeft size={16} />
              Back to countries
            </Link>
          </Button>
        </div>

        {/* Header with flag */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            <div className="flex-shrink-0">
              <img
                src={country.flags.svg || "/placeholder.svg"}
                alt={`Flag of ${country.name.common}`}
                className="w-full md:w-64 h-auto rounded-lg shadow-lg border border-border"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-balance">{country.name.common}</h1>
              {country.name.official && country.name.official !== country.name.common && (
                <p className="text-xl text-muted-foreground mb-4">{country.name.official}</p>
              )}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-sm">
                  {country.region}
                </Badge>
                {country.subregion && (
                  <Badge variant="outline" className="text-sm">
                    {country.subregion}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Facts */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe size={20} />
                  Basic Facts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {country.capital && country.capital[0] && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <MapPin size={16} />
                        <span className="font-medium">Capital</span>
                      </div>
                      <p className="text-lg">{country.capital[0]}</p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Users size={16} />
                      <span className="font-medium">Population</span>
                    </div>
                    <p className="text-lg">{formattedPopulation}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Languages size={16} />
                      <span className="font-medium">Languages</span>
                    </div>
                    <p className="text-lg">{languages}</p>
                  </div>

                  {/* <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <DollarSign size={16} />
                      <span className="font-medium">Currency</span>
                    </div>
                    <p className="text-lg">{currencies}</p>
                  </div> */}
                </div>
              </CardContent>
            </Card>

            {/* Weather Card with fallback skeleton */}
            {weatherLat && weatherLon ? (
              <Suspense fallback={<WeatherSkeleton />}>
                <WeatherCard lat={weatherLat} lon={weatherLon} locationName={weatherLocation} />
              </Suspense>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Current Weather</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">Weather data is not available for this location</p>
                </CardContent>
              </Card>
            )}

            <Suspense fallback={<GallerySkeleton />}>
              <CountryGallery countryName={country.name.common} />
            </Suspense>
          </div>

          {/* Sidebar with additional info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground block mb-1">Region</span>
                  <span>{country.region}</span>
                </div>
                {country.subregion && (
                  <>
                    <Separator />
                    <div>
                      <span className="font-medium text-muted-foreground block mb-1">Subregion</span>
                      <span>{country.subregion}</span>
                    </div>
                  </>
                )}
                <Separator />
                <div>
                  <span className="font-medium text-muted-foreground block mb-1">Country Code</span>
                  <span>{country.cca3}</span>
                </div>
                {country.latlng && (
                  <>
                    <Separator />
                    <div>
                      <span className="font-medium text-muted-foreground block mb-1">Coordinates</span>
                      <span>
                        {country.latlng[0].toFixed(2)}°, {country.latlng[1].toFixed(2)}°
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

// Weather Skeleton Loader
function WeatherSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6 mb-6">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function GallerySkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-video rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
