import { Context } from "grammy";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function weatherCommand(ctx: Context) {
  const city = ctx.match;
  
  if (!city) {
    await ctx.reply("Please provide a city name. Example: /weather London");
    return;
  }

  try {
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
      `☁️ ${weather.weather[0].description}`;

    await ctx.reply(message);
  } catch (error) {
    await ctx.reply("Sorry, I couldn't fetch the weather information. Please check the city name and try again.");
  }
} 