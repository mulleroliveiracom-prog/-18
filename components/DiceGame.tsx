import React, { useState } from 'react';

interface DiceGameProps {
  spinsRemaining: number;
  isVip: boolean;
  useSpin: () => boolean;
  onCheckout: () => void;
  onComplete: (reward: number) => void;
  daysUntilReset: number;
}

type GameStep = 'setup' | 'guess' | 'rolling' | 'result';

export const DiceGame: React.FC<DiceGameProps> = ({ spinsRemaining, isVip, useSpin, onCheckout, onComplete, daysUntilReset }) => {
  const [step, setStep] = useState<GameStep>('setup');
  const [wish, setWish] = useState('');
  const [secretNumber, setSecretNumber] = useState(1);
  const [guessNumber, setGuessNumber] = useState(1);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);

  const handleHideDesire = () => {
    if (!wish.trim()) return;
    setStep('guess');
  };

  const handleRoll = () => {
    if (!useSpin()) return;
    setStep('rolling');
    setIsRolling(true);

    let counter = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        setDiceValue(guessNumber);
        setIsRolling(false);
        setStep('result');
      }
    }, 100);
  };

  const hasNoSpins = !isVip && spinsRemaining <= 0;

  if (hasNoSpins) {
    return (
      <div className="w-full max-w-sm bg-[#0f1525] border-2 border-red-500/20 p-6 rounded-[2rem] text-center space-y-4 shadow-2xl animate-in zoom-in">
        <div className="text-4xl animate-bounce">🔒</div>
        <p className="text-white text-[9px] font-black uppercase italic leading-tight">
          TESTE ESGOTADO! NOVOS GIROS EM {daysUntilReset} DIAS OU LIBERE O ACESSO VITALÍCIO.
        </p>
        <button 
          onClick={onCheckout}
          className="w-full py-4 bg-yellow-500 text-black rounded-xl font-black uppercase tracking-widest text-[10px] shadow-[0_4px_0_rgb(161,98,7)] animate-heartbeat animate-glow-gold"
        >
          LIBERAR TUDO R$ 1,00 🚀
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm bg-[#0f1525] p-6 rounded-[2.5rem] border-2 border-zinc-900 shadow-2xl space-y-6 animate-in slide-in-from-bottom relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full animate-shimmer opacity-5 pointer-events-none"></div>
      
      <div className="text-center space-y-1 relative z-10">
        <h2 className="text-xl font-black text-yellow-500 italic uppercase tracking-tighter">DADO DA SURPRESA</h2>
        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">MODO DESAFIO ATIVO</p>
      </div>

      <div className="relative z-10">
        {step === 'setup' && (
          <div className="space-y-4 animate-in fade-in">
            <textarea
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="Escreva seu desejo secreto..."
              className="w-full bg-black/40 border-2 border-zinc-800 p-4 rounded-[1.5rem] text-white text-xs font-bold italic placeholder:text-zinc-700 outline-none h-24 resize-none"
            />
            <div className="flex items-center justify-between bg-black/40 p-3 rounded-[1.5rem] border-2 border-zinc-800">
              <span className="text-[9px] font-black text-zinc-500 uppercase">NÚMERO SECRETO</span>
              <select value={secretNumber} onChange={(e) => setSecretNumber(Number(e.target.value))} className="bg-zinc-900 text-yellow-500 font-black px-3 py-1 rounded-lg outline-none border border-yellow-500/20">
                {[1, 2, 3, 4, 5, 6].map(num => <option key={num} value={num}>{num}</option>)}
              </select>
            </div>
            <button onClick={handleHideDesire} disabled={!wish.trim()} className="w-full py-4 bg-white text-black rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-[0_4px_0_rgb(160,160,160)] active:translate-y-1 disabled:opacity-20 animate-pulse">ESCONDER DESEJO 🤫</button>
          </div>
        )}

        {step === 'guess' && (
          <div className="space-y-6 animate-in slide-in-from-right text-center">
            <p className="text-white font-black italic text-[11px] uppercase">Tente adivinhar o número:</p>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map(num => (
                <button key={num} onClick={() => setGuessNumber(num)} className={`aspect-square rounded-xl border-2 font-black text-lg ${guessNumber === num ? 'bg-yellow-500 border-yellow-400 text-black scale-105 shadow-lg shadow-yellow-500/20' : 'bg-black border-zinc-800 text-zinc-500'}`}>{num}</button>
              ))}
            </div>
            <button onClick={handleRoll} className="w-full py-4 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 text-black rounded-[1.5rem] font-black text-sm uppercase tracking-widest animate-heartbeat animate-glow-gold">LANÇAR DADO 🎲</button>
          </div>
        )}

        {step === 'rolling' && (
          <div className="flex flex-col items-center justify-center space-y-6 py-4">
            <div className="w-16 h-16 bg-zinc-900 border-4 border-yellow-500 rounded-2xl flex items-center justify-center text-3xl font-black text-white animate-bounce shadow-[0_0_30px_rgba(251,191,36,0.3)]">{diceValue}</div>
            <p className="text-yellow-500 font-black animate-pulse tracking-widest text-[8px] uppercase">Sorteando...</p>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-6 animate-in zoom-in text-center">
            <div className="w-16 h-16 bg-zinc-900 border-4 border-yellow-500 rounded-xl flex items-center justify-center text-3xl font-black text-white mx-auto">{diceValue}</div>
            <div className="space-y-3">
              {diceValue === secretNumber ? (
                <div className="bg-green-500/10 border-2 border-green-500/30 p-4 rounded-[2rem] space-y-2 shadow-lg shadow-green-500/10">
                  <p className="text-green-400 font-black uppercase text-[9px]">ACERTOU! 🎉</p>
                  <p className="text-white text-sm font-black italic">"{wish}"</p>
                </div>
              ) : (
                <div className="bg-red-500/10 border-2 border-red-500/30 p-4 rounded-[2rem]">
                  <p className="text-red-400 font-black uppercase text-[9px]">ERROU! 💔</p>
                  <p className="text-zinc-500 text-[10px] font-bold italic">O desejo permanece oculto.</p>
                </div>
              )}
            </div>
            <button onClick={() => { onComplete(30); if(!isVip) onCheckout(); else setStep('setup'); }} className="w-full py-4 bg-yellow-500 text-black rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-[0_4px_0_rgb(161,98,7)] animate-heartbeat animate-glow-gold">CONCLUÍDO 🔓</button>
          </div>
        )}
      </div>
    </div>
  );
};
