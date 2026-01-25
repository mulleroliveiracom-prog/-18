
import { Category, GameItem } from '../types';

// Artistic minimalist silhuette paths (representing various postures/moods)
const silhuettes = [
  "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z",
  "M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm1 13h-2v-6h2v6zm0-8h-2V7h2v2z",
  "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l3.59-3.59L17 12l-5 5z",
  "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z",
  "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z",
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z",
  "M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"
];

const generateGameItems = () => {
  const items: GameItem[] = [];
  const categories = [Category.Warmup, Category.Daring, Category.Position];
  
  const contentMap = {
    [Category.Warmup]: {
      nouns: ["Carinho", "Sussurro", "Massagem", "Toque", "Beijo", "Olhar", "Provocação", "Desejo", "Sedução", "Arrepio"],
      adjectives: ["Sutil", "Ardente", "Lento", "Profundo", "Misterioso", "Doce", "Proibido", "Intenso", "Gélido", "Vibrante"],
      steps: [
        "Crie um ambiente relaxante com luz baixa.",
        "Use as pontas dos dedos para explorar áreas sensíveis.",
        "Mantenha contato visual por pelo menos 30 segundos.",
        "Respire próximo ao ouvido do seu par.",
        "Use um acessório (lenço, pluma ou gelo) para surpreender."
      ]
    },
    [Category.Daring]: {
      nouns: ["Comando", "Desafio", "Entrega", "Dominação", "Troca", "Venda", "Algema", "Poder", "Submissão", "Fetiche"],
      adjectives: ["Ousado", "Arriscado", "Picante", "Direto", "Surpreendente", "Sombrio", "Total", "Excitante", "Cego", "Livre"],
      steps: [
        "Defina quem terá o controle total nos próximos minutos.",
        "Vende os olhos do seu parceiro para aguçar os outros sentidos.",
        "Explore uma zona erógena que vocês raramente focam.",
        "Peça ao seu par para descrever uma fantasia em detalhes.",
        "Use comandos claros e firmes para guiar a ação."
      ]
    },
    [Category.Position]: {
      nouns: ["Lótus", "Estrela", "Ponte", "Trono", "Conexão", "Abraço", "Fusão", "Ritmo", "Enlace", "Equilíbrio"],
      adjectives: ["Invertida", "Profunda", "Rítmica", "Clássica", "Moderna", "Evoluída", "Íntima", "Poderosa", "Suave", "Elevada"],
      steps: [
        "Ajustem-se para que o contato pele a pele seja máximo.",
        "Sincronize sua respiração com a do seu parceiro.",
        "Experimente variar o ângulo de penetração ou contato.",
        "Mantenha o suporte nos braços ou pernas para maior estabilidade.",
        "Foque na sensação de unidade e entrega física total."
      ]
    }
  };

  categories.forEach(cat => {
    const meta = contentMap[cat];
    for (let i = 1; i <= 50; i++) {
      const noun = meta.nouns[i % meta.nouns.length];
      const adj = meta.adjectives[i % meta.adjectives.length];
      const name = `${noun} ${adj}`;
      
      items.push({
        id: `${cat.toLowerCase()}-${i}`,
        nome: name,
        descricao: `Uma experiência de ${cat.toLowerCase()} focada em ${name.toLowerCase()}.`,
        instrucoesDetalhes: `1. Prepare o espaço e garanta privacidade total.\n2. ${meta.steps[i % meta.steps.length]}\n3. Avancem no ritmo que for confortável para ambos.\n4. Comunique-se através de toques e sons.\n5. Finalizem com um momento de conexão emocional.`,
        categoria: cat,
        iconeSvg: silhuettes[i % silhuettes.length]
      });
    }
  });

  return items;
};

export const gameDatabase = generateGameItems();

export const diceActions = [
  "Beijar", "Lamber", "Morder", "Sussurrar", "Explorar", "Massagear", "Soprar", "Chupar", "Vibrar", "Acariciar", "Pressionar", "Morder Levemente",
  "Arranhar", "Cheirar", "Provocar", "Sugar", "Roçar", "Apertar"
];

export const diceBodyParts = [
  "Pescoço", "Seios", "Orelha", "Coxas", "Barriga", "Nuca", "Lábios", "Costas", "Virilha", "Umbigo", "Tornozelos", "Palmas das Mãos",
  "Pés", "Glúteos", "Mamilos", "Clitóris/Pênis", "Joelhos", "Dedos"
];
