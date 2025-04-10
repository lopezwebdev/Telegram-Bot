import { Bot } from "grammy";
import * as dotenv from "dotenv";
import { registerCommands } from "./commands";

dotenv.config();

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN must be provided!");
}

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

// Register all commands
registerCommands(bot);

// Handle text messages
bot.on("message:text", async (ctx) => {
  await ctx.reply(
    "I don't understand that message. Please use one of my commands:\n" +
    "/start - Start the bot\n" +
    "/help - Show available commands\n" +
    "/weather [city] - Get weather information\n" +
    "/reminder [time] [message] - Set a reminder\n" +
    "/notes - Manage your notes"
  );
});

export { bot };