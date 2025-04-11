import { Bot } from "grammy";
import * as dotenv from "dotenv";
import { registerCommands } from "./commands";

dotenv.config();

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN must be provided!");
}

// Create a new bot instance
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

// Add error handling
bot.catch((err) => {
  console.error("Bot error:", err);
});

// Register all commands
registerCommands(bot);

// Handle text messages
bot.on("message:text", async (ctx) => {
  try {
    await ctx.reply(
      "I don't understand that message. Please use one of my commands:\n" +
      "/start - Start the bot\n" +
      "/help - Show available commands\n" +
      "/weather [city] - Get weather information\n" +
      "/reminder [time] [message] - Set a reminder\n" +
      "/notes - Manage your notes"
    );
  } catch (error) {
    console.error("Error handling message:", error);
    await ctx.reply("Sorry, I encountered an error. Please try again later.");
  }
});

// Log when bot is ready
bot.api.getMe().then((botInfo) => {
  console.log(`Bot started successfully: @${botInfo.username}`);
}).catch((error) => {
  console.error("Error getting bot info:", error);
});

export { bot };