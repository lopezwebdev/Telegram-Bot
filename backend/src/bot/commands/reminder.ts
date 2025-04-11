import { Context } from "grammy";
import { PrismaClient, Reminder } from "@prisma/client";
import { parseTime } from "../utils/timeParser";
import { scheduleReminder } from "../../services/reminderService";
import { bot } from "../bot";

const prisma = new PrismaClient();

export const reminderCommand = async (ctx: Context) => {
  try {
    if (!ctx.message?.text) {
      await ctx.reply("Please provide a valid command.");
      return;
    }

    const args = ctx.message.text.split(" ");
    const command = args[1]?.toLowerCase();

    if (!command) {
      await ctx.reply(
        "Please specify a command: add, list, or delete.\n" +
        "Example: /reminder add 30m Take medicine"
      );
      return;
    }

    switch (command) {
      case "add": {
        const timeStr = args[2];
        const message = args.slice(3).join(" ");

        if (!timeStr || !message) {
          await ctx.reply(
            "Please provide both time and message.\n" +
            "Example: /reminder add 30m Take medicine"
          );
          return;
        }

        const minutes = parseTime(timeStr);
        if (minutes === null) {
          await ctx.reply(
            "Invalid time format. Please use format like '30m' or '1h'."
          );
          return;
        }

        const reminder = await prisma.reminder.create({
          data: {
            userId: parseInt(ctx.from?.id.toString() || "0"),
            message,
            minutes,
            createdAt: new Date(),
          },
        });

        // Schedule the reminder to trigger
        scheduleReminder(reminder, bot);

        await ctx.reply(
          `Reminder set for ${minutes} minutes from now:\n${message}`
        );
        break;
      }

      case "list": {
        const reminders = await prisma.reminder.findMany({
          where: {
            userId: parseInt(ctx.from?.id.toString() || "0"),
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        if (reminders.length === 0) {
          await ctx.reply("You have no active reminders.");
          return;
        }

        const reminderList = reminders
          .map(
            (r: Reminder) =>
              `• ${r.message} (${r.minutes}m) - Created: ${r.createdAt.toLocaleString()}`
          )
          .join("\n");

        await ctx.reply(`Your reminders:\n${reminderList}`);
        break;
      }

      case "delete": {
        const reminderId = args[2];
        if (!reminderId) {
          await ctx.reply(
            "Please provide the reminder ID to delete.\n" +
            "Use /reminder list to see your reminders."
          );
          return;
        }

        const reminder = await prisma.reminder.delete({
          where: {
            id: reminderId,
            userId: parseInt(ctx.from?.id.toString() || "0"),
          },
        });

        await ctx.reply(`Reminder deleted: ${reminder.message}`);
        break;
      }

      default:
        await ctx.reply(
          "Invalid command. Use 'add', 'list', or 'delete'.\n" +
          "Example: /reminder add 30m Take medicine"
        );
    }
  } catch (error) {
    console.error("Error handling reminder command:", error);
    await ctx.reply("Sorry, there was an error processing your request.");
  }
} 