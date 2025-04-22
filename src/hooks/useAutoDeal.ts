import {useGameStore} from '@/stores/gameStore';
import {useEffect}    from 'react';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useAutoDeal = () => {
  const startGame = useGameStore(state => state.startGame);
  const dealNextCard = useGameStore(state => state.dealNextCard);
  const sortPlayerHand = useGameStore(state => state.sortPlayerHand);
  const playNextToField = useGameStore(state => state.playNextToField);
  const playNext7ToField = useGameStore(state => state.playNext7ToField);
  const playNextToDeck = useGameStore(state => state.playNextToDeck);
  const phase = useGameStore(state => state.phase);
  const phaseSub = useGameStore(state => state.phaseSub);
  const setPhase = useGameStore(state => state.setPhase);
  const currentTurnIndex = useGameStore(state => state.currentTurnIndex);

  useEffect(() => {
    let cancelled = false;

    const runner = async () => {

      switch (phaseSub) {
        case null:
          break;

        case 'dealing':
          await delay(500);
          while (!cancelled) {
            const remaining = useGameStore.getState().cards.filter(c => c.location === 'deck').length;
            if (remaining > 0) {
              dealNextCard();
              await delay(100);
            } else {
              useGameStore.setState({phaseSub: 'sortPlayerHand'});
              break;
            }
          }
          break;

        case 'sortPlayerHand':
          sortPlayerHand();
          await delay(500);
          useGameStore.setState({phaseSub: 'autoPlace7s'});
          break;

        case 'autoPlace7s':
          playNext7ToField();
          await delay(500);
          useGameStore.setState({phaseSub: 'turnLoop'});
          break;

        case 'turnLoop':
          // ✅ 残り1人なら再帰的に finishPlayer を呼び出す
          const remainingPlayers = useGameStore.getState().getRemainingPlayers(); // ギブアップ・上がり済み以外
          if (remainingPlayers.length === 0) {
            return
          }
          if (remainingPlayers.length === 1) {
            const remainingPlayer = remainingPlayers[0];
            if (remainingPlayer) {
              // 🎯 再帰で最後の1人を勝利として finish
              useGameStore.getState().finishPlayer(remainingPlayer, 'win');
              return
            }
          }
          await delay(500);
          useGameStore.getState().updatePlayableFlags()
          const remaining = useGameStore.getState().cards.filter(c =>
            c.location === 'player' || c.location.startsWith('npc'));
          if (remaining.length === 0) {
            await delay(5000);
            useGameStore.setState({phaseSub: 'result'});
            break;
          }
          if (phase === 'playing' && currentTurnIndex == 0) {
            useGameStore.getState().updatePlayableFlags()
            const playerCards = useGameStore.getState().cards.filter(c => c.location === 'player');
            const playableCards = playerCards.filter(c => c.isPlayable);

            if (playableCards.length === 0) {
              // ✅ 出せるカードが無い → パス処理
              useGameStore.getState().handlePass("player")
              // playNextToField(false); // プレイヤーのパス処理
              // await delay(500); // アニメーション待ち
              return;
            }
            // ユーザのアクション待ち
            useGameStore.setState({phaseSub: 'waitingInput'});
            return
          }
          playNextToField();

          // await delay(500); // アニメーションの時間を確保してから
          break;

        case 'result':
          // TODO
          await delay(5000);
          useGameStore.setState({phaseSub: 'playNextToDeck'});
          break;

        case 'playNextToDeck':
          startGame()
          break;

        default:
          console.log(`phaseSub: ${phaseSub}`);
      }
    };

    runner().then(() => {
    });

    return () => {
      cancelled = true;
    };
  }, [phaseSub, dealNextCard, sortPlayerHand, playNextToField, playNext7ToField, playNextToDeck, setPhase, phase, currentTurnIndex, startGame]);
};
