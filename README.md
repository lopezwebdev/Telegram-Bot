# Telegram Bot

A feature-rich Telegram bot built with TypeScript, Express, and PostgreSQL.

## Features

- Weather information using OpenWeatherMap API
- Reminder system with flexible time formats
- Notes management system
- Database persistence
- Express server for webhook support

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- Telegram Bot Token (from BotFather)
- OpenWeatherMap API Key

## Setup

1. Clone the repository:
```bash
git clone https://github.com/lopezwebdev/Telegram-Bot.git
cd Telegram-Bot
```

2. Install dependencies:
```bash
cd backend
npm install
```

3. Create a PostgreSQL database:
```bash
createdb telegram_bot
```

4. Create a .env file in the backend directory with the following variables:
```
TELEGRAM_BOT_TOKEN=your_bot_token
OPENWEATHER_API_KEY=your_api_key
DATABASE_URL=postgresql://localhost:5432/telegram_bot
PORT=3000
```

5. Start the bot:
```bash
npm run dev
```

## Available Commands

- `/start` - Show welcome message
- `/help` - Show available commands
- `/weather [city]` - Get weather information for a city
- `/reminder [time] [message]` - Set a reminder (e.g., 30m, 2h, 1d)
- `/notes` - Manage your notes
  - `/notes add [title] [content]` - Add a new note
  - `/notes list` - List all notes
  - `/notes delete [id]` - Delete a note

## Development

- `npm run dev` - Start the bot in development mode
- `npm run build` - Build the TypeScript code
- `npm start` - Start the bot in production mode

## License

MIT 
