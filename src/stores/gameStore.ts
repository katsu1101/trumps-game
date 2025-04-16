import {Card, CardLocation, Rank, Suit} from '@/types/card';
import {create}                         from 'zustand';

// 定数定義
const suits: Suit[] = ['spade', 'heart', 'diamond', 'club'];
const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const createDeck = (): Card[] => {
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

const shuffle = <T>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5); // シンプルなシャッフル
};

const assignInitialCards = (shuffledDeck: Card[]) => {
  const {npcCount, setCardLocation} = useGameStore.getState();
  const totalPlayers = 1 + npcCount;

  // 各プレイヤーの手札用の配列を準備
  const hands: Card[][] = Array.from({length: totalPlayers}, () => []);

  // 順番にカードを配る
  shuffledDeck.forEach((card, i) => {
    const playerIndex = i % totalPlayers;
    hands[playerIndex].push(card);
  });

  // 配布先にセット（プレイヤー: 表 / NPC: 裏）
  hands.forEach((hand, index) => {
    const location: CardLocation = index === 0 ? 'player' : `npc${index - 1}`;
    const isFaceUp = index === 0;

    hand.forEach(card => {
      setCardLocation(card.id, location, isFaceUp);
    });
  });
};

const chooseCardToPlay = (
  cards: Card[],
  who: Card['location'],
  strategy: 'first' | 'random' | 'edge' | 'center' = 'random'
): Card | undefined => {
  const playable = cards.filter(c => c.location === who && c.isPlayable);
  if (playable.length === 0) return undefined;

  switch (strategy) {
    case 'random':
      return playable[Math.floor(Math.random() * playable.length)];

    case 'edge': {
      // A, K に近いほどスコア高
      const scored = playable.map(card => {
        const idx = rankToIndex(card.rank);
        const score = Math.max(idx, rankOrder.length - 1 - idx); // A:12, K:12, 7:6
        return {card, score};
      });

      scored.sort((a, b) => b.score - a.score); // 降順（端が上）
      return scored[0].card;
    }

    case 'center': {
      // 7に近いほどスコア低（中心優先）
      const scored = playable.map(card => {
        const idx = rankToIndex(card.rank);
        const score = Math.abs(idx - 6); // 7:0, A/K:6
        return {card, score};
      });

      scored.sort((a, b) => a.score - b.score); // 昇順（中心が上）
      return scored[0].card;
    }

    default:
      return playable[0];
  }
}

const rankOrder = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

const rankToIndex = (rank: string): number => {
  return rankOrder.indexOf(rank);
};

type GamePhase = "auto" | 'dealing' | 'ready' | `demo${number}`;

