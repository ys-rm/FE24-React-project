export interface WikipediaSummary {
  title: string
  extract: string
  thumbnail?: {
    source: string
    width: number
    height: number
  }
}

export async function getWikipediaSummary(countryName: string): Promise<WikipediaSummary | null> {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(countryName)}`

    const response = await fetch(url, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    return {
      title: data.title,
      extract: data.extract,
      thumbnail: data.thumbnail,
    }
  } catch (error) {
    console.error("Error fetching Wikipedia summary:", error)
    return null
  }
}
