/**
 * Constrói um link interno do site.
 *
 * No GitHub Pages o site não fica na raiz do domínio, mas sim em
 * `https://<utilizador>.github.io/<nome-do-repo>/`. Todos os links internos
 * têm de levar esse prefixo à frente, senão apontam para fora do site.
 *
 * O prefixo vem do `base` do astro.config.mjs. Usar sempre esta função em vez
 * de escrever `href="/alguma-coisa"` à mão.
 *
 *   caminho()                 -> "/"           ou "/loja/"
 *   caminho("/artigos/x")     -> "/artigos/x"  ou "/loja/artigos/x"
 */
export function caminho(destino = "/"): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, "");
  const relativo = destino.replace(/^\/+/, "");
  return relativo ? `${base}/${relativo}` : `${base}/`;
}
