import { DeckImpl } from "../../src/deck/DeckImpl"; 
import { expect } from "chai";
import { CardImpl } from "../../src/card/CardImpl";
import { Card } from "../../src/card/Card";

const testCards: Card[] =[
    new CardImpl("Ace", "Clubs"),
    new CardImpl("Ace", "Spades"),
    new CardImpl("King", "Diamond"),
    new CardImpl("Queen", "Hearts"),
    new CardImpl("Five", "Diamond")
];

type DeckConstructor = new (cards: Card[], currentIndex: number) => DeckImpl;

export function testDeck(Deck: DeckConstructor){
    describe("Deck Tests", () => {
        it("Should return the top Card when drawCard() is called", () => {
            // Create a Deck with known order
            const deck = new Deck(testCards, 0);

            // Draw Card
            const card = deck.drawCard();
            
            // Assert
            expect(card).to.be.deep.equal({ rank: "Ace", suit: "Clubs"})
        });

        it("Should shuffle the deck, then draw a card, if Deck is 'empty' when drawCards() is called.", () => {
            // Create an Empty Deck (currentIndex set to end of deck)
            const deck = new Deck(testCards, 5);

            // Draw Card with Empty Deck
            const drawnCard = deck.drawCard();
            const shuffledCards = deck.cards;

            // Assert
            expect(drawnCard).exist; // A card is successfully drawn.

            // Check if all cards pre-shuffle are still in deck
            for (const card of testCards) {
                expect(shuffledCards).to.deep.include(card);
            }
        });

        it("Should randomise the order of Cards in the deck when shuffle()", () => {
            // Create a Deck
            const deck = new Deck(testCards, 0);

            // Shuffle Deck
            deck.shuffle();
            const shuffledCards = deck.cards;

            // Assert
            expect(deck.cards.length).to.equal(5);
            
            // Check if all cards pre-shuffle are still in deck
            for (const card of testCards) {
                expect(shuffledCards).to.deep.include(card);
            }
        });

        it("Should clear the Deck when clearDeck()", () => {
            // Create a Deck
            const deck = new Deck(testCards, 0);
            expect(deck.cards.length).to.equal(5);

            // Clear Deck
            deck.clearDeck();

            // Assert
            expect(deck.cards.length).to.equal(0);

        })


        it("Should add a deck of cards when addCards()", () => {
            // Create a Deck
            const deck = new Deck([], 0);

            // Add Cards to Deck
            deck.addCards();

            // Assert
            expect(deck.cards.length).to.equal(52);
        })
    })
};

// Create an instance of DeckImpl constructor
const DeckImplConstructor = DeckImpl as DeckConstructor;

// Call the testDeck function with the DeckImpl constructor
testDeck(DeckImplConstructor);