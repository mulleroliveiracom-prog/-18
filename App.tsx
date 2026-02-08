
import React, { useState, useEffect, ReactNode, ErrorInfo, useRef } from 'react';
import { Category, GameItem } from './types';
import { useGameStore } from './hooks/useGameStore';
import { Wheel } from './components/Wheel';
import { Store } from './components/Store';
import { DiceGame } from './components/DiceGame';
import { NeonPulseGame } from './components/NeonPulseGame';
import { cardChallenges, slotActions, slotTargets, slotIntensities } from './data/content';

interface ErrorBoundaryProps { children?: ReactNode; }
interface ErrorBoundaryState { hasError: boolean; }

/**
 * ErrorBoundary class component to catch rendering errors in its child components.
 * Fixed: Explicitly extend React.Component to ensure 'this.state' and 'this.props' are correctly typed and recognized.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
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
          <h2 className="text-2xl font-black text-white uppercase mb-4 font-luxury">Ops! Algo deu errado.</h2>
          <button onClick={() => window.location.reload()} className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest">RECARREGAR</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const TutorialModal: React.FC<{ 
  title: string; 
  subtitle: string; 
  icon: string; 
  steps: string[]; 
  onClose: () => void;
}> = ({ title, subtitle, icon, steps, onClose }) => (
  <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
    <div className="bg-[#1a1f2e] border-2 border-yellow-500/30 w-full max-w-[320px] rounded-[2.5rem] p-8 text-center space-y-6 shadow-[0_0_80px_rgba(0,0,0,1)]">
      <div className="space-y-2">
        <div className="text-5xl mb-2 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{icon}</div>
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">{title}</h2>
        <p className="text-yellow-500 text-[10px] font-black uppercase tracking-widest">{subtitle}</p>
        <div className="w-12 h-1 bg-pink-600 mx-auto mt-2 rounded-full"></div>
      </div>
      <div className="bg-black/40 rounded-2xl p-5 text-left space-y-3 border border-white/5 shadow-inner">
        {steps.map((step, i) => (
          <p key={i} className="text-[10px] text-zinc-300 font-bold leading-relaxed flex items-start">
            <span className="text-yellow-500 mr-2 font-black">{(i + 1)}.</span>
            <span>{step}</span>
          </p>
        ))}
      </div>
      <div className="space-y-3">
        <button onClick={onClose} className="w-full py-4 bg-[#22c55e] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_4px_0_rgb(21,128,61)] active:translate-y-1 transition-all">
          ENTENDI! ✅
        </button>
        <button onClick={onClose} className="text-[8px] text-zinc-600 font-black uppercase tracking-[0.2em] hover:text-white transition-colors">PULAR EXPLICAÇÃO</button>
      </div>
    </div>
  </div>
);

const CardsGame: React.FC<{
  onComplete: (item: any) => void;
  spinsRemaining: number;
  isVip: boolean;
  useSpin: (type: any) => boolean;
  onCheckout: () => void;
  daysUntilReset: number;
}> = ({ onComplete, spinsRemaining, isVip, useSpin, onCheckout, daysUntilReset }) => {
  const [revealingIndex, setRevealingIndex] = useState<number | null>(null);
  const [revealedContent, setRevealedContent] = useState<{ index: number, text: string } | null>(null);

  const drawCard = (index: number) => {
    if (revealingIndex !== null || revealedContent !== null) return;
    if (!useSpin('cards')) return;
    
    setRevealingIndex(index);
    
    setTimeout(() => {
      const randomChallenge = cardChallenges[Math.floor(Math.random() * cardChallenges.length)];
      setRevealingIndex(null);
      setRevealedContent({ index, text: randomChallenge });
      
      setTimeout(() => {
        onComplete({
          id: 'card-' + Date.now(),
          nome: 'CARTA DO DESTINO',
          descricao: randomChallenge,
          reward: 10,
          timer: 30
        });
        setRevealedContent(null);
      }, 1200);
    }, 800);
  };

  const hasNoSpins = !isVip && spinsRemaining <= 0;

  if (hasNoSpins) return (
    <div className="bg-[#0f1525] border-2 border-red-500/20 p-8 rounded-[3rem] text-center space-y-4 animate-in zoom-in shadow-2xl mt-10">
      <div className="text-4xl">🎴</div>
      <p className="text-white text-[10px] font-black uppercase italic leading-tight">CARTAS ESGOTADAS! NOVOS GIROS EM {daysUntilReset} DIAS.</p>
      <button onClick={onCheckout} className="w-full py-4 bg-yellow-500 text-black rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg animate-glow-gold">LIBERAR AGORA R$ 1,00 🚀</button>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center space-y-6 pt-4 animate-in fade-in duration-500">
      <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter text-center font-luxury">CARDS DA<br/>SORTE</h2>
      <div className="grid grid-cols-3 gap-3 w-full px-2 max-w-[320px]">
        {Array.from({ length: 12 }).map((_, i) => (
          <button 
            key={i} 
            onClick={() => drawCard(i)}
            disabled={revealingIndex !== null || revealedContent !== null}
            className={`aspect-[3/4] rounded-2xl border-2 transition-all duration-700 shadow-lg flex items-center justify-center p-2 relative overflow-hidden ${
              revealingIndex === i || revealedContent?.index === i 
                ? 'bg-zinc-900 border-yellow-500 scale-105 shadow-[0_0_20px_rgba(251,191,36,0.3)]' 
                : 'bg-[#0f1525] border-zinc-800 active:scale-95'
            }`}
          >
            {revealedContent?.index === i ? (
               <span className="text-[7px] font-black uppercase text-yellow-500 leading-tight animate-in fade-in zoom-in">{revealedContent.text}</span>
            ) : (
               <span className={`text-2xl transition-all ${revealingIndex === i ? 'animate-ping' : 'animate-pulse'}`}>❤️</span>
            )}
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
  useSpin: (type: any) => boolean;
  onCheckout: () => void;
}> = ({ onComplete, spinsRemaining, isVip, useSpin, onCheckout }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [slots, setSlots] = useState(['?', '?', '?']);

  const spin = () => {
    if (isSpinning) return;
    if (!useSpin('slots')) return;
    setIsSpinning(true);
    let iters = 0;
    const interval = setInterval(() => {
      setSlots([
        slotActions[Math.floor(Math.random() * slotActions.length)],
        slotTargets[Math.floor(Math.random() * slotTargets.length)],
        slotIntensities[Math.floor(Math.random() * slotIntensities.length)]
      ]);
      iters++;
      if (iters > 20) {
        clearInterval(interval);
        setIsSpinning(false);
        const final = [
          slotActions[Math.floor(Math.random() * slotActions.length)],
          slotTargets[Math.floor(Math.random() * slotTargets.length)],
          slotIntensities[Math.floor(Math.random() * slotIntensities.length)]
        ];
        setSlots(final);
        onComplete({ id: 'slot-' + Date.now(), nome: 'SLOT PROIBIDO', descricao: `${final[0]} ${final[1]} ${final[2]}`, reward: 10, timer: 30 });
      }
    }, 80);
  };

  const hasNoSpins = !isVip && spinsRemaining <= 0;

  if (hasNoSpins) return (
    <div className="bg-[#0f1525] border-2 border-red-500/20 p-8 rounded-[3rem] text-center space-y-4 animate-in zoom-in shadow-2xl mt-10">
      <div className="text-4xl">🎰</div>
      <p className="text-white text-[10px] font-black uppercase italic leading-tight">SLOTS ESGOTADOS! LIBERE O ACESSO VIP VITALÍCIO.</p>
      <button onClick={onCheckout} className="w-full py-4 bg-yellow-500 text-black rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg animate-glow-gold">LIBERAR AGORA R$ 1,00 🚀</button>
    </div>
  );

  return (
    <div className="space-y-8 py-4 w-full animate-in fade-in duration-500">
      <div className="flex space-x-2">
        {slots.map((s, i) => (
          <div key={i} className="flex-1 h-28 bg-zinc-950 border-2 border-zinc-800 rounded-3xl flex items-center justify-center text-center p-2 shadow-inner overflow-hidden">
            <span className={`text-[10px] font-black uppercase italic leading-tight ${isSpinning ? 'animate-pulse text-zinc-600' : 'text-yellow-500'}`}>{s}</span>
          </div>
        ))}
      </div>
      <button onClick={spin} disabled={isSpinning} className="w-full py-5 bg-gradient-to-br from-yellow-600 to-yellow-400 text-black rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_6px_0_rgb(161,98,7)] active:translate-y-1 transition-all animate-glow-gold animate-heartbeat">
        {isSpinning ? 'COMBINANDO...' : 'GIRAR SLOT ⚡'}
      </button>
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
    <div className="fixed inset-0 z-[1100] bg-black/98 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="bg-[#0f1525] border-2 border-yellow-400/50 w-full max-w-[320px] rounded-[3rem] p-6 text-center space-y-4 shadow-[0_0_50px_rgba(251,191,36,0.3)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full animate-shimmer pointer-events-none opacity-10"></div>
        <div className="space-y-1 relative z-10">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tighter font-luxury">ACESSO VITALÍCIO</h2>
          <p className="text-yellow-500 text-[8px] font-black uppercase tracking-[0.3em]">LUNA SUTRA PREMIUM - R$ 1,00</p>
        </div>
        <div className="space-y-2 relative z-10 flex flex-col items-center">
          <div className="bg-white p-2 rounded-xl inline-block shadow-lg">
            <img src={qrCodeUrl} alt="QR Code Pix" className="w-[120px] h-[120px] block" loading="lazy" />
          </div>
          <p className="text-zinc-400 text-[8px] font-black uppercase tracking-widest mt-2">CNPJ: 64.988.605/0001-15</p>
        </div>
        <div className="space-y-2 relative z-10">
          <div className="relative group">
            <textarea readOnly value={pixCode} className="w-full bg-black/60 border border-zinc-800 p-2.5 rounded-lg text-[8px] text-zinc-500 font-mono h-12 resize-none outline-none overflow-hidden" />
            <button onClick={copyToClipboard} className={`absolute bottom-1 right-1 px-2 py-1 rounded-md text-[7px] font-black uppercase transition-all ${copied ? 'bg-green-600 text-white' : 'bg-yellow-500 text-black'}`}>
              {copied ? 'COPIADO' : 'COPIAR PIX'}
            </button>
          </div>
        </div>
        <div className="space-y-3 pt-1 relative z-10">
          <button onClick={onCheck} disabled={isChecking} className="w-full py-3 bg-green-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-[0_4px_0_rgb(21,128,61)] animate-heartbeat active:translate-y-1 disabled:opacity-50">
            {isChecking ? 'VERIFICANDO...' : 'JÁ PAGUEI ✅'}
          </button>
          <button onClick={onClose} className="w-full py-1 text-zinc-600 font-black uppercase text-[8px] tracking-widest hover:text-white transition-colors">VOLTAR</button>
        </div>
      </div>
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
        <div className="space-y-4">
          <div className="w-24 h-24 border-4 border-yellow-500/50 rounded-full flex flex-col items-center justify-center mx-auto bg-black/60 shadow-[0_0_40px_rgba(251,191,36,0.3)] animate-pulse">
            <span className="text-3xl font-black text-white">18+</span>
          </div>
          <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none font-luxury">LUNA<br/><span className="text-yellow-500">SUTRA</span></h1>
        </div>
        <div className="space-y-6">
          <p className="text-zinc-400 text-xs font-medium uppercase tracking-[0.2em] leading-relaxed">Bem-vindo ao Clímax do seu Relacionamento.<br/>Uma experiência VIP desenhada para casais que buscam o extraordinário.</p>
          <button onClick={() => setStep(1)} className="w-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 text-black py-5 rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl animate-heartbeat transition-all active:scale-95">
            ENTRAR NO CLUBE 🔒
          </button>
        </div>
      </div>
      <div className="absolute bottom-10 text-[8px] text-zinc-600 font-black uppercase tracking-widest">Luna Sutra &copy; 2025 | CNPJ 64.988.605/0001-15</div>
    </div>
  );
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-8 animate-in slide-in-from-right duration-500 z-[300]">
      <div className="w-full max-w-[300px] space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-yellow-500 italic uppercase leading-none font-luxury">SEU PERFIL</h2>
          <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest">PERSONALIZAÇÃO DA EXPERIÊNCIA</p>
        </div>
        <div className="space-y-6">
          <input value={userName} onChange={e => setUserName(e.target.value)} className="w-full bg-[#0f1525] border-2 border-zinc-900 p-5 rounded-2xl text-white text-lg font-black uppercase outline-none focus:border-yellow-500/50 transition-all shadow-xl" placeholder="SEU NOME" />
          <input value={partnerName} onChange={e => setPartnerName(e.target.value)} className="w-full bg-[#0f1525] border-2 border-zinc-900 p-5 rounded-2xl text-white text-lg font-black uppercase outline-none focus:border-yellow-500/50 transition-all shadow-xl" placeholder="NOME DO PAR" />
        </div>
        <button disabled={!userName || !partnerName} onClick={() => onComplete(userName, partnerName)} className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 py-5 rounded-2xl text-lg font-black uppercase text-black disabled:opacity-30 shadow-lg active:scale-95 transition-all animate-heartbeat animate-glow-gold">COMEÇAR AGORA ✨</button>
      </div>
    </div>
  );
};

export default function App() {
  const { state, updateProfile, updateProfileImage, addCompletion, unlockGame, useSpin, setVipStatus, getDaysUntilReset, completeTutorial } = useGameStore();
  const [activeTab, setActiveTab] = useState<'girar' | 'cards' | 'slot' | 'loja' | 'vip'>('girar');
  const [category, setCategory] = useState<Category>(Category.Warmup);
  const [activeMission, setActiveMission] = useState<any>(null);
  const [missionTimer, setMissionTimer] = useState<number | null>(null);
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [pixCode, setPixCode] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(() => localStorage.getItem('luna_last_payment_id'));
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [isNeonPulseActive, setIsNeonPulseActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: any;
    if (missionTimer !== null && missionTimer > 0) interval = setInterval(() => setMissionTimer(prev => (prev !== null ? prev - 1 : 0)), 1000);
    else if (missionTimer === 0) clearInterval(interval);
    return () => clearInterval(interval);
  }, [missionTimer]);

  const handleCreatePix = async () => {
    if (state.isVip) return;
    setIsGeneratingPix(true);
    setPixCode(null);
    try {
      const response = await fetch('/api/create-pix', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      const data = await response.json();
      if (response.ok && data.pix_code) {
        setPixCode(data.pix_code);
        setPaymentId(data.payment_id);
        localStorage.setItem('luna_last_payment_id', data.payment_id);
      } else {
        alert(data.details || data.message || 'Erro ao gerar Pix.');
      }
    } catch (err) { console.error(err); alert('Erro no servidor de pagamentos.'); }
    finally { setIsGeneratingPix(false); }
  };

  const handleCheckPayment = async () => {
    if (!paymentId || isCheckingPayment) return;
    setIsCheckingPayment(true);
    try {
      const response = await fetch(`/api/check-payment?id=${paymentId}`);
      const data = await response.json();
      if (data.isApproved) { setVipStatus(true); setPixCode(null); localStorage.removeItem('luna_last_payment_id'); }
      else { alert('Aguardando confirmação bancária...'); }
    } catch (err) { console.error(err); }
    finally { setIsCheckingPayment(false); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!state.isOnboarded) return <ErrorBoundary><Onboarding onComplete={updateProfile} /></ErrorBoundary>;

  const closeMission = () => { setActiveMission(null); setMissionTimer(null); };

  const showTutorial = (gameId: string) => !state.tutorialsCompleted.includes(gameId);

  const handleStartMission = () => {
    if (missionTimer !== null) {
      if (missionTimer === 0) {
        addCompletion(activeMission.id, activeMission.reward);
        closeMission();
      }
      return;
    }
    if (!state.isVip) {
      handleCreatePix();
    } else {
      setMissionTimer(activeMission.timer || 30);
    }
  };

  const levelProgress = Math.min((state.completedPositions / 50) * 100, 100);

  return (
    <ErrorBoundary>
      <div className="h-full w-full flex flex-col bg-black text-white overflow-hidden relative">
        {pixCode && <PixModal pixCode={pixCode} onCheck={handleCheckPayment} isChecking={isCheckingPayment} onClose={() => setPixCode(null)} />}
        
        {isGeneratingPix && (
          <div className="fixed inset-0 z-[1200] bg-black/90 flex flex-col items-center justify-center space-y-4 backdrop-blur-md">
            <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-yellow-500 font-black uppercase tracking-widest text-[8px] animate-pulse">Conectando ao Mercado Pago Seguro...</p>
          </div>
        )}

        {/* SEQUÊNCIA DE TUTORIAIS LÓGICOS */}
        {activeTab === 'girar' && (
          showTutorial('roleta') ? (
            <TutorialModal 
              icon="🎰"
              title="COMO JOGAR?"
              subtitle="ROLETA LUNA"
              steps={[
                "Escolha a intensidade: Aquecimento, Ousadia ou Posição.",
                "Clique em GIRAR para sortear um desafio.",
                "Após o sorteio, clique em INICIAR AGORA.",
                "Realize a missão por 35 segundos.",
                "Somente após o tempo zerar, você poderá clicar em CONCLUÍDO e ganhar 20 moedas!"
              ]}
              onClose={() => completeTutorial('roleta')}
            />
          ) : showTutorial('dice') ? (
            <TutorialModal 
              icon="🎲"
              title="COMO JOGAR?"
              subtitle="DADO DA SURPRESA"
              steps={[
                "Um parceiro escreve um desejo oculto e um número de 1 a 6.",
                "O outro parceiro tenta adivinhar o número secreto.",
                "Se você acertar o número secreto do seu par, o desejo é revelado para ser cumprido na hora!"
              ]}
              onClose={() => completeTutorial('dice')}
            />
          ) : null
        )}

        <header className="px-6 pt-10 pb-4 flex-shrink-0 z-10 border-b border-white/5 bg-black/60 backdrop-blur-xl">
          <div className="w-full flex justify-between items-center mb-4 bg-zinc-900/50 p-2 rounded-full border border-white/5 shadow-inner">
             <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest ml-2">CONEXÃO</span>
             <div className="flex-1 mx-4 h-1.5 bg-black/50 rounded-full overflow-hidden">
               <div className="h-full bg-yellow-500 transition-all duration-1000" style={{ width: `${levelProgress}%` }}></div>
             </div>
             <span className="text-[7px] font-black text-yellow-500 mr-2">{state.completedPositions} / 50</span>
          </div>
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
               <h1 className="text-[7px] font-black text-yellow-500 uppercase tracking-widest opacity-60 leading-none">LUNA SUTRA VIP</h1>
               <p className="text-xl font-black italic uppercase tracking-tighter leading-none font-luxury">{state.userName} & {state.partnerName}</p>
            </div>
            <div className="flex flex-col items-end space-y-1.5">
              <div className="bg-[#0f1525] px-3 py-1.5 rounded-xl border border-zinc-800 flex items-center space-x-1.5 shadow-xl transition-transform active:scale-95">
                <span className="text-lg font-black text-yellow-500">{state.coins}</span>
                <span className="text-base">🪙</span>
              </div>
              {state.isVip && <span className="text-[7px] font-black bg-yellow-500 text-black px-2.5 py-1 rounded-full uppercase tracking-widest animate-shimmer shadow-lg">MEMBRO VIP</span>}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar touch-pan-y relative px-4 pb-32 animate-in fade-in duration-700">
          {activeTab === 'girar' && (
            <div className="py-2 space-y-6 flex flex-col items-center max-w-[340px] mx-auto">
               <div className="w-full flex bg-[#0f1525] p-1.5 rounded-[1.5rem] border border-zinc-800/50 shadow-2xl">
                {Object.values(Category).map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`flex-1 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${category === cat ? 'bg-yellow-500 text-black scale-105 shadow-md' : 'text-zinc-600 hover:text-zinc-400'}`}>{cat}</button>
                ))}
              </div>
              <Wheel category={category} history={state.history} onComplete={(item) => setActiveMission({...item, reward: 20, timer: 35})} spinsRemaining={state.spins.wheel} isVip={state.isVip} onSpinUsed={() => useSpin('wheel')} onCheckout={handleCreatePix} daysUntilReset={getDaysUntilReset()} />
              <div className="w-full border-t border-white/5 pt-6 mt-6">
                <DiceGame spinsRemaining={state.spins.dice} isVip={state.isVip} useSpin={() => useSpin('dice')} onCheckout={handleCreatePix} onComplete={(reward) => addCompletion('dice-turn-' + Date.now(), reward)} daysUntilReset={getDaysUntilReset()} />
              </div>
            </div>
          )}

          {activeTab === 'cards' && <div className="max-w-[340px] mx-auto py-2"><CardsGame onComplete={(item) => setActiveMission({...item, reward: 10, timer: 30})} spinsRemaining={state.spins.cards} isVip={state.isVip} useSpin={useSpin} onCheckout={handleCreatePix} daysUntilReset={getDaysUntilReset()} /></div>}
          
          {activeTab === 'slot' && <div className="max-w-[340px] mx-auto py-2"><SlotGame onComplete={(item) => setActiveMission({...item, reward: 10, timer: 30})} spinsRemaining={state.spins.slots} isVip={state.isVip} useSpin={useSpin} onCheckout={handleCreatePix} /></div>}
          
          {activeTab === 'loja' && <div className="max-w-[340px] mx-auto"><Store state={state} onUnlock={unlockGame} /></div>}
          
          {activeTab === 'vip' && (
            <div className="py-8 space-y-8 max-w-[340px] mx-auto animate-in slide-in-from-bottom flex flex-col items-center">
               {/* --- CARD DE PERFIL NEON --- */}
               <div className="w-full relative bg-gradient-to-br from-[#FF007A] via-purple-600 to-yellow-500 p-[2px] rounded-[3.5rem] shadow-[0_20px_50px_rgba(255,0,122,0.2)]">
                  <div className="bg-[#0f1525] rounded-[3.4rem] p-10 flex flex-col items-center space-y-6 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF007A]/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    
                    {/* Círculo da Foto */}
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-28 h-28 rounded-full border-4 border-[#FFD700] p-1 bg-black shadow-[0_0_30px_rgba(255,215,0,0.3)] relative group cursor-pointer overflow-hidden transition-all hover:scale-105 active:scale-95"
                    >
                      {state.profileImage ? (
                        <img src={state.profileImage} className="w-full h-full object-cover rounded-full" alt="Foto do Casal" />
                      ) : (
                        <div className="w-full h-full rounded-full flex items-center justify-center text-zinc-700 bg-zinc-900 group-hover:text-yellow-500 transition-colors">
                          <span className="text-4xl">📸</span>
                        </div>
                      )}
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    </div>

                    <div className="text-center">
                       <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-tight font-luxury">
                          {state.userName}<br/><span className="text-zinc-500 text-sm">&</span> {state.partnerName}
                       </h2>
                       <p className="mt-2 text-[8px] font-black text-yellow-500 uppercase tracking-[0.4em]">CASAL LUNA SUTRA</p>
                    </div>

                    {/* Barra de XP */}
                    <div className="w-full space-y-2">
                       <div className="flex justify-between items-center text-[7px] font-black text-zinc-500 uppercase tracking-widest px-1">
                          <span>NÍVEL VIP 1</span>
                          <span className="text-yellow-500">EXPERIÊNCIA</span>
                       </div>
                       <div className="w-full h-4 bg-black/60 rounded-full border border-white/5 p-1 shadow-inner">
                          <div className="h-full bg-gradient-to-r from-yellow-600 via-[#FFD700] to-yellow-600 rounded-full shadow-[0_0_15px_rgba(255,215,0,0.5)] transition-all duration-1000" style={{ width: `${levelProgress}%` }}></div>
                       </div>
                    </div>
                  </div>
               </div>

               {/* Container do Jogo */}
               <div className="w-full p-6 bg-[#0f1525] border-2 border-pink-500/20 rounded-[2.5rem] shadow-xl flex flex-col items-center space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse"></span>
                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">MINI-GAME DE ALTA DOPAMINA</span>
                  </div>
                  
                  {isNeonPulseActive ? (
                    <NeonPulseGame 
                      userName={state.userName} 
                      partnerName={state.partnerName} 
                      onGameOver={(finalScore) => {
                        if (finalScore >= 500) {
                          alert("🎉 Conexão em Nível Máximo!");
                          addCompletion('neon-pulse-master', 100);
                        }
                        setIsNeonPulseActive(false);
                      }} 
                    />
                  ) : (
                    <button 
                      onClick={() => setIsNeonPulseActive(true)} 
                      className="w-full py-8 bg-gradient-to-r from-pink-600 to-pink-500 rounded-3xl flex flex-col items-center justify-center space-y-2 shadow-lg animate-heartbeat active:scale-95 transition-all"
                    >
                       <span className="text-4xl">⚡</span>
                       <span className="text-white font-black text-[10px] uppercase tracking-widest">INICIAR NEON PULSE</span>
                    </button>
                  )}
               </div>

               {/* Oferta R$ 1,00 */}
               {!state.isVip && (
                 <div className="w-full bg-[#0f1525] p-8 rounded-[3rem] border-2 border-yellow-500/30 space-y-4 animate-in zoom-in shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-yellow-500/5 pointer-events-none"></div>
                    <div className="flex items-center justify-between relative z-10">
                       <div className="space-y-1">
                          <p className="text-yellow-500 font-black text-[10px] uppercase tracking-widest">OFERTA DE ATIVAÇÃO</p>
                          <p className="text-white text-lg font-black italic uppercase leading-tight">R$ 1,00 VITALÍCIO</p>
                       </div>
                       <button onClick={handleCreatePix} className="px-8 py-4 bg-yellow-500 text-black rounded-2xl font-black uppercase text-[10px] shadow-xl animate-heartbeat active:scale-95 transition-all">LIBERAR 🔒</button>
                    </div>
                 </div>
               )}
            </div>
          )}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-2xl border-t border-white/5 px-4 py-4 flex justify-around items-center z-50 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,1)] pb-[calc(1rem+env(safe-area-inset-bottom))]">
          {[
            { id: 'girar', label: 'LUNA', icon: '🎰' },
            { id: 'cards', label: 'CARDS', icon: '🎴' },
            { id: 'slot', label: 'SLOT', icon: '⚡' },
            { id: 'loja', label: 'LOJA', icon: '👜' },
            { id: 'vip', label: 'VIP', icon: '👤' }
          ].map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id as any); setIsNeonPulseActive(false); }} className="flex flex-col items-center space-y-1 outline-none flex-1 group">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-500 ${activeTab === item.id ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/30 -translate-y-2 scale-110' : 'text-zinc-600 opacity-60 group-hover:opacity-100'}`}>{item.icon}</div>
              <span className={`text-[7px] font-black tracking-widest transition-all ${activeTab === item.id ? 'text-yellow-500' : 'opacity-30'}`}>{item.label}</span>
            </button>
          ))}
        </nav>

        {activeMission && (
          <div className="fixed inset-0 z-[1300] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-500">
             <div className="bg-[#0f1525] border-2 border-yellow-500/20 w-full max-w-[300px] rounded-[3rem] text-center p-8 space-y-6 relative shadow-[0_0_100px_rgba(251,191,36,0.15)]">
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-tight font-luxury">{activeMission.nome}</h2>
                <div className="p-5 bg-black/60 rounded-[2rem] border border-zinc-900 shadow-inner">
                  <p className="text-lg text-white font-black italic">"{activeMission.descricao}"</p>
                </div>
                {missionTimer !== null && <div className="text-5xl font-black text-yellow-500 font-mono animate-pulse">00:{missionTimer < 10 ? `0${missionTimer}` : missionTimer}</div>}
                <div className="flex flex-col space-y-4">
                  <button onClick={handleStartMission} disabled={missionTimer !== null && missionTimer > 0} className="w-full py-5 font-black rounded-2xl uppercase tracking-widest text-lg bg-yellow-500 text-black shadow-[0_4px_0_rgb(161,98,7)] animate-glow-gold animate-heartbeat disabled:opacity-50 active:scale-95 transition-all">
                    {missionTimer === null ? 'INICIAR AGORA ⏳' : missionTimer === 0 ? `CONCLUÍDO! (+${activeMission.reward})` : 'AGUARDE...'}
                  </button>
                  <button onClick={closeMission} disabled={missionTimer !== null && missionTimer > 0} className="text-zinc-600 font-black uppercase text-[9px] tracking-widest hover:text-white transition-colors">✕ FECHAR</button>
                </div>
             </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
