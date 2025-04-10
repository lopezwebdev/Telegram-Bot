import { Context } from "grammy";

export async function startCommand(ctx: Context) {
  await ctx.reply(
    "Welcome! 👋 I'm your personal assistant bot. Here are my commands:\n\n" +
    "/start - Show this welcome message\n" +
    "/help - Show available commands\n" +
    "/weather - Get weather information\n" +
    "/reminder - Set a reminder\n" +
    "/notes - Manage your notes"
  );
} 