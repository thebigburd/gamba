import { CardImpl } from "../../src/card/CardImpl";
import { testCard } from "./Card.test";

type CardConstructor = new (rank: string, suit: string) => CardImpl;

// Create an instance of CardImpl constructor
const cardImplConstructor = CardImpl as CardConstructor;

// Call the testCard function with the CardImpl constructor
testCard(cardImplConstructor);
