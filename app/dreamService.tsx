// services/dreamService.ts

// 1. DEFINA OS TIPOS UMA ÚNICA VEZ
export type Tag = {
  emoji: string;
  text: string;
};

export type Dream = {
  id: string;
  date: string;
  summary?: string; // O resumo é usado na lista
  fullText: string;  // O texto completo é usado no editor
  tags: Tag[];
};

// 2. CENTRALIZE OS DADOS EM UM ÚNICO LUGAR
const DREAMS: Dream[] = [
  { 
    id: '1', 
    date: 'Segunda-feira, 20 de abril de 2025', 
    summary: 'Aqui pode ficar o início do sonho como digitado pelo usuário ou um resumo gerado por IA. O texto pode ser um pouco longo e vai ser cortado após 3 linhas.',
    fullText: 'Aqui pode ficar o início do sonho como digitado pelo usuário ou um resumo gerado por IA. O texto pode ser um pouco longo e vai ser cortado após 3 linhas. Este é o resto do texto completo que aparece na tela de edição, permitindo ao usuário ver todos os detalhes e fazer as alterações necessárias.',
    tags: [{ emoji: '😱', text: 'Lúcido' }] 
  },
  { 
    id: '2', 
    date: 'Domingo, 19 de abril de 2025', 
    summary: 'Sonhei que estava voando sobre a cidade de Maceió à noite. As luzes eram incríveis e a sensação de liberdade era indescritível.',
    fullText: 'Sonhei que estava voando sobre a cidade de Maceió à noite. As luzes eram incríveis e a sensação de liberdade era indescritível. Pude ver o mar e os prédios da orla, tudo brilhando. Foi uma experiência muito vívida e emocionante.',
    tags: [{ emoji: '✈️', text: 'Voo' }, { emoji: '✨', text: 'Positivo' }] 
  },
  {
    id: '3',
    date: 'Sexta, 13 de junho de 2025',
    summary: 'Sonhei que o sonhario ficava famoso e a gente ganhava muito dinheiro, nunca mais precisando se humilhar.',
    fullText: 'Sonhei que o sonhario ficava famoso e a gente ganhava muito dinheiro, nunca mais precisando se humilhar. Estou apenas testando, mas são sonhos reais(desenjos!)',
    tags: [{emoji: '✈️', text: 'Vooo'},  { emoji: '✨', text: 'Positivo' }]
  }
];

// 3. CRIE FUNÇÕES PARA ACESSAR OS DADOS (COMO UMA API FARIA)

// Função para pegar todos os sonhos (para a tela de lista)
export const getDreams = (): Dream[] => {
  // Em um app real, isso faria uma chamada de API: fetch('/api/dreams')
  return DREAMS;
};

// Função para pegar um único sonho pelo seu ID (para a tela de edição)
export const getDreamById = (id: string): Dream | undefined => {
  // Em um app real, isso faria: fetch(`/api/dreams/${id}`)
  return DREAMS.find(dream => dream.id === id);
};
