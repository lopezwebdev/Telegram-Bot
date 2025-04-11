import * as express from "express";
import * as dotenv from "dotenv";
import { bot } from "./bot/bot";
import { startReminderService, cleanupOldReminders } from "./services/reminderService";

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
    // Start the bot
    await bot.start();
    console.log("Telegram bot started successfully");

    // Start the reminder service
    await startReminderService(bot);
    console.log("Reminder service started successfully");

    // Schedule cleanup of old reminders (run once a day)
    setInterval(async () => {
      await cleanupOldReminders();
    }, 24 * 60 * 60 * 1000);
    
    // Run initial cleanup
    await cleanupOldReminders();

    // Start Express server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // Handle graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Shutting down gracefully...");
      process.exit(0);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();