
import React, { useState } from 'react';
import { Category } from './types';
import { useGameStore } from './hooks/useGameStore';
import { Wheel } from './components/Wheel';
import { DiceGame } from './components/DiceGame';
import { Store } from './components/Store';

const Onboarding: React.FC<{ onComplete: (n: string, p: string) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState('');
  const [partnerName, setPartnerName] = useState('');

  if (step === 0) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 scale-110 blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black"></div>
        
        <div className="relative z-10 space-y-12 max-w-sm animate-in fade-in zoom-in duration-1000">
          <div className="relative">
            <div className="absolute inset-0 bg-red-600 blur-[40px] opacity-20 animate-pulse"></div>
            <div className="w-40 h-40 border-8 border-red-700 rounded-full flex items-center justify-center mx-auto text-6xl font-black mb-4 shadow-[0_0_50px_rgba(185,28,28,0.5)] bg-black/40 relative">
              18+
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="font-luxury text-6xl text-white neon-red tracking-tighter uppercase leading-none">ACESSO<br/>RESTRITO</h1>
            <div className="w-16 h-1 bg-red-600 mx-auto rounded-full"></div>
          </div>
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs leading-relaxed">
            Este clube VIP contém conteúdo adulto exclusivo para casais. <br/>Você é maior de idade?
          </p>
          <button 
            onClick={() => setStep(1)}
            className="w-full bg-red-700 py-6 rounded-2xl text-xl font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-red-600 transition-all active:scale-95 border-b-8 border-red-900"
          >
            ENTRAR NO CLUBE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-12 animate-in slide-in-from-right duration-500">
        <div className="text-center space-y-2">
          <h2 className="font-luxury text-4xl text-yellow-500">BOAS-VINDAS</h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Personalize sua Experiência VIP</p>
        </div>
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Seu Nome de Jogador</label>
            <input 
              value={userName}
              onChange={e => setUserName(e.target.value)}
              className="w-full bg-zinc-900/50 border-2 border-zinc-800 p-5 rounded-3xl text-white outline-none focus:border-yellow-600 focus:bg-zinc-900 transition-all text-lg font-bold"
              placeholder="Ex: Christian"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Nome do seu Par</label>
            <input 
              value={partnerName}
              onChange={e => setPartnerName(e.target.value)}
              className="w-full bg-zinc-900/50 border-2 border-zinc-800 p-5 rounded-3xl text-white outline-none focus:border-yellow-600 focus:bg-zinc-900 transition-all text-lg font-bold"
              placeholder="Ex: Anastasia"
            />
          </div>
        </div>
        <button 
          disabled={!userName || !partnerName}
          onClick={() => onComplete(userName, partnerName)}
          className="w-full bg-yellow-600 disabled:opacity-20 py-6 rounded-3xl text-xl font-black uppercase text-black shadow-[0_10px_0_rgb(161,98,7)] active:translate-y-1 active:shadow-none transition-all"
        >
          INICIAR JOGO
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const { state, updateProfile, addCompletion, unlockGame } = useGameStore();
  const [activeTab, setActiveTab] = useState<'roleta' | 'dados' | 'loja'>('roleta');
  const [category, setCategory] = useState<Category>(Category.Warmup);

  if (!state.isOnboarded) {
    return <Onboarding onComplete={updateProfile} />;
  }

  const nextMilestone = state.completedPositions < 10 ? 10 : 
                       state.completedPositions < 20 ? 20 : 
                       state.completedPositions < 50 ? 50 : 100;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-yellow-500 selection:text-black">
      {/* Top Header - VIP Branding */}
      <header className="p-6 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-900 sticky top-0 z-40">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-0.5">
            <h1 className="text-[9px] font-black tracking-[0.4em] text-yellow-600 uppercase opacity-80">
              CASINO VIP COUPLERS
            </h1>
            <p className="text-lg font-black tracking-tighter text-white uppercase italic">
              {state.userName} <span className="text-yellow-500">&</span> {state.partnerName}
            </p>
          </div>
          <div className="flex flex-col items-end">
             <div className="flex items-center space-x-2 bg-zinc-900 px-4 py-2 rounded-2xl border border-yellow-600/20 shadow-inner">
              <span className="text-yellow-500 font-black text-lg">{state.coins}</span>
              <span className="text-xs filter drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]">🪙</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-[9px] font-black uppercase text-zinc-500 tracking-widest">
            <span>Progressão de Rank</span>
            <span className="text-yellow-600">{state.completedPositions} / {nextMilestone} Desafios</span>
          </div>
          <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-800 p-0.5">
            <div 
              className="bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-300 h-full rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(234,179,8,0.3)]" 
              style={{ width: `${(state.completedPositions / nextMilestone) * 100}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,_#0d0d0d_0%,_#000000_100%)]">
        {activeTab === 'roleta' && (
          <div className="p-6 space-y-10 pb-28 flex flex-col items-center">
            {/* Category Selector */}
            <div className="w-full max-w-sm flex bg-zinc-900/50 p-1.5 rounded-[2rem] border border-zinc-800 shadow-xl">
              {Object.values(Category).map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${category === cat ? 'bg-yellow-600 text-black shadow-lg scale-100' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="text-center space-y-3">
              <h2 className="font-luxury text-6xl text-white drop-shadow-[0_5px_15px_rgba(255,255,255,0.1)]">{category}</h2>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] opacity-60">Sorteio de Alta Volatilidade</p>
            </div>

            <Wheel 
              category={category} 
              history={state.history} 
              onComplete={(item) => addCompletion(item.id)} 
            />
          </div>
        )}

        {activeTab === 'dados' && <DiceGame />}

        {activeTab === 'loja' && <Store state={state} onUnlock={unlockGame} />}
      </main>

      {/* Luxury Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-2xl border-t border-zinc-900 px-8 py-6 flex justify-between items-center z-40 rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
        {[
          { id: 'roleta', label: 'Roleta', icon: '🎰' },
          { id: 'dados', label: 'Dados', icon: '🎲' },
          { id: 'loja', label: 'Loja', icon: '💎' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`flex flex-col items-center space-y-2 group relative ${activeTab === item.id ? 'text-yellow-500' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            {activeTab === item.id && (
              <div className="absolute -top-4 w-12 h-1 bg-yellow-500 rounded-full blur-[2px]"></div>
            )}
            <span className={`text-3xl transition-transform duration-300 ${activeTab === item.id ? 'scale-125' : 'group-hover:scale-110'}`}>
              {item.icon}
            </span>
            <span className={`text-[9px] font-black uppercase tracking-[0.3em] transition-opacity ${activeTab === item.id ? 'opacity-100' : 'opacity-40'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
