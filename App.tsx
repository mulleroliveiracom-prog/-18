
import React, { Component, useState, useEffect, ReactNode, ErrorInfo } from 'react';
import { Category, GameItem } from './types';
import { useGameStore } from './hooks/useGameStore';
import { Wheel } from './components/Wheel';
import { Store } from './components/Store';
import { DiceGame } from './components/DiceGame';
import { cardChallenges, slotActions, slotTargets, slotIntensities } from './data/content';

interface ErrorBoundaryProps { children?: ReactNode; }
interface ErrorBoundaryState { hasError: boolean; }

// Fix: Use named Component import to ensure 'this.props' is correctly typed by TypeScript
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };
  constructor(props: ErrorBoundaryProps) { super(props); }
  static getDerivedStateFromError(_: Error): ErrorBoundaryState { return { hasError: true }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error("Luna Crash Log:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-8 text-center">
          <div className="text-6xl mb-4 text-red-600">⚠️</div>
          <h2 className="text-2xl font-black text-white uppercase mb-4">Ops! Algo deu errado.</h2>
          <button onClick={() => window.location.reload()} className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest">RECARREGAR LUNA</button>
        </div>
      );
    }
    // Corrected access to this.props.children
    return this.props.children;
  }
}

const HeartExplosion: React.FC = () => {
  const [hearts, setHearts] = useState<{ id: number; left: string; size: string; delay: string }[]>([]);
  useEffect(() => {
    const newHearts = Array.from({ length: 20 }).map((_, i) => ({
      id: Date.now() + i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 20 + 10}px`,
      delay: `${Math.random() * 0.5}s`,
    }));
    setHearts(newHearts);
    const timer = setTimeout(() => setHearts([]), 3500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="fixed inset-0 pointer-events-none z-[999] overflow-hidden">
      {hearts.map(h => (
        <div key={h.id} className="particle-heart" style={{ left: h.left, fontSize: h.size, animationDelay: h.delay }}>❤️</div>
      ))}
    </div>
  );
};

const PixModal: React.FC<{ pixCode: string; onCheck: () => void; isChecking: boolean; onClose: () => void }> = ({ pixCode, onCheck, isChecking, onClose }) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(pixCode)}`;

  return (
    <div className="fixed inset-0 z-[300] bg-black/98 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="bg-[#0f1525] border-2 border-yellow-400/50 w-full max-w-[320px] rounded-[3rem] p-6 text-center space-y-5 shadow-[0_0_50px_rgba(251,191,36,0.2)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full animate-shimmer pointer-events-none opacity-5"></div>
        <div className="space-y-1 relative z-10">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">ACESSO VITALÍCIO</h2>
          <p className="text-yellow-500 text-[8px] font-black uppercase tracking-[0.3em]">OFERTA VIP R$ 0,01</p>
        </div>

        <div className="space-y-3 relative z-10 flex flex-col items-center">
          <div className="bg-white p-3 rounded-2xl inline-block shadow-lg">
            <img src={qrCodeUrl} alt="QR Code Pix" className="w-[140px] h-[140px] block" loading="lazy" />
          </div>
          <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider">Aponte a câmera ou copie o código</p>
        </div>

        <div className="space-y-3 relative z-10">
          <div className="relative group">
            <textarea readOnly value={pixCode} className="w-full bg-black/60 border border-zinc-800 p-3 rounded-xl text-[8px] text-zinc-500 font-mono h-12 resize-none outline-none" />
            <button onClick={copyToClipboard} className={`absolute bottom-1.5 right-1.5 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${copied ? 'bg-green-600 text-white' : 'bg-yellow-500 text-black shadow-md'}`}>
              {copied ? 'COPIADO!' : 'COPIAR'}
            </button>
          </div>
        </div>

        <div className="space-y-3 pt-1 relative z-10">
          <button 
            onClick={onCheck}
            disabled={isChecking}
            className="w-full py-3.5 bg-green-600 text-white rounded-xl font-black uppercase tracking-widest text-[11px] shadow-[0_4px_0_rgb(21,128,61)] animate-heartbeat active:translate-y-1 disabled:opacity-50"
          >
            {isChecking ? 'VERIFICANDO...' : 'JÁ PAGUEI ✅'}
          </button>
          <button onClick={onClose} className="w-full py-1 text-zinc-600 font-black uppercase text-[9px] tracking-widest hover:text-white transition-colors">VOLTAR AO LUNA</button>
        </div>
      </div>
    </div>
  );
};

const TutorialOverlay: React.FC<{ title: string; description: string; onClose: () => void; icon: string; }> = ({ title, description, onClose, icon }) => (
  <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
    <div className="bg-[#121826] border-2 border-yellow-500/30 w-full max-w-[320px] rounded-[3rem] p-8 text-center space-y-6 shadow-2xl relative">
      <div className="text-6xl mb-2 flex justify-center animate-bounce">{icon}</div>
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">COMO JOGAR?</h2>
        <p className="text-yellow-500 font-black text-sm tracking-widest uppercase">{title}</p>
      </div>
      <div className="bg-[#0a0f1a] p-5 rounded-2xl border border-white/5">
        <div className="text-zinc-200 text-[11px] leading-relaxed font-bold italic space-y-3 text-left">
          {description.split('\n').map((line, i) => (<p key={i}>{line}</p>))}
        </div>
      </div>
      <button onClick={onClose} className="w-full bg-green-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_4px_0_rgb(21,128,61)] animate-heartbeat">ENTENDI! ✅</button>
    </div>
  </div>
);

const CardsGame: React.FC<{ onComplete: (item: any) => void; spinsRemaining: number; isVip: boolean; useSpin: () => boolean; onCheckout: () => void; daysUntilReset: number; }> = ({ onComplete, spinsRemaining, isVip, useSpin, onCheckout, daysUntilReset }) => {
  const [revealed, setRevealed] = useState<number[]>([]);
  const handleFlip = (index: number) => {
    if (revealed.includes(index)) return;
    if (!useSpin()) return;
    setRevealed(prev => [...prev, index]);
    const challenge = cardChallenges[Math.floor(Math.random() * cardChallenges.length)];
    onComplete({ id: `card-${Date.now()}-${index}`, nome: `CARD REVELADO`, descricao: challenge, timer: 30 });
  };
  const hasNoSpins = !isVip && spinsRemaining <= 0;
  if (hasNoSpins) return (
    <div className="bg-[#0f1525] border-2 border-red-500/20 p-6 rounded-[2.5rem] text-center space-y-3 shadow-2xl">
      <p className="text-white text-[9px] font-black uppercase italic">GIROS DE CARDS ESGOTADOS! RENOVAÇÃO EM {daysUntilReset} DIAS.</p>
      <button onClick={onCheckout} className="w-full py-4 bg-yellow-500 text-black rounded-xl font-black uppercase tracking-widest text-[10px] animate-heartbeat">LIBERAR TUDO AGORA 🚀</button>
    </div>
  );
  return (
    <div className="space-y-10 animate-in slide-in-from-bottom duration-700">
      <div className="bg-[#0f1525] border border-zinc-900 p-4 rounded-[2rem] space-y-2 relative overflow-hidden shadow-xl">
        <div className="flex justify-between items-center px-1">
          <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">PROGRESSO CARDS</span>
          <span className="text-[10px] font-black text-yellow-500 animate-pulse">{revealed.length} / 12</span>
        </div>
        <div className="h-1 bg-black rounded-full overflow-hidden">
          <div className="h-full bg-yellow-500 shadow-[0_0_10px_rgba(251,191,36,0.5)] transition-all duration-1000" style={{ width: `${(revealed.length / 12) * 100}%` }}></div>
        </div>
      </div>
      <h2 className="text-center text-3xl font-black text-white italic uppercase tracking-tighter">CARDS DA SORTE</h2>
      <div className="grid grid-cols-3 gap-4 pb-12 px-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <button key={i} onClick={() => handleFlip(i)} disabled={revealed.includes(i)} className={`aspect-[3/4] rounded-xl border-2 transition-all duration-500 flex items-center justify-center shadow-xl ${revealed.includes(i) ? 'bg-zinc-900 border-zinc-800 opacity-20 scale-90' : 'bg-[#0f1525] border-zinc-900 shadow-yellow-500/5'}`}>
            <span className={`text-3xl ${revealed.includes(i) ? 'grayscale opacity-10' : 'animate-heartbeat'}`}>❤️</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const SlotGame: React.FC<{ onComplete: (item: any) => void; spinsRemaining: number; isVip: boolean; useSpin: () => boolean; onCheckout: () => void; }> = ({ onComplete, spinsRemaining, isVip, useSpin, onCheckout }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<[string, string, string] | null>(null);
  const spin = () => {
    if (isSpinning) return;
    if (!useSpin()) return;
    setIsSpinning(true);
    setResult(null);
    setTimeout(() => {
      const action = slotActions[Math.floor(Math.random() * slotActions.length)];
      const target = slotTargets[Math.floor(Math.random() * slotTargets.length)];
      const intensity = slotIntensities[Math.floor(Math.random() * slotIntensities.length)];
      setResult([action, target, intensity]);
      setIsSpinning(false);
      onComplete({ id: `slot-${Date.now()}`, nome: "COMBO PROIBIDO", descricao: `${action} ${target} ${intensity}`, timer: 30 });
    }, 2000);
  };
  const hasNoSpins = !isVip && spinsRemaining <= 0;
  if (hasNoSpins) return (
    <div className="bg-[#0f1525] border-2 border-red-500/20 p-6 rounded-[2.5rem] text-center space-y-3 shadow-2xl">
      <p className="text-white text-[9px] font-black uppercase italic">SLOT BLOQUEADO PARA TESTE GRÁTIS.</p>
      <button onClick={onCheckout} className="w-full py-4 bg-yellow-500 text-black rounded-xl font-black uppercase tracking-widest text-[10px] animate-heartbeat">LIBERAR ACESSO VIP 🔓</button>
    </div>
  );
  return (
    <div className="bg-[#0f1525] p-6 rounded-[3rem] border-2 border-zinc-900 shadow-2xl space-y-8 py-8 relative overflow-hidden">
      <div className="flex justify-between gap-2 h-32">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex-1 bg-black rounded-xl border-2 border-zinc-800 flex items-center justify-center overflow-hidden relative shadow-inner">
            <div className={`text-[10px] font-black text-center px-1 uppercase italic transition-all duration-300 ${isSpinning ? 'animate-bounce opacity-40' : 'text-yellow-500 shadow-yellow-500/20'}`}>
              {result ? result[i] : '---'}
            </div>
          </div>
        ))}
      </div>
      <button onClick={spin} disabled={isSpinning} className="w-full py-5 bg-gradient-to-br from-pink-600 to-pink-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-[0_6px_0_rgb(157,23,77)] animate-heartbeat disabled:opacity-50">
        {isSpinning ? 'GIRANDO...' : 'SORTEAR COMBO ⚡'}
      </button>
    </div>
  );
};

const Onboarding: React.FC<{ onComplete: (n: string, p: string) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  if (step === 0) return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-8 text-center overflow-hidden z-[300]">
      <div className="relative z-10 space-y-12 animate-in fade-in duration-1000 max-w-sm w-full">
        <div className="w-32 h-32 border-4 border-yellow-500/50 rounded-full flex flex-col items-center justify-center mx-auto bg-black/60 shadow-[0_0_40px_rgba(251,191,36,0.3)] animate-pulse">
          <span className="text-4xl font-black text-white">18+</span>
          <span className="text-[8px] font-black text-yellow-600 uppercase mt-1">ACESSO VIP</span>
        </div>
        <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">LUNA<br/><span className="text-yellow-500">SUTRA</span></h1>
        <button onClick={() => setStep(1)} className="w-full bg-yellow-500 text-black py-5 rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl animate-heartbeat">SOU MAIOR DE IDADE</button>
      </div>
    </div>
  );
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-8 animate-in slide-in-from-right duration-500 z-[300]">
      <div className="w-full max-w-[300px] space-y-10">
        <h2 className="text-3xl font-black text-yellow-500 italic uppercase leading-none text-center">PERFIL CASAL</h2>
        <div className="space-y-6">
          <input value={userName} onChange={e => setUserName(e.target.value)} className="w-full bg-[#0f1525] border-2 border-zinc-900 p-5 rounded-2xl text-white text-lg font-black uppercase outline-none focus:border-yellow-500/50" placeholder="SEU NOME" />
          <input value={partnerName} onChange={e => setPartnerName(e.target.value)} className="w-full bg-[#0f1525] border-2 border-zinc-900 p-5 rounded-2xl text-white text-lg font-black uppercase outline-none focus:border-yellow-500/50" placeholder="NOME DO PAR" />
        </div>
        <button disabled={!userName || !partnerName} onClick={() => onComplete(userName, partnerName)} className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 py-5 rounded-2xl text-lg font-black uppercase text-black disabled:opacity-30">COMEÇAR LUNA 🔒</button>
      </div>
    </div>
  );
};

export default function App() {
  const { state, updateProfile, addCompletion, unlockGame, completeTutorial, useSpin, setVipStatus, getDaysUntilReset } = useGameStore();
  const [activeTab, setActiveTab] = useState<'girar' | 'cards' | 'slot' | 'loja' | 'vip'>('girar');
  const [category, setCategory] = useState<Category>(Category.Warmup);
  const [activeMission, setActiveMission] = useState<any>(null);
  const [missionTimer, setMissionTimer] = useState<number | null>(null);
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [pixCode, setPixCode] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(() => localStorage.getItem('luna_last_payment_id'));
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [lastCoins, setLastCoins] = useState(state.coins);

  useEffect(() => {
    let interval: any;
    if (missionTimer !== null && missionTimer > 0) interval = setInterval(() => setMissionTimer(prev => (prev !== null ? prev - 1 : 0)), 1000);
    else if (missionTimer === 0) clearInterval(interval);
    return () => clearInterval(interval);
  }, [missionTimer]);

  useEffect(() => {
    if (state.coins > lastCoins) { setShowHearts(true); setTimeout(() => setShowHearts(false), 3000); }
    setLastCoins(state.coins);
  }, [state.coins]);

  useEffect(() => {
    const handleFocus = () => { if (paymentId && !state.isVip) handleCheckPayment(); };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [paymentId, state.isVip]);

  const handleCreatePix = async () => {
    if (state.isVip) return;
    setIsGeneratingPix(true);
    try {
      const response = await fetch('/api/create-pix', { method: 'POST' });
      const data = await response.json();
      if (data.pix_code) {
        setPixCode(data.pix_code);
        setPaymentId(data.payment_id);
        localStorage.setItem('luna_last_payment_id', data.payment_id);
      }
    } catch (err) { console.error(err); alert('Erro ao gerar Pix.'); }
    finally { setIsGeneratingPix(false); }
  };

  const handleCheckPayment = async () => {
    if (!paymentId || isCheckingPayment) return;
    setIsCheckingPayment(true);
    try {
      const response = await fetch(`/api/check-payment?id=${paymentId}`);
      const data = await response.json();
      if (data.isApproved) {
        setVipStatus(true);
        setPixCode(null);
        localStorage.removeItem('luna_last_payment_id');
      }
    } catch (err) { console.error(err); }
    finally { setIsCheckingPayment(false); }
  };

  if (!state.isOnboarded) return <ErrorBoundary><Onboarding onComplete={updateProfile} /></ErrorBoundary>;

  const closeMission = () => { setActiveMission(null); setMissionTimer(null); };

  return (
    <ErrorBoundary>
      <div className="h-full w-full flex flex-col bg-black text-white overflow-hidden relative">
        {showHearts && <HeartExplosion />}
        {pixCode && <PixModal pixCode={pixCode} onCheck={handleCheckPayment} isChecking={isCheckingPayment} onClose={() => setPixCode(null)} />}
        
        {isGeneratingPix && (
          <div className="fixed inset-0 z-[400] bg-black/90 flex flex-col items-center justify-center space-y-4 backdrop-blur-md">
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-yellow-500 font-black uppercase tracking-widest text-[9px]">Protegendo sua conexão...</p>
          </div>
        )}

        <header className="px-6 pt-10 pb-4 flex-shrink-0 z-10 border-b border-white/5 bg-black/50 backdrop-blur-lg">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
               <h1 className="text-[8px] font-black text-yellow-500 uppercase tracking-widest opacity-60 leading-none">LUNA SUTRA</h1>
               <p className="text-xl font-black italic uppercase tracking-tighter leading-none">{state.userName} & {state.partnerName}</p>
            </div>
            <div className="flex flex-col items-end space-y-1.5">
              <div className={`bg-[#0f1525] px-3 py-1.5 rounded-xl border border-zinc-800 flex items-center space-x-1.5 shadow-xl ${showHearts ? 'animate-coin-pop' : ''}`}>
                <span className="text-lg font-black text-yellow-500">{state.coins}</span>
                <span className="text-base animate-pulse">🪙</span>
              </div>
              {state.isVip && <span className="text-[7px] font-black bg-yellow-500 text-black px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse shadow-lg shadow-yellow-500/20">VIP ATIVO</span>}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar touch-pan-y relative px-4 pb-32 animate-in fade-in duration-700">
          {activeTab === 'girar' && (
            <div className="py-2 space-y-6 flex flex-col items-center max-w-[340px] mx-auto">
               <div className="w-full flex bg-[#0f1525] p-1.5 rounded-[1.5rem] border border-zinc-800/50 shadow-2xl overflow-hidden">
                {Object.values(Category).map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`flex-1 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${category === cat ? 'bg-yellow-500 text-black scale-105 shadow-md' : 'text-zinc-500 hover:text-white/60'}`}>{cat}</button>
                ))}
              </div>
              <Wheel category={category} history={state.history} onComplete={(item) => setActiveMission({...item, reward: 20, timer: 35})} spinsRemaining={state.spins.wheel} isVip={state.isVip} onSpinUsed={() => useSpin('wheel')} onCheckout={handleCreatePix} daysUntilReset={getDaysUntilReset()} />
              <DiceGame spinsRemaining={state.spins.dice} isVip={state.isVip} useSpin={() => useSpin('dice')} onCheckout={handleCreatePix} onComplete={(reward) => addCompletion('dice-turn-' + Date.now(), reward)} daysUntilReset={getDaysUntilReset()} />
            </div>
          )}

          {activeTab === 'cards' && <div className="max-w-[340px] mx-auto py-2"><CardsGame onComplete={(item) => setActiveMission({...item, reward: 10, timer: 30})} spinsRemaining={state.spins.cards} isVip={state.isVip} useSpin={() => useSpin('cards')} onCheckout={handleCreatePix} daysUntilReset={getDaysUntilReset()} /></div>}
          {activeTab === 'slot' && <div className="max-w-[340px] mx-auto py-2"><SlotGame onComplete={(item) => setActiveMission({...item, reward: 10, timer: 30})} spinsRemaining={state.spins.slots} isVip={state.isVip} useSpin={() => useSpin('slots')} onCheckout={handleCreatePix} /></div>}
          {activeTab === 'loja' && <div className="max-w-[340px] mx-auto"><Store state={state} onUnlock={unlockGame} /></div>}
          {activeTab === 'vip' && (
            <div className="px-4 py-8 space-y-8 text-center max-w-[300px] mx-auto animate-in slide-in-from-bottom">
               {state.isVip ? (
                 <div className="space-y-6">
                    <div className="relative bg-gradient-to-br from-yellow-600 via-yellow-400 to-yellow-600 p-8 rounded-[3rem] shadow-[0_0_40px_rgba(251,191,36,0.3)] border-2 border-white/20 group">
                      <div className="absolute top-4 right-6 text-black/20 text-4xl font-black italic">VIP</div>
                      <div className="text-left space-y-4">
                        <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center text-xl">🏆</div>
                        <div className="space-y-0.5">
                          <p className="text-black/60 text-[8px] font-black uppercase tracking-widest">MEMBRO VITALÍCIO</p>
                          <p className="text-black text-lg font-black italic uppercase leading-tight">{state.userName} & {state.partnerName}</p>
                        </div>
                        <div className="pt-4 flex justify-between items-end">
                           <span className="text-black/40 text-[7px] font-bold">LUNA SUTRA CLUB PREMIUM</span>
                           <span className="text-black text-xs font-black">2024-2025</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-white font-black uppercase tracking-widest text-sm italic">BEM-VINDO AO CLUBE!</h3>
                       <p className="text-zinc-500 text-[10px] font-bold">Você tem acesso ilimitado a todos os jogos e giros extras para sempre.</p>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-6">
                    <div className="text-6xl animate-bounce">🏆</div>
                    <h2 className="text-3xl font-black text-yellow-500 uppercase italic tracking-tighter">Área VIP Luna</h2>
                    <div className="bg-[#0f1525] p-8 rounded-[2.5rem] border-4 border-yellow-500/30 space-y-6 relative overflow-hidden shadow-2xl">
                       <div className="text-white text-4xl font-black animate-pulse">R$ 0,01</div>
                       <button onClick={handleCreatePix} className="w-full py-5 bg-yellow-500 text-black rounded-2xl font-black uppercase tracking-widest text-lg shadow-[0_6px_0_rgb(161,98,7)] animate-heartbeat">LIBERAR AGORA 🔒</button>
                    </div>
                 </div>
               )}
            </div>
          )}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-2xl border-t border-white/5 px-4 py-4 flex justify-around items-center z-50 rounded-t-[2.5rem] shadow-2xl pb-[calc(1rem+env(safe-area-inset-bottom))]">
          {[
            { id: 'girar', label: 'LUNA', icon: '🎰' },
            { id: 'cards', label: 'CARDS', icon: '🎴' },
            { id: 'slot', label: 'SLOT', icon: '⚡' },
            { id: 'loja', label: 'LOJA', icon: '👜' },
            { id: 'vip', label: 'VIP', icon: '🏆' }
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className="flex flex-col items-center space-y-1 outline-none flex-1">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-500 ${activeTab === item.id ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 -translate-y-2 scale-110' : 'text-zinc-600 opacity-60'}`}>{item.icon}</div>
              <span className={`text-[7px] font-black tracking-widest ${activeTab === item.id ? 'text-yellow-500' : 'opacity-30'}`}>{item.label}</span>
            </button>
          ))}
        </nav>

        {activeMission && (
          <div className="fixed inset-0 z-[250] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-500">
             <div className="bg-[#0f1525] border-2 border-yellow-500/20 w-full max-w-[300px] rounded-[3rem] text-center p-8 space-y-6 relative shadow-[0_0_100px_rgba(251,191,36,0.1)]">
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-tight">{activeMission.nome}</h2>
                <div className="p-5 bg-black/60 rounded-[2rem] border border-zinc-900 shadow-inner">
                  <p className="text-lg text-white font-black italic">"{activeMission.descricao}"</p>
                </div>
                {missionTimer !== null && <div className="text-5xl font-black text-yellow-500 font-mono animate-pulse">00:{missionTimer < 10 ? `0${missionTimer}` : missionTimer}</div>}
                <div className="flex flex-col space-y-4">
                  <button onClick={() => { if (missionTimer === null) setMissionTimer(activeMission.timer || 30); else { addCompletion(activeMission.id, activeMission.reward); closeMission(); } }} disabled={missionTimer !== null && missionTimer > 0} className="w-full py-5 font-black rounded-2xl uppercase tracking-widest text-lg bg-yellow-500 text-black shadow-[0_6px_0_rgb(161,98,7)] animate-heartbeat disabled:opacity-50">
                    {missionTimer === null ? 'INICIAR AGORA ⏳' : missionTimer === 0 ? `CONCLUÍDO! (+${activeMission.reward})` : 'AGUARDE...'}
                  </button>
                  <button onClick={closeMission} disabled={missionTimer !== null && missionTimer > 0} className="text-zinc-600 font-black uppercase text-[9px] tracking-widest">✕ FECHAR</button>
                </div>
             </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
