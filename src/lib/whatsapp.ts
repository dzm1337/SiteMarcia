import { WHATSAPP_NUMERO } from "@/config/site";

export interface EncomendaWhatsapp {
  /** Nome do artigo, tal como aparece no site. */
  produto: string;
  /** Tamanho escolhido pelo cliente, se o artigo tiver tamanhos. */
  tamanho?: string;
  /** Preço já formatado (ex.: "89,00 €"). Omitido em artigos sob consulta. */
  preco?: string;
  /** URL absoluto da página do artigo. */
  url: string;
}

/**
 * Constrói o link `wa.me` com a mensagem de encomenda pré-preenchida.
 *
 * Abre a aplicação WhatsApp no telemóvel e o WhatsApp Web no computador.
 * Não envia nada sozinho — o cliente vê a mensagem e carrega em enviar.
 */
export function construirLinkWhatsapp({ produto, tamanho, preco, url }: EncomendaWhatsapp): string {
  const partes = [`Olá! Tenho interesse neste artigo: ${produto}`];

  if (tamanho) partes.push(`tamanho ${tamanho}`);
  if (preco) partes.push(preco);

  const mensagem = `${partes.join(" — ")}.\n${url}`;

  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}

/** Formata um valor em euros no formato português: 89 -> "89,00 €". */
export function formatarPreco(valor: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(valor);
}
