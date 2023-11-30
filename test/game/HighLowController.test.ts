import { expect } from "chai";
import { HighLowController } from "../../src/game/HighLowController";
import { DeckImpl } from "../../src/deck/DeckImpl";
import { instance, mock, when } from "ts-mockito";
import { CardImpl } from "../../src/card/CardImpl";


describe("High Low Controller Test", () => {
	it("Should change the Game State to CORRECT, and increment streak, if the player predicts correctly that the next card is higher.", () => {
		// Setup
		// Create mocks
		const deckImplMock: DeckImpl = mock(DeckImpl);
		const deckInstance = instance(deckImplMock);

		// Stub the Draw Card method of mock.
		when(deckImplMock.drawCard())
			.thenReturn(new CardImpl("Five", "Hearts"))
			.thenReturn(new CardImpl("Ten", "Clubs"));

		// Create the game instance with the mocked deck
		const game = new HighLowController(1, 0.3);
		game["playingDeck"] = deckInstance;

		game.startGame();

		// Act
		game.playerAct(true);

		// Assert
		expect(game.gameState).to.equal("CORRECT");
		expect(game.getStreak()).to.be.equal(1);

	});

	it("Should change the Game State to CORRECT, and increment streak, if the player predicts correctly that the next card is lower", () => {
		// Setup
		// Create mocks
		const deckImplMock: DeckImpl = mock(DeckImpl);
		const deckInstance = instance(deckImplMock);

		// Stub the Draw Card method of mock.
		when(deckImplMock.drawCard())
			.thenReturn(new CardImpl("Ten", "Clubs"))
			.thenReturn(new CardImpl("Five", "Hearts"));

		// Create the game instance with the mocked deck
		const game = new HighLowController(1, 0.3);
		game["playingDeck"] = deckInstance;

		game.startGame();

		// Act
		game.playerAct(false);

		// Assert
		expect(game.gameState).to.equal("CORRECT");
		expect(game.getStreak()).to.be.equal(1);
	});

	it("Should change the Game State to PUSH, and increment streak, if the next card is equal to the player's card.", () => {
		// Setup
		// Create mocks
		const deckImplMock: DeckImpl = mock(DeckImpl);
		const deckInstance = instance(deckImplMock);

		// Stub the Draw Card method of mock.
		when(deckImplMock.drawCard())
			.thenReturn(new CardImpl("Five", "Clubs"))
			.thenReturn(new CardImpl("Five", "Hearts"));

		// Create the game instance with the mocked deck
		const game = new HighLowController(1, 0.3);
		game["playingDeck"] = deckInstance;

		game.startGame();

		// Act
		game.playerAct(false);

		// Assert
		expect(game.gameState).to.equal("PUSH");
		expect(game.getStreak()).to.be.equal(1);
	});

	it("Should change the Game State to RESULT, and Win Type to LOSE, if the player predicts incorrectly that the next card is higher.", () => {
		// Setup
		// Create mocks
		const deckImplMock: DeckImpl = mock(DeckImpl);
		const deckInstance = instance(deckImplMock);

		// Stub the Draw Card method of mock.
		when(deckImplMock.drawCard())
			.thenReturn(new CardImpl("Ten", "Clubs"))
			.thenReturn(new CardImpl("Five", "Hearts"));

		// Create the game instance with the mocked deck
		const game = new HighLowController(1, 0.3);
		game["playingDeck"] = deckInstance;

		game.startGame();

		// Act
		game.playerAct(true);

		// Assert
		expect(game.gameState).to.equal("RESULT");
		expect(game.winType).to.equal("LOSE");
		expect(game.getStreak()).to.be.equal(0);
	});

	it("Should change the Game State to RESULT, and Win Type to LOSE, if the player predicts incorrectly that the next card is lower.", () => {
		// Setup
		// Create mocks
		const deckImplMock: DeckImpl = mock(DeckImpl);
		const deckInstance = instance(deckImplMock);

		// Stub the Draw Card method of mock.
		when(deckImplMock.drawCard())
			.thenReturn(new CardImpl("Ace", "Hearts"))
			.thenReturn(new CardImpl("King", "Clubs"));

		// Create the game instance with the mocked deck
		const game = new HighLowController(1, 0.3);
		game["playingDeck"] = deckInstance;

		game.startGame();

		// Act
		game.playerAct(false);

		// Assert
		expect(game.gameState).to.equal("RESULT");
		expect(game.winType).to.equal("LOSE");
		expect(game.getStreak()).to.be.equal(0);
	});

	it("Should change the Game State to RESULT, and Win Type to WIN, if they choose to quit between rounds.", () => {
		// Setup
		// Create mocks
		const deckImplMock: DeckImpl = mock(DeckImpl);
		const deckInstance = instance(deckImplMock);

		// Stub the Draw Card method of mock.
		when(deckImplMock.drawCard())
			.thenReturn(new CardImpl("Ace", "Hearts"))
			.thenReturn(new CardImpl("King", "Clubs"));

		// Create the game instance with the mocked deck
		const game = new HighLowController(1, 0.3);
		game["playingDeck"] = deckInstance;

		game.startGame();
		game.playerAct(true);

		// Act
		game.surrender();

		// Assert
		expect(game.gameState).to.equal("RESULT");
		expect(game.winType).to.equal("WIN");
		expect(game.getStreak()).to.be.equal(1);
	});

	it("Should change the Game State to RESULT, and Win Type to SURRENDER, if they choose to quit during a round.", () => {
		// Setup
		// Create mocks
		const deckImplMock: DeckImpl = mock(DeckImpl);
		const deckInstance = instance(deckImplMock);

		// Stub the Draw Card method of mock.
		when(deckImplMock.drawCard())
			.thenReturn(new CardImpl("Ace", "Hearts"))
			.thenReturn(new CardImpl("King", "Clubs"));

		// Create the game instance with the mocked deck
		const game = new HighLowController(1, 0.3);
		game["playingDeck"] = deckInstance;

		game.startGame();

		// Act
		game.surrender();

		// Assert
		expect(game.gameState).to.equal("RESULT");
		expect(game.winType).to.equal("SURRENDER");
	});

	it("Should reset and shuffle the deck when the player's win streak reaches a multiple of 10.", () => {
		// Setup
		const game = new HighLowController(1, 0.3);
		game.setStreak(10);
		game.startGame();
		game.gameState = "CORRECT";

		// Assert Before
		expect(game.getPlayingDeck().currentIndex).to.equal(2);

		// Act
		game.continue();

		// Assert
		expect(game.getPlayingDeck().currentIndex).to.equal(1);
	});

});