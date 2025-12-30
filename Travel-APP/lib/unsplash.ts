export interface UnsplashImage {
  id: string
  urls: {
    regular: string
    small: string
  }
  alt_description: string | null
  user: {
    name: string
    username: string
  }
  links: {
    html: string
  }
}

export async function getUnsplashImages(query: string, count = 6): Promise<UnsplashImage[]> {
  try {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY

    if (!accessKey) {
      console.error("[v0] Unsplash access key not found in environment variables")
      return []
    }

    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&client_id=${accessKey}`

    console.log("[v0] Fetching Unsplash images for:", query)

    const response = await fetch(url, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!response.ok) {
      console.error("[v0] Unsplash API error:", response.status, response.statusText)
      return []
    }

    const data = await response.json()
    console.log("[v0] Unsplash images received:", data.results?.length || 0)

    if (!data.results || data.results.length === 0) {
      return []
    }

    return data.results.map((photo: any) => ({
      id: photo.id,
      urls: {
        regular: photo.urls.regular,
        small: photo.urls.small,
      },
      alt_description: photo.alt_description,
      user: {
        name: photo.user.name,
        username: photo.user.username,
      },
      links: {
        html: photo.links.html,
      },
    }))
  } catch (error) {
    console.error("[v0] Error fetching Unsplash images:", error)
    return []
  }
}
