import {useGameStore} from '@/stores/gameStore';
import {useEffect}    from 'react';

export const useAutoDeal = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      const {
        phase,
        phaseSub,
        currentTurnIndex,
        nextActionTime,
        updatePlayableFlags,
        getRemainingPlayers,
        finishPlayer,
        cards,
        setPhase,
        dealNextCard,
        sortPlayerHand,
        playNext7ToField,
        playNextToField,
        handlePass,
        showParticipantLine,
      } = useGameStore.getState();

      console.log('phaseSub', phaseSub);
      if (!phaseSub) return;
      const now = Date.now();
      if (now < nextActionTime) return;  // 時間が来ていなければ待つ

      switch (phaseSub) {
        case 'dealing': {
          const remaining = cards.filter(c => c.location === 'deck').length;
          if (remaining > 0) {
            dealNextCard();
          } else {
            setPhase(phase, 'sortPlayerHand');
          }
          break;
        }
        case 'sortPlayerHand': {
          sortPlayerHand();
          setPhase(phase, 'autoPlace7s');
          break;
        }
        case 'autoPlace7s': {
          playNext7ToField();
          setPhase(phase, 'turnLoop');
          break;
        }
        case 'turnLoop': {

          const remainingPlayers = getRemainingPlayers();
          if (remainingPlayers.length === 0) {
            useGameStore.getState().toResult()
            return;
          }
          if (remainingPlayers.length === 1) {
            useGameStore.getState().toResult()
            finishPlayer(remainingPlayers[0], 'win');
            return;
          }

          const cards = updatePlayableFlags();
          const remainingCards = cards.filter(c => c.location === 'player' || c.location.startsWith('npc'));
          if (remainingCards.length === 0) {
            useGameStore.getState().toResult()
            return;
          }
          useGameStore.setState({nextActionTime: now + 500});

          if (phase === 'playing' && currentTurnIndex === 0) {
            const playerCards = cards.filter(c => c.location === 'player');
            const playableCards = playerCards.filter(c => c.isPlayable);
            if (playableCards.length === 0) {
              showParticipantLine('player', 'pass');
              handlePass('player');
            } else {
              setPhase(phase, 'waitingInput');
            }
          } else {
            playNextToField();
          }
          break;
        }

        case 'result': {
          // 少し時間をおいて次のフェーズに
          if (phase === 'demo') {
            setPhase('title');
          }
          break;
        }
        case 'waitingInput': {
          // ここはプレイヤー操作待ちなので何もしない
          break;
        }
      }
    }, 100); // 500msごとに進行チェック

    return () => clearInterval(interval);
  }, []);
};
