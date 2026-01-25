
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
  categoria: Category;
  iconeSvg: string;
}

export interface UserState {
  userName: string;
  partnerName: string;
  coins: number;
  completedPositions: number;
  history: string[];
  unlockedGames: string[];
  isOnboarded: boolean;
  ageVerified: boolean;
}

export interface DiceResult {
  action: string;
  bodyPart: string;
}
