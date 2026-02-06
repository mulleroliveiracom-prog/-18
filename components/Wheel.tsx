
import React, { useState, useEffect } from 'react';
import { Category, GameItem } from '../types';
import { gameDatabase } from '../data/content';

interface WheelProps {
  category: Category;
  onComplete: (item: GameItem) => void;
  history: string[];
  spinsRemaining: number;
  isVip: boolean;
  onSpinUsed: () => boolean;
  onCheckout: () => void;
}

export const Wheel: React.FC<WheelProps> = ({ category, onComplete, history, spinsRemaining, isVip, onSpinUsed, onCheckout }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [slices, setSlices] = useState<GameItem[]>([]);

  useEffect(() => {
    const available = gameDatabase.filter(item => 
      item.categoria === category && !history.includes(item.id)
    );
    const pool = available.length > 12 ? available : gameDatabase.filter(i => i.categoria === category);
    const selectedSlices = [];
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    for(let i = 0; i < 12; i++) {
      selectedSlices.push(shuffled[i % shuffled.length]);
    }
    setSlices(selectedSlices);
  }, [category, history]);

  const spin = () => {
    if (isSpinning) return;
    if (!onSpinUsed()) return;

    setIsSpinning(true);

    const extraSpins = 12 + Math.random() * 8;
    const finalRotation = rotation + (extraSpins * 360) + (Math.random() * 360);
    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const normalizedRotation = (finalRotation % 360);
      const sliceIndex = Math.floor(((360 - normalizedRotation + 15) % 360) / 30);
      const winner = slices[sliceIndex % 12];
      onComplete(winner);
    }, 4500);
  };

  const hasNoSpins = !isVip && spinsRemaining <= 0;

  return (
    <div className="flex flex-col items-center w-full max-w-[340px] mx-auto py-2">
      <div className="relative w-[70vw] h-[70vw] max-w-[260px] max-h-[260px] mb-8 perspective-2000">
        {/* Ponteiro Luna com Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 z-20 w-10 h-12 bg-white rounded-b-2xl shadow-[0_0_25px_rgba(255,255,255,0.4)] border-2 border-zinc-950 flex items-end justify-center pb-3">
           <div className="w-4 h-4 bg-pink-600 rounded-full animate-pulse shadow-[0_0_15px_#db2777]"></div>
        </div>

        {/* Círculo de Glow Externo */}
        <div className="absolute inset-[-10px] rounded-full bg-gradient-to-br from-pink-600/20 to-transparent blur-2xl opacity-50"></div>

        <div 
          className="w-full h-full rounded-full border-[8px] border-zinc-950 shadow-[0_0_40px_rgba(233,30,99,0.3)] overflow-hidden bg-zinc-950 relative transform-gpu"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 4.5s cubic-bezier(0.15, 0, 0.05, 1)' : 'none'
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full scale-105">
            {slices.map((item, i) => (
              <g key={i} transform={`rotate(${i * 30} 50 50)`}>
                <path 
                  d="M 50 50 L 50 0 A 50 50 0 0 1 75 6.7 Z" 
                  fill={i % 2 === 0 ? '#db2777' : '#9d174d'}
                  stroke="#ffffff08"
                  strokeWidth="0.2"
                />
                <text x="50" y="22" transform={`rotate(15 50 22)`} textAnchor="middle" fill="#ffffff15" fontSize="2.8" fontWeight="900">PLAY</text>
              </g>
            ))}
          </svg>
          {/* Centro da Roleta Luna */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-zinc-950 rounded-full border-[4px] border-zinc-900 shadow-[0_0_20px_rgba(0,0,0,1)] flex flex-col items-center justify-center text-[9px] font-black uppercase tracking-[0.2em] text-yellow-500">
            <span className="italic leading-none drop-shadow-md">LUNA</span>
          </div>
        </div>
      </div>

      <div className="w-full text-center space-y-6">
        {hasNoSpins ? (
          <div className="bg-[#0f1525] border-2 border-red-500/30 p-6 rounded-[2.5rem] space-y-4 animate-in zoom-in shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full animate-shimmer opacity-5 pointer-events-none"></div>
            <p className="text-white text-[10px] font-black uppercase italic leading-tight relative z-10">
              SEUS GIROS GRÁTIS ACABARAM! GANHE NOVOS EM 7 DIAS OU LIBERE TUDO AGORA POR APENAS R$ 0,01.
            </p>
            <button 
              onClick={onCheckout}
              className="w-full py-5 bg-yellow-500 text-black rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg animate-heartbeat relative z-10"
            >
              LIBERAR TUDO AGORA 🚀
            </button>
            <p className="text-[7px] font-black text-zinc-500 uppercase tracking-widest relative z-10">Novos giros grátis toda semana!</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] opacity-60">GIROS RESTANTES</span>
              <div className="flex space-x-2 bg-[#0f1525] p-2 rounded-full border border-white/5">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className={`w-2.5 h-2.5 rounded-full transition-all duration-700 ${isVip ? 'bg-yellow-500 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.6)]' : idx < spinsRemaining ? 'bg-pink-500 shadow-[0_0_10px_rgba(233,30,99,0.7)] scale-110' : 'bg-zinc-800 opacity-20'}`}></div>
                ))}
              </div>
            </div>
            <button 
              onClick={spin}
              disabled={isSpinning}
              className="w-full py-5 bg-gradient-to-br from-pink-600 to-pink-500 rounded-3xl font-black text-xl uppercase tracking-widest shadow-[0_8px_0_rgb(157,23,77)] animate-heartbeat active:translate-y-1 active:shadow-none transition-all"
            >
              {isSpinning ? 'GIRANDO...' : 'GIRAR 🎰'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
