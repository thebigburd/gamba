import { SlashCommandBuilder } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Checks Bot latency"),
	cooldown: 5,
	category: "utils",
	async execute(interaction) {
		const sent = await interaction.reply({ content: "Pinging...", fetchReply: true });
		interaction.editReply(`Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
	},

};
