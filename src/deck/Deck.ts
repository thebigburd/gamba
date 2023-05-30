import { Card } from "../card/Card";

export interface Deck{

    cards: Card[];
    currentIndex: number;

    drawCard(): Card;
    clearDeck();
    shuffle();
    addCards();

}