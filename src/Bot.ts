import * as fs from "node:fs";
import * as path from "node:path";
// Require the necessary discord.js classes
import { Client, Collection, Events } from "discord.js";
import "dotenv/config";
import { Command } from "./interfaces/Command";

export class Bot {
	public commands = new Collection<string, Command>();

	public constructor(private client: Client) {
		// Retrieve Commands for Client
		this.retrieveSlashCommands();
		// Retrieve Listeners
		this.retrieveEventHandlers();

		this.login(process.env.TOKEN);
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

	private async retrieveEventHandlers() {
		const eventsPath = path.join(__dirname, "events");
		const eventsFolder = fs.readdirSync(eventsPath);

		for (const file of eventsFolder) {
			const filePath = path.join(eventsPath, file);
			const event = await import(filePath);
			if (event.once) {
				this.client.once(event.name, (...args) => event.execute(...args));
			}
			else {
				this.client.on(event.name, (...args) => event.execute(...args));
			}
		}

	}

}