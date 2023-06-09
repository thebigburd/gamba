import * as fs from "node:fs";
import * as path from "node:path";
// Require the necessary discord.js classes
import { Client, Collection, Events } from "discord.js";
import "dotenv/config";
import { Command } from "./interfaces/Command";

export class Bot {
	public commands = new Collection<string, Command>();

	public constructor(private client: Client) {
		this.login(process.env.TOKEN);

		// When the client is ready, run this code (only once)
		// We use 'c' for the event parameter to keep it separate from the already defined 'client'
		client.once(Events.ClientReady, c => {
			// Retrieve Commands for Client
			this.retrieveSlashCommands();
			this.retrieveHandlers();

			console.log(`Ready! Logged in as ${c.user.tag}`);
		});
	}


	private async login(token: string): Promise<void> {
		try {
			await this.client.login(token);
		}
		catch (error) {
			console.log(error);
			return;
		}
	}

	private async retrieveSlashCommands() {
		const foldersPath = path.join(__dirname, "commands");
		const commandFolders = fs.readdirSync(foldersPath);

		// Check all folders under commands
		for (const folder of commandFolders) {
			const commandsPath = path.join(foldersPath, folder);
			const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".ts"));
			// Check all command files
			for (const file of commandFiles) {
				const filePath = path.join(commandsPath, file);
				const command = await import(filePath);
				// Set a new item in the Collection with the key as the command name and the value as the exported module
				if ("data" in command && "execute" in command) {
					this.commands.set(command.data.name, command);
				}
				else {
					console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
				}
			}
		}
	}

	private async retrieveHandlers() {
		this.client.on(Events.InteractionCreate, async interaction => {
			if (!interaction.isChatInputCommand()) return;

			console.log(interaction);
			const command = this.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			}
			catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true });
				}
				else {
					await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
				}
			}
		});
	}

}