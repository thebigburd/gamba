import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, EmbedBuilder } from "discord.js";
import { BlackjackController } from "../../game/BlackjackController";
import { CardImpl } from "../../card/CardImpl";


module.exports = {
	data: new SlashCommandBuilder()
		.setName("blackjack")
		.setDescription("Play a game of Blackjack!")
		.addIntegerOption(option =>
			option.setName("stake")
				.setDescription("The amount of money you wish to risk on the game.")),
	cooldown: 5,
	category: "game",
	async execute(interaction) {

		const player = interaction.user.username;
		const userId = interaction.user.id;
		const stake = interaction.options.getInteger("stake");
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
			const game = new BlackjackController(6);

			game.startGame();

			const hitButton = new ButtonBuilder()
				.setCustomId("hit-button")
				.setLabel("Hit")
				.setStyle(ButtonStyle.Primary);

			const standButton = new ButtonBuilder()
				.setCustomId("stand-button")
				.setLabel("Stand")
				.setStyle(ButtonStyle.Secondary);

			const row = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(hitButton, standButton);

			// The Embed displaying the game state that the bot will send to the channel.
			const gameDisplay = new EmbedBuilder()
				.setTitle(`${player}'s Blackjack Game.`)
				.addFields(
					{ name: "Dealer's Hand", value: `${getHandName(game.getDealerHand())}` },
					{ name: "Total", value: `${game.getHandValue(game.getDealerHand())}` },
					{ name: "Player's Hand", value: `${getHandName(game.getPlayerHand())}` },
					{ name: "Total", value: `${game.getHandValue(game.getPlayerHand())}` },
				);

			const response = await interaction.reply({ embeds: [gameDisplay], components: [row] });

			// Filter only allows the user who used the slash command to interact with it.
			const collectorFilter = i => i.user.id === interaction.user.id;

			try {
				const collector = response.createMessageComponentCollector({ filter: collectorFilter, componentType: ComponentType.Button, time: 180_000 });

				collector.on("collect", i => {
					if (i.customId === "hit-button") {
						switch (game.getGameState()) {
						case "PLAYER":
							i.deferUpdate();
							game.hit();
							updateGameDisplay();
							break;
						case "RESULT":
							i.reply("There is no game running. Use /blackjack to start a new game!");
							break;
						default:
							i.followUp({ content: `It's not your turn, ${i.user.username}!`, ephemeral: true });
							break;
						}
					}
					else if (i.customId === "stand-button") {
						switch (game.getGameState()) {
						case "PLAYER":
							i.deferUpdate();
							game.stand();
							updateGameDisplay();
							break;
						case "RESULT":
							i.reply("There is no game running. Use /blackjack to start a new game!");
							break;
						default:
							i.followUp(`It's not your turn, ${i.user.username}!`);
							break;
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
				const newGameDisplay = new EmbedBuilder()
					.setTitle(`${player}'s Blackjack Game.`)
					.addFields(
						{ name: "Dealer's Hand", value: `${getHandName(game.getDealerHand())}` },
						{ name: "Total", value: `${game.getHandValue(game.getDealerHand())}` },
						{ name: "Player's Hand", value: `${getHandName(game.getPlayerHand())}` },
						{ name: "Total", value: `${game.getHandValue(game.getPlayerHand())}` },
					);

				await response.edit({ embeds: [newGameDisplay] })
					.then(() => {
						if (game.getGameState() === "RESULT") {
							const result = game.getResult();
							const winType = game.getWinType();
							channel.send(`${result}`);

							if (winType === "WIN") {
								economyManager.addBalance(userId, (stake * 2));
								channel.send(`**${player} has won ${stake * 2}!**`);
							}
							else if (winType === "DRAW") {
								economyManager.addBalance(userId, (stake));
							}
						}
					})
					.catch((error) => {
						console.error(`Failed to send message/display:  ${error}`);
					});
			};
		}

		function getHandName(cards: CardImpl[]) : string {
			const handName = cards.map(card => card.getCardName()).join(", ");
			return handName;
		}

	},
};