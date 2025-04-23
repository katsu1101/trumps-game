import {participants}                        from "@/constants/participants";
import {Card, CardLocation}                  from "@/types/card";
import {chooseCardToPlay}                    from "@/utils/aiStrategy";
import {rankOrder, rankToIndex, suitToIndex} from "@/utils/cardUtils";
import {createDeck}                          from "@/utils/createDeck";
import {create}                              from 'zustand';

export type GamePhase = 'title' | 'demo' | 'playing'
export type GamePhaseSub =
  null
  | 'dealing'
  | 'sortPlayerHand'
  | 'autoPlace7s'
  | 'turnLoop'
  | 'result'
  | 'playNextToDeck'
  | 'waitingInput';
type FinishInfo = {
  player: CardLocation;
  rank?: number;           // 勝ち抜け順位（ギブアップ時は無し）
  reason: 'pass' | 'win' | 'giveUp';
  timestamp: number; // ここを追加！
};
type CharacterLine = {
  text: string;
  timestamp: number;
};
export const useGameStore = create<{
  npcCount: number;
  PASS_LIMIT: number;
  phase: GamePhase;
  phaseSub: GamePhaseSub;
  lineTimestamp: number | null;
  currentTurnIndex: number;
  cards: Card[];
  nextActionTime: number
  lastPassPlayer: { player?: CardLocation, type?: 'win' | 'pass' | 'giveUp', timestamp?: number },
  passCountMap: Record<string, number>; // 'player', 'npc0' など
  finishedPlayers: FinishInfo[];

  characterLines: Partial<Record<CardLocation, CharacterLine | null>>

  setCharacterLine: (player: CardLocation, text: string) => void;

  // --- Phase control ---
  startGame: () => void;
  setPhase: (phase: GamePhase, sub?: GamePhaseSub) => void;

  // --- Card actions ---
  dealCards: () => void;
  dealNextCard: () => void;
  drawCard: () => void;

  // --- Turn actions ---
  playNextToField: () => void;
  nextTurnLoop: () => void;
  toResult: () => void;
  playNext7ToField: () => void;
  playNextToDeck: () => void;
  playUserCard: (cardId: string) => void;
  finishPlayer: (
    playerId: CardLocation,
    reason: 'giveUp' | 'win'
  ) => void
  showParticipantLine: (
    playerId: CardLocation,
    reason: 'start' | 'playCard' | 'pass' | 'giveUp' | 'win'
  ) => void;
  getRemainingPlayers: () => CardLocation[];
  handlePass: (playerId: CardLocation) => void;

  // --- Hand management ---
  sortPlayerHand: () => void;
  updatePlayableFlags: () => Card[];

  setLastPassPlayer: (player?: CardLocation, reason?: 'win' | 'pass' | 'giveUp') => void;
  resetPassCounts: () => void;
}>((set, get) => ({
  npcCount: 3,
  PASS_LIMIT: 3, // パスの上限

  phase: 'title',
  phaseSub: null,
  lineTimestamp: null,
  cards: [],
  currentTurnIndex: 0,
  nextActionTime: 0,
  passCountMap: {'player': 0},
  finishedPlayers: [] as FinishInfo[],
  characterLines: {},

  setCharacterLine: (playerId: CardLocation, text: string) => {
    const state = get();
    set({
      characterLines: {
        ...state.characterLines,
        [playerId]: {text, timestamp: Date.now()},
      }
    });
  },

  // パス
  lastPassPlayer: {},
  setLastPassPlayer: (player?: CardLocation, type?: 'win' | 'pass' | 'giveUp') => {
    set({lastPassPlayer: {player, type, timestamp: Date.now()}});
  },
  resetPassCounts: () => {
    set({passCountMap: {'player': 0}});
  },

  // ゲームの開始処理
  startGame: () => { // mode: 'auto' | 'instant' | `demo${number}`
    const deck = createDeck().sort(() => Math.random() - 0.5);
    // 基本状態初期化
    set({
      cards: deck,
      phase: 'title',
      currentTurnIndex: 0,
      nextActionTime: 0,
      passCountMap: {},
      lastPassPlayer: {},
      finishedPlayers: [],
      characterLines: {},
    });
  },

  setPhase: (phase: GamePhase, sub?: GamePhaseSub) => {
    set({phase, phaseSub: sub});
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
      const location: CardLocation = index === 0 ? 'player' : `npc${index}` as const;
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
    const location: CardLocation = currentIndex === 0 ? 'player' : `npc${currentIndex}`;
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
    const currentLocation = currentIndex === 0 ? 'player' : (`npc${currentIndex}` as const);

    const myCards: Card[] = state.cards.filter(c => c.location === currentLocation);
    if (myCards.length === 0) {
      state.nextTurnLoop();
      return;
    } // すでにあがったプレイヤー

    const participant = participants.find(p => p.id === currentLocation);
    const cardToPlay = chooseCardToPlay(state.cards, currentLocation, participant?.strategy);

    if (!cardToPlay) {
      // 出せない → スキップ
      useGameStore.getState().showParticipantLine(currentLocation, 'pass');
      state.handlePass(currentLocation);

      return;
    }

    if (myCards.length === 1) {
      // 最後の一枚を出すとき、勝利確定
      state.finishPlayer(currentLocation, 'win');
    }
    const updatedCards: Card[] = state.cards.map(c =>
      c.id === cardToPlay.id ? {...c, location: 'field', isFaceUp: true} : c
    );
    set({
      cards: updatedCards,
    });
    state.nextTurnLoop()
  },

  finishPlayer: (
    playerId: CardLocation,
    reason: 'giveUp' | 'win'
  ) => {
    const state = get();
    const finishedPlayers = state.finishedPlayers;

    // 順位計算
    const winCount = finishedPlayers.filter(f => f.reason === 'win').length;
    const giveUpCount = finishedPlayers.filter(f => f.reason === 'giveUp').length;
    const totalPlayers = 1 + state.npcCount;

    const rank =
      reason === 'win'
        ? winCount + 1
        : totalPlayers - giveUpCount;

    // 🔥 ギブアップ時：カードをすべて場に出す
    const updatedCards: Card[] = state.cards.map(c =>
      c.location === playerId ? {...c, location: 'field', isFaceUp: true} : c
    );

    // 順位登録
    const updatedFinished = [
      ...finishedPlayers,
      {player: playerId, rank, reason, timestamp: Date.now()},
    ];

    set({
      finishedPlayers: updatedFinished,
      cards: updatedCards,  // 🃏 カード更新
    });

    state.showParticipantLine(playerId, reason);
    state.nextTurnLoop();
  },

  showParticipantLine: (
    playerId: CardLocation,
    reason: 'win' | 'giveUp' | 'pass' | 'playCard' | 'start'
  ) => {
    const state = get();
    const participant = participants.find(p => p.id === playerId);
    const lines = participant?.lines[reason];

    if (lines && lines.length > 0) {
      const randomChoice = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
      const text = randomChoice(lines);
      state.setCharacterLine(playerId, text);
    }
  },
  getRemainingPlayers: () => {
    const state = get();
    const finished = state.finishedPlayers.map(f => f.player);
    return [
      'player' as CardLocation,
      ...Array(state.npcCount).fill(0).map((_, i) => `npc${i + 1}` as CardLocation)
    ].filter(p => !finished.includes(p));
  },

  handlePass: (playerId: CardLocation) => {
    const state = get();
    const currentPassCount = state.passCountMap[playerId] ?? 0;

    if (currentPassCount + 1 > state.PASS_LIMIT) {
      state.finishPlayer(playerId, 'giveUp');
    } else {
      set({
        passCountMap: {
          ...state.passCountMap,
          [playerId]: currentPassCount + 1,
        },
      });
      state.setLastPassPlayer(playerId, 'pass');
      // ✅ ここで nextTurnLoop を必ず回す
      state.nextTurnLoop();
    }
  },


  nextTurnLoop: () => {
    const state = get();
    const totalPlayers = 1 + state.npcCount;
    let nextIndex = (state.currentTurnIndex + 1) % totalPlayers;


    for (let i = 0; i < totalPlayers; i++) {
      const nextLocation = nextIndex === 0 ? 'player' : `npc${nextIndex}` as const;
      const hasHand = state.cards.some(
        c => c.location === nextLocation
      );
      if (hasHand) {
        set({
          currentTurnIndex: nextIndex,
          phaseSub: 'turnLoop',
        });
        return;
      }
      nextIndex = (nextIndex + 1) % totalPlayers;
    }

    // ここまで来る＝全員あがってる → 終了フラグを立てるなど
    console.warn('全員が手札なし（あがり）');
    state.toResult()
  },

  toResult: () => {
    const state = get();
    const updatedCards: Card[] = state.cards.map(c => {
      return {...c, location: 'field', isFaceUp: true};
    })
    set({
      cards: updatedCards,
      phaseSub: 'result',
      nextActionTime: Date.now() + 10000
    });
  },


  // 全カードを場から山札に戻す（デモ終了など）
  playNextToDeck: () => {
    const updatedCards: Card[] = get().cards.map(c => {
      return {...c, location: 'deck', isFaceUp: false};
    });
    set({cards: updatedCards});
  },

  // カード選択
  playUserCard: (cardId: string) => {
    const state = get();
    const myCards = state.cards.filter(c => c.location === 'player');
    const card: Card | undefined = myCards.find(c => c.id === cardId && c.isPlayable);
    if (!card) {
      return
    }

    // 出す処理
    const updatedCards: Card[] = state.cards.map(c =>
      c.id === card.id ? {...c, location: 'field', isFaceUp: true} : c
    );

    if (myCards.length <= 1) {
      // ✅ 最後の1枚を出したので勝利
      // メッセージ表示用
      state.finishPlayer('player', 'win');
      state.setLastPassPlayer('player', 'win');
    }

    set({
      cards: updatedCards,
    });
    // useGameStore.setState({phaseSub: 'turnLoop'}); // ✅ 再開
    get().nextTurnLoop(); // ターン進行
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
    return updated
  }
}));