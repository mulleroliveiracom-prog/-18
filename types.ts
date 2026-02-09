export enum Category {
  Warmup = 'Aquecimento',
  Daring = 'Ousadia',
  Position = 'Posição'
}

export interface GameItem {
  id: string;
  nome: string;
  descricao: string;
  instrucoesDetalhes: string;
  categoria: Category | string;
  iconeSvg: string;
}

export interface UserState {
  userName: string;
  partnerName: string;
  profileImage?: string;
  coins: number;
  completedPositions: number;
  history: string[];
  unlockedGames: string[];
  isOnboarded: boolean;
  ageVerified: boolean;
  tutorialsCompleted: string[];
  isVip: boolean;
  vipKey: string | null;
  firstSpinDate: string | null;
  dailyLives: number;
  lastLivesResetDate: string | null;
  spins: {
    wheel: number;
    cards: number;
    slots: number;
    dice: number;
  };
}