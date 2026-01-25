import React, { useState, useEffect } from 'react';
import { Category, GameItem } from './types';
import { useGameStore } from './hooks/useGameStore';
import { Wheel } from './components/Wheel';
import { Store } from './components/Store';
import { cardChallenges, slotActions, slotTargets, slotIntensities } from './data/content';

const TutorialOverlay: React.FC<{ 
  title: string; 
  description: string; 
  onClose: () => void; 
  icon: string;
}> = ({ title, description, onClose, icon }) => (
  <div className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
    <div className="bg-[#0f1525] border-4 border-yellow-500/30 w-full max-w-[340px] rounded-[3rem] p-8 text-center space-y-6 shadow-[0_0_100px_rgba(255,193,7,0.2)]">
      <div className="text-7xl drop-shadow-[0_0_30px_rgba(255,193,7,0.5)] animate-bounce">{icon}</div>
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">COMO JOGAR?</h2>
        <p className="text-yellow-500 font-black text-lg tracking-widest uppercase">{title}</p>
        <div className="w-16 h-1 bg-pink-600 mx-auto rounded-full"></div>
      </div>
      <div className="bg-black/40 p-5 rounded-2xl border border-white/5 max-h-[30vh] overflow-y-auto custom-scrollbar">
        <div className="text-zinc-200 text-xs leading-relaxed font-bold italic space-y-3 text-left">
          {description ? description.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          )) : <p>Carregando instruções...</p>}
        </div>
      </div>
      <div className="flex flex-col space-y-3">
        <button onClick={onClose} className="w-full bg-green-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-lg shadow-[0_8px_0_rgb(21,128,61)] active:translate-y-1 active:shadow-none transition-all">ENTENDI! ✅</button>
        <button onClick={onClose} className="text-zinc-600 font-black uppercase text-[9px] tracking-widest">Pular Explicação</button>
      </div>
    </div>
  </div>
);

const Onboarding: React.FC<{ onComplete: (n: string, p: string) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState('');
  const [partnerName, setPartnerName] = useState('');

  if (step === 0) {
    return (
      <div className="fixed inset-0 bg-[#070b14] flex flex-col items-center justify-center p-8 text-center overflow-hidden z-[300]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a2333_0%,_#070b14_100%)] opacity-50"></div>
        <div className="relative z-10 space-y-12 animate-in fade-in duration-1000 max-w-sm">
          <div className="w-48 h-48 border-[10px] border-red-600 rounded-full flex flex-col items-center justify-center mx-auto bg-black/60 shadow-[0_0_60px_rgba(220,38,38,0.5)] animate-pulse">
            <span className="text-6xl font-black text-white">18+</span>
            <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mt-2 text-center">ACESSO<br/>RESTRITO</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">LUNA<br/><span className="text-yellow-500">SUTRA</span></h1>
            <p className="text-zinc-400 font-bold uppercase tracking-[0.3em] text-[10px]">O CLIMAX DO SEU RELACIONAMENTO</p>
          </div>
          <button onClick={() => setStep(1)} className="w-full bg-white text-black py-6 rounded-[2rem] text-xl font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95 transition-all">SOU MAIOR DE IDADE</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#070b14] flex flex-col items-center justify-center p-8 animate-in slide-in-from-right duration-500 z-[300]">
      <div className="w-full max-w-sm space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-black text-yellow-500 italic uppercase leading-none tracking-tighter">PERFIL VIP</h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">QUEM VAI EXPLORAR O LUNA?</p>
        </div>
        <div className="space-y-8">
          <div className="relative">
            <input value={userName} onChange={e => setUserName(e.target.value)} className="w-full bg-[#0f1525] border-4 border-zinc-900 p-6 rounded-[2rem] text-white outline-none focus:border-yellow-500 transition-all text-xl font-black uppercase italic" placeholder="SEU NOME" />
            <span className="absolute -top-3 left-6 bg-[#070b14] px-2 text-zinc-600 text-[9px] font-black uppercase tracking-widest">JOGADOR 1</span>
          </div>
          <div className="relative">
            <input value={partnerName} onChange={e => setPartnerName(e.target.value)} className="w-full bg-[#0f1525] border-4 border-zinc-900 p-6 rounded-[2rem] text-white outline-none focus:border-yellow-500 transition-all text-xl font-black uppercase italic" placeholder="NOME DO PAR" />
            <span className="absolute -top-3 left-6 bg-[#070b14] px-2 text-zinc-600 text-[9px] font-black uppercase tracking-widest">JOGADOR 2</span>
          </div>
        </div>
        <button disabled={!userName || !partnerName} onClick={() => onComplete(userName, partnerName)} className="w-full bg-gradient-to-r from-pink-600 to-purple-600 disabled:opacity-20 py-6 rounded-[2rem] text-xl font-black uppercase text-white shadow-xl transition-all transform active:scale-95">COMEÇAR AGORA 🔒</button>
      </div>
    </div>
  );
};

const CardsGame = ({ onComplete }: { onComplete: (item: any) => void }) => {
  const [flipped, setFlipped] = useState<number[]>([]);
  
  return (
    <div className="px-6 py-8 space-y-10 animate-in slide-in-from-bottom duration-500 text-center">
      <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter leading-none">CARDS DA<br/>SORTE</h2>
      <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
        {Array.from({ length: 12 }).map((_, i) => (
          <div 
            key={i} 
            onClick={() => {
              if(!flipped.includes(i)) {
                setFlipped([...flipped, i]);
                const challenge = cardChallenges[Math.floor(Math.random() * cardChallenges.length)];
                onComplete({ nome: "CARD REVELADO", descricao: challenge, categoria: 'Cards', id: `card-${i}-${Date.now()}` });
              }
            }}
            className="aspect-[3/4] bg-[#0f1525] border-2 border-zinc-900 rounded-2xl flex items-center justify-center cursor-pointer active:scale-90 transition-all group overflow-hidden shadow-lg"
          >
            {flipped.includes(i) ? (
              <span className="text-3xl">🔥</span>
            ) : (
              <span className="text-pink-500 text-4xl drop-shadow-[0_0_10px_rgba(233,30,99,0.4)]">❤️</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const SlotGame = ({ onComplete }: { onComplete: (item: any) => void }) => {
  const [spinning, setSpinning] = useState(false);
  const [cols, setCols] = useState(["🔥", "🔞", "😈"]);

  const spin = () => {
    setSpinning(true);
    const interval = setInterval(() => {
      setCols([
        slotActions[Math.floor(Math.random() * slotActions.length)],
        slotTargets[Math.floor(Math.random() * slotTargets.length)],
        slotIntensities[Math.floor(Math.random() * slotIntensities.length)]
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
      const a = slotActions[Math.floor(Math.random() * slotActions.length)];
      const t = slotTargets[Math.floor(Math.random() * slotTargets.length)];
      const i = slotIntensities[Math.floor(Math.random() * slotIntensities.length)];
      setCols([a, t, i]);
      onComplete({
        id: 'slot-res-' + Date.now(),
        nome: "COMBINAÇÃO PROIBIDA",
        descricao: `${a} ${t} ${i}!`,
        categoria: 'Slot'
      });
    }, 2000);
  };

  return (
    <div className="px-6 py-8 space-y-12 text-center animate-in zoom-in duration-700">
      <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-none">SLOT<br/>PROIBIDO</h2>
      <div className="bg-[#0f1525] p-6 rounded-[3rem] border-8 border-zinc-950 flex space-x-3 max-w-sm mx-auto shadow-2xl relative">
         {cols.map((val, i) => (
           <div key={i} className={`flex-1 aspect-[1/2] bg-zinc-950 rounded-2xl border-2 border-zinc-900 flex items-center justify-center p-2 text-center text-xs font-black text-pink-500 italic shadow-inner transition-all ${spinning ? 'opacity-40' : ''}`}>
             <span className="uppercase tracking-tighter leading-tight break-words">{val}</span>
           </div>
         ))}
      </div>
      <button onClick={spin} disabled={spinning} className="px-12 py-6 bg-gradient-to-r from-pink-600 to-purple-600 rounded-[2rem] font-black text-2xl uppercase tracking-widest text-white shadow-xl active:translate-y-2 active:shadow-none transition-all disabled:opacity-50">
        {spinning ? 'SORTEANDO...' : '⚡ PUXAR'}
      </button>
    </div>
  );
};

export default function App() {
  const { state, updateProfile, addCompletion, unlockGame, completeTutorial } = useGameStore();
  const [activeTab, setActiveTab] = useState<'girar' | 'cards' | 'slot' | 'loja' | 'vip'>('girar');
  const [category, setCategory] = useState<Category>(Category.Warmup);
  const [activeMission, setActiveMission] = useState<any>(null);
  const [missionTimer, setMissionTimer] = useState<number | null>(null);

  useEffect(() => {
    let interval: any;
    if (missionTimer !== null && missionTimer > 0) {
      interval = setInterval(() => {
        setMissionTimer(prev => (prev !== null ? prev - 1 : 0));
      }, 1000);
    } else if (missionTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [missionTimer]);

  if (!state.isOnboarded) return <Onboarding onComplete={updateProfile} />;

  const tutorialContent = {
    girar: { 
      title: "ROLETA LUNA", 
      icon: "🎰", 
      description: "1. Escolha a intensidade: Aquecimento, Ousadia ou Posição.\n2. Clique em GIRAR para sortear um desafio.\n3. Após o sorteio, clique em INICIAR AGORA.\n4. Realize a missão por 35 segundos.\n5. Somente após o tempo zerar, você poderá clicar em CONCLUÍDO e ganhar 20 moedas!" 
    },
    cards: { 
      title: "CARDS DA SORTE", 
      icon: "🎴", 
      description: "1. Toque em qualquer card para revelar uma missão.\n2. Clique em INICIAR AGORA e realize a ação por 30 segundos.\n3. Ao completar o tempo, clique em CONCLUÍDO para ganhar 10 moedas!" 
    },
    slot: { 
      title: "SLOT PROIBIDO", 
      icon: "⚡", 
      description: "1. Puxe a alavanca para girar combinações eróticas.\n2. Clique em INICIAR AGORA e realize a ação por 30 segundos.\n3. Ganhe 10 moedas por cada rodada de sucesso!" 
    }
  };

  const handleStartMissionTimer = () => {
    setMissionTimer(30);
  };

  const closeMission = () => {
    setActiveMission(null);
    setMissionTimer(null);
  };

  return (
    <div className="h-full flex flex-col bg-[#070b14] text-white">
      
      {activeTab === 'girar' && !state.tutorialsCompleted.includes('girar') && (
        <TutorialOverlay {...tutorialContent.girar} onClose={() => completeTutorial('girar')} />
      )}

      {activeTab === 'cards' && !state.tutorialsCompleted.includes('cards') && (
        <TutorialOverlay {...tutorialContent.cards} onClose={() => completeTutorial('cards')} />
      )}
      {activeTab === 'slot' && !state.tutorialsCompleted.includes('slot') && (
        <TutorialOverlay {...tutorialContent.slot} onClose={() => completeTutorial('slot')} />
      )}

      <header className="px-8 pt-10 pb-4 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
             <h1 className="text-[10px] font-black tracking-[0.4em] text-yellow-500 uppercase opacity-60">LUNA CLUB</h1>
             <p className="text-2xl font-black italic tracking-tighter uppercase leading-none">{state.userName} <span className="text-pink-500">&</span> {state.partnerName}</p>
          </div>
          <div className="bg-[#0f1525] px-4 py-2 rounded-2xl border-2 border-zinc-950 flex items-center space-x-2 shadow-lg">
            <span className="text-xl font-black text-yellow-500">{state.coins}</span>
            <span className="text-base animate-pulse">🪙</span>
          </div>
        </div>
        
        <div className="bg-[#0f1525]/80 p-6 rounded-[2rem] border-2 border-zinc-950 space-y-3 shadow-lg">
          <div className="flex justify-between text-[9px] font-black uppercase text-zinc-500 tracking-[0.2em]">
            <span>CONEXÃO</span>
            <span className="text-yellow-500">{state.completedPositions} / 5</span>
          </div>
          <div className="w-full bg-zinc-950 h-3 rounded-full overflow-hidden border-2 border-zinc-900 p-0.5">
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (state.completedPositions / 5) * 100)}%` }}></div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pb-32">
        {activeTab === 'girar' && (
          <div className="px-4 py-6 space-y-10 flex flex-col items-center">
             <div className="w-full max-w-sm flex bg-[#0f1525] p-2 rounded-[2rem] border-2 border-zinc-950 shadow-xl">
              {Object.values(Category).map(cat => (
                <button key={cat} onClick={() => setCategory(cat)} className={`flex-1 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.1em] transition-all ${category === cat ? 'bg-yellow-500 text-black shadow-md' : 'text-zinc-600'}`}>{cat}</button>
              ))}
            </div>
            
            <div className="w-full max-w-sm flex justify-center">
              <Wheel category={category} history={state.history} onComplete={(item) => addCompletion(item.id)} />
            </div>
          </div>
        )}

        {activeTab === 'cards' && <CardsGame onComplete={(item) => setActiveMission({...item, reward: 10})} />}
        {activeTab === 'slot' && <SlotGame onComplete={(item) => setActiveMission({...item, reward: 10})} />}
        {activeTab === 'loja' && <Store state={state} onUnlock={unlockGame} />}
      </main>

      {activeMission && (
        <div className="fixed inset-0 z-[250] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-[#0f1525] border-6 border-pink-500/20 w-full max-w-[340px] rounded-[3rem] overflow-hidden shadow-2xl text-center p-10 space-y-8">
              <div className="space-y-2">
                 <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-tight">{activeMission.nome}</h2>
                 <span className="inline-block bg-pink-500/10 text-pink-500 text-[9px] font-black px-6 py-2 rounded-full uppercase tracking-[0.3em] border border-pink-500/20">{activeMission.categoria}</span>
              </div>
              <div className="p-6 bg-black/80 rounded-[2rem] border-2 border-zinc-900">
                <p className="text-2xl text-white font-black leading-tight italic">"{activeMission.descricao}"</p>
              </div>

              {missionTimer !== null && (
                <div className="space-y-4">
                   <div className="text-6xl font-black text-pink-500 font-mono">
                     00:{missionTimer < 10 ? `0${missionTimer}` : missionTimer}
                   </div>
                   <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                     <div 
                       className="bg-gradient-to-r from-pink-600 to-purple-600 h-full transition-all duration-1000 ease-linear"
                       style={{ width: `${(missionTimer / 30) * 100}%` }}
                     ></div>
                   </div>
                </div>
              )}

              <div className="flex flex-col space-y-4">
                <button 
                  onClick={() => {
                    if (missionTimer === null && activeMission.reward > 0) {
                      handleStartMissionTimer();
                    } else {
                      addCompletion(activeMission.id, activeMission.reward); 
                      closeMission();
                    }
                  }} 
                  disabled={missionTimer !== null && missionTimer > 0}
                  className={`w-full py-6 font-black rounded-2xl uppercase tracking-widest text-xl transition-all shadow-lg ${
                    (missionTimer === null && activeMission.reward > 0) 
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_8px_0_rgb(157,23,77)]' 
                      : (missionTimer === 0 || activeMission.reward === 0) 
                        ? 'bg-yellow-500 text-black shadow-[0_8px_0_rgb(161,98,7)]' 
                        : 'bg-zinc-800 text-zinc-500 opacity-50'
                  }`}
                >
                  {missionTimer === null && activeMission.reward > 0 ? 'COMEÇAR AGORA ⏳' : (missionTimer === 0 || activeMission.reward === 0) ? `CONCLUÍDO! (+${activeMission.reward})` : 'AGUARDE...'}
                </button>
                <button 
                  onClick={closeMission} 
                  disabled={missionTimer !== null && missionTimer > 0}
                  className={`text-zinc-600 font-black uppercase text-[9px] tracking-[0.3em] ${missionTimer !== null && missionTimer > 0 ? 'opacity-20 pointer-events-none' : ''}`}
                >
                  ✕ FECHAR
                </button>
              </div>
           </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-[#0f1525]/95 backdrop-blur-xl border-t-4 border-zinc-950 px-6 py-6 flex justify-around items-center z-50 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        {[
          { id: 'girar', label: 'LUNA', icon: '🎰' },
          { id: 'cards', label: 'CARDS', icon: '🎴' },
          { id: 'slot', label: 'SLOT', icon: '⚡' },
          { id: 'loja', label: 'LOJA', icon: '👜' },
          { id: 'vip', label: 'VIP', icon: '🏆' }
        ].map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id as any)} className="flex flex-col items-center space-y-2 relative">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${activeTab === item.id ? 'bg-yellow-500 text-black shadow-lg -translate-y-3' : 'text-zinc-600'}`}>{item.icon}</div>
            <span className={`text-[8px] font-black tracking-widest transition-all ${activeTab === item.id ? 'text-yellow-500 opacity-100' : 'opacity-30'}`}>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
