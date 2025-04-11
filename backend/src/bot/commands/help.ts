import { Context } from "grammy";

export const helpCommand = async (ctx: Context) => {
  try {
    console.log(`Help command received from user ${ctx.from?.id}`);
    
    const helpMessage = 
      "📚 Available Commands:\n\n" +
      "🌤️ Weather Commands:\n" +
      "  /weather [city] - Get current weather\n" +
      "  /forecast [city] - Get 5-day forecast\n\n" +
      "⏰ Reminder Commands:\n" +
      "  /reminder [time] [message] - Set a reminder\n" +
      "  /reminders - List your reminders\n" +
      "  /cancel [id] - Cancel a reminder\n\n" +
      "📝 Note Commands:\n" +
      "  /notes - List your notes\n" +
      "  /addnote [text] - Add a new note\n" +
      "  /deletenote [id] - Delete a note\n\n" +
      "❓ Other Commands:\n" +
      "  /start - Show welcome message\n" +
      "  /help - Show this help message";

    await ctx.reply(helpMessage);
    console.log(`Help message sent to user ${ctx.from?.id}`);
  } catch (error) {
    console.error("Error in help command:", error);
    await ctx.reply("Sorry, I encountered an error. Please try again later.");
  }
}; 