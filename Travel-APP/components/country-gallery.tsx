import { ImageIcon, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUnsplashImages } from "@/lib/unsplash"
import { getWikipediaSummary } from "@/lib/wikipedia"

interface CountryGalleryProps {
  countryName: string
}

export async function CountryGallery({ countryName }: CountryGalleryProps) {
  const [images, summary] = await Promise.all([getUnsplashImages(countryName, 6), getWikipediaSummary(countryName)])

  return (
    <div className="space-y-6">
      {/* Wikipedia Summary */}
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>About {summary.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">{summary.extract}</p>
            <a
              href={`https://en.wikipedia.org/wiki/${encodeURIComponent(countryName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              Read more on Wikipedia
              <ExternalLink size={14} />
            </a>
            <p className="text-xs text-muted-foreground mt-2">Source: Wikipedia</p>
          </CardContent>
        </Card>
      )}

      {/* Image Gallery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon size={20} />
            Gallery
          </CardTitle>
        </CardHeader>
        <CardContent>
          {images.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {images.map((image) => (
                  <a
                    key={image.id}
                    href={image.links.html}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-video overflow-hidden rounded-lg bg-muted"
                  >
                    <img
                      src={image.urls.small || "/placeholder.svg"}
                      alt={image.alt_description || `${countryName} landscape`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </a>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Images from{" "}
                <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Unsplash
                </a>
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No images available</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
