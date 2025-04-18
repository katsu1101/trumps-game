import {Card, CardLocation}                  from "@/types/card";
import {chooseCardToPlay}                    from "@/utils/aiStrategy";
import {rankOrder, rankToIndex, suitToIndex} from "@/utils/cardUtils";
import {createDeck}                          from "@/utils/createDeck";
import {create}                              from 'zustand';

export type GamePhase = 'dealing' | 'placing7s' | 'auto' | 'instant' | `demo${number}`

export const useGameStore = create<{
  npcCount: number;
  phase: GamePhase;
  currentTurnIndex: number;
  cards: Card[];

  // --- Phase control ---
  startGame: (mode: 'auto' | 'instant' | `demo${number}`) => void;

  // --- Card actions ---
  dealCards: () => void;
  dealNextCard: () => void;
  drawCard: () => void;

  // --- Turn actions ---
  playNextToField: () => void;
  playNext7ToField: () => void;
  playNextToDeck: () => void;

  // --- Hand management ---
  sortPlayerHand: () => void;
  updatePlayableFlags: () => void;
}>((set, get) => ({
  npcCount: 3,
  phase: 'dealing',
  cards: [],
  currentTurnIndex: 0,

  // ゲームの開始処理
  startGame: () => { // mode: 'auto' | 'instant' | `demo${number}`
    const deck = createDeck().sort(() => Math.random() - 0.5);

    // 基本状態初期化
    set({
      cards: deck,
      phase: 'auto',
      currentTurnIndex: 0,
    });
  },


  // --- Card actions ---
  dealCards: () => {
    const npcCount = get().npcCount;
    const totalPlayers = 1 + npcCount;
    const shuffled = createDeck().sort(() => Math.random() - 0.5);
    const hands: Card[][] = Array.from({length: totalPlayers}, () => []);

    shuffled.forEach((card, i) => {
      const index = i % totalPlayers;
      hands[index].push(card);
    });

    const cards = hands.flatMap((hand, index) => {
      const location: CardLocation = index === 0 ? 'player' : `npc${index - 1}` as const;
      const isFaceUp = index === 0;
      return hand.map(card => ({...card, location, isFaceUp}));
    });

    set({cards});
  },

  dealNextCard: () => {
    const {cards, npcCount} = get();
    const totalPlayers = 1 + npcCount;
    const nextCard = cards.findLast(c => c.location === 'deck');
    if (!nextCard) return;

    const alreadyDealt = cards.length - cards.filter(c => c.location === 'deck').length;
    const currentIndex = alreadyDealt % totalPlayers;
    const location: CardLocation = currentIndex === 0 ? 'player' : `npc${currentIndex - 1}`;
    const isFaceUp = location === 'player';

    const updatedCards = cards.map(c =>
      c.id === nextCard.id ? {...c, location, isFaceUp} : c
    );

    set({cards: updatedCards});
  },

  drawCard: () => {
    const state = get();
    const card = state.cards.find(c => c.location === 'deck');
    if (!card) return;

    set({
      cards: state.cards.map(c =>
        c.id === card.id ? {...c, location: 'player', isFaceUp: true} : c
      )
    });
  },

  // --- Turn actions ---

  // 最初に7を一斉に出す
  playNext7ToField: () => {
    const state = get();
    const updatedCards = state.cards.map(card =>
      card.rank === '7' ? {...card, location: 'field' as const, isFaceUp: true} : card
    );
    set({cards: updatedCards});
  },

  // 順番に1枚ずつ手札を場に出す（戦略に応じて）
  playNextToField: () => {
    const state = get();
    const totalPlayers = 1 + state.npcCount;
    const currentIndex = state.currentTurnIndex % totalPlayers;
    const currentLocation = currentIndex === 0 ? 'player' : (`npc${currentIndex - 1}` as const);

    const strategy = (() => {
      switch (currentLocation) {
        case 'player': return 'edge';
        case 'npc1': return 'random';
        case 'npc2': return 'center';
        case 'npc3': return 'first';
        default: return 'first';
      }
    })();

    const cardToPlay = chooseCardToPlay(state.cards, currentLocation, strategy);

    if (!cardToPlay) {
      // 出せない → スキップ
      set({currentTurnIndex: (state.currentTurnIndex + 1) % totalPlayers});
      return;
    }

    const updatedCards: Card[] = state.cards.map(c =>
      c.id === cardToPlay.id ? {...c, location: 'field', isFaceUp: true} : c
    );

    set({
      cards: updatedCards,
      currentTurnIndex: (state.currentTurnIndex + 1) % totalPlayers
    });
  },

  // 全カードを場から山札に戻す（デモ終了など）
  playNextToDeck: () => {
    const updatedCards: Card[] = get().cards.map(c => {
      return {...c, location: 'deck', isFaceUp: false};
    });
    set({cards: updatedCards});
  },


  // --- Hand management ---

  // プレイヤーの手札をスート → ランク順に並べ替え
  sortPlayerHand: () => {
    const state = get();

    const sortedPlayerCards = state.cards
      .filter(c => c.location === 'player')
      .sort((a, b) => {
        if (a.suit !== b.suit) {
          return suitToIndex(a.suit) - suitToIndex(b.suit);
        }
        return rankToIndex(a.rank) - rankToIndex(b.rank);
      });

    const otherCards = state.cards.filter(c => c.location !== 'player');

    set({cards: [...sortedPlayerCards, ...otherCards]});
  },

  // 出せるカードかどうかを判定して isPlayable を付与
  updatePlayableFlags: () => {
    const cards = get().cards;

    const fieldBySuit = new Map<string, number[]>();

    // 場に出ているカードをスート別に分類
    cards.forEach(c => {
      if (c.location === 'field') {
        const idx = rankToIndex(c.rank);
        const existing = fieldBySuit.get(c.suit) || [];
        fieldBySuit.set(c.suit, [...existing, idx]);
      }
    });

    const updated = cards.map(c => {
      if (c.location !== 'player' && !c.location.startsWith('npc')) {
        return {...c, isPlayable: false};
      }

      const idx = rankToIndex(c.rank);
      const placed = fieldBySuit.get(c.suit) || [];

      // 7がまだ出ていないなら、7しか出せない
      if (!placed.includes(6)) return {...c, isPlayable: c.rank === '7'};

      // 並び順で判断（連続する隣のカードのみ出せる）
      const sorted = placed.slice().sort((a, b) => a - b);
      let canPlay = false;

      // 上方向（例：7→8→9）
      let up = 6;
      while (sorted.includes(up)) up++;
      if (up < rankOrder.length && up === idx) {
        canPlay = true;
      }

      // 下方向（例：7→6→5）
      let down = 6;
      while (sorted.includes(down)) down--;
      if (down >= 0 && down === idx) {
        canPlay = true;
      }

      return {...c, isPlayable: canPlay};
    });

    set({cards: updated});
  }
}));