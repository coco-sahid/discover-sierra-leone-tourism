"use client";

import { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun, CloudSun, Wind, Droplets, Thermometer, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
}

interface WeatherWidgetProps {
  latitude: number;
  longitude: number;
  locationName: string;
}

const getWeatherIcon = (code: number, isDay: boolean) => {
  if (code === 0 || code === 1) {
    return isDay ? <Sun className="w-10 h-10 text-amber-400" /> : <Sun className="w-10 h-10 text-indigo-300" />;
  }
  if (code === 2) {
    return <CloudSun className="w-10 h-10 text-amber-300" />;
  }
  if (code === 3) {
    return <Cloud className="w-10 h-10 text-zinc-400" />;
  }
  if (code >= 45 && code <= 48) {
    return <Cloud className="w-10 h-10 text-zinc-300" />;
  }
  if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    return <CloudRain className="w-10 h-10 text-blue-400" />;
  }
  return <Cloud className="w-10 h-10 text-zinc-400" />;
};

const getWeatherDescription = (code: number) => {
  const descriptions: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Thunderstorm with heavy hail",
  };
  return descriptions[code] || "Unknown";
};

export function WeatherWidget({ latitude, longitude, locationName }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day&timezone=auto`
        );
        
        if (!response.ok) throw new Error("Failed to fetch weather");
        
        const data = await response.json();
        
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          humidity: data.current.relative_humidity_2m,
          windSpeed: Math.round(data.current.wind_speed_10m),
          weatherCode: data.current.weather_code,
          isDay: data.current.is_day === 1,
        });
      } catch (err) {
        setError("Unable to load weather");
      } finally {
        setLoading(false);
      }
    }

    if (latitude && longitude) {
      fetchWeather();
    }
  }, [latitude, longitude]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-center h-24">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-center h-24 text-zinc-500">
          <Cloud className="w-8 h-8 mr-2" />
          <span>Weather unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-6 text-white overflow-hidden relative ${
        weather.isDay 
          ? "bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600" 
          : "bg-gradient-to-br from-indigo-800 via-purple-900 to-slate-900"
      }`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative">
        <p className="text-sm font-medium text-white/80 mb-1">Current Weather</p>
        <p className="font-bold text-lg mb-4">{locationName}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {getWeatherIcon(weather.weatherCode, weather.isDay)}
            <div>
              <div className="text-4xl font-bold">{weather.temperature}°C</div>
              <div className="text-sm text-white/80">{getWeatherDescription(weather.weatherCode)}</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/20">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-white/70" />
            <div className="text-sm">
              <span className="text-white/70">Feels</span>
              <span className="ml-1 font-medium">{weather.temperature}°</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-white/70" />
            <div className="text-sm">
              <span className="text-white/70">Humidity</span>
              <span className="ml-1 font-medium">{weather.humidity}%</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-white/70" />
            <div className="text-sm">
              <span className="text-white/70">Wind</span>
              <span className="ml-1 font-medium">{weather.windSpeed} km/h</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default WeatherWidget;
