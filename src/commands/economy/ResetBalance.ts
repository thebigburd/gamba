import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from "discord.js";
import User from "../../models/User";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("resetbalance")
		.setDescription("Resets account balance, or sets up account if new!"),
	category: "economy",
	cooldown: 3,
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const userId = interaction.user.id;
		const economyManager = interaction.client.economyManager;
		const user = await economyManager.balanceCache.get(userId);


		if (user) {
			if (user.balance < 1000) {
				economyManager.setBalance(userId, 1000);
				await User.update(
					{ balance: 1000 },
					{ where: { id: `${userId}` } },
				);
				interaction.followUp({ content: "Your balance has been reset to 1000.", ephemeral: true });
			}
			else {
				const confirmButton = new ButtonBuilder()
					.setCustomId("confirm-button")
					.setLabel("Confirm")
					.setStyle(ButtonStyle.Danger);

				const cancelButton = new ButtonBuilder()
					.setCustomId("cancel-button")
					.setLabel("Cancel")
					.setStyle(ButtonStyle.Secondary);

				const row = new ActionRowBuilder<ButtonBuilder>()
					.addComponents(confirmButton, cancelButton);

				const response = await interaction.followUp({ content: "Are you sure you wish to reset your balance?", components: [row], ephemeral: true });

				const collectorFilter = i => i.user.id === interaction.user.id;

				try {
					const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });


					if (confirmation.customId === "confirm-button") {
						economyManager.setBalance(userId, 1000);
						await User.update(
							{ balance: 1000 },
							{ where: { id: `${userId}` } },
						);
						await confirmation.update({ content: "Your balance has been reset to 1000.", components: [] });
					}
					else if (confirmation.customId === "cancel-button") {
						await confirmation.update({ content: "Cancelled", components: [] });
					}
				}
				catch (e) {
					console.error(e);
					await interaction.editReply({ content: "Confirmation not received within 1 minute, cancelling", components: [] });
				}
			}

		}
		else {
			try {
				// Create new Database Entry for New User.
				const newUser = await User.create({ id: userId, balance: 1000 });
				await economyManager.updateCache();
				console.log(`New User with id ${userId} has been created.`);

				interaction.followUp({ content: `Hi ${interaction.user.username}! Your account has been funded with 1000 to start you off!`, ephemeral: true });
				return newUser;
			}
			catch (error) {
				console.error("Failed to add User to the database.");
				interaction.followUp("Error! Something went wrong!");
			}
		}

	},
};