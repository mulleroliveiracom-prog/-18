
import React, { useState, useEffect } from 'react';
import { Category, GameItem } from '../types';
import { gameDatabase } from '../data/content';

interface WheelProps {
  category: Category;
  onComplete: (item: GameItem) => void;
  history: string[];
}

export const Wheel: React.FC<WheelProps> = ({ category, onComplete, history }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
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
    setIsSpinning(true);
    setShowModal(false);
    setTimer(null);

    const extraSpins = 12 + Math.random() * 8;
    const finalRotation = rotation + (extraSpins * 360) + (Math.random() * 360);
    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const normalizedRotation = (finalRotation % 360);
      const sliceIndex = Math.floor(((360 - normalizedRotation + 15) % 360) / 30);
      const winner = slices[sliceIndex % 12];
      setSelectedItem(winner);
      setShowModal(true);
    }, 4500);
  };

  const startTimer = () => {
    setTimer(35);
    const intervalId = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev ? prev - 1 : 0;
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[400px] mx-auto py-6">
      <div className="relative w-[75vw] h-[75vw] max-w-[320px] max-h-[320px] mb-12 perspective-2000">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 z-20 w-10 h-14 bg-white rounded-b-2xl shadow-lg border-2 border-zinc-900 flex items-end justify-center pb-3">
           <div className="w-4 h-4 bg-pink-600 rounded-full animate-pulse shadow-[0_0_10px_#e91e63]"></div>
        </div>

        <div 
          className="w-full h-full rounded-full border-[12px] border-zinc-950 shadow-[0_0_50px_rgba(233,30,99,0.3)] overflow-hidden bg-zinc-950 relative transform-gpu"
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
                  fill={i % 2 === 0 ? '#e91e63' : '#c2185b'}
                  stroke="#ffffff05"
                  strokeWidth="0.2"
                />
                <g transform="translate(62, 12) rotate(15)">
                   <text x="0" y="0" fill="white" fontSize="4" fontWeight="black" opacity="0.3" className="uppercase italic tracking-tighter">PLAY</text>
                </g>
              </g>
            ))}
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-zinc-950 rounded-full border-[6px] border-zinc-900 shadow-xl flex flex-col items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500">
            <span className="mb-1 italic">LUNA</span>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>

      <button 
        onClick={spin}
        disabled={isSpinning}
        className="w-full py-6 bg-gradient-to-br from-pink-600 to-pink-500 rounded-[2rem] font-black text-2xl uppercase tracking-widest shadow-[0_8px_0_rgb(157,23,77)] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center space-x-4 z-10"
      >
        <span>{isSpinning ? 'GIRANDO...' : 'GIRAR'}</span>
        {!isSpinning && <span className="text-3xl">🎰</span>}
      </button>

      {showModal && selectedItem && (
        <div className="fixed inset-0 z-[250] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#0f1525] border-6 border-pink-500/20 w-full max-w-[340px] rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="p-10 space-y-8 text-center">
              <div className="space-y-2">
                 <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">{selectedItem.nome}</h2>
                 <span className="inline-block bg-pink-500/10 text-pink-500 text-[9px] font-black px-6 py-2 rounded-full uppercase tracking-widest border border-pink-500/20">
                  {selectedItem.categoria}
                 </span>
              </div>
              
              <div className="bg-black/80 p-8 rounded-[2rem] border-2 border-zinc-900 shadow-inner">
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4">MISSÃO REVELADA:</p>
                <p className="text-2xl text-zinc-100 font-black leading-tight italic">
                  "{selectedItem.descricao}"
                </p>
              </div>

              {timer !== null && (
                <div className="space-y-4">
                   <div className="text-6xl font-black text-pink-500 font-mono">
                     00:{timer < 10 ? `0${timer}` : timer}
                   </div>
                   <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                     <div 
                       className="bg-gradient-to-r from-pink-600 to-purple-600 h-full transition-all duration-1000 ease-linear"
                       style={{ width: `${(timer / 35) * 100}%` }}
                     ></div>
                   </div>
                </div>
              )}

              <div className="flex flex-col space-y-4 pt-4">
                <button 
                  onClick={() => {
                    if (timer === null) {
                      startTimer();
                    } else if (timer === 0) {
                      onComplete(selectedItem);
                      setShowModal(false);
                      setTimer(null);
                    }
                  }}
                  disabled={timer !== null && timer > 0}
                  className={`w-full py-6 rounded-2xl font-black text-xl uppercase tracking-widest shadow-lg transition-all transform active:scale-95 ${timer === 0 ? 'bg-yellow-500 text-black shadow-[0_8px_0_rgb(161,98,7)]' : timer !== null && timer > 0 ? 'bg-zinc-800 text-zinc-500 opacity-50' : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_8px_0_rgb(157,23,77)]'}`}
                >
                  {timer === null ? 'INICIAR AGORA ⏳' : timer === 0 ? 'CONCLUÍDO (+20)' : 'AGUARDE...'}
                </button>
                <button 
                  onClick={() => setShowModal(false)}
                  disabled={timer !== null && timer > 0}
                  className={`w-full py-4 bg-zinc-900/50 text-zinc-600 font-black rounded-2xl uppercase text-[9px] tracking-widest border border-zinc-800 ${timer !== null && timer > 0 ? 'opacity-20 pointer-events-none' : ''}`}
                >
                  TROCAR POSIÇÃO ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
