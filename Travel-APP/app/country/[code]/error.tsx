"use client"

import { useEffect } from "react"
import { ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/" className="gap-2">
              <ArrowLeft size={16} />
              Back to countries
            </Link>
          </Button>
        </div>

        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertCircle className="text-destructive" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Failed to load country</h2>
                <p className="text-muted-foreground">
                  We encountered an error while fetching country information. Please try again.
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => reset()}>Try again</Button>
                <Button asChild variant="outline">
                  <Link href="/">Go home</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
