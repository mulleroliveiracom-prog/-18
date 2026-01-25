
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
      name: 'ORÁCULO DO DESEJO',
      description: 'Um mergulho nas fantasias subconscientes do seu par. Use cartas intuitivas para revelar o que as palavras não dizem.',
      cost: 500,
      levelRequired: 20,
      icon: '✨'
    },
    {
      id: 'crystal_dice',
      name: 'DADOS DE CRISTAL',
      description: 'Mecânica avançada de sorteio com desafios de alta intensidade e novos locais.',
      cost: 750,
      levelRequired: 35,
      icon: '💎'
    },
    {
      id: 'forbidden_slot',
      name: 'SLOT PROIBIDO',
      description: 'Combinações aleatórias rápidas e ousadas para momentos de extrema urgência.',
      cost: 1000,
      levelRequired: 50,
      icon: '⚡'
    }
  ];

  return (
    <div className="p-6 pb-32 space-y-10 animate-in fade-in duration-500">
      <div className="relative bg-gradient-to-br from-[#ffc107] to-[#ff9800] p-12 rounded-[3.5rem] shadow-2xl overflow-hidden group">
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-white/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
        <div className="relative z-10 flex flex-col space-y-2">
            <h2 className="text-black/50 text-[10px] font-black uppercase tracking-[0.4em]">SALDO VIP TOTAL</h2>
            <div className="flex items-center space-x-4">
               <span className="text-7xl font-black text-black leading-none">{state.coins}</span>
               <span className="text-4xl filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]">🪙</span>
            </div>
        </div>
      </div>

      <div className="space-y-8">
        {shopItems.map(item => {
          const isUnlocked = state.unlockedGames.includes(item.id);
          const isLevelMet = state.completedPositions >= item.levelRequired;
          const canAfford = state.coins >= item.cost;
          const isLocked = !isLevelMet;
          
          return (
            <div key={item.id} className={`bg-[#0f1525]/80 border-2 border-zinc-800/50 rounded-[3.5rem] p-10 relative overflow-hidden transition-all duration-500 ${isLocked ? 'grayscale opacity-80' : 'hover:border-yellow-500/30 shadow-xl'}`}>
              {isLocked && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-3">
                   <div className="text-4xl text-white/40">🔒</div>
                   <span className="text-white font-black text-[10px] uppercase tracking-[0.3em] bg-black/40 px-4 py-2 rounded-full border border-white/10">
                    NÍVEL {item.levelRequired} NECESSÁRIO
                   </span>
                </div>
              )}
              
              <div className="flex justify-between items-start">
                <div className="space-y-4 flex-1 pr-4">
                  <div className="w-14 h-14 bg-zinc-900 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">{item.name}</h3>
                  <p className="text-zinc-500 text-sm font-medium leading-relaxed">{item.description}</p>
                </div>
                
                <div className="flex flex-col items-end space-y-6">
                  {!isUnlocked ? (
                    <>
                      <div className="flex flex-col items-end">
                        <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">CUSTO</span>
                        <span className="text-yellow-500 font-black text-2xl">{item.cost} 🪙</span>
                      </div>
                      <button 
                        onClick={() => onUnlock(item.id, item.cost)}
                        disabled={!isLevelMet || !canAfford}
                        className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all ${isLevelMet && canAfford ? 'bg-white text-black hover:scale-105' : 'bg-zinc-800 text-zinc-600'}`}
                      >
                        ADQUIRIR AGORA
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-end space-y-2">
                       <span className="bg-green-500/10 text-green-500 text-[10px] font-black px-6 py-2 rounded-full border border-green-500/20 uppercase tracking-widest">DESBLOQUEADO</span>
                       <button className="text-white/60 text-[10px] font-bold underline">Jogar Agora</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
