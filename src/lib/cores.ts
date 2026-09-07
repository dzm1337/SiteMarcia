/**
 * Cores que têm bolinha desenhada no site.
 *
 * Os tons em si vivem no `src/styles/global.css`, em `.bola[data-tom="..."]`.
 * Não podem estar aqui porque a Content-Security-Policy do site proíbe
 * atributos `style` inline — a cor tem de vir de uma folha de estilos.
 *
 * Para acrescentar uma cor: juntar o nome a esta lista E a regra no global.css.
 * Uma cor que não esteja aqui aparece só com o nome, sem bolinha —
 * nunca com a cor errada.
 */
const TONS_CONHECIDOS = new Set([
  "bordo",
  "chocolate",
  "castanho",
  "preto",
  "branco",
  "creme",
  "bege",
  "verde-azeitona",
  "verde",
  "verde-petroleo",
  "verde-esmeralda",
  "verde-alface",
  "azul-marinho",
  "azul",
  "cinzento",
  "vermelho",
  "rosa",
  "rosa-velho",
  "terracota",
  "ferrugem",
  "laranja",
  "amarelo",
]);

/**
 * Converte o nome de uma cor no identificador usado no CSS.
 * "Bordô" -> "bordo", "Verde-azeitona" -> "verde-azeitona".
 * Devolve `null` se não conhecermos a cor.
 */
export function slugDaCor(nome: string): string | null {
  const slug = nome.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-");

  return TONS_CONHECIDOS.has(slug) ? slug : null;
}
