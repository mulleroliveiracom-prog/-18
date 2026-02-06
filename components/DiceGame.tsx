
import React, { useState } from 'react';

interface DiceGameProps {
  spinsRemaining: number;
  isVip: boolean;
  useSpin: () => boolean;
  onCheckout: () => void;
  onComplete: (reward: number) => void;
}

type GameStep = 'setup' | 'guess' | 'rolling' | 'result';

export const DiceGame: React.FC<DiceGameProps> = ({ spinsRemaining, isVip, useSpin, onCheckout, onComplete }) => {
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
        setDiceValue(guessNumber); // O dado sempre cai no número que o parceiro escolheu para testar o palpite
        setIsRolling(false);
        setStep('result');
      }
    }, 100);
  };

  const hasNoSpins = !isVip && spinsRemaining <= 0;

  if (hasNoSpins) {
    return (
      <div className="w-full max-w-sm bg-[#0f1525] border-4 border-red-500/30 p-8 rounded-[3.5rem] text-center space-y-6 shadow-2xl animate-in zoom-in">
        <div className="text-5xl animate-bounce">🔒</div>
        <p className="text-white text-xs font-black uppercase italic leading-tight">
          TESTE GRÁTIS CONCLUÍDO!<br/>LIBERE O ACESSO VITALÍCIO PARA CONTINUAR JOGANDO O DADO E TODOS OS OUTROS JOGOS.
        </p>
        <button 
          onClick={onCheckout}
          className="w-full py-5 bg-yellow-500 text-black rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-[0_6px_0_rgb(161,98,7)] animate-heartbeat"
        >
          LIBERAR TUDO R$ 0,01 🚀
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm bg-[#0f1525] p-8 rounded-[3.5rem] border-2 border-zinc-900 shadow-2xl space-y-8 animate-in slide-in-from-bottom duration-700 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full animate-shimmer opacity-5 pointer-events-none"></div>
      
      <div className="text-center space-y-1 relative z-10">
        <h2 className="text-2xl font-black text-yellow-500 italic uppercase tracking-tighter">DADO DA SURPRESA</h2>
        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">
          MODO DESAFIO ATIVO
        </p>
      </div>

      <div className="relative z-10">
        {step === 'setup' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-3">
               <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block ml-2">PASSO 1: SEU DESEJO</span>
               <textarea
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                placeholder="Ex: Quero um boquete de 5 minutos..."
                className="w-full bg-black/40 border-2 border-zinc-800 p-6 rounded-[2rem] text-white text-sm font-bold italic placeholder:text-zinc-700 outline-none focus:border-yellow-500/50 transition-all h-32 resize-none shadow-inner"
              />
            </div>
            <div className="flex items-center justify-between bg-black/40 p-4 rounded-[2rem] border-2 border-zinc-800">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-2">NÚMERO SECRETO</span>
              <select 
                value={secretNumber}
                onChange={(e) => setSecretNumber(Number(e.target.value))}
                className="bg-zinc-900 text-yellow-500 font-black px-4 py-2 rounded-xl outline-none border border-yellow-500/20"
              >
                {[1, 2, 3, 4, 5, 6].map(num => <option key={num} value={num}>{num}</option>)}
              </select>
            </div>
            <button 
              onClick={handleHideDesire}
              disabled={!wish.trim()}
              className="w-full py-5 bg-white text-black rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-[0_6px_0_rgb(160,160,160)] active:translate-y-1 active:shadow-none transition-all disabled:opacity-20"
            >
              ESCONDER DESEJO 🤫
            </button>
          </div>
        )}

        {step === 'guess' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-500 text-center">
            <div className="text-5xl">👀</div>
            <p className="text-white font-black italic text-sm uppercase px-4">Passou para o parceiro!<br/><span className="text-yellow-500">Tente adivinhar o número secreto:</span></p>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map(num => (
                <button 
                  key={num}
                  onClick={() => setGuessNumber(num)}
                  className={`aspect-square rounded-2xl border-2 font-black text-xl transition-all ${guessNumber === num ? 'bg-yellow-500 border-yellow-400 text-black scale-110 shadow-lg' : 'bg-black border-zinc-800 text-zinc-500'}`}
                >
                  {num}
                </button>
              ))}
            </div>
            <button 
              onClick={handleRoll}
              className="w-full py-6 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black rounded-[2rem] font-black text-lg uppercase tracking-widest shadow-xl animate-heartbeat"
            >
              LANÇAR DADO 🎲
            </button>
          </div>
        )}

        {step === 'rolling' && (
          <div className="flex flex-col items-center justify-center space-y-8 py-10">
            <div className="w-24 h-24 bg-zinc-900 border-4 border-yellow-500 rounded-3xl flex items-center justify-center text-5xl font-black text-white shadow-[0_0_50px_rgba(251,191,36,0.4)] animate-bounce">
              {diceValue}
            </div>
            <p className="text-yellow-500 font-black animate-pulse tracking-[0.3em] text-[10px] uppercase">Cruzando os dedos...</p>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-8 animate-in zoom-in duration-500 text-center">
            <div className="w-20 h-20 bg-zinc-900 border-4 border-yellow-500 rounded-2xl flex items-center justify-center text-4xl font-black text-white shadow-xl mx-auto">
              {diceValue}
            </div>
            
            <div className="space-y-4">
              {diceValue === secretNumber ? (
                <div className="bg-green-500/10 border-2 border-green-500/30 p-6 rounded-[2.5rem] space-y-4 animate-in bounce-in">
                  <p className="text-green-500 font-black uppercase tracking-widest text-[11px]">ACERTOU EM CHEIO! 🎉</p>
                  <p className="text-white text-lg font-black italic leading-tight">"{wish}"</p>
                </div>
              ) : (
                <div className="bg-red-500/10 border-2 border-red-500/30 p-6 rounded-[2.5rem] space-y-2">
                  <p className="text-red-500 font-black uppercase tracking-widest text-[11px]">ERROU O PALPITE! 💔</p>
                  <p className="text-zinc-500 text-xs font-bold italic">O desejo permanece em segredo...</p>
                </div>
              )}
            </div>

            <button 
              onClick={() => { onComplete(30); onCheckout(); }}
              className="w-full py-5 bg-yellow-500 text-black rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-[0_6px_0_rgb(161,98,7)] animate-heartbeat"
            >
              LIBERAR TODOS OS JOGOS 🔓
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
