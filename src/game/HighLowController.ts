import { CardImpl } from "../card/CardImpl";
import { DeckImpl } from "../deck/DeckImpl";
import { GameController } from "./GameController";

const GAMESTATE = {
	PLAYER: "PLAYER",
	CORRECT: "CORRECT",
	RESULT: "RESULT",
} as const;

const WINTYPE = {
	WIN: "WIN",
	SURRENDER: "SURRENDER",
	LOSE: "LOSE",
} as const;

type GameState = typeof GAMESTATE[keyof typeof GAMESTATE]
type WinType = typeof WINTYPE[keyof typeof WINTYPE]

export class HighLowController implements GameController {
	maxplayers: number;
	gameState: GameState;
	winType: WinType;
	private playingDeck: DeckImpl;
	private playerCard: CardImpl;
	private nextCard: CardImpl;
	private streak: number;
	// The multiplier is the return on each win.
	private multiplier: number;

	constructor(deckCount: number, multiplier) {
		this.maxplayers = 1;
		this.streak = 0;
		this.multiplier = multiplier;

		this.playingDeck = new DeckImpl([], 0);
		for (let i = 0; i < deckCount; i++) {
			this.playingDeck.addCards();
		}

	}

	startGame() {
		this.playingDeck.shuffle();

		this.playerCard = this.playingDeck.drawCard();
		this.nextCard = this.playingDeck.drawCard();

		this.gameState = GAMESTATE.PLAYER;
	}

	playerAct(higher: boolean) {
		if (this.gameState !== GAMESTATE.PLAYER) {
			throw new Error("It's not the player's turn.");
		}

		const cardValue = this.getCardValue(this.playerCard);
		const nextCardValue = this.getCardValue(this.nextCard);

		// If next card is higher than player's card
		if (cardValue < nextCardValue && higher) {
			this.streak += 1;
			this.gameState = GAMESTATE.CORRECT;
		}
		// If next card is lower than player's card
		else if (cardValue > nextCardValue && !higher) {
			this.streak += 1;
			this.gameState = GAMESTATE.CORRECT;
		}
		else {
			this.gameState = GAMESTATE.RESULT;
			this.winType = WINTYPE.LOSE;
		}
	}

	continue() {
		if (this.gameState !== GAMESTATE.CORRECT) {
			throw new Error("It is not time to decide. This option should not be available.");
		}

		// Resets and shuffles the deck after 10 Wins to prevent Card Counting.
		if (this.streak % 10 === 0) {
			this.playingDeck.clearDeck();
			this.playingDeck.addCards();
			this.playingDeck.shuffle;
		}

		this.playerCard = this.nextCard;
		this.nextCard = this.playingDeck.drawCard();

		this.gameState = GAMESTATE.PLAYER;
	}

	surrender() {
		if (this.gameState === GAMESTATE.CORRECT) {
			this.winType = WINTYPE.WIN;
			this.gameState = GAMESTATE.RESULT;
		}
		else if (this.gameState === GAMESTATE.PLAYER) {
			this.winType = WINTYPE.SURRENDER;
			this.gameState = GAMESTATE.RESULT;
		}
		else {
			throw new Error("This option shold not be available. It is not time to decide.");
		}
	}

	getResult() {
		if (this.winType === WINTYPE.WIN) {
			return ("You leave taking the whole pot!");
		}

		if (this.winType === WINTYPE.SURRENDER) {
			return ("You surrendered, forfeiting half the pot!");
		}

		return ("Incorrect. You have lost!");
	}

	getWinType(): WinType {
		return this.winType;
	}

	getPlayerCard(): CardImpl {
		return this.playerCard;
	}

	getNextCard(): CardImpl {
		return this.nextCard;
	}

	getStreak(): number {
		return this.streak;
	}

	setStreak(num: number) {
		this.streak = num;
	}

	getGameState() {
		return this.gameState;
	}

	getMultiplier() {
		return this.multiplier;
	}

	getPlayingDeck(): DeckImpl {
		return this.playingDeck;
	}

	getCardValue(card: CardImpl): number {
		switch (card.cardRank) {
		case "Ace":
			return 1;
		case "Two":
			return 2;
		case "Three":
			return 3;
		case "Four":
			return 4;
		case "Five":
			return 5;
		case "Six":
			return 6;
		case "Seven":
			return 7;
		case "Eight":
			return 8;
		case "Nine":
			return 9;
		case "Ten":
			return 10;
		case "Jack":
			return 11;
		case "Queen":
			return 12;
		case "King":
			return 13;
		default:
			throw new Error(`Invalid card rank: ${card.rank}`);
		}
	}

}