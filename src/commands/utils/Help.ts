import { ActionRowBuilder, ComponentType, EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Provides help of a specific command or of the Bot in general.")
		.addStringOption(option =>
			option.setName("command")
				.setDescription("The command you need help with.")),
	cooldown: 5,
	category: "utils",
	async execute(interaction) {

		const command = interaction.options.getString("command");

		const bjDescription = new EmbedBuilder()
			.setTitle("Blackjack Help")
			.addFields(
				{ name: "Rules", value: "The aim of Blackjack is to have a hand with a value better than the dealer, without going over 21. Going over 21 means you have Busted and lose. \n With the exception of Kings, Queens and Jacks and Aces, Cards are worth their face value. Kings, Queens and Jacks are worth 10. Aces are a special card as they are worth 11 as long as your total hand does not go over 21, otherwise they are 1." },
				{ name: "How to Play", value: "At the beginning, both the player and the dealer are dealt two cards. One of the dealer's cards will be face down. \n\n Hit - This will draw a card from the deck to the player's hand. You can continue to Hit unless you go over 21. \n\n	 Stand - The player sticks with the cards in their hands, and the dealer plays. \n The dealer must hit while under 17 total card value, and stand otherwise." },
				{ name: "Winnings", value: "This game returns double your stake." },
				{ name: "Usage", value: "/blackjack \n /blackjack <stake value>" },
			);

		const highlowDescription = new EmbedBuilder()
			.setTitle("Higher or Lower Help")
			.addFields(
				{ name: "Rules", value: "The aim of Higher or Lower is to predict whether the next card is higher or lower than the card you have." },
				{ name: "How to Play", value: "Higher - Press if you believe the next card is Higher than your current card. \n\n Lower - Press if you believe the next card is Lower than your current card. \n\n Surrender - Available during a round. Leave with half the winnings in the pot. \n \n Leave - Available during intermission. Leave with all the winnings in the pot. " },
				{ name: "Winnings", value: "This game returns a multiplier of the current round's pot." },
				{ name: "Usage", value: "/highlow \n /highlow <stake value>" },
			);

		const balanceDescription = new EmbedBuilder()
			.setTitle("Balance")
			.setDescription("This is an economy command that allows you check how much money you have. \n Earn money from playing games, claiming your daily reward and other activities! \n\n If you run out of money, use the /resetbalance command to reset to the starting amount.");

		const resetBalanceDescription = new EmbedBuilder()
			.setTitle("Reset Balance")
			.setDescription("This is an economy command that resets your balance to 1000.");

		// If no Option open Select menu and let User select the command they need help with.
		// If Option specified create embed with specific information on the given command.

		if (!command) {
			const selectOptions = new StringSelectMenuBuilder()
				.setCustomId("commands")
				.setPlaceholder("Select from List")
				.addOptions(
					new StringSelectMenuOptionBuilder()
						.setLabel("Blackjack")
						.setDescription("The Blackjack card game. /blackjack")
						.setValue("blackjack"),
					new StringSelectMenuOptionBuilder()
						.setLabel("Higher or Lower")
						.setDescription("The Higher or Lower card game. /highlow")
						.setValue("highlow"),
					new StringSelectMenuOptionBuilder()
						.setLabel("Balance")
						.setDescription("Economy command. /balance")
						.setValue("balance"),
					new StringSelectMenuOptionBuilder()
						.setLabel("Reset Balance")
						.setDescription("Economy command. /resetbalance")
						.setValue("resetbalance"),
				);

			const selector = new ActionRowBuilder<StringSelectMenuBuilder>()
				.addComponents(selectOptions);

			const helpDisplay = new EmbedBuilder()
				.setAuthor({ name: "Gamba", url: "https://github.com/thebigburd/gamba" })
				.setDescription(`Welcome to <@${process.env.CLIENTID}>'s help menu. \n Use the box below to learn about the avaialble commands.`);

			const selectMenu = await interaction.reply(
				{
					embeds: [helpDisplay],
					components: [selector],
					ephemeral: true,
				});

			const collector = selectMenu.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 360000 });

			try {

				collector.on("collect", i => {
					i.deferUpdate();
					if (i.values[0] === "blackjack") {
						selectMenu.edit({ embeds: [bjDescription], components: [selector] });
					}
					if (i.values[0] === "highlow") {
						selectMenu.edit({ embeds: [highlowDescription], components: [selector] });
					}
					if (i.values[0] === "balance") {
						selectMenu.edit({ embeds: [balanceDescription], components: [selector] });
					}
					if (i.values[0] === "resetbalance") {
						selectMenu.edit({ embeds: [resetBalanceDescription], components: [selector] });
					}
				});

				collector.on("end", (collected, reason) => {
					const disabledOptions = new StringSelectMenuBuilder()
						.setCustomId("commands")
						.setPlaceholder("Select from List")
						.setDisabled(true)
						.addOptions(
							new StringSelectMenuOptionBuilder()
								.setLabel("blackjack")
								.setDescription("The Blackjack card game")
								.setValue("Blackjack"),
							new StringSelectMenuOptionBuilder()
								.setLabel("highlow")
								.setDescription("The Higher or Lower card game")
								.setValue("Higher or Lower"),
							new StringSelectMenuOptionBuilder()
								.setLabel("balance")
								.setDescription("Economy command.")
								.setValue("Balance"),
						);

					const disabledSelector = new ActionRowBuilder<StringSelectMenuBuilder>()
						.addComponents(disabledOptions);

					const expiredDisplay = new EmbedBuilder()
						.setAuthor({ name: "Gamba", url: "https://github.com/thebigburd/gamba" })
						.setDescription("Help Menu Expired. \n Use /help to create a new Help menu.");


					interaction.editReply(
						{
							embeds: [expiredDisplay],
							components: [disabledSelector],
							ephemeral: true,
						});
					console.log(`Collected ${collected.size} interactions.`);
					console.log(`${reason}`);
				});
			}
			catch (e) {
				interaction.reply(`No interaction received. ${e}`);
			}
		}
		else {
			if (command === "blackjack" || command === "bj") {
				const response = await interaction.reply({ embeds: [bjDescription], ephemeral: true });
			}
			if (command === "highlow" || command === "higherorlower") {
				const response = await interaction.reply({ embeds: [highlowDescription], ephemeral: true });
			}
			if (command === "balance") {
				const response = await interaction.reply({ embeds: [balanceDescription], ephemeral: true });
			}
			if (command === "resetbalance") {
				const response = await interaction.reply({ embeds: [resetBalanceDescription], ephemeral: true });
			}

		}
	},

};
