import { Context } from "grammy";
import { AppDataSource } from "../../config/database";
import { Reminder } from "../../entities/Reminder";

const reminderRepository = AppDataSource.getRepository(Reminder);

export async function reminderCommand(ctx: Context) {
  const matchText = ctx.match as string;
  const args = matchText.split(" ");
  
  if (args.length < 2) {
    await ctx.reply(
      "Please provide a time and message for the reminder.\n" +
      "Example: /reminder 30m Buy groceries\n" +
      "Time formats: 30m (minutes), 2h (hours), 1d (days)"
    );
    return;
  }

  const timeStr = args[0];
  const message = args.slice(1).join(" ");

  // Parse time string
  const timeMatch = timeStr.match(/^(\d+)([mhd])$/);
  if (!timeMatch) {
    await ctx.reply("Invalid time format. Use: 30m, 2h, or 1d");
    return;
  }

  const [, amount, unit] = timeMatch;
  const now = new Date();
  const scheduledTime = new Date(now);

  switch (unit) {
    case "m":
      scheduledTime.setMinutes(now.getMinutes() + parseInt(amount));
      break;
    case "h":
      scheduledTime.setHours(now.getHours() + parseInt(amount));
      break;
    case "d":
      scheduledTime.setDate(now.getDate() + parseInt(amount));
      break;
  }

  try {
    const reminder = new Reminder();
    reminder.userId = ctx.from?.id || 0;
    reminder.message = message;
    reminder.scheduledTime = scheduledTime;

    await reminderRepository.save(reminder);

    await ctx.reply(
      `✅ Reminder set for ${scheduledTime.toLocaleString()}\n` +
      `Message: ${message}`
    );
  } catch (error) {
    await ctx.reply("Sorry, I couldn't set the reminder. Please try again.");
  }
} 