/* eslint-disable no-inline-comments */
import { expect } from "chai";
import { BlackjackController } from "../../src/game/BlackjackController";
import { CardImpl } from "../../src/card/CardImpl";
import { DeckImpl } from "../../src/deck/DeckImpl";
import { instance, mock, when } from "ts-mockito";


describe("Blackjack Controller Test", () => {
	it("Should deal two cards to the player and the dealer at start", () => {
		// Setup
		const game = new BlackjackController(1);

		// Act
		game.startGame();
		game.revealHidden();

		// Assert
		const playerHand = game.getPlayerHand();
		const dealerHand = game.getDealerHand();
		expect(playerHand.length).to.be.equal(2);
		expect(dealerHand.length).to.be.equal(2);
	});

	it("Should draw a card to the player's hand when they hit.", () => {
		// Setup
		const game = new BlackjackController(1);
		game.startGame();
		let playerHand = game.getPlayerHand();
		expect(playerHand.length).to.be.equal(2);

		// Act
		game.hit();

		// Assert
		playerHand = game.getPlayerHand();
		expect(playerHand.length).to.be.equal(3);
	});

	it("Should throw an error when player hits when it's not their turn.", () => {
		// Setup
		const game = new BlackjackController(1);

		// Act and Assert
		expect(() => game.hit()).to.throw(Error, "It is not the player's turn.");
	});

	it("Should return the 'You have busted. Dealer wins.' if player busts from hitting", () => {
		// Setup
		const game = new BlackjackController(1);
		game.startGame();

		// Act
		while (game.getHandValue(game.getPlayerHand()) < 22) {
			game.hit();
		}
		const result = game.getResult();

		// Assert
		expect(game.gameState).to.equal("RESULT");
		expect(result).to.equal("You have busted. Dealer wins.");
	});

	it("Should update GAMESTATE to 'RESULT' and update dealer's hand when player stands.", () => {
		// Setup
		const game = new BlackjackController(1);
		game.startGame();
		game.revealHidden();
		const initDealerHand = [...game.getDealerHand()];
		const initDealerValue = game.getHandValue(initDealerHand);

		// Act
		game.stand();

		// Assert
		expect(game.getGameState()).to.equal("RESULT");
		const updatedDealerHand = game.getDealerHand();
		const updatedDealerHandValue = game.getHandValue(updatedDealerHand);

		// If the initial dealer hand value was less than 17, ensure that the dealer's hand has been updated
		if (initDealerValue < 17) {
			expect(updatedDealerHand.length).to.be.greaterThan(initDealerHand.length);
			expect(updatedDealerHandValue).to.be.greaterThan(initDealerValue);
		}
		else {
			// If the initial dealer hand value was 17 or higher, the dealer should not have drawn any new cards
			expect(updatedDealerHand.length).to.equal(initDealerHand.length);
			expect(updatedDealerHandValue).to.equal(initDealerValue);
		}
	});

	it("should return 'Dealer has busted. You won!' if Dealer busts from drawing", () => {
		// Setup
		// Create mocks
		const deckImplMock: DeckImpl = mock(DeckImpl);
		const deckInstance = instance(deckImplMock);

		// Stub the methods of the mock
		when(deckImplMock.drawCard())
			.thenReturn(new CardImpl("King", "Hearts")) // Player Card
			.thenReturn(new CardImpl("Eight", "Spades")) // Dealer Card
			.thenReturn(new CardImpl("Jack", "Diamonds")) // Player Card
			.thenReturn(new CardImpl("Five", "Clubs")) // Dealer Card
			.thenReturn(new CardImpl("Ten", "Clubs")); // Dealer Card

		// Create the game instance with the mocked deck
		const game = new BlackjackController(1);
		game["playingDeck"] = deckInstance;

		game.startGame();


		// Act
		game.stand();

		// Assert
		const result = game.getResult();
		const dealerHand = game.getDealerHand();
		expect(game.getHandValue(dealerHand)).to.be.greaterThan(21);
		expect(result).to.equal("Dealer has busted. You won!");
	});

	it("should return 'Draw' if player and dealer have the same hand value", () => {
		// Setup
		// Create mocks
		const deckImplMock: DeckImpl = mock(DeckImpl);
		const deckInstance = instance(deckImplMock);

		// Stub the methods of the mock
		when(deckImplMock.drawCard())
			.thenReturn(new CardImpl("King", "Hearts")) // Player Card
			.thenReturn(new CardImpl("Ten", "Spades")) // Dealer Card
			.thenReturn(new CardImpl("Jack", "Diamonds")) // Player Card
			.thenReturn(new CardImpl("Queen", "Clubs")); // Dealer Card

		// Create the game instance with the mocked deck
		const game = new BlackjackController(1);
		game["playingDeck"] = deckInstance;

		game.startGame();


		// Act
		game.stand();

		// Assert
		const result = game.getResult();
		const playerHand = game.getPlayerHand();
		const dealerHand = game.getDealerHand();
		expect(game.getHandValue(playerHand)).to.equal(game.getHandValue(dealerHand));
		expect(result).to.equal("Draw.");
	});

	it("should return 'You won!' if player has a higher hand value than dealer", () => {
		// Setup
		// Create mocks
		const deckImplMock: DeckImpl = mock(DeckImpl);
		const deckInstance = instance(deckImplMock);

		// Stub the methods of the mock
		when(deckImplMock.drawCard())
			.thenReturn(new CardImpl("King", "Hearts")) // Player Card
			.thenReturn(new CardImpl("Eight", "Spades")) // Dealer Card
			.thenReturn(new CardImpl("Jack", "Diamonds")) // Player Card
			.thenReturn(new CardImpl("Queen", "Clubs")); // Dealer Card

		// Create the game instance with the mocked deck
		const game = new BlackjackController(1);
		game["playingDeck"] = deckInstance;

		game.startGame();


		// Act
		game.stand();

		// Assert
		const result = game.getResult();
		const playerHand = game.getPlayerHand();
		const dealerHand = game.getDealerHand();
		expect(game.getHandValue(playerHand)).to.be.greaterThan(game.getHandValue(dealerHand));
		expect(result).to.equal("You won!");
	});

	it("should return 'Dealer wins.' if dealer has a higher hand value than player", () => {
		// Setup
		// Create mocks
		const deckImplMock: DeckImpl = mock(DeckImpl);
		const deckInstance = instance(deckImplMock);

		// Stub the methods of the mock
		when(deckImplMock.drawCard())
			.thenReturn(new CardImpl("Seven", "Hearts")) // Player Card
			.thenReturn(new CardImpl("Eight", "Spades")) // Dealer Card
			.thenReturn(new CardImpl("Jack", "Diamonds")) // Player Card
			.thenReturn(new CardImpl("Queen", "Clubs")); // Dealer Card

		// Create the game instance with the mocked deck
		const game = new BlackjackController(1);
		game["playingDeck"] = deckInstance;

		game.startGame();


		// Act
		game.stand();

		// Assert
		const result = game.getResult();
		const playerHand = game.getPlayerHand();
		const dealerHand = game.getDealerHand();
		expect(game.getHandValue(dealerHand)).to.be.greaterThan(game.getHandValue(playerHand));
		expect(result).to.equal("Dealer wins.");
	});
});