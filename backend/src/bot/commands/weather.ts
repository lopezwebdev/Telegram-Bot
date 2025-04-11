import { Context } from "grammy";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Define types for weather data
interface WeatherData {
  name: string;
  sys: { country: string };
  main: { 
    temp: number; 
    feels_like: number; 
    humidity: number 
  };
  wind: { speed: number };
  weather: { description: string }[];
}

// Mock weather data for testing
const mockWeatherData: Record<string, WeatherData> = {
  "Tokyo": {
    name: "Tokyo",
    sys: { country: "JP" },
    main: { 
      temp: 22.5, 
      feels_like: 23.0, 
      humidity: 65 
    },
    wind: { speed: 3.5 },
    weather: [{ description: "scattered clouds" }]
  },
  "London": {
    name: "London",
    sys: { country: "GB" },
    main: { 
      temp: 15.2, 
      feels_like: 14.8, 
      humidity: 72 
    },
    wind: { speed: 4.2 },
    weather: [{ description: "light rain" }]
  },
  "New York": {
    name: "New York",
    sys: { country: "US" },
    main: { 
      temp: 18.7, 
      feels_like: 19.1, 
      humidity: 68 
    },
    wind: { speed: 3.8 },
    weather: [{ description: "partly cloudy" }]
  }
};

export const weatherCommand = async (ctx: Context) => {
  try {
    console.log(`Weather command received from user ${ctx.from?.id}`);
    
    const city = ctx.match;
    
    if (!city) {
      console.log(`No city provided by user ${ctx.from?.id}`);
      await ctx.reply(
        "🌍 Please provide a city name.\n" +
        "Example: /weather London\n" +
        "You can also use: /forecast [city] for a 5-day forecast"
      );
      return;
    }

    // Convert city to string if it's a RegExpMatchArray
    const cityName = typeof city === 'string' ? city : city[0];
    
    console.log(`Fetching weather for city: ${cityName}`);
    
    // Use mock data instead of making an API call
    let weather: WeatherData;
    
    // Check if we have mock data for this city
    if (cityName in mockWeatherData) {
      weather = mockWeatherData[cityName];
      console.log(`Using mock data for ${cityName}`);
    } else {
      // Generate random weather data for unknown cities
      weather = {
        name: cityName,
        sys: { country: "??" },
        main: { 
          temp: Math.floor(Math.random() * 30) + 5, 
          feels_like: Math.floor(Math.random() * 30) + 5, 
          humidity: Math.floor(Math.random() * 50) + 30 
        },
        wind: { speed: Math.floor(Math.random() * 10) + 1 },
        weather: [{ description: "unknown" }]
      };
      console.log(`Generated random weather data for ${cityName}`);
    }

    const message = 
      `🌍 Weather in ${weather.name}, ${weather.sys.country}\n\n` +
      `🌡️ Temperature: ${weather.main.temp}°C\n` +
      `🌡️ Feels like: ${weather.main.feels_like}°C\n` +
      `💨 Wind: ${weather.wind.speed} m/s\n` +
      `💧 Humidity: ${weather.main.humidity}%\n` +
      `☁️ ${weather.weather[0].description}\n\n` +
      `🔄 Last updated: ${new Date().toLocaleTimeString()}\n\n` +
      `ℹ️ Note: This is mock data for testing purposes.`;

    await ctx.reply(message);
    console.log(`Weather information sent to user ${ctx.from?.id} for city ${cityName}`);
  } catch (error) {
    console.error(`Error fetching weather for user ${ctx.from?.id}:`, error);
    await ctx.reply("❌ Sorry, I couldn't fetch the weather information. Please try again later.");
  }
};