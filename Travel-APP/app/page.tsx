import { Suspense } from "react"
import { CountryList } from "@/components/country-list"
import { SearchBar } from "@/components/search-bar"
import { RegionFilters } from "@/components/region-filters"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-balance">Explore Countries</h1>
          <p className="text-muted-foreground text-lg">
            Discover detailed information about countries around the world
          </p>
        </header>

        <div className="space-y-6">
          <SearchBar />
          <RegionFilters />
          <Suspense fallback={<CountryListSkeleton />}>
            <CountryList />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

function CountryListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    </div>
  )
}
