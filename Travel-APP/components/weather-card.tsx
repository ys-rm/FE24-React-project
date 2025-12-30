import { Cloud, Wind, Droplets, ThermometerSun } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getWeather } from "@/lib/weather"

interface WeatherCardProps {
  lat: number
  lon: number
  locationName: string
}

export async function WeatherCard({ lat, lon, locationName }: WeatherCardProps) {
  const weather = await getWeather(lat, lon)

  if (!weather) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud size={20} />
            Current Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Weather data is currently unavailable</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud size={20} />
          Current Weather in {locationName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6 mb-6">
          <div className="text-6xl" role="img" aria-label={weather.description}>
            {weather.icon}
          </div>
          <div>
            <div className="text-4xl font-bold">{weather.temperature}°C</div>
            <div className="text-lg text-muted-foreground">{weather.description}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <ThermometerSun size={16} />
              <span>Feels like</span>
            </div>
            <p className="text-lg font-medium">{weather.temperature}°C</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Wind size={16} />
              <span>Wind speed</span>
            </div>
            <p className="text-lg font-medium">{weather.windSpeed} km/h</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Droplets size={16} />
              <span>Humidity</span>
            </div>
            <p className="text-lg font-medium">{weather.humidity}%</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4">Data from Open-Meteo</p>
      </CardContent>
    </Card>
  )
}
