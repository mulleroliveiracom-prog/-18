
import React, { useState } from 'react';
import { diceActions, diceBodyParts } from '../data/content';

export const DiceGame: React.FC = () => {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<{a: string, b: string} | null>(null);

  const rollDice = () => {
    setIsRolling(true);
    setResult(null);
    
    // Procedural sound
    const ctx = new AudioContext();
    const playRoll = () => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(50 + Math.random() * 100, ctx.currentTime);
      g.gain.setValueAtTime(0.05, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    };

    const rollInterval = setInterval(playRoll, 100);

    setTimeout(() => {
      clearInterval(rollInterval);
      const a = diceActions[Math.floor(Math.random() * diceActions.length)];
      const b = diceBodyParts[Math.floor(Math.random() * diceBodyParts.length)];
      setResult({ a, b });
      setIsRolling(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[70vh] space-y-12 py-12 px-6 text-center">
      <div className="space-y-2">
        <h2 className="font-luxury text-5xl text-yellow-500 neon-gold">DADOS DE CRISTAL</h2>
        <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase">Deixe o acaso guiar o toque</p>
      </div>
      
      <div className="flex space-x-12 relative">
        <div className={`w-32 h-32 bg-zinc-900 border-4 border-yellow-600 rounded-[2rem] flex items-center justify-center text-5xl shadow-[0_20px_40px_rgba(202,138,4,0.3)] transition-all duration-300 ${isRolling ? 'animate-bounce rotate-[720deg] scale-110' : 'rotate-12'}`}>
          <span className="drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{isRolling ? '?' : '🎲'}</span>
        </div>
        <div className={`w-32 h-32 bg-zinc-950 border-4 border-red-600 rounded-[2rem] flex items-center justify-center text-5xl shadow-[0_20px_40px_rgba(220,38,38,0.3)] transition-all duration-300 ${isRolling ? 'animate-bounce -rotate-[720deg] scale-110' : '-rotate-12'}`}>
          <span className="drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{isRolling ? '?' : '🔥'}</span>
        </div>
      </div>

      {result && !isRolling && (
        <div className="bg-zinc-900/80 backdrop-blur-md p-10 rounded-[3rem] border border-yellow-600/20 animate-in zoom-in duration-500 max-w-sm w-full shadow-2xl">
          <p className="text-zinc-500 uppercase tracking-[0.4em] text-[10px] font-black mb-6">Missão Instantânea</p>
          <div className="space-y-2">
            <p className="text-4xl font-black text-yellow-500 uppercase tracking-tighter">{result.a}</p>
            <p className="text-xl font-bold text-zinc-400">o(a)</p>
            <p className="text-4xl font-black text-red-600 uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]">{result.b}</p>
          </div>
          <div className="mt-8 pt-8 border-t border-zinc-800">
            <p className="text-zinc-400 italic text-sm font-medium">"Explore com curiosidade e prazer..."</p>
          </div>
        </div>
      )}

      <button 
        onClick={rollDice}
        disabled={isRolling}
        className="group relative px-20 py-6 bg-white rounded-2xl font-black text-xl uppercase tracking-widest text-black shadow-[0_10px_0_rgb(161,161,170)] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
      >
        <span className="relative z-10">{isRolling ? 'LANÇANDO...' : 'LANÇAR DADOS'}</span>
        <div className="absolute inset-0 bg-yellow-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-2xl opacity-10"></div>
      </button>
    </div>
  );
};
