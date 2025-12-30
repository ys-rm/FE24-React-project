import { ArrowLeft, ZapOff as MapOff } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function NotFound() {
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

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="rounded-full bg-muted p-3">
                <MapOff className="text-muted-foreground" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Country Not Found</h2>
                <p className="text-muted-foreground">
                  The country you're looking for doesn't exist or the code is invalid.
                </p>
              </div>
              <Button asChild>
                <Link href="/">Browse all countries</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
