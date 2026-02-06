
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
  daysUntilReset: number;
}

export const Wheel: React.FC<WheelProps> = ({ category, onComplete, history, spinsRemaining, isVip, onSpinUsed, onCheckout, daysUntilReset }) => {
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
      <div className="relative w-[65vw] h-[65vw] max-w-[240px] max-h-[240px] mb-8 perspective-2000">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 z-20 w-8 h-10 bg-white rounded-b-2xl shadow-[0_0_20px_rgba(255,255,255,0.4)] border-2 border-zinc-950 flex items-end justify-center pb-2">
           <div className="w-3 h-3 bg-pink-600 rounded-full animate-pulse"></div>
        </div>

        <div className="absolute inset-[-8px] rounded-full bg-gradient-to-br from-yellow-500/20 to-transparent blur-xl opacity-50"></div>

        <div 
          className="w-full h-full rounded-full border-[6px] border-zinc-950 shadow-[0_0_30px_rgba(251,191,36,0.2)] overflow-hidden bg-zinc-950 relative transform-gpu"
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
                  strokeWidth="0.1"
                />
              </g>
            ))}
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-zinc-950 rounded-full border-[3px] border-zinc-900 flex flex-col items-center justify-center text-[8px] font-black uppercase text-yellow-500">
            <span className="italic">LUNA</span>
          </div>
        </div>
      </div>

      <div className="w-full text-center space-y-4">
        {hasNoSpins ? (
          <div className="bg-[#0f1525] border-2 border-red-500/20 p-5 rounded-[2.5rem] space-y-3 animate-in zoom-in shadow-2xl">
            <p className="text-white text-[9px] font-black uppercase italic leading-tight">
              GIROS ESGOTADOS! NOVOS GIROS EM {daysUntilReset} DIAS OU LIBERE TUDO AGORA.
            </p>
            <button 
              onClick={onCheckout}
              className="w-full py-4 bg-yellow-500 text-black rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg animate-heartbeat"
            >
              LIBERAR TUDO AGORA 🚀
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-1">
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">GIROS RESTANTES</span>
              <div className="flex space-x-1.5 bg-[#0f1525] p-1.5 rounded-full border border-white/5">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className={`w-2 h-2 rounded-full transition-all duration-700 ${isVip ? 'bg-yellow-500 animate-pulse' : idx < spinsRemaining ? 'bg-pink-500 scale-110' : 'bg-zinc-800 opacity-20'}`}></div>
                ))}
              </div>
            </div>
            <button 
              onClick={spin}
              disabled={isSpinning}
              className="w-full py-4 bg-gradient-to-br from-yellow-600 to-yellow-500 text-black rounded-2xl font-black text-lg uppercase tracking-widest shadow-[0_6px_0_rgb(161,98,7)] animate-heartbeat active:translate-y-1 active:shadow-none transition-all"
            >
              {isSpinning ? 'GIRANDO...' : 'GIRAR 🎰'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
