export const rankOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;
export type Rank = typeof rankOrder[number];

export const suitOrder = ['spade', 'heart', 'diamond', 'club'] as const;
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

// ランク・スートのインデックス取得
export const rankToIndex = (rank: Rank) => rankOrder.indexOf(rank);
export const suitToIndex = (suit: Suit) => suitOrder.indexOf(suit);
