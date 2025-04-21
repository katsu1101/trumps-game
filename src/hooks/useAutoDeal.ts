import {useGameStore} from '@/stores/gameStore';
import {useEffect}    from 'react';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useAutoDeal = () => {
  const dealNextCard = useGameStore(state => state.dealNextCard);
  const sortPlayerHand = useGameStore(state => state.sortPlayerHand);
  const playNextToField = useGameStore(state => state.playNextToField);
  const playNext7ToField = useGameStore(state => state.playNext7ToField);
  const playNextToDeck = useGameStore(state => state.playNextToDeck);
  const phase = useGameStore(state => state.phase);
  const phaseSub = useGameStore(state => state.phaseSub);
  const setPhase = useGameStore(state => state.setPhase);

  useEffect(() => {
    let cancelled = false;


    const runner = async () => {
      console.log("phaseSub", phaseSub)

      switch (phaseSub) {
        case null:
          break;

        case 'dealing':
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
          while (!cancelled) {
            useGameStore.getState().updatePlayableFlags()
            const remaining = useGameStore.getState().cards.filter(c =>
              c.location === 'player' || c.location.startsWith('npc'));
            if (remaining.length > 0) {
              // if (phase === 'playing' && currentTurnIndex == 0) {
              //   // TODO ユーザのアクション待ち
              //   await delay(1000);
              //   break
              // }
              await delay(500);
              useGameStore.getState().updatePlayableFlags()
              playNextToField(phase === 'demo');

              await delay(500); // アニメーションの時間を確保してから
              useGameStore.getState().nextTurnLoop();
            } else {
              await delay(5000);
              useGameStore.setState({phaseSub: 'result'});
              break;
            }
          }
          break;

        case 'result':
          // TODO
          useGameStore.setState({phaseSub: 'playNextToDeck'});
          break;

        case 'playNextToDeck':
          playNextToDeck();
          setPhase('title', null)
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
  }, [phaseSub, dealNextCard, sortPlayerHand, playNextToField, playNext7ToField, playNextToDeck, setPhase, phase]);
};
