import { PrismaClient, Reminder } from "@prisma/client";
import { Bot } from "grammy";

const prisma = new PrismaClient();

// Store active timeouts to prevent memory leaks
const activeTimeouts = new Map<string, NodeJS.Timeout>();

/**
 * Start the reminder service to check for and trigger reminders
 * @param bot The Telegram bot instance
 */
export async function startReminderService(bot: Bot) {
  console.log("Starting reminder service...");
  
  // Check for reminders every minute
  setInterval(async () => {
    try {
      await checkAndTriggerReminders(bot);
    } catch (error) {
      console.error("Error in reminder service:", error);
    }
  }, 60000); // Check every minute
  
  // Initial check
  await checkAndTriggerReminders(bot);
}

/**
 * Check for and trigger due reminders
 * @param bot The Telegram bot instance
 */
async function checkAndTriggerReminders(bot: Bot) {
  const now = new Date();
  
  // Find all reminders that are due
  const dueReminders = await prisma.reminder.findMany({
    where: {
      createdAt: {
        lte: new Date(now.getTime() - 1000), // Ensure we don't miss any
      },
    },
  });
  
  for (const reminder of dueReminders) {
    // Calculate if the reminder is due
    const reminderTime = new Date(reminder.createdAt.getTime() + reminder.minutes * 60000);
    
    if (now >= reminderTime) {
      // Trigger the reminder
      await triggerReminder(bot, reminder);
      
      // Delete the reminder after triggering
      await prisma.reminder.delete({
        where: {
          id: reminder.id,
        },
      });
    }
  }
}

/**
 * Trigger a reminder by sending a message to the user
 * @param bot The Telegram bot instance
 * @param reminder The reminder to trigger
 */
async function triggerReminder(bot: Bot, reminder: Reminder) {
  try {
    await bot.api.sendMessage(
      reminder.userId.toString(),
      `⏰ REMINDER: ${reminder.message}`
    );
    console.log(`Triggered reminder for user ${reminder.userId}: ${reminder.message}`);
  } catch (error) {
    console.error(`Failed to trigger reminder for user ${reminder.userId}:`, error);
  }
}

/**
 * Schedule a new reminder
 * @param reminder The reminder to schedule
 * @param bot The Telegram bot instance
 */
export async function scheduleReminder(reminder: Reminder, bot: Bot) {
  // Clear any existing timeout for this reminder
  if (activeTimeouts.has(reminder.id)) {
    clearTimeout(activeTimeouts.get(reminder.id));
    activeTimeouts.delete(reminder.id);
  }
  
  // Calculate when the reminder should trigger
  const triggerTime = reminder.minutes * 60000; // Convert to milliseconds
  
  // Set a timeout to trigger the reminder
  const timeout = setTimeout(async () => {
    try {
      // Check if the reminder still exists
      const existingReminder = await prisma.reminder.findUnique({
        where: { id: reminder.id },
      });
      
      if (existingReminder) {
        // Trigger the reminder
        await triggerReminder(bot, existingReminder);
        
        // Delete the reminder after triggering
        await prisma.reminder.delete({
          where: { id: reminder.id },
        });
      }
    } catch (error) {
      console.error(`Error triggering scheduled reminder ${reminder.id}:`, error);
    } finally {
      // Clean up the timeout
      activeTimeouts.delete(reminder.id);
    }
  }, triggerTime);
  
  // Store the timeout for cleanup
  activeTimeouts.set(reminder.id, timeout);
  
  console.log(`Scheduled reminder ${reminder.id} to trigger in ${reminder.minutes} minutes`);
}

/**
 * Clean up old reminders that are no longer needed
 */
export async function cleanupOldReminders() {
  try {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Delete reminders older than a week
    const result = await prisma.reminder.deleteMany({
      where: {
        createdAt: {
          lt: oneWeekAgo,
        },
      },
    });
    
    console.log(`Cleaned up ${result.count} old reminders`);
  } catch (error) {
    console.error("Error cleaning up old reminders:", error);
  }
} 