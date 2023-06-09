import { SlashCommandBuilder } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("server")
		.setDescription("Provides information about the server."),
	category: "utils",
	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run
		await interaction.reply(`This server is ${interaction.guild.name}, and was created on ${interaction.guild.createdAt}. It has ${interaction.guild.memberCount} members.`);
	},
};