"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useCallback, useEffect, useState } from "react"

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("query") || "")

  useEffect(() => {
    setQuery(searchParams.get("query") || "")
  }, [searchParams])

  const handleSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value) {
        params.set("query", value)
      } else {
        params.delete("query")
      }

      // Reset to page 1 when searching
      params.set("page", "1")

      router.push(`/?${params.toString()}`)
    },
    [router, searchParams],
  )

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} aria-hidden="true" />
      <Input
        type="search"
        placeholder="Search for a country..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch(query)
          }
        }}
        onBlur={() => handleSearch(query)}
        className="pl-10 h-12"
        aria-label="Search countries"
      />
    </div>
  )
}
