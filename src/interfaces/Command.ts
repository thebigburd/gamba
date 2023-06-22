import { SlashCommandBuilder } from "discord.js";

export interface Command {
	data: SlashCommandBuilder,
	cooldown,
	execute(...args: any): any
}