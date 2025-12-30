export interface WeatherData {
  temperature: number
  weatherCode: number
  windSpeed: number
  humidity: number
  description: string
  icon: string
}

// Weather code mappings from Open-Meteo
function getWeatherDescription(code: number): { description: string; icon: string } {
  const weatherCodes: Record<number, { description: string; icon: string }> = {
    0: { description: "Clear sky", icon: "☀️" },
    1: { description: "Mainly clear", icon: "🌤️" },
    2: { description: "Partly cloudy", icon: "⛅" },
    3: { description: "Overcast", icon: "☁️" },
    45: { description: "Foggy", icon: "🌫️" },
    48: { description: "Foggy", icon: "🌫️" },
    51: { description: "Light drizzle", icon: "🌦️" },
    53: { description: "Moderate drizzle", icon: "🌦️" },
    55: { description: "Dense drizzle", icon: "🌧️" },
    61: { description: "Slight rain", icon: "🌧️" },
    63: { description: "Moderate rain", icon: "🌧️" },
    65: { description: "Heavy rain", icon: "🌧️" },
    71: { description: "Slight snow", icon: "🌨️" },
    73: { description: "Moderate snow", icon: "❄️" },
    75: { description: "Heavy snow", icon: "❄️" },
    77: { description: "Snow grains", icon: "🌨️" },
    80: { description: "Slight rain showers", icon: "🌦️" },
    81: { description: "Moderate rain showers", icon: "🌧️" },
    82: { description: "Violent rain showers", icon: "⛈️" },
    85: { description: "Slight snow showers", icon: "🌨️" },
    86: { description: "Heavy snow showers", icon: "❄️" },
    95: { description: "Thunderstorm", icon: "⛈️" },
    96: { description: "Thunderstorm with hail", icon: "⛈️" },
    99: { description: "Thunderstorm with hail", icon: "⛈️" },
  }

  return weatherCodes[code] || { description: "Unknown", icon: "🌡️" }
}

export async function getWeather(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=celsius&wind_speed_unit=kmh`

    const response = await fetch(url, {
      next: { revalidate: 1800 }, // Cache for 30 minutes
    })

    if (!response.ok) {
      throw new Error("Failed to fetch weather data")
    }

    const data = await response.json()
    const { description, icon } = getWeatherDescription(data.current.weather_code)

    return {
      temperature: Math.round(data.current.temperature_2m),
      weatherCode: data.current.weather_code,
      windSpeed: Math.round(data.current.wind_speed_10m),
      humidity: data.current.relative_humidity_2m,
      description,
      icon,
    }
  } catch (error) {
    console.error("Error fetching weather:", error)
    return null
  }
}
