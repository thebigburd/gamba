import { GameController } from "./GameController";
import { DeckImpl } from "../deck/DeckImpl";
import { CardImpl } from "../card/CardImpl";


const GAMESTATE = {
	START: "START",
	PLAYER: "PLAYER",
	DEALER: "DEALER",
	RESULT: "RESULT",
} as const;

const WINTYPE = {
	WIN: "WIN",
	DRAW: "DRAW",
	LOSE: "LOSE",
	NATURAL: "NATWIN",
} as const;

type GameState = typeof GAMESTATE[keyof typeof GAMESTATE]
type WinType = typeof WINTYPE[keyof typeof WINTYPE]

export class BlackjackController implements GameController {

	// Multiplayer will be implemented later.
	maxplayers: number;
	private playingDeck: DeckImpl;
	private playerHand: CardImpl[];
	private dealerHand: CardImpl[];
	private hiddenCard: CardImpl;
	gameState: GameState;
	winType: WinType;

	constructor(deckCount: number) {
		this.maxplayers = 4;
		this.playingDeck = new DeckImpl([], 0);
		for (let i = 0; i < deckCount; i++) {
			this.playingDeck.addCards();
		}
		this.dealerHand = [];
		this.playerHand = [];
		this.gameState = GAMESTATE.START;
		this.winType = WINTYPE.LOSE;
	}

	startGame(): void {
		this.playingDeck.shuffle();

		// Deal Starting Hands
		this.playerHand.push(this.playingDeck.drawCard());
		this.dealerHand.push(this.playingDeck.drawCard());
		this.playerHand.push(this.playingDeck.drawCard());
		this.hiddenCard = this.playingDeck.drawCard();

		// Set state to Player's Turn
		this.gameState = GAMESTATE.PLAYER;
	}

	hit(): void {
		if (this.gameState !== GAMESTATE.PLAYER) {
			throw new Error("It is not the player's turn.");
		}

		this.playerHand.push(this.playingDeck.drawCard());

		if (this.getHandValue(this.playerHand) > 21) {
			this.gameState = GAMESTATE.RESULT;
		}
	}

	stand(): void {
		if (this.gameState !== GAMESTATE.PLAYER) {
			throw new Error("It is not the player's turn.");
		}

		this.gameState = GAMESTATE.DEALER;

		// Dealer Plays
		this.revealHidden();
		while (this.getHandValue(this.dealerHand) < 17) {
			this.dealerHand.push(this.playingDeck.drawCard());
		}

		this.gameState = GAMESTATE.RESULT;
	}

	getPlayerHand(): CardImpl[] {
		return this.playerHand;
	}

	getDealerHand(): CardImpl[] {
		return this.dealerHand;
	}

	getGameState(): GameState {
		return this.gameState;
	}

	getWinType(): WinType {
		return this.winType;
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
		case "Jack":
		case "Queen":
		case "King":
			return 10;
		default:
			throw new Error(`Invalid card rank: ${card.rank}`);
		}
	}

	getHandValue(hand: CardImpl[]): number {
		let val = 0;
		let numAces = 0;

		for (const card of hand) {
			const cardVal = this.getCardValue(card);

			if (cardVal === 1) {
				numAces++;
			}

			val += cardVal;
		}

		// Aces can be 1 or 11 depending on whether it will cause Bust.
		while (val < 11 && numAces > 0) {
			val += 10;
			numAces--;
		}

		return val;
	}

	/**
	 * 	Reveals the Dealer's Hidden Card. Used when Dealer's turn.
	 */
	revealHidden(): void {
		if (this.hiddenCard) {
			this.dealerHand.push(this.hiddenCard);
			this.hiddenCard = null;
		}
	}

	getResult() : string {
		const playerVal = this.getHandValue(this.playerHand);
		const dealerVal = this.getHandValue(this.dealerHand);

		if (playerVal > 21) {
			return ("You have busted. Dealer wins.");
		}

		if (dealerVal > 21) {
			this.winType = WINTYPE.WIN;
			return ("Dealer has busted. You won!");
		}

		if (playerVal === dealerVal) {
			this.winType = WINTYPE.DRAW;
			return ("Draw.");
		}

		if (playerVal > dealerVal) {
			this.winType = WINTYPE.WIN;
			return ("You won!");
		}

		return ("Dealer wins.");
	}

}