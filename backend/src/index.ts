import * as express from "express";
import * as dotenv from "dotenv";
import { bot } from "./bot/bot";
import { AppDataSource } from "./config/database";
import { ReminderService } from "./services/reminderService";

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'TELEGRAM_BOT_TOKEN',
  'OPENWEATHER_API_KEY',
  'DATABASE_URL',
  'PORT'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const app = express.default();
const port = process.env.PORT || 3000;

app.use(express.json());

// Basic route
app.get("/", (_req, res) => {
  res.json({ status: "Bot is running" });
});

async function startServer() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log("Database connected successfully");

    // Start the bot
    await bot.start();
    console.log("Telegram bot started successfully");

    // Initialize reminder service
    const reminderService = new ReminderService(bot);
    console.log("Reminder service initialized");

    // Start Express server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // Handle graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Shutting down gracefully...");
      reminderService.stop();
      process.exit(0);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();