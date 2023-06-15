import { CardImpl } from "../card/CardImpl";
import { Deck } from "./Deck";


export class DeckImpl implements Deck {

	cards: CardImpl[];
	currentIndex: number;

	constructor(cards: CardImpl[], currentIndex: number) {
		this.cards = cards;
		this.currentIndex = currentIndex;
	}

	/**
     * Draw the top card of the deck.
     * @returns {CardImpl}
     */
	drawCard(): CardImpl {
		// If the last card has been drawn.
		if (this.currentIndex >= this.cards.length) {
			this.shuffle();
		}

		const card = this.cards[this.currentIndex];
		this.currentIndex++;

		return card;
	}

	/**
     *  Empties the current playing deck
     */
	clearDeck(): void {
		this.cards = [];
		this.currentIndex = 0;
	}

	/**
     * Shuffles the existing cards in the deck using the Fisher-Yates Algorithm.
     * @returns {void}
     */
	shuffle(): void {
		for (let i = this.cards.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
		}

		this.currentIndex = 0;
	}

	/**
     * Adds the given card to the bottom of the deck.
     * @param card
     */
	addCard(card: CardImpl) {
		this.cards.push(card);
	}

	/**
     * Adds a deck of 52 cards to the playing deck.
     *  @returns {void}
     */
	addCards(): void {
		const ranks = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];
		const suits = ["Spades", "Hearts", "Diamonds", "Clubs"];

		for (const rank of ranks) {
			for (const suit of suits) {
				const card = new CardImpl(rank, suit);
				this.addCard(card);
			}
		}
	}

}