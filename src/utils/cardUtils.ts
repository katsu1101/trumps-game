
// ランク・スートのインデックス取得
import {Rank, Suit} from "@/types/card";
export const rankOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;
export const suitOrder = ['spade', 'heart', 'diamond', 'club'] as const;
export const rankToIndex = (rank: Rank) => rankOrder.indexOf(rank);
export const suitToIndex = (suit: Suit) => suitOrder.indexOf(suit);
