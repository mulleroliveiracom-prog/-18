
import { useState, useEffect } from 'react';
import { UserState } from '../types';

const STORAGE_KEY = 'casino_vip_state';

const INITIAL_STATE: UserState = {
  userName: '',
  partnerName: '',
  coins: 0,
  completedPositions: 0,
  history: [],
  unlockedGames: [],
  isOnboarded: false,
  ageVerified: false
};

export function useGameStore() {
  const [state, setState] = useState<UserState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateProfile = (userName: string, partnerName: string) => {
    setState(prev => ({ ...prev, userName, partnerName, isOnboarded: true, ageVerified: true }));
  };

  const addCompletion = (itemId: string) => {
    setState(prev => {
      const newCoins = prev.coins + 10;
      const newCompleted = prev.completedPositions + 1;
      const newHistory = [itemId, ...prev.history].slice(0, 100);
      
      // Milestone rewards
      let bonusCoins = 0;
      const newlyUnlocked: string[] = [...prev.unlockedGames];

      if (newCompleted === 10) bonusCoins += 50;
      if (newCompleted === 20) newlyUnlocked.push('oracle');
      if (newCompleted === 50) newlyUnlocked.push('crystal_dice');
      if (newCompleted === 100) bonusCoins += 1000;

      return {
        ...prev,
        coins: newCoins + bonusCoins,
        completedPositions: newCompleted,
        history: newHistory,
        unlockedGames: newlyUnlocked
      };
    });
  };

  const unlockGame = (gameId: string, cost: number) => {
    if (state.coins >= cost) {
      setState(prev => ({
        ...prev,
        coins: prev.coins - cost,
        unlockedGames: [...prev.unlockedGames, gameId]
      }));
      return true;
    }
    return false;
  };

  return { state, updateProfile, addCompletion, unlockGame };
}
