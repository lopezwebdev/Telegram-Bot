import { Bot } from "grammy";
import { startCommand } from "./start";
import { helpCommand } from "./help";
import { weatherCommand } from "./weather";
import { reminderCommand } from "./reminder";
import { notesCommand } from "./notes";

export function registerCommands(bot: Bot) {
  // Register all commands
  bot.command("start", startCommand);
  bot.command("help", helpCommand);
  bot.command("weather", weatherCommand);
  bot.command("reminder", reminderCommand);
  bot.command("notes", notesCommand);
} 