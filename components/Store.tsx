
import React from 'react';
import { UserState } from '../types';

interface StoreProps {
  state: UserState;
  onUnlock: (id: string, cost: number) => void;
}

export const Store: React.FC<StoreProps> = ({ state, onUnlock }) => {
  const shopItems = [
    {
      id: 'oracle',
      name: 'Oráculo do Desejo',
      description: 'Descubra os desejos mais profundos do seu par neste jogo de cartas psicológico.',
      cost: 50,
      unlockRequirement: '20 Posições Concluídas',
      requiredCount: 20
    },
    {
      id: 'crystal_dice',
      name: 'Dados de Cristal',
      description: 'Versão avançada dos dados com desafios extremos e personalizáveis.',
      cost: 200,
      unlockRequirement: '50 Posições Concluídas',
      requiredCount: 50
    },
    {
      id: 'vip_suite',
      name: 'Suíte VIP',
      description: 'Acesso a conteúdos exclusivos e trilhas sonoras imersivas para suas sessões.',
      cost: 500,
      unlockRequirement: '100 Posições Concluídas',
      requiredCount: 100
    }
  ];

  return (
    <div className="p-6 pb-24 space-y-8">
      <div className="flex justify-between items-center bg-zinc-900/80 p-6 rounded-3xl border border-yellow-600/30">
        <div>
          <h2 className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Saldo VIP</h2>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-yellow-500">{state.coins}</span>
            <span className="text-yellow-600">🪙</span>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Nível</h2>
          <p className="text-xl font-semibold text-white">
            {state.completedPositions >= 100 ? 'Mestre do Prazer' : 'Iniciante VIP'}
          </p>
        </div>
      </div>

      <h3 className="font-luxury text-3xl text-center text-white mb-6">Loja Secreta</h3>

      <div className="space-y-4">
        {shopItems.map(item => {
          const isUnlocked = state.unlockedGames.includes(item.id);
          const canUnlock = state.completedPositions >= item.requiredCount && state.coins >= item.cost;
          
          return (
            <div key={item.id} className={`p-6 rounded-3xl border transition-all ${isUnlocked ? 'bg-zinc-900 border-yellow-600/50' : 'bg-black/50 border-zinc-800 grayscale'}`}>
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                  {item.name}
                  {!isUnlocked && <span className="text-zinc-600">🔒</span>}
                </h4>
                <div className="text-yellow-500 font-bold">{item.cost} 🪙</div>
              </div>
              <p className="text-sm text-zinc-400 mb-6">{item.description}</p>
              
              {!isUnlocked ? (
                <div className="flex flex-col space-y-3">
                  <div className="text-xs text-zinc-500 flex justify-between">
                    <span>Progresso necessário: {item.unlockRequirement}</span>
                    <span>{state.completedPositions}/{item.requiredCount}</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-yellow-600 h-full transition-all" 
                      style={{ width: `${Math.min(100, (state.completedPositions / item.requiredCount) * 100)}%` }}
                    />
                  </div>
                  <button 
                    disabled={!canUnlock}
                    onClick={() => onUnlock(item.id, item.cost)}
                    className={`mt-2 py-3 rounded-xl font-bold uppercase transition-all ${canUnlock ? 'bg-yellow-600 text-black hover:bg-yellow-500' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
                  >
                    Desbloquear
                  </button>
                </div>
              ) : (
                <button className="w-full bg-white text-black py-3 rounded-xl font-bold uppercase hover:bg-zinc-200 transition-all">
                  Jogar Agora
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
