import { Bot } from "grammy";
import { AppDataSource } from "../config/database";
import { Reminder } from "../entities/Reminder";

const reminderRepository = AppDataSource.getRepository(Reminder);

export class ReminderService {
  private bot: Bot;
  private checkInterval: NodeJS.Timeout;

  constructor(bot: Bot) {
    this.bot = bot;
    this.checkInterval = setInterval(() => this.checkReminders(), 60000); // Check every minute
  }

  private async checkReminders() {
    try {
      const now = new Date();
      const dueReminders = await reminderRepository.find({
        where: {
          scheduledTime: now,
          isCompleted: false
        }
      });

      for (const reminder of dueReminders) {
        try {
          await this.bot.api.sendMessage(
            reminder.userId,
            `⏰ Reminder: ${reminder.message}`
          );
          
          reminder.isCompleted = true;
          await reminderRepository.save(reminder);
        } catch (error) {
          console.error(`Failed to send reminder to user ${reminder.userId}:`, error);
        }
      }
    } catch (error) {
      console.error("Error checking reminders:", error);
    }
  }

  public stop() {
    clearInterval(this.checkInterval);
  }
} 