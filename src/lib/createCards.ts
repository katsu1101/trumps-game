import {Card}                 from '@/types/card';
import {rankOrder, suitOrder} from "@/utils/cardUtils";

const suits = suitOrder;
const ranks = rankOrder;

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
