import { Context } from "grammy";
import { AppDataSource } from "../../config/database";
import { Note } from "../../entities/Note";

const noteRepository = AppDataSource.getRepository(Note);

export async function notesCommand(ctx: Context) {
  const matchText = ctx.match as string;
  const args = matchText.split(" ");
  const command = args[0]?.toLowerCase();

  if (!command) {
    await ctx.reply(
      "Notes commands:\n\n" +
      "/notes add <title> <content> - Add a new note\n" +
      "/notes list - List all your notes\n" +
      "/notes delete <id> - Delete a note by ID"
    );
    return;
  }

  const userId = ctx.from?.id || 0;

  switch (command) {
    case "add":
      if (args.length < 3) {
        await ctx.reply("Please provide a title and content for the note.\nExample: /notes add Shopping List Buy milk, eggs");
        return;
      }
      const title = args[1];
      const content = args.slice(2).join(" ");
      
      try {
        const note = new Note();
        note.userId = userId;
        note.title = title;
        note.content = content;
        
        await noteRepository.save(note);
        await ctx.reply(`✅ Note added successfully!\nTitle: ${title}`);
      } catch (error) {
        await ctx.reply("Sorry, I couldn't add the note. Please try again.");
      }
      break;

    case "list":
      try {
        const notes = await noteRepository.find({
          where: { userId, isArchived: false },
          order: { createdAt: "DESC" }
        });

        if (notes.length === 0) {
          await ctx.reply("You don't have any notes yet.");
          return;
        }

        const noteList = notes.map(note => 
          `📝 ${note.title} (ID: ${note.id})\n${note.content}\n`
        ).join("\n");

        await ctx.reply(`Your notes:\n\n${noteList}`);
      } catch (error) {
        await ctx.reply("Sorry, I couldn't retrieve your notes. Please try again.");
      }
      break;

    case "delete":
      const noteId = parseInt(args[1]);
      if (isNaN(noteId)) {
        await ctx.reply("Please provide a valid note ID to delete.\nExample: /notes delete 1");
        return;
      }

      try {
        const note = await noteRepository.findOne({
          where: { id: noteId, userId }
        });

        if (!note) {
          await ctx.reply("Note not found or you don't have permission to delete it.");
          return;
        }

        await noteRepository.remove(note);
        await ctx.reply(`✅ Note deleted successfully!`);
      } catch (error) {
        await ctx.reply("Sorry, I couldn't delete the note. Please try again.");
      }
      break;

    default:
      await ctx.reply(
        "Invalid command. Available commands:\n" +
        "/notes add <title> <content>\n" +
        "/notes list\n" +
        "/notes delete <id>"
      );
  }
} 