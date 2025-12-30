"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback } from "react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
}

export function Pagination({ currentPage, totalPages, pageSize }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", newPage.toString())
      router.push(`/?${params.toString()}`)
    },
    [router, searchParams],
  )

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    pages.push(1)

    let start = Math.max(2, currentPage - 1)
    let end = Math.min(totalPages - 1, currentPage + 1)

    if (currentPage <= 3) {
      end = 4
    }

    if (currentPage >= totalPages - 2) {
      start = totalPages - 3
    }

    if (start > 2) {
      pages.push("...")
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages - 1) {
      pages.push("...")
    }

    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline ml-1">Previous</span>
      </Button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page as number)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
              className="min-w-9"
            >
              {page}
            </Button>
          ),
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <span className="hidden sm:inline mr-1">Next</span>
        <ChevronRight size={16} />
      </Button>
    </nav>
  )
}
