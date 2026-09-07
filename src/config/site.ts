/**
 * Configuração central do site.
 * Quase tudo o que é preciso mudar sem tocar em código está aqui.
 */

export const site = {
  /** Nome da loja — aparece no cabeçalho, no <title> e nas partilhas. */
  nome: "SuaCara Modas",
  /** Palavra que acompanha o nome no logótipo. */
  subtitulo: "Roupas",
  /** Frase curta usada na meta description por omissão. */
  descricao: "Vestidos e roupa feminina. Encomende diretamente pelo WhatsApp.",
  /** Idioma do site. */
  lang: "pt-PT",
  /** Moeda usada nos preços. */
  moeda: "EUR",
} as const;

/**
 * Número de WhatsApp que recebe as encomendas.
 * Formato internacional, só dígitos, sem "+" e sem espaços.
 * +351 913 290 121 -> "351913290121"
 */
export const WHATSAPP_NUMERO = "351913290121";

/**
 * Categorias disponíveis para os artigos.
 * Para adicionar uma categoria nova, acrescentar aqui e no `public/admin/config.yml`
 * (o painel de administração, criado na fase 3).
 */
export const CATEGORIAS = [
  "Novidades",
  "Vestuário",
  "Conjuntos",
  "Casacos",
  "Vestidos",
  "Acessórios",
] as const;

export type Categoria = (typeof CATEGORIAS)[number];