type GameState = {
  phase: GamePhase;
  npcCount: number;
  cards: Card[];
  turnIndex: number, // player = 0, npc1 = 1, npc2 = 2...

  setNpcCount: (count: number) => void;
  setCardLocation: (id: string, location: Card['location'], faceUp?: boolean) => void;
  dealCards: () => void;
  dealNextCard: () => void;
  sortPlayerHand: () => void,
  playNext7ToField: () => void,
  playNextToField: () => void,
  playNextToDeck: () => void,
  drawCard: () => void;
  startGame: (mode: 'auto' | 'instant' | `demo${number}`) => void;
  playRandomToField: () => void,
  collectFieldToDeck: () => void,
  updatePlayableFlags: () => void,
};
export const useGameStore = create<GameState>((set, get) => ({
  npcCount: 4,
  cards: [],
  phase: 'dealing',
  turnIndex: 0,

  setNpcCount: (count) => {
    if (count >= 2 && count <= 4) set({npcCount: count});
  },

  setCardLocation: (id, location, faceUp = false) =>
    set(state => ({
      cards: state.cards.map(card =>
        card.id === id ? {...card, location, isFaceUp: faceUp} : card
      )
    })),

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

  playRandomToField: () => {
    const cards = [...get().cards];

    // 場に出せるカード（まだ手札にあるもの）
    const handCards = cards.filter(c => c.location.startsWith('npc') || c.location === 'player');

    if (handCards.length === 0) return;

    const randomIndex = Math.floor(Math.random() * handCards.length);
    const selectedCard = handCards[randomIndex];

    const field: CardLocation = "field"
    // location を 'field' に変更
    const updatedCards = cards.map(card =>
      card === selectedCard ? {...card, location: field, isFaceUp: true} : card
    );

    set({cards: updatedCards});
  },

  collectFieldToDeck: () => {
    const cards = get().cards;

    const deck: CardLocation = "deck"
    const updatedCards = cards.map(card =>
      card.location === 'field'
        ? {...card, location: deck, isFaceUp: false}
        : card
    );

    set({cards: updatedCards});
  },

  dealNextCard: () => {
    const state = get();
    const {cards, npcCount} = state;
    const totalPlayers = 1 + npcCount;
    const nextCard = cards.findLast(c => c.location === 'deck');
    if (!nextCard) return;

    const alreadyDealt = cards.length - cards.filter(c => c.location === 'deck').length;
    const currentIndex = alreadyDealt % totalPlayers;
    const location = currentIndex === 0 ? 'player' : `npc${currentIndex - 1}` as const;
    const isFaceUp = location === 'player';

    set({
      cards: cards.map(c =>
        c.id === nextCard.id
          ? {...c, location, isFaceUp}
          : c
      )
    });
  },

  drawCard: () => {
    const state = get();
    const card = state.cards.find(c => c.location === 'deck');
    if (!card) return;

    set({
      cards: state.cards.map(c =>
        c.id === card.id
          ? {...c, location: 'player', isFaceUp: true}
          : c
      )
    });
  },

  startGame: (mode) => {
    const deck = shuffle(createDeck());
    set({cards: deck, phase: mode === 'auto' ? 'dealing' : 'ready'});

    if (mode === 'instant') {
      assignInitialCards(deck); // 即配布
    }
  },
  sortPlayerHand: () => set(state => {
    const order = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    // プレイヤーのカードだけを抽出してソート
    const sortedPlayerCards = state.cards
      .filter(c => c.location === 'player')
      .sort((a, b) => {
        if (a.suit !== b.suit) return a.suit.localeCompare(b.suit); // スート順
        return order.indexOf(a.rank) - order.indexOf(b.rank);       // ランク順
      });

    // プレイヤー以外のカードはそのまま
    const otherCards = state.cards.filter(c => c.location !== 'player');

    return {
      cards: [...sortedPlayerCards, ...otherCards]
    };
  }),

  playNext7ToField: () => set(state =>{
    const updatedCards: Card[] = state.cards.map(c =>
      c.rank === "7" ? { ...c, location: 'field', isFaceUp: true } : c
    );
    return {
      cards: updatedCards
    }
  }),

  playNextToField: () => set(state => {
    const totalPlayers = 1 + state.npcCount;
    const currentIndex = state.turnIndex % totalPlayers;
    const currentLocation = currentIndex === 0 ? 'player' : (`npc${currentIndex - 1}` as const);
    const strategy = currentLocation === 'player' ? 'edge' :
      currentLocation === 'npc1' ? 'random' :
        currentLocation === 'npc2' ?  'center' :
          currentLocation === 'npc3' ?  'first' : 'first'
    const cardToPlay = chooseCardToPlay(state.cards, currentLocation, strategy);
    if (!cardToPlay) {
      return { turnIndex: (state.turnIndex + 1) % totalPlayers };
    }

    const updatedCards: Card[] = state.cards.map(c =>
      c.id === cardToPlay.id ? { ...c, location: 'field', isFaceUp: true } : c
    );

      return {
      cards: updatedCards,
      turnIndex: (state.turnIndex + 1) % totalPlayers
    } as Partial<typeof state>; // ✅ ここがポイント
  }),

  playNextToDeck: () => set(state => {
    const updatedCards: Card[] = state.cards.map(c => {
        return {...c, location: 'deck', isFaceUp: false} as Card
      }
    );
    return {
      cards: updatedCards,
    }
  }),

  updatePlayableFlags: () => {
    const cards = get().cards;

    const fieldBySuit = new Map<string, number[]>();

    // フィールドカードをスート別に分類
    cards.forEach(c => {
      if (c.location === 'field') {
        const idx = rankToIndex(c.rank);
        const existing = fieldBySuit.get(c.suit) || [];
        fieldBySuit.set(c.suit, [...existing, idx]);
      }
    });

    const updated = cards.map(c => {
      if (c.location !== 'player' && !c.location.startsWith('npc')) {
        return { ...c, isPlayable: false };
      }

      const idx = rankToIndex(c.rank);
      const placed = fieldBySuit.get(c.suit) || [];

      // 7が場にないなら何も出せない
      if (!placed.includes(6)) return { ...c, isPlayable: c.rank === '7' };

      // ソートして連続判定
      const sorted = placed.slice().sort((a, b) => a - b);

      let canPlay = false;

      // 上方向（7→8→9...）の連続確認
      let up = 6;
      while (sorted.includes(up)) up++;
      if (up < rankOrder.length && up === idx) {
        canPlay = true;
      }

      // 下方向（7→6→5...）の連続確認
      let down = 6;
      while (sorted.includes(down)) down--;
      if (down >= 0 && down === idx) {
        canPlay = true;
      }

      return { ...c, isPlayable: canPlay };
    });

    set({ cards: updated });
  }

}));
