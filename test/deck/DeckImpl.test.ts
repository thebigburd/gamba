import { Card } from "../../src/card/Card";
import { CardImpl } from "../../src/card/CardImpl";
import { DeckImpl } from "../../src/deck/DeckImpl";
import { testDeck } from "./Deck.test";

const testCards: Card[] = [
	new CardImpl("Ace", "Clubs"),
	new CardImpl("Ace", "Spades"),
	new CardImpl("King", "Diamond"),
	new CardImpl("Queen", "Hearts"),
	new CardImpl("Five", "Diamond"),
];

type DeckConstructor = new (cards: Card[], currentIndex: number) => DeckImpl;

// Create an instance of DeckImpl constructor
const DeckImplConstructor = DeckImpl as DeckConstructor;

// Call the testDeck function with the DeckImpl constructor
testDeck(DeckImplConstructor);