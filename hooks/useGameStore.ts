import { useState, useEffect } from 'react';
import { UserState } from '../types';

const STORAGE_KEY = 'luna_sutra_state_v4';

const INITIAL_SPINS = {
  wheel: 3,
  cards: 1,
  slots: 0,
  dice: 1
};

const INITIAL_STATE: UserState = {
  userName: '',
  partnerName: '',
  profileImage: undefined,
  coins: 0,
  completedPositions: 0,
  history: [],
  unlockedGames: [],
  isOnboarded: false,
  ageVerified: false,
  tutorialsCompleted: [],
  isVip: false,
  firstSpinDate: null,
  spins: { ...INITIAL_SPINS }
};

export function useGameStore() {
  const [state, setState] = useState<UserState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : INITIAL_STATE;
    
    // Lógica de Renovação Semanal (7 dias)
    if (parsed.firstSpinDate) {
      const firstSpin = new Date(parsed.firstSpinDate).getTime();
      const now = new Date().getTime();
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

      if (now - firstSpin >= sevenDaysInMs) {
        parsed.spins = { ...INITIAL_SPINS };
        parsed.firstSpinDate = new Date().toISOString();
      }
    }
    
    return parsed;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateProfile = (userName: string, partnerName: string) => {
    setState(prev => ({ ...prev, userName, partnerName, isOnboarded: true, ageVerified: true }));
  };

  const updateProfileImage = (image: string) => {
    setState(prev => ({ ...prev, profileImage: image }));
  };

  const useSpin = (type: keyof UserState['spins']) => {
    if (state.isVip) return true;
    if (state.spins[type] <= 0) return false;

    setState(prev => {
      const newSpins = { ...prev.spins, [type]: prev.spins[type] - 1 };
      const firstDate = prev.firstSpinDate || new Date().toISOString();
      return { ...prev, spins: newSpins, firstSpinDate: firstDate };
    });
    return true;
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

  const setVipStatus = (status: boolean) => {
    setState(prev => ({ ...prev, isVip: status }));
  };

  const getDaysUntilReset = () => {
    if (!state.firstSpinDate) return 7;
    const firstSpin = new Date(state.firstSpinDate).getTime();
    const now = new Date().getTime();
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    const diff = sevenDaysInMs - (now - firstSpin);
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return { state, updateProfile, updateProfileImage, addCompletion, unlockGame, completeTutorial, useSpin, setVipStatus, getDaysUntilReset };
}