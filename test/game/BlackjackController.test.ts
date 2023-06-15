import { assert, expect } from "chai";
import { BlackjackController } from "../../src/game/BlackjackController";


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

	it("Should update GAMESTATE to 'RESULT' and return the 'Player has busted. Dealer wins.' if player busts.", () => {
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
		expect(result).to.equal("Player has busted. Dealer wins.");
	});

	it("Should update GAMESTATE to 'RESULT' and update dealer's hand when player stands.", () => {
		// Setup
		const game = new BlackjackController(1);
		game.startGame();
		game.revealHidden();
		const initDealerHand = game.getDealerHand();
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
		} else {
			// If the initial dealer hand value was 17 or higher, the dealer should not have drawn any new cards
			expect(updatedDealerHand.length).to.equal(initDealerHand.length);
			expect(updatedDealerHandValue).to.equal(initDealerValue);
		}
	});

});