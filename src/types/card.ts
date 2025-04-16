export type Suit = 'spade' | 'heart' | 'diamond' | 'club';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' |
  '8' | '9' | '10' | 'J' | 'Q' | 'K';
export type CardLocation = 'deck' | 'field' | 'river' | 'player' | `npc${number}`;

export type Card = {
  id: string; // `${suit}-${rank}`など
  suit: Suit;
  rank: Rank;
  location: CardLocation;
  isFaceUp: boolean;
  isPlayable?: boolean; // ✅ 出せるかどうかのフラグ
};
