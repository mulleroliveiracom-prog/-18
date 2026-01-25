
import { useState, useEffect } from 'react';
import { UserState } from '../types';

const STORAGE_KEY = 'luna_sutra_state_v3';

const INITIAL_STATE: UserState = {
  userName: '',
  partnerName: '',
  coins: 0,
  completedPositions: 0,
  history: [],
  unlockedGames: [],
  isOnboarded: false,
  ageVerified: false,
  tutorialsCompleted: []
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

  const addCompletion = (itemId: string, reward: number = 20) => {
    setState(prev => {
      const newCoins = prev.coins + reward;
      const newCompleted = prev.completedPositions + 1;
      const newHistory = [itemId, ...prev.history].slice(0, 100);
      return { ...prev, coins: newCoins, completedPositions: newCompleted, history: newHistory };
    });
  };

  const completeTutorial = (gameId: string) => {
    setState(prev => ({
      ...prev,
      tutorialsCompleted: [...new Set([...prev.tutorialsCompleted, gameId])]
    }));
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

  return { state, updateProfile, addCompletion, unlockGame, completeTutorial };
}
