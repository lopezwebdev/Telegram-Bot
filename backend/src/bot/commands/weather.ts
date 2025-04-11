import { Context } from "grammy";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

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

    console.log(`Fetching weather for city: ${city}`);
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        q: city,
        appid: WEATHER_API_KEY,
        units: "metric"
      }
    });

    const weather = response.data;
    const message = 
      `🌍 Weather in ${weather.name}, ${weather.sys.country}\n\n` +
      `🌡️ Temperature: ${weather.main.temp}°C\n` +
      `🌡️ Feels like: ${weather.main.feels_like}°C\n` +
      `💨 Wind: ${weather.wind.speed} m/s\n` +
      `💧 Humidity: ${weather.main.humidity}%\n` +
      `☁️ ${weather.weather[0].description}\n\n` +
      `🔄 Last updated: ${new Date().toLocaleTimeString()}`;

    await ctx.reply(message);
    console.log(`Weather information sent to user ${ctx.from?.id} for city ${city}`);
  } catch (error) {
    console.error(`Error fetching weather for user ${ctx.from?.id}:`, error);
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      await ctx.reply("❌ City not found. Please check the spelling and try again.");
    } else {
      await ctx.reply("❌ Sorry, I couldn't fetch the weather information. Please try again later.");
    }
  }
}; 