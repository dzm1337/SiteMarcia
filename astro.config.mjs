// @ts-check
import { defineConfig } from "astro/config";

/*
 * O site é publicado no Cloudflare Pages, que o serve na raiz do endereço
 * (https://<projeto>.pages.dev/). Por isso o BASE_PATH é "/".
 *
 * O SITE_URL é usado para os links canónicos e para o link do WhatsApp.
 * Definir nas variáveis de ambiente do Cloudflare Pages se o projeto tiver
 * outro nome, ou quando houver domínio próprio.
 */
const SITE_URL = process.env.SITE_URL ?? "https://suacaramodas.pages.dev";
const BASE_PATH = process.env.BASE_PATH ?? "/";

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  output: "static",
  trailingSlash: "ignore",
  build: {
    format: "directory",
    /*
     * Estilos sempre em ficheiros, nunca em <style> inline. É isto que nos
     * permite ter `style-src 'self'` sem 'unsafe-inline' na CSP.
     */
    inlineStylesheets: "never",
  },
  image: {
    // Só permitimos otimizar imagens locais. Sem domínios remotos = sem SSRF.
    domains: [],
    remotePatterns: [],
  },
  devToolbar: {
    enabled: false,
  },
  /*
   * A CSP NÃO é gerada aqui de propósito.
   *
   * No Cloudflare Pages conseguimos enviar cabeçalhos HTTP a sério, e a CSP
   * completa está em `public/_headers` — que também consegue coisas que um
   * <meta> nunca conseguiria: `frame-ancestors` e `Strict-Transport-Security`.
   *
   * Ter as duas ao mesmo tempo (meta + cabeçalho) faria com que os browsers
   * aplicassem as duas em conjunto, o que dá conflitos difíceis de diagnosticar.
   */
  vite: {
    build: {
      // 0 = nunca embutir. Sem isto o Astro mete os scripts pequenos inline no
      // HTML, e a CSP (`script-src 'self'`, sem 'unsafe-inline') bloqueia-os.
      assetsInlineLimit: 0,
    },
  },
});
