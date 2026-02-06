
import React, { useState, useEffect, ReactNode, ErrorInfo, Component } from 'react';
import { Category, GameItem } from './types';
import { useGameStore } from './hooks/useGameStore';
import { Wheel } from './components/Wheel';
import { Store } from './components/Store';
import { DiceGame } from './components/DiceGame';
import { cardChallenges, slotActions, slotTargets, slotIntensities } from './data/content';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Fix: Use the named 'Component' import and ensure proper generic typing for state and props.
// This resolves "Property 'state' does not exist" and "Property 'props' does not exist" errors.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Luna Crash Log:", error, errorInfo);
  }

  render() {
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
    return this.props.children;
  }
}

// Componente de Explosão de Corações
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
        <div 
          key={h.id} 
          className="particle-heart"
          style={{ left: h.left, fontSize: h.size, animationDelay: h.delay }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
};

const PixModal: React.FC<{ pixCode: string; onClose: () => void }> = ({ pixCode, onClose }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixCode)}`;

  return (
    <div className="fixed inset-0 z-[300] bg-black/98 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="bg-[#0f1525] border-4 border-yellow-400 animate-glow-gold w-full max-w-[340px] rounded-[3.5rem] p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full animate-shimmer pointer-events-none"></div>
        <div className="space-y-1 relative z-10">
          <div className="text-4xl mb-2 animate-bounce">🏆</div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">ACESSO VITALÍCIO</h2>
          <p className="text-yellow-500 text-[9px] font-black uppercase tracking-[0.3em]">OFERTA LIMITADA VIP</p>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="bg-white p-4 rounded-3xl inline-block shadow-[0_0_20px_rgba(251,191,36,0.3)] transform hover:scale-105 transition-transform duration-500 overflow-hidden">
            <img 
              src={qrCodeUrl} 
              alt="QR Code Pix" 
              className="w-[180px] h-[180px] mx-auto block"
              loading="lazy"
            />
          </div>
          <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
            Aponte a câmera ou use o código abaixo
          </p>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="relative group">
            <textarea 
              readOnly 
              value={pixCode} 
              className="w-full bg-black/60 border-2 border-zinc-800 p-4 rounded-2xl text-[9px] text-zinc-500 font-mono h-20 resize-none focus:outline-none transition-colors group-hover:border-yellow-500/30"
            />
            <button 
              onClick={copyToClipboard}
              className={`absolute bottom-2 right-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all animate-heartbeat ${
                copied ? 'bg-green-600 text-white' : 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-lg'
              }`}
            >
              {copied ? 'COPIADO! ✅' : 'COPIAR CÓDIGO'}
            </button>
          </div>
        </div>

        <div className="space-y-4 pt-2 relative z-10">
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
  <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
    <div className="bg-[#121826] border-2 border-yellow-500/30 w-full max-w-[320px] rounded-[3rem] p-8 text-center space-y-6 shadow-2xl relative">
      <div className="text-6xl mb-2 flex justify-center animate-bounce">{icon}</div>
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">COMO JOGAR?</h2>
        <p className="text-yellow-500 font-black text-sm tracking-widest uppercase">{title}</p>
        <div className="w-12 h-1 bg-pink-600 mx-auto rounded-full mt-2"></div>
      </div>
      <div className="bg-[#0a0f1a] p-5 rounded-2xl border border-white/5">
        <div className="text-zinc-200 text-[11px] leading-relaxed font-bold italic space-y-3 text-left">
          {description.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        <button onClick={onClose} className="w-full bg-green-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_4px_0_rgb(21,128,61)] animate-heartbeat active:translate-y-1 active:shadow-none transition-all">ENTENDI! ✅</button>
        <button onClick={onClose} className="text-zinc-600 font-black uppercase text-[9px] tracking-widest hover:text-white transition-colors">Pular Explicação</button>
      </div>
    </div>
  </div>
);

const CardsGame: React.FC<{ 
  onComplete: (item: any) => void; 
  spinsRemaining: number; 
  isVip: boolean; 
  useSpin: () => boolean; 
  onCheckout: () => void; 
 }> = ({ onComplete, spinsRemaining, isVip, useSpin, onCheckout }) => {
  const [revealed, setRevealed] = useState<number[]>([]);

  const handleFlip = (index: number) => {
    if (revealed.includes(index)) return;
    if (!useSpin()) return;

    setRevealed(prev => [...prev, index]);
    const challenge = cardChallenges[Math.floor(Math.random() * cardChallenges.length)];
    onComplete({
      id: `card-${Date.now()}-${index}`,
      nome: `CARD REVELADO`,
      descricao: challenge,
      timer: 30
    });
  };

  const hasNoSpins = !isVip && spinsRemaining <= 0;

  if (hasNoSpins) {
    return (
      <div className="bg-[#0f1525] border border-red-500/30 p-8 rounded-[3rem] text-center space-y-4 animate-in zoom-in shadow-2xl">
        <p className="text-white text-xs font-black uppercase italic">Giros de cartas esgotados!</p>
        <button onClick={onCheckout} className="w-full py-5 bg-yellow-500 text-black rounded-2xl font-black uppercase tracking-widest text-[11px] animate-heartbeat shadow-lg">LIBERAR TUDO AGORA 🚀</button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom duration-700">
      <div className="bg-[#0f1525] border border-zinc-900 p-5 rounded-[2.5rem] space-y-3 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full animate-shimmer opacity-10 pointer-events-none"></div>
        <div className="flex justify-between items-center px-2">
          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">CONEXÃO</span>
          <span className="text-[11px] font-black text-yellow-500 animate-pulse">{revealed.length % 6} / 5</span>
        </div>
        <div className="h-1.5 bg-black rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-1000 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
            style={{ width: `${((revealed.length % 6) / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      <h2 className="text-center text-4xl font-black text-white italic uppercase tracking-tighter leading-none drop-shadow-[0_4px_10px_rgba(0,0,0,1)]">CARDS DA<br/>SORTE</h2>

      <div className="grid grid-cols-3 gap-5 pb-12 px-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleFlip(i)}
            disabled={revealed.includes(i)}
            className={`aspect-[3/4] rounded-2xl border-2 transition-all duration-500 flex items-center justify-center shadow-2xl transform active:scale-90 ${
              revealed.includes(i) 
                ? 'bg-zinc-900 border-zinc-800 opacity-20 scale-90' 
                : 'bg-[#0f1525] border-zinc-900 hover:border-yellow-500/30'
            }`}
          >
            <span className={`text-4xl transition-all duration-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.7)] ${revealed.includes(i) ? 'grayscale opacity-10' : 'animate-heartbeat'}`}>
              ❤️
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

const SlotGame: React.FC<{ 
  onComplete: (item: any) => void; 
  spinsRemaining: number; 
  isVip: boolean; 
  useSpin: () => boolean; 
  onCheckout: () => void; 
}> = ({ onComplete, spinsRemaining, isVip, useSpin, onCheckout }) => {
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
      
      onComplete({
        id: `slot-${Date.now()}`,
        nome: "COMBO PROIBIDO",
        descricao: `${action} ${target} ${intensity}`,
        timer: 30
      });
    }, 2000);
  };

  const hasNoSpins = !isVip && spinsRemaining <= 0;

  if (hasNoSpins) {
    return (
      <div className="bg-[#0f1525] border border-red-500/30 p-8 rounded-[3rem] text-center space-y-4 animate-in zoom-in shadow-2xl">
        <p className="text-white text-xs font-black uppercase italic">Giros de slot esgotados!</p>
        <button onClick={onCheckout} className="w-full py-5 bg-yellow-500 text-black rounded-2xl font-black uppercase tracking-widest text-[11px] animate-heartbeat shadow-lg">LIBERAR TUDO AGORA 🚀</button>
      </div>
    );
  }

  return (
    <div className="bg-[#0f1525] p-8 rounded-[3.5rem] border-2 border-zinc-900 shadow-2xl space-y-10 animate-in zoom-in py-10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full animate-shimmer opacity-5 pointer-events-none"></div>
      <div className="flex justify-between gap-3 h-40">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex-1 bg-black rounded-2xl border-2 border-zinc-800 flex items-center justify-center overflow-hidden relative shadow-inner">
            <div className={`text-[11px] font-black text-center px-1 uppercase italic transition-all duration-300 ${isSpinning ? 'animate-bounce opacity-40' : 'text-yellow-500'}`}>
              {result ? result[i] : '---'}
            </div>
            {isSpinning && <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80 animate-pulse"></div>}
          </div>
        ))}
      </div>
      <button 
        onClick={spin} 
        disabled={isSpinning}
        className="w-full py-6 bg-gradient-to-br from-pink-600 to-pink-500 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-[0_6px_0_rgb(157,23,77)] animate-heartbeat active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
      >
        {isSpinning ? 'SORTEANDO...' : 'PUXAR ALAVANCA ⚡'}
      </button>
    </div>
  );
};

