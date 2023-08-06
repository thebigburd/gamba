import { SlashCommandBuilder } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("balance")
		.setDescription("Check account balance."),
	category: "economy",
	cooldown: 3,
	async execute(interaction) {

		const userId = interaction.user.id;
		const username = interaction.user.username;
		const economyManager = interaction.client.economyManager;
		const user = await economyManager.balanceCache.get(userId);

		if (user) {
			const balance = user.balance;
			interaction.reply({ content: `${username} has ${balance}.` });
		}
		else {
			interaction.reply({ content: "You need to setup an account by typing '/resetbalance'", ephemeral: true });
		}
	},
};