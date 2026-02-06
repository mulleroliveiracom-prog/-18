import React, { useState, useEffect, ReactNode, ErrorInfo, Component } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Category, GameItem } from './types';
import { useGameStore } from './hooks/useGameStore';
import { Wheel } from './components/Wheel';
import { Store } from './components/Store';
import { cardChallenges, slotActions, slotTargets, slotIntensities } from './data/content';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Fix: Extending Component directly from react to ensure state and props are correctly typed
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    // Fix: state is correctly recognized as a property of the class
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Luna Crash Log:", error, errorInfo);
  }

  render() {
    // Fix: state property access is now correctly recognized
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-8 text-center">
          <div className="text-6xl mb-4 text-red-600">⚠️</div>
          <h2 className="text-2xl font-black text-white uppercase mb-4">Ops! Algo deu errado.</h2>
          <p className="text-zinc-500 text-sm mb-8">Ocorreu um erro inesperado. Tente recarregar o aplicativo.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest"
          >
            RECARREGAR LUNA
          </button>
        </div>
      );
    }
    // Fix: props property access is now correctly recognized
    return this.props.children;
  }
}

const PixModal: React.FC<{ pixCode: string; onClose: () => void }> = ({ pixCode, onClose }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
      <div className="bg-[#0f1525] border-4 border-yellow-400/60 w-full max-w-[340px] rounded-[3rem] p-8 text-center space-y-6 shadow-[0_0_50px_rgba(251,191,36,0.3)] ring-2 ring-yellow-500/20">
        <div className="space-y-1">
          <div className="text-4xl mb-2">🏆</div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">ACESSO VITALÍCIO</h2>
          <p className="text-yellow-500 text-[9px] font-black uppercase tracking-[0.3em]">OFERTA LIMITADA VIP</p>
        </div>

        {/* QR Code Section */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-3xl inline-block shadow-2xl transform hover:scale-105 transition-transform duration-500">
            <QRCodeSVG 
              value={pixCode} 
              size={180} 
              level="M" 
              includeMargin={false}
              className="mx-auto"
            />
          </div>
          <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
            Aponte a câmera ou use o código abaixo
          </p>
        </div>

        {/* Textarea Section */}
        <div className="space-y-4">
          <div className="relative group">
            <textarea 
              readOnly 
              value={pixCode} 
              className="w-full bg-black/60 border-2 border-zinc-800 p-4 rounded-2xl text-[9px] text-zinc-500 font-mono h-20 resize-none focus:outline-none transition-colors group-hover:border-yellow-500/30"
            />
            <button 
              onClick={copyToClipboard}
              className={`absolute bottom-2 right-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                copied ? 'bg-green-600 text-white' : 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-lg'
              }`}
            >
              {copied ? 'COPIADO! ✅' : 'COPIAR CÓDIGO'}
            </button>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-center space-x-3 text-white font-black">
            <span className="text-xs text-zinc-500 font-normal line-through">R$ 97,00</span>
            <span className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-yellow-500 to-yellow-200 animate-pulse">R$ 0,01</span>
          </div>
          <button 
            onClick={onClose}
            className="w-full py-2 text-zinc-600 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors"
          >
            VOLTAR AO LUNA
          </button>
        </div>
      </div>
    </div>
  );
};

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
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-8 text-center overflow-hidden z-[300]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a2333_0%,_#000000_100%)] opacity-50"></div>
        <div className="relative z-10 space-y-12 animate-in fade-in duration-1000 max-w-sm">
          <div className="w-48 h-48 border-[10px] border-yellow-600/50 rounded-full flex flex-col items-center justify-center mx-auto bg-black/60 shadow-[0_0_60px_rgba(202,138,4,0.3)] animate-pulse">
            <span className="text-6xl font-black text-white">18+</span>
            <span className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.3em] mt-2 text-center">ACESSO<br/>RESTRITO</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">LUNA<br/><span className="text-yellow-500">SUTRA</span></h1>
            <p className="text-zinc-400 font-bold uppercase tracking-[0.3em] text-[10px]">O CLIMAX DO SEU RELACIONAMENTO</p>
          </div>
          <button onClick={() => setStep(1)} className="w-full bg-yellow-500 text-black py-6 rounded-[2rem] text-xl font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(255,255,255,0.05)] active:scale-95 transition-all">SOU MAIOR DE IDADE</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-8 animate-in slide-in-from-right duration-500 z-[300]">
      <div className="w-full max-w-sm space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-black text-yellow-500 italic uppercase leading-none tracking-tighter">PERFIL VIP</h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">QUEM VAI EXPLORAR O LUNA?</p>
        </div>
        <div className="space-y-8">
          <div className="relative">
            <input value={userName} onChange={e => setUserName(e.target.value)} className="w-full bg-[#0f1525] border-4 border-zinc-900 p-6 rounded-[2rem] text-white outline-none focus:border-yellow-500 transition-all text-xl font-black uppercase italic" placeholder="SEU NOME" />
            <span className="absolute -top-3 left-6 bg-black px-2 text-zinc-600 text-[9px] font-black uppercase tracking-widest">JOGADOR 1</span>
          </div>
          <div className="relative">
            <input value={partnerName} onChange={e => setPartnerName(e.target.value)} className="w-full bg-[#0f1525] border-4 border-zinc-900 p-6 rounded-[2rem] text-white outline-none focus:border-yellow-500 transition-all text-xl font-black uppercase italic" placeholder="NOME DO PAR" />
            <span className="absolute -top-3 left-6 bg-black px-2 text-zinc-600 text-[9px] font-black uppercase tracking-widest">JOGADOR 2</span>
          </div>
        </div>
        <button disabled={!userName || !partnerName} onClick={() => onComplete(userName, partnerName)} className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 disabled:opacity-20 py-6 rounded-[2rem] text-xl font-black uppercase text-black shadow-xl transform active:scale-95">COMEÇAR AGORA 🔒</button>
      </div>
    </div>
  );
};

