import { Context } from "grammy";

export const startCommand = async (ctx: Context) => {
  try {
    console.log(`Start command received from user ${ctx.from?.id}`);
    
    const welcomeMessage = 
      "👋 Welcome to RedPineappleBot!\n\n" +
      "I can help you with:\n" +
      "🌤️ /weather [city] - Get weather information\n" +
      "⏰ /reminder [time] [message] - Set a reminder\n" +
      "📝 /notes - Manage your notes\n\n" +
      "Use /help to see all available commands!";

    await ctx.reply(welcomeMessage);
    console.log(`Welcome message sent to user ${ctx.from?.id}`);
  } catch (error) {
    console.error("Error in start command:", error);
    await ctx.reply("Sorry, I encountered an error. Please try again later.");
  }
}; 