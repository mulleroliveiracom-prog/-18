import { Category, GameItem } from '../types';

const positionSilhouettes = [
  "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z",
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
];

export const cardChallenges = [
  "Fazer um boquete de 2 minutos sem parar", "Beijar o clitóris lentamente", "Lamber as bolas com carinho", "Fazer um strip-tease completo",
  "Morder a bunda com vontade", "Sussurrar uma safadeza no ouvido", "Chupar os dedos dos pés", "Massagem com óleo no corpo todo",
  "Ficar de quatro e esperar o tapa", "Beijo grego (se ambos toparem)", "Usar um vibrador no parceiro", "Amarrar as mãos do par com um cinto",
  "Lamber o pescoço de baixo para cima", "Fazer sexo oral até o orgasmo", "Chupar os mamilos com força", "Colocar gelo na boca e fazer sexo oral",
  "Usar mel para lamber uma parte do corpo", "Dizer 3 coisas que quer fazer na cama", "Lamber o umbigo", "Beijar a parte interna das coxas",
  "Fazer a posição do missionário por 5 min", "Fazer a posição cachorrinho rápido", "Fazer a posição 69", "Usar os dedos para estimular",
  "Dar 5 tapas na bunda", "Deixar o par te guiar por 3 minutos", "Fazer um oral duplo", "Lamber o canal auditivo", "Puxar o cabelo durante o beijo",
  "Beijar o corpo todo sem usar as mãos", "Fazer um agachamento pelado(a)", "Colocar uma música sexy e dançar", "Morder o lábio inferior forte",
  "Lamber o suor do parceiro", "Fazer o par gemer alto", "Beijo francês profundo", "Chupar a língua do par", "Massagem na próstata (opcional)",
  "Lamber o períneo", "Fazer o par gozar só com a boca", "Posição de conchinha penetrando", "Posição amazona (ela por cima)",
  "Ficar pelado(a) na frente da janela", "Enviar um nude agora", "Falar uma fantasia proibida", "Lamber o mastro", "Beijar o saco escrotal",
  "Fazer o par ficar excitado sem tocar nas genitais", "Morder a nuca", "Lamber o peito", "Beijar o meio das pernas",
  "Beijar o púbis", "Lamber as axilas", "Morder a orelha", "Soprar o umbigo", "Chupar um dedo da mão", 
  "Fazer massagem nas nádegas", "Puxar a cueca/calcinha com os dentes", "Beijar a sola do pé", "Morder a coxa", "Chupar o lóbulo"
];

export const slotActions = [
  "Lamber", "Chupar", "Morder", "Beijar", "Massagear", "Puxar", "Soprar", "Arranhar", "Apertar", "Roçar",
  "Explorar", "Estimular", "Sugacionar", "Friccionar", "Mordiscar", "Provocar", "Contornar", "Afagar", "Esculpir", "Saborear"
];

export const slotTargets = [
  "o Pau", "a Buceta", "os Mamilos", "a Bunda", "as Bolas", "o Clitóris", "o Pescoço", "as Coxas", "o Umbigo", "o Ânus",
  "os Lábios", "a Nuca", "as Orelhas", "os Seios", "o Púbis", "as Panturrilhas", "os Pés", "as Costas", "os Braços", "as Virilhas"
];

export const slotIntensities = [
  "com Força", "Lentamente", "com Gelo", "com Mel", "Rápido", "com Carinho", "Dando Tapinhas", "Gemer no Ouvido", "com Saliva", "Sem Parar",
  "com Paixão", "com Vigor", "com Delicadeza", "Vezes Seguidas", "Alternando Lado", "com a Ponta da Língua", "com Lubrificante", "Olhando nos Olhos", "com Calma", "de Forma Selvagem"
];

export const diceActions = [
  "Beijar", "Lamber", "Morder", "Sussurrar", "Explorar", "Massagear", "Chupar", "Acariciar", "Puxar", "Soprar"
];

export const diceBodyParts = [
  "Pescoço", "Orelha", "Coxas", "Barriga", "Nuca", "Lábios", "Seios", "Bunda", "Umbigo", "Clitóris"
];

const generateGameItems = () => {
  const items: GameItem[] = [];
  const categories = [Category.Warmup, Category.Daring, Category.Position];
  
  categories.forEach(cat => {
    for (let i = 0; i < 50; i++) {
      items.push({
        id: `${cat.toLowerCase()}-${i}`,
        nome: `${cat} Challenge #${i + 1}`,
        descricao: cardChallenges[i % cardChallenges.length],
        instrucoesDetalhes: `Foque no prazer e na conexão. ${cardChallenges[i % cardChallenges.length]}`,
        categoria: cat,
        iconeSvg: positionSilhouettes[i % positionSilhouettes.length]
      });
    }
  });
  return items;
};

export const gameDatabase = generateGameItems();