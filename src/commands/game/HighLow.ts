import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { HighLowController } from "../../game/HighLowController";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("highlow")
		.setDescription("Play a game of High or Low!")
		.addIntegerOption(option =>
			option.setName("stake")
				.setDescription("The amount of money you wish to risk on the game.")),
	cooldown: 5,
	category: "game",
	async execute(interaction) {

		const player = interaction.user.username;
		const userId = interaction.user.id;
		const stake = interaction.options.getInteger("stake");
		let pot = Math.ceil(stake / 2);
		const multiplier = 0.3;
		const economyManager = interaction.client.economyManager;
		const channel = interaction.channel;
		const userData = await economyManager.balanceCache.get(userId);


		if (!userData) {
			interaction.reply({ content: "You do not have an account, type /resetbalance to set one up!", ephemeral: true });
		}
		else if (stake < 0) {
			interaction.reply({ content: "You cannot stake negative money numpty." });
		}
		else if (stake > economyManager.getBalance(userId)) {
			interaction.reply({ content: "You do not have sufficient funds!" });
		}
		else {
			// Stake taken immediatly, to prevent stalling game to save stake.
			economyManager.addBalance(userId, -stake);

			// Instantiate game controller
			const game = new HighLowController(3, multiplier);

			game.startGame();

			const highButton = new ButtonBuilder()
				.setCustomId("high-button")
				.setLabel("Higher")
				.setStyle(ButtonStyle.Primary);

			const lowButton = new ButtonBuilder()
				.setCustomId("low-button")
				.setLabel("Lower")
				.setStyle(ButtonStyle.Secondary);

			const surrenderButton = new ButtonBuilder()
				.setCustomId("surrender-button")
				.setLabel("Surrender")
				.setStyle(ButtonStyle.Danger);

			const gameRow = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(highButton, lowButton, surrenderButton);

			// The Embed displaying the game state that the bot will send to the channel.
			const gameDisplay = new EmbedBuilder()
				.setTitle(`${player}'s Higher or Lower Game.`)
				.addFields(
					{ name: "Next Card", value: "?" },
					{ name: "Current Card", value: `${game.getPlayerCard().getCardName()}` },
					{ name: "Pot", value: `${pot}` },
					{ name: "Current Streak", value: `${game.getStreak()}` },
				);

			const response = await interaction.reply({ embeds: [gameDisplay], components: [gameRow] });

			// Filter only allows the user who used the slash command to interact with it.
			const collectorFilter = i => i.user.id === interaction.user.id;

			try {
				const collector = response.createMessageComponentCollector({ filter: collectorFilter, componentType: ComponentType.Button, time: 420_000 });

				collector.on("collect", i => {
					if (i.customId === "high-button") {
						switch (game.getGameState()) {
						case "PLAYER":
							i.deferUpdate();
							game.playerAct(true);
							updateGameDisplay();
							break;
						case "RESULT":
							i.reply("There is no game running. Use /highlow to start a new game!");
							break;
						default:
							i.reply({ content: `These buttons aren't for you, ${i.user.username}!`, ephemeral: true });
							break;
						}
					}
					else if (i.customId === "low-button") {
						switch (game.getGameState()) {
						case "PLAYER":
							i.deferUpdate();
							game.playerAct(false);
							updateGameDisplay();
							break;
						case "RESULT":
							i.reply("There is no game running. Use /highlow to start a new game!");
							break;
						default:
							i.reply({ content: `These buttons aren't for you, ${i.user.username}!`, ephemeral: true });
							break;
						}
					}
					else if (i.customId === "leave-button" || i.customId === "surrender-button") {
						switch (game.getGameState()) {
						case "CORRECT":
							i.deferUpdate();
							game.surrender();
							updateGameDisplay();
							break;
						case "PLAYER":
							i.deferUpdate();
							game.surrender();
							updateGameDisplay();
							break;
						case "PUSH":
							i.deferUpdate();
							game.surrender();
							updateGameDisplay();
							break;
						case "RESULT":
							i.reply({ content: "There is no game running. Use /highlow to start a new game!" });
							break;
						default:
							i.reply({ content: `These buttons aren't for you!, ${i.user.username}!`, ephemeral: true });
						}
					}
					else if (i.customId === "continue-button") {
						switch (game.getGameState()) {
						case "CORRECT":
							i.deferUpdate();
							game.continue();
							updateGameDisplay();
							break;
						case "PUSH":
							i.deferUpdate();
							game.continue();
							updateGameDisplay();
							break;
						case "RESULT":
							i.reply({ content: "There is no game running. Use /highlow to start a new game!" });
							break;
						default:
							i.reply({ content: `These buttons aren't for you!, ${i.user.username}!`, ephemeral: true });
						}
					}
					else {
						i.reply({ content: "These buttons aren't for you!", ephemeral: true });
					}
				});

				collector.on("end", collected => {
					console.log(`Collector Expired. Collected ${collected.size} interactions.`);
				});
			}
			catch (e) {
				await interaction.editReply({ content: "No interaction was received in the time limit. Game is cancelled.", components: [] });
			}


			const updateGameDisplay = async function() {
				const state = game.getGameState();

				// Player Makes Decision during Intermission
				if (state === "CORRECT") {
					pot = Math.ceil(pot + (multiplier * pot));

					const continueButton = new ButtonBuilder()
						.setCustomId("continue-button")
						.setLabel("Continue")
						.setStyle(ButtonStyle.Primary);

					const leaveButton = new ButtonBuilder()
						.setCustomId("leave-button")
						.setLabel("Leave")
						.setStyle(ButtonStyle.Secondary);

					const decisionRow = new ActionRowBuilder<ButtonBuilder>()
						.addComponents(continueButton, leaveButton);

					const newGameDisplay = new EmbedBuilder()
						.setTitle(`${player}'s Higher or Lower Game.`)
						.setDescription("Correct!")
						.addFields(
							{ name: "Current Card", value: `${game.getNextCard().getCardName()}` },
							{ name: "Pot", value: `${pot}` },
							{ name: "Current Streak", value: `${game.getStreak()}` },
							{ name: "Decision", value: "Continue or Leave with the Full Pot?" },
						);

					await response.edit({ embeds: [newGameDisplay], components: [decisionRow] });
				}
				else if (state === "PUSH") {
					const continueButton = new ButtonBuilder()
						.setCustomId("continue-button")
						.setLabel("Continue")
						.setStyle(ButtonStyle.Primary);

					const leaveButton = new ButtonBuilder()
						.setCustomId("leave-button")
						.setLabel("Leave")
						.setStyle(ButtonStyle.Secondary);

					const decisionRow = new ActionRowBuilder<ButtonBuilder>()
						.addComponents(continueButton, leaveButton);

					const newGameDisplay = new EmbedBuilder()
						.setTitle(`${player}'s Higher or Lower Game.`)
						.setDescription("Draw.")
						.addFields(
							{ name: "Current Card", value: `${game.getNextCard().getCardName()}` },
							{ name: "Pot", value: `${pot}` },
							{ name: "Current Streak", value: `${game.getStreak()}` },
							{ name: "Decision", value: "Continue or Leave with the Full Pot?" },
						);

					await response.edit({ embeds: [newGameDisplay], components: [decisionRow] });
				}
				// Player Chooses to Carry On
				else if (state === "PLAYER") {
					const newGameDisplay = new EmbedBuilder()
						.setTitle(`${player}'s Higher or Lower Game.`)
						.addFields(
							{ name: "Next Card", value: "?" },
							{ name: "Current Card", value: `${game.getPlayerCard().getCardName()}` },
							{ name: "Pot", value: `${pot}` },
							{ name: "Current Streak", value: `${game.getStreak()}` },
						);

					await response.edit({ embeds: [newGameDisplay], components: [gameRow] });
				}
				// Player Chooses to Leave
				else if (state === "RESULT") {
					const result = game.getResult();
					const winType = game.getWinType();

					const newGameDisplay = new EmbedBuilder()
						.setTitle(`${player}'s Higher or Lower Game.`)
						.addFields(
							{ name: "Next Card", value: `${game.getNextCard().getCardName()}` },
							{ name: "Current Card", value: `${game.getPlayerCard().getCardName()}` },
							{ name: "Pot", value: `${pot}` },
							{ name: "Current Streak", value: `${game.getStreak()}` },
						);

					await response.edit({ embeds: [newGameDisplay] })
						.then(() => {
							if (winType === "WIN") {
								economyManager.addBalance(userId, pot);
								channel.send({ content: `${result}`, ephemeral: true });
								channel.send(`**${player} has won a ${pot} pot with a ${game.getStreak()} winstreak!**`);
							}
							else if (winType === "SURRENDER") {
								const winnings = Math.ceil(pot / 2);
								economyManager.addBalance(userId, winnings);
								channel.send({ content: `${result}`, ephemeral: true });
								channel.send(`**${player} has won a ${winnings} pot with a ${game.getStreak()} winstreak!**`);
							}
							else {
								channel.send({ content: `${result}`, ephemeral: true });
								channel.send(`${player} loses a ${pot} pot after a ${game.getStreak()} winstreak.`);
							}
						})
						.catch((error) => {
							console.error(`Failed to send message/display: ${error}`);
						});
				}
			};
		}
	},
};