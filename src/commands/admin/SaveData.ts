import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";


module.exports = {
	data: new SlashCommandBuilder()
		.setName("savedata")
		.setDescription("Saves Cached Data to the Database.")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	category: "admin",
	cooldown: 60,
	async execute(interaction) {
		const economyManager = interaction.client.economyManager;

		await interaction.deferReply({ ephemeral: true });

		try {
			await economyManager.saveCache();

			await interaction.editReply("Data has been successfully persisted");
		}
		catch (error) {
			await interaction.editReply(`Something went wrong saving to database: ${error}`);
		}
	},
};