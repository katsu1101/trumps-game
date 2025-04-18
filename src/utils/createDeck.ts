import {Card}                 from "@/types/card";
import {rankOrder, suitOrder} from "@/utils/cardUtils";

// 定数定義
const suits = suitOrder;
const ranks = rankOrder;

export const createDeck = (): Card[] => {
  return suits.flatMap(suit =>
    ranks.map(rank => ({
      id: `${suit}-${rank}`,
      suit,
      rank,
      location: 'deck',
      isFaceUp: false,
    }))
  );
};
