import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";
import { CATEGORIAS } from "@/config/site";

/**
 * Modelo de dados de um artigo.
 *
 * Cada artigo é um ficheiro Markdown em `src/content/products/`.
 * O painel de administração (fase 3) escreve exatamente neste formato.
 * Se um ficheiro não respeitar este esquema, o build falha — de propósito:
 * é melhor o site não publicar do que publicar um artigo partido.
 *
 * Um artigo é um *modelo* de peça (ex.: "Vestido Longo com Fecho e Bolsos").
 * As cores são variantes desse modelo, cada uma com as suas fotografias.
 */
const products = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
  schema: ({ image }) =>
    z.object({
      /** Nome do artigo. */
      nome: z.string().min(1),
      /** Descrição curta para listagens e meta description. */
      resumo: z.string().min(1).max(200),
      /** Preço em euros. Deixar vazio marca o artigo como "sob consulta". */
      preco: z.number().nonnegative().optional(),
      /** Tamanhos disponíveis, por ordem. Vazio = artigo de tamanho único. */
      tamanhos: z.array(z.string().min(1)).default([]),
      /** Categoria do artigo. */
      categoria: z.enum(CATEGORIAS),

      /**
       * Cores disponíveis. A primeira é a que aparece por omissão e nas
       * listagens. Cada cor tem as suas próprias fotografias.
       */
      cores: z
        .array(
          z.object({
            /** Nome da cor como o cliente a vê (ex.: "Bordô"). */
            nome: z.string().min(1),
            /** Fotografias desta cor. A primeira é a principal. */
            fotos: z.array(image()).min(1),
            /** Descrição da foto para leitores de ecrã e para o SEO. */
            alt: z.string().min(1),
            /** Esgota só esta cor, mantendo as outras à venda. */
            esgotado: z.boolean().default(false),
          }),
        )
        .min(1),

      /** Esgota o artigo inteiro, independentemente das cores. */
      esgotado: z.boolean().default(false),
      /** Destaca o artigo na página inicial. */
      destaque: z.boolean().default(false),
      /** Ordem de apresentação dentro da categoria (menor aparece primeiro). */
      ordem: z.number().int().default(0),
      /** Data em que o artigo foi adicionado. */
      data: z.coerce.date().optional(),
      /** Esconde o artigo do site sem apagar o ficheiro. */
      rascunho: z.boolean().default(false),
    }),
});

export const collections = { products };
