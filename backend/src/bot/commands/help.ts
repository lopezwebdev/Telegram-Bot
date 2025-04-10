import { Context } from "grammy";

export async function helpCommand(ctx: Context) {
  await ctx.reply(
    "Available commands:\n\n" +
    "/start - Start the bot and see welcome message\n" +
    "/help - Show this help message\n" +
    "/weather [city] - Get weather information for a city\n" +
    "/reminder [time] [message] - Set a reminder\n" +
    "/notes - Manage your notes (add/list/delete)"
  );
} 