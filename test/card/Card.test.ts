import { expect } from "chai";
import { CardImpl } from "../../src/card/CardImpl";

type CardConstructor = new (rank: string, suit: string) => CardImpl;

export function testCard(Card: CardConstructor) {
	describe("General Card Tests", () => {
		it("Should be instantiated with a rank and a suit", () => {
			// Call Constructor to instantiate Card
			const card = new Card("Ace", "Spades");

			// Assert
			expect(card.rank).to.equal("Ace");

			expect(card.suit).to.equal("Spades");

			expect(card.getCardName()).to.equal("Ace of Spades");

		});

		it("Should change its name when Rank is modified.", () => {
			// Call Constructor to instantiate Card
			const card = new Card("Ace", "Spades");
			expect(card.getCardName()).to.equal("Ace of Spades");

			// Act
			card.rank = "King";

			// Assert
			expect(card.rank).to.equal("King");

			expect(card.getCardName()).to.equal("King of Spades");

		});

		it("Should change its name when Suit is modified", () => {
			// Call Constructor to instantiate Card
			const card = new Card("Ace", "Spades");
			expect(card.getCardName()).to.equal("Ace of Spades");

			// Act
			card.suit = "Hearts";

			// Assert
			expect(card.suit).to.equal("Hearts");

			expect(card.getCardName()).to.equal("Ace of Hearts");
		});
	});
}
