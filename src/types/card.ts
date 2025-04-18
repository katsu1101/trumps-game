import {rankOrder, suitOrder} from "@/utils/cardUtils";

export type Rank = typeof rankOrder[number];
export type Suit = typeof suitOrder[number];

export type CardLocation = 'deck' | 'field' | 'river' | 'player' | `npc${number}`;

// カード型
export type Card = {
  id: string;
  suit: Suit;
  rank: Rank;
  location: CardLocation;
  isFaceUp: boolean;
  isPlayable?: boolean;
};