const CardsGame = ({ onComplete, spinsRemaining, isVip, useSpin, onCheckout }: { onComplete: (item: any) => void, spinsRemaining: number, isVip: boolean, useSpin: () => boolean, onCheckout: () => void }) => {
  const [flipped, setFlipped] = useState<number[]>([]);
  
  if (!isVip && spinsRemaining <= 0) return (
    <div className="px-6 py-8 bg-[#0f1525] rounded-[3rem] border-4 border-red-500/30 text-center space-y-6 mx-4 animate-in zoom-in">
      <div className="text-5xl">🔒</div>
      <h3 className="text-2xl font-black text-white uppercase italic">Limite Atingido!</h3>
      <p className="text-zinc-400 text-xs font-bold leading-relaxed">Libere acesso TOTAL e VITALÍCIO agora por apenas R$ 0,01.</p>
      <button onClick={onCheckout} className="w-full py-5 bg-yellow-500 text-black rounded-2xl font-black uppercase tracking-widest text-sm">LIBERAR ACESSO VITALÍCIO 🚀</button>
    </div>
  );

  return (
    <div className="px-6 py-8 space-y-10 animate-in slide-in-from-bottom duration-500 text-center">
      <div className="space-y-2">
        <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter leading-none">CARDS DA<br/>SORTE</h2>
        <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest">{isVip ? 'Giros Ilimitados VIP' : `Giros Restantes: ${spinsRemaining}`}</p>
      </div>
      <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
        {Array.from({ length: 12 }).map((_, i) => (
          <div 
            key={i} 
            onClick={() => {
              if(!flipped.includes(i) && useSpin()) {
                setFlipped([...flipped, i]);
                const challenge = cardChallenges[Math.floor(Math.random() * cardChallenges.length)];
                onComplete({ nome: "CARD REVELADO", descricao: challenge, categoria: 'Cards', id: `card-${i}-${Date.now()}` });
              }
            }}
            className="aspect-[3/4] bg-[#0f1525] border-2 border-zinc-900 rounded-2xl flex items-center justify-center cursor-pointer active:scale-90 transition-all group overflow-hidden shadow-lg"
          >
            {flipped.includes(i) ? <span className="text-3xl">🔥</span> : <span className="text-yellow-500 text-4xl">❤️</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

const SlotGame = ({ onComplete, spinsRemaining, isVip, useSpin, onCheckout }: { onComplete: (item: any) => void, spinsRemaining: number, isVip: boolean, useSpin: () => boolean, onCheckout: () => void }) => {
  const [spinning, setSpinning] = useState(false);
  const [cols, setCols] = useState(["🔥", "🔞", "😈"]);

  if (!isVip && spinsRemaining <= 0) return (
    <div className="px-6 py-8 bg-[#0f1525] rounded-[3rem] border-4 border-red-500/30 text-center space-y-6 mx-4 animate-in zoom-in">
      <div className="text-5xl">🔒</div>
      <h3 className="text-2xl font-black text-white uppercase italic">Limite Atingido!</h3>
      <button onClick={onCheckout} className="w-full py-5 bg-yellow-500 text-black rounded-2xl font-black uppercase tracking-widest text-sm">LIBERAR ACESSO VITALÍCIO 🚀</button>
    </div>
  );

  const spin = () => {
    if (spinning || !useSpin()) return;
    setSpinning(true);
    const interval = setInterval(() => {
      setCols([slotActions[Math.floor(Math.random() * slotActions.length)], slotTargets[Math.floor(Math.random() * slotTargets.length)], slotIntensities[Math.floor(Math.random() * slotIntensities.length)]]);
    }, 100);
    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
      const a = slotActions[Math.floor(Math.random() * slotActions.length)];
      const t = slotTargets[Math.floor(Math.random() * slotTargets.length)];
      const i = slotIntensities[Math.floor(Math.random() * slotIntensities.length)];
      setCols([a, t, i]);
      onComplete({ id: 'slot-res-' + Date.now(), nome: "COMBINAÇÃO PROIBIDA", descricao: `${a} ${t} ${i}!`, categoria: 'Slot' });
    }, 2000);
  };

  return (
    <div className="px-6 py-8 space-y-12 text-center animate-in zoom-in duration-700">
      <div className="space-y-2">
        <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-none">SLOT<br/>PROIBIDO</h2>
        <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">{isVip ? 'Giros Ilimitados VIP' : `Giros Restantes: ${spinsRemaining}`}</p>
      </div>
      <div className="bg-[#0f1525] p-6 rounded-[3rem] border-8 border-zinc-950 flex space-x-3 max-w-sm mx-auto shadow-2xl">
         {cols.map((val, i) => (
           <div key={i} className="flex-1 aspect-[1/2] bg-zinc-950 rounded-2xl border-2 border-zinc-900 flex items-center justify-center p-2 text-center text-xs font-black text-yellow-500 italic uppercase leading-tight">{val}</div>
         ))}
      </div>
      <button onClick={spin} disabled={spinning} className="px-12 py-6 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-[2rem] font-black text-2xl uppercase tracking-widest text-black shadow-xl disabled:opacity-50 active:scale-95 transition-all">⚡ PUXAR</button>
    </div>
  );
};

export default function App() {
  const { state, updateProfile, addCompletion, unlockGame, completeTutorial, useSpin, setVipStatus } = useGameStore();
  const [activeTab, setActiveTab] = useState<'girar' | 'cards' | 'slot' | 'loja' | 'vip'>('girar');
  const [category, setCategory] = useState<Category>(Category.Warmup);
  const [activeMission, setActiveMission] = useState<any>(null);
  const [missionTimer, setMissionTimer] = useState<number | null>(null);
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [pixCode, setPixCode] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (missionTimer !== null && missionTimer > 0) {
      interval = setInterval(() => setMissionTimer(prev => (prev !== null ? prev - 1 : 0)), 1000);
    } else if (missionTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [missionTimer]);

  const handleCreatePix = async () => {
    setIsGeneratingPix(true);
    try {
      const response = await fetch('/api/create-pix', { method: 'POST' });
      const data = await response.json();
      if (data.pix_code) {
        setPixCode(data.pix_code);
      } else {
        alert('Erro ao gerar Pix. Tente novamente.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão com o servidor de pagamentos.');
    } finally {
      setIsGeneratingPix(false);
    }
  };

  if (!state.isOnboarded) return <ErrorBoundary><Onboarding onComplete={updateProfile} /></ErrorBoundary>;

  const tutorialContent = {
    girar: { title: "ROLETA LUNA", icon: "🎰", description: "1. Escolha a intensidade.\n2. Clique em GIRAR.\n3. Realize a missão por 35 segundos.\n4. Ganhe 20 moedas!" },
    cards: { title: "CARDS DA SORTE", icon: "🎴", description: "Revele cards e ganhe 10 moedas!" },
    slot: { title: "SLOT PROIBIDO", icon: "⚡", description: "Puxe a alavanca para combinações picantes!" }
  };

  const closeMission = () => { setActiveMission(null); setMissionTimer(null); };

  return (
    <ErrorBoundary>
      <div className="h-full w-full flex flex-col bg-black text-white overflow-hidden relative">
        
        {pixCode && <PixModal pixCode={pixCode} onClose={() => setPixCode(null)} />}
        
        {isGeneratingPix && (
          <div className="fixed inset-0 z-[400] bg-black/80 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-yellow-500 font-black uppercase tracking-widest text-xs">Gerando Pix Seguro...</p>
          </div>
        )}

        {activeTab === 'girar' && !state.tutorialsCompleted.includes('girar') && (
          <TutorialOverlay {...tutorialContent.girar} onClose={() => completeTutorial('girar')} />
        )}

        <header className="px-8 pt-10 pb-4 flex-shrink-0 z-10 bg-black/50 backdrop-blur-sm">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
               <h1 className="text-[10px] font-black tracking-[0.4em] text-yellow-500 uppercase opacity-60">LUNA CLUB</h1>
               <p className="text-2xl font-black italic tracking-tighter uppercase leading-none">{state.userName} <span className="text-yellow-500">&</span> {state.partnerName}</p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div className="bg-[#0f1525] px-4 py-2 rounded-2xl border-2 border-zinc-950 flex items-center space-x-2 shadow-lg">
                <span className="text-xl font-black text-yellow-500">{state.coins}</span>
                <span className="text-base animate-pulse">🪙</span>
              </div>
              {state.isVip && <span className="text-[8px] font-black bg-yellow-500 text-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">VIP ATIVO</span>}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar touch-pan-y relative px-4 pb-40">
          {activeTab === 'girar' && (
            <div className="py-6 space-y-8 flex flex-col items-center max-w-sm mx-auto">
               <div className="w-full flex bg-[#0f1525] p-2 rounded-[2rem] border-2 border-zinc-950 shadow-xl">
                {Object.values(Category).map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`flex-1 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.1em] transition-all ${category === cat ? 'bg-yellow-500 text-black shadow-md' : 'text-zinc-600'}`}>{cat}</button>
                ))}
              </div>
              <Wheel 
                category={category} 
                history={state.history} 
                onComplete={(item) => addCompletion(item.id)} 
                spinsRemaining={state.spins.wheel} 
                isVip={state.isVip} 
                onSpinUsed={() => useSpin('wheel')} 
                onCheckout={handleCreatePix} 
              />
            </div>
          )}

          {activeTab === 'cards' && <CardsGame onComplete={(item) => setActiveMission({...item, reward: 10})} spinsRemaining={state.spins.cards} isVip={state.isVip} useSpin={() => useSpin('cards')} onCheckout={handleCreatePix} />}
          {activeTab === 'slot' && <SlotGame onComplete={(item) => setActiveMission({...item, reward: 10})} spinsRemaining={state.spins.slots} isVip={state.isVip} useSpin={() => useSpin('slots')} onCheckout={handleCreatePix} />}
          {activeTab === 'loja' && <Store state={state} onUnlock={unlockGame} />}
          {activeTab === 'vip' && (
            <div className="px-4 py-12 space-y-12 text-center animate-in slide-in-from-bottom max-w-sm mx-auto">
               <div className="text-8xl mb-6">🏆</div>
               <h2 className="text-4xl font-black text-yellow-500 uppercase italic tracking-tighter leading-none">Área VIP Luna</h2>
               <div className="bg-[#0f1525] p-10 rounded-[3rem] border-4 border-yellow-500/20 space-y-8 shadow-2xl">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">OFERTA PIX VITALÍCIA</span>
                    <div className="text-white text-5xl font-black">R$ 0,01</div>
                  </div>
                  <button onClick={handleCreatePix} className="w-full py-6 bg-yellow-500 text-black rounded-2xl font-black uppercase tracking-widest text-xl shadow-[0_8px_0_rgb(161,98,7)] active:scale-95 active:shadow-none transition-all">LIBERAR AGORA 🔒</button>
               </div>
            </div>
          )}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t-4 border-zinc-950 px-6 py-6 flex justify-around items-center z-50 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          {[
            { id: 'girar', label: 'LUNA', icon: '🎰' },
            { id: 'cards', label: 'CARDS', icon: '🎴' },
            { id: 'slot', label: 'SLOT', icon: '⚡' },
            { id: 'loja', label: 'LOJA', icon: '👜' },
            { id: 'vip', label: 'VIP', icon: '🏆' }
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className="flex flex-col items-center space-y-2 relative outline-none">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${activeTab === item.id ? 'bg-yellow-500 text-black shadow-lg -translate-y-3' : 'text-zinc-600'}`}>{item.icon}</div>
              <span className={`text-[8px] font-black tracking-widest transition-all ${activeTab === item.id ? 'text-yellow-500 opacity-100' : 'opacity-30'}`}>{item.label}</span>
            </button>
          ))}
        </nav>

        {activeMission && (
          <div className="fixed inset-0 z-[250] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-300">
             <div className="bg-[#0f1525] border-6 border-yellow-500/20 w-full max-w-[340px] rounded-[3rem] overflow-hidden shadow-2xl text-center p-10 space-y-8">
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-tight">{activeMission.nome}</h2>
                <div className="p-6 bg-black/80 rounded-[2rem] border-2 border-zinc-900">
                  <p className="text-2xl text-white font-black leading-tight italic">"{activeMission.descricao}"</p>
                </div>
                {missionTimer !== null && (
                  <div className="text-6xl font-black text-yellow-500 font-mono">00:{missionTimer < 10 ? `0${missionTimer}` : missionTimer}</div>
                )}
                <div className="flex flex-col space-y-4">
                  <button onClick={() => { if (missionTimer === null) setMissionTimer(30); else { addCompletion(activeMission.id, activeMission.reward); closeMission(); } }} disabled={missionTimer !== null && missionTimer > 0} className="w-full py-6 font-black rounded-2xl uppercase tracking-widest text-xl bg-yellow-500 text-black shadow-xl active:scale-95 transition-all disabled:opacity-50">
                    {missionTimer === null ? 'COMEÇAR AGORA ⏳' : missionTimer === 0 ? `CONCLUÍDO! (+${activeMission.reward})` : 'AGUARDE...'}
                  </button>
                  <button onClick={closeMission} disabled={missionTimer !== null && missionTimer > 0} className="text-zinc-600 font-black uppercase text-[9px] tracking-[0.3em]">✕ FECHAR</button>
                </div>
             </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
