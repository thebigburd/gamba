import { Card } from "./Card";

export class CardImpl implements Card {

	rank: string;
	suit: string;

	constructor(rank: string, suit: string) {
		this.rank = rank;
		this.suit = suit;
	}

	get cardRank() : string {
		return this.rank;
	}

	set cardRank(rank: string) {
		this.rank = rank;

	}

	get cardSuit() : string {
		return this.suit;
	}

	set cardSuit(suit: string) {
		this.suit = suit;
	}


	getCardName() : string {
		return `${this.rank} of ${this.suit}`;
	}

}