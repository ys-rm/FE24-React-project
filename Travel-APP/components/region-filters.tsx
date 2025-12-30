"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useCallback } from "react"

const REGIONS = [
  { label: "All", value: "" },
  { label: "Africa", value: "Africa" },
  { label: "Americas", value: "Americas" },
  { label: "Asia", value: "Asia" },
  { label: "Europe", value: "Europe" },
  { label: "Oceania", value: "Oceania" },
  { label: "Antarctic", value: "Antarctic" },
] as const

export function RegionFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentRegion = searchParams.get("region") || ""

  const handleRegionChange = useCallback(
    (region: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (region) {
        params.set("region", region)
      } else {
        params.delete("region")
      }

      // Reset to page 1 when changing region
      params.set("page", "1")

      router.push(`/?${params.toString()}`)
    },
    [router, searchParams],
  )

  return (
    <nav aria-label="Filter by region">
      <div className="flex flex-wrap gap-2">
        {REGIONS.map((region) => (
          <Button
            key={region.value}
            variant={currentRegion === region.value ? "default" : "outline"}
            onClick={() => handleRegionChange(region.value)}
            size="sm"
          >
            {region.label}
          </Button>
        ))}
      </div>
    </nav>
  )
}