const Onboarding: React.FC<{ onComplete: (n: string, p: string) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState('');
  const [partnerName, setPartnerName] = useState('');

  if (step === 0) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-8 text-center overflow-hidden z-[300]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a2333_0%,_#000000_100%)] opacity-50"></div>
        <div className="relative z-10 space-y-12 animate-in fade-in duration-1000 max-w-sm w-full">
          <div className="w-40 h-40 border-[8px] border-yellow-600/50 rounded-full flex flex-col items-center justify-center mx-auto bg-black/60 shadow-[0_0_80px_rgba(202,138,4,0.4)] animate-pulse">
            <span className="text-5xl font-black text-white">18+</span>
            <span className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.3em] mt-2 text-center">ACESSO<br/>RESTRITO</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none drop-shadow-2xl">LUNA<br/><span className="text-yellow-500">SUTRA</span></h1>
            <p className="text-zinc-400 font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">O CLIMAX DO SEU RELACIONAMENTO</p>
          </div>
          <button onClick={() => setStep(1)} className="w-full bg-yellow-500 text-black py-6 rounded-[2.5rem] text-xl font-black uppercase tracking-[0.2em] shadow-xl animate-heartbeat active:scale-95 transition-all">SOU MAIOR DE IDADE</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-8 animate-in slide-in-from-right duration-500 z-[300]">
      <div className="w-full max-w-[320px] space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-black text-yellow-500 italic uppercase leading-none tracking-tighter">PERFIL VIP</h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">QUEM VAI EXPLORAR O LUNA?</p>
        </div>
        <div className="space-y-8">
          <div className="relative group">
            <input value={userName} onChange={e => setUserName(e.target.value)} className="w-full bg-[#0f1525] border-2 border-zinc-900 p-6 rounded-3xl text-white outline-none focus:border-yellow-500 transition-all text-xl font-black uppercase italic" placeholder="SEU NOME" />
            <span className="absolute -top-3 left-6 bg-black px-2 text-zinc-600 text-[10px] font-black uppercase tracking-widest group-focus-within:text-yellow-500">JOGADOR 1</span>
          </div>
          <div className="relative group">
            <input value={partnerName} onChange={e => setPartnerName(e.target.value)} className="w-full bg-[#0f1525] border-2 border-zinc-900 p-6 rounded-3xl text-white outline-none focus:border-yellow-500 transition-all text-xl font-black uppercase italic" placeholder="NOME DO PAR" />
            <span className="absolute -top-3 left-6 bg-black px-2 text-zinc-600 text-[10px] font-black uppercase tracking-widest group-focus-within:text-yellow-500">JOGADOR 2</span>
          </div>
        </div>
        <button disabled={!userName || !partnerName} onClick={() => onComplete(userName, partnerName)} className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 disabled:opacity-20 py-6 rounded-[2.5rem] text-xl font-black uppercase text-black shadow-2xl animate-shimmer active:scale-95 transition-all">COMEÇAR AGORA 🔒</button>
      </div>
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
  const [showHearts, setShowHearts] = useState(false);
  const [lastCoins, setLastCoins] = useState(state.coins);

  useEffect(() => {
    let interval: any;
    if (missionTimer !== null && missionTimer > 0) {
      interval = setInterval(() => setMissionTimer(prev => (prev !== null ? prev - 1 : 0)), 1000);
    } else if (missionTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [missionTimer]);

  // Feedback visual ao ganhar moedas
  useEffect(() => {
    if (state.coins > lastCoins) {
      setShowHearts(true);
      setTimeout(() => setShowHearts(false), 3000);
    }
    setLastCoins(state.coins);
  }, [state.coins]);

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
    girar: { 
      title: "ROLETA LUNA", 
      icon: "🎰", 
      description: "1. Escolha a intensidade: Aquecimento, Ousadia ou Posição.\n2. Clique em GIRAR para sortear um desafio.\n3. Após o sorteio, clique em INICIAR AGORA.\n4. Realize a missão por 35 segundos.\n5. Somente após o tempo zerar, você poderá clicar em CONCLUÍDO e ganhar 20 moedas!" 
    },
    dice: {
      title: "DADO DA SURPRESA",
      icon: "🎲",
      description: "1. Um parceiro escreve um desejo oculto e um número de 1 a 6.\n2. O outro parceiro tenta adivinhar o número secreto.\n3. Se você acertar o número secreto do seu par, o desejo é revelado para ser cumprido na hora!"
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

  const closeMission = () => { setActiveMission(null); setMissionTimer(null); };

  return (
    <ErrorBoundary>
      <div className="h-full w-full flex flex-col bg-black text-white overflow-hidden relative transition-all duration-700">
        
        {showHearts && <HeartExplosion />}
        {pixCode && <PixModal pixCode={pixCode} onClose={() => setPixCode(null)} />}
        
        {isGeneratingPix && (
          <div className="fixed inset-0 z-[400] bg-black/90 flex flex-col items-center justify-center space-y-6 backdrop-blur-md">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-xl animate-pulse">🔒</div>
            </div>
            <p className="text-yellow-500 font-black uppercase tracking-widest text-[11px]">Criptografando Pagamento VIP...</p>
          </div>
        )}

        {activeTab === 'girar' && !state.tutorialsCompleted.includes('girar') && (
          <TutorialOverlay {...tutorialContent.girar} onClose={() => completeTutorial('girar')} />
        )}
        {activeTab === 'girar' && state.tutorialsCompleted.includes('girar') && !state.tutorialsCompleted.includes('dice') && (
          <TutorialOverlay {...tutorialContent.dice} onClose={() => completeTutorial('dice')} />
        )}
        {activeTab === 'cards' && !state.tutorialsCompleted.includes('cards') && (
          <TutorialOverlay {...tutorialContent.cards} onClose={() => completeTutorial('cards')} />
        )}
        {activeTab === 'slot' && !state.tutorialsCompleted.includes('slot') && (
          <TutorialOverlay {...tutorialContent.slot} onClose={() => completeTutorial('slot')} />
        )}

        <header className="px-6 pt-12 pb-6 flex-shrink-0 z-10 bg-black/60 backdrop-blur-xl border-b border-white/5">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
               <h1 className="text-[10px] font-black tracking-[0.5em] text-yellow-500 uppercase opacity-60 leading-none">LUNA CLUB</h1>
               <p className="text-2xl font-black italic tracking-tighter uppercase leading-none drop-shadow-lg">{state.userName} <span className="text-yellow-500">&</span> {state.partnerName}</p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div className={`bg-[#0f1525] px-4 py-2 rounded-2xl border border-zinc-800 flex items-center space-x-2 shadow-2xl transition-all ${showHearts ? 'animate-coin-pop' : ''}`}>
                <span className="text-xl font-black text-yellow-500">{state.coins}</span>
                <span className="text-lg animate-pulse">🪙</span>
              </div>
              {state.isVip && <span className="text-[8px] font-black bg-yellow-500 text-black px-3 py-1 rounded-full uppercase tracking-widest animate-shimmer shadow-[0_0_15px_rgba(251,191,36,0.4)]">VIP ATIVO</span>}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar touch-pan-y relative px-4 pb-36 animate-in fade-in duration-1000">
          {activeTab === 'girar' && (
            <div className="py-4 space-y-8 flex flex-col items-center max-w-[360px] mx-auto">
               <div className="w-full flex bg-[#0f1525] p-2 rounded-[2rem] border-2 border-zinc-900 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full animate-shimmer opacity-5 pointer-events-none"></div>
                {Object.values(Category).map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`flex-1 py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.1em] transition-all relative z-10 ${category === cat ? 'bg-yellow-500 text-black shadow-[0_4px_15px_rgba(251,191,36,0.3)] scale-105' : 'text-zinc-600 hover:text-white/60'}`}>{cat}</button>
                ))}
              </div>
              
              <Wheel 
                category={category} 
                history={state.history} 
                onComplete={(item) => setActiveMission({...item, reward: 20, timer: 35})} 
                spinsRemaining={state.spins.wheel} 
                isVip={state.isVip} 
                onSpinUsed={() => useSpin('wheel')} 
                onCheckout={handleCreatePix} 
              />

              <DiceGame 
                spinsRemaining={state.spins.dice}
                isVip={state.isVip}
                useSpin={() => useSpin('dice')}
                onCheckout={handleCreatePix}
                onComplete={(reward) => addCompletion('dice-turn-' + Date.now(), reward)}
              />
            </div>
          )}

          {activeTab === 'cards' && (
            <div className="max-w-[360px] mx-auto py-4">
              <CardsGame 
                onComplete={(item) => setActiveMission({...item, reward: 10, timer: 30})} 
                spinsRemaining={state.spins.cards} 
                isVip={state.isVip} 
                useSpin={() => useSpin('cards')} 
                onCheckout={handleCreatePix} 
              />
            </div>
          )}

          {activeTab === 'slot' && (
            <div className="max-w-[360px] mx-auto py-4">
              <SlotGame 
                onComplete={(item) => setActiveMission({...item, reward: 10, timer: 30})} 
                spinsRemaining={state.spins.slots} 
                isVip={state.isVip} 
                useSpin={() => useSpin('slots')} 
                onCheckout={handleCreatePix} 
              />
            </div>
          )}

          {activeTab === 'loja' && <div className="max-w-[360px] mx-auto"><Store state={state} onUnlock={unlockGame} /></div>}

          {activeTab === 'vip' && (
            <div className="px-4 py-12 space-y-10 text-center animate-in slide-in-from-bottom max-w-[320px] mx-auto">
               <div className="text-8xl mb-4 animate-bounce filter drop-shadow-[0_10px_30px_rgba(251,191,36,0.4)]">🏆</div>
               <h2 className="text-4xl font-black text-yellow-500 uppercase italic tracking-tighter leading-none drop-shadow-2xl">Área VIP Luna</h2>
               <div className="bg-[#0f1525] p-10 rounded-[3.5rem] border-4 border-yellow-500/40 space-y-8 shadow-[0_0_50px_rgba(251,191,36,0.1)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full animate-shimmer pointer-events-none"></div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">OFERTA PIX VITALÍCIA</span>
                    <div className="text-white text-5xl font-black animate-pulse">R$ 0,01</div>
                  </div>
                  <button onClick={handleCreatePix} className="w-full py-6 bg-yellow-500 text-black rounded-3xl font-black uppercase tracking-widest text-xl shadow-[0_8px_0_rgb(161,98,7)] animate-heartbeat active:translate-y-1 active:shadow-none transition-all">LIBERAR AGORA 🔒</button>
               </div>
            </div>
          )}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-2xl border-t border-white/5 px-6 py-6 flex justify-around items-center z-50 rounded-t-[3.5rem] shadow-[0_-20px_60px_rgba(0,0,0,1)] pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          {[
            { id: 'girar', label: 'LUNA', icon: '🎰' },
            { id: 'cards', label: 'CARDS', icon: '🎴' },
            { id: 'slot', label: 'SLOT', icon: '⚡' },
            { id: 'loja', label: 'LOJA', icon: '👜' },
            { id: 'vip', label: 'VIP', icon: '🏆' }
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className="flex flex-col items-center space-y-2 relative outline-none flex-1">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-500 ${activeTab === item.id ? 'bg-yellow-500 text-black shadow-[0_0_30px_rgba(251,191,36,0.5)] -translate-y-4 scale-125' : 'text-zinc-600 hover:text-zinc-400'}`}>{item.icon}</div>
              <span className={`text-[8px] font-black tracking-widest transition-all ${activeTab === item.id ? 'text-yellow-500 opacity-100' : 'opacity-30'}`}>{item.label}</span>
            </button>
          ))}
        </nav>

        {activeMission && (
          <div className="fixed inset-0 z-[250] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-500">
             <div className="bg-[#0f1525] border-4 border-yellow-500/20 w-full max-w-[320px] rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] text-center p-10 space-y-8 relative">
                <div className="absolute top-0 left-0 w-full h-full animate-shimmer opacity-5 pointer-events-none"></div>
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-tight relative z-10">{activeMission.nome}</h2>
                <div className="p-6 bg-black/60 rounded-[2.5rem] border border-zinc-900 relative z-10 shadow-inner">
                  <p className="text-xl text-white font-black leading-tight italic">"{activeMission.descricao}"</p>
                </div>
                {missionTimer !== null && (
                  <div className="text-6xl font-black text-yellow-500 font-mono tracking-tighter animate-pulse relative z-10">00:{missionTimer < 10 ? `0${missionTimer}` : missionTimer}</div>
                )}
                <div className="flex flex-col space-y-4 relative z-10">
                  <button onClick={() => { if (missionTimer === null) setMissionTimer(activeMission.timer || 30); else { addCompletion(activeMission.id, activeMission.reward); closeMission(); } }} disabled={missionTimer !== null && missionTimer > 0} className="w-full py-6 font-black rounded-3xl uppercase tracking-widest text-xl bg-yellow-500 text-black shadow-[0_8px_0_rgb(161,98,7)] animate-heartbeat active:translate-y-1 active:shadow-none transition-all disabled:opacity-50">
                    {missionTimer === null ? 'INICIAR AGORA ⏳' : missionTimer === 0 ? `CONCLUÍDO! (+${activeMission.reward})` : 'AGUARDE...'}
                  </button>
                  <button onClick={closeMission} disabled={missionTimer !== null && missionTimer > 0} className="text-zinc-600 font-black uppercase text-[10px] tracking-[0.3em] hover:text-white transition-colors">✕ FECHAR</button>
                </div>
             </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
