import { Card, Suit, Rank } from '@/types/card';

const suits: Suit[] = ['spade', 'heart', 'diamond', 'club'];
const ranks: Rank[] = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

export const createFullDeck = (): Card[] => {
  return suits.flatMap(suit =>
    ranks.map(rank => ({
      suit,
      rank,
      id: `${suit}-${rank}`,
      location: "deck",
      isFaceUp: false,
    }))
  );
};
