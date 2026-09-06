# Arquitetura

## O que este site é

Um catálogo de roupa em português. Mostra artigos; ao carregar em **Comprar**, abre o
WhatsApp com uma mensagem de encomenda pré-preenchida. A encomenda é depois tratada
na conversa, por pessoas.

Não existe: carrinho, checkout, pagamentos, contas de cliente, base de dados ou
servidor aplicacional.

## Decisões e porquê

### Site estático (sem backend)

O site é compilado para ficheiros HTML/CSS/JS e servido tal como está. Não há programa
a correr nem base de dados.

Foi uma escolha deliberada. Para um site que só mostra artigos e abre o WhatsApp, um
backend acrescentaria: um sistema de login para proteger, upload de ficheiros para
validar, um servidor para manter atualizado e uma base de dados para salvaguardar —
tudo isso são riscos e trabalho, sem nada que o visitante notasse. Sem servidor não há
porta para arrombar.

Foi considerada e descartada uma versão com Shopify (excessiva: traz checkout e
pagamentos que não são precisos) e uma com backend em Python (mais superfície de
ataque e manutenção permanente sem benefício visível).

### Astro

Gera páginas estáticas e envia praticamente zero JavaScript para o browser, o que dá
páginas rápidas e bom SEO. Permite ilhas interativas em React só onde são mesmo
precisas — o seletor de tamanho, a galeria de fotografias e o menu em telemóvel.

### Conteúdo em ficheiros + CMS ligado ao Git

Cada artigo é um ficheiro Markdown em `src/content/products/`. O esquema em
`src/content.config.ts` valida-os no build: um artigo mal preenchido faz o build
falhar, em vez de publicar uma página partida.

Na fase 3 entra o **Sveltia CMS** em `/admin`: um painel visual com formulários e
upload de fotografias. Ao gravar, escreve nestes ficheiros através do GitHub e o site
recompila sozinho (cerca de um minuto). O dono da loja não precisa de mexer em código,
e o site continua estático.

### Cloudflare Pages

Alojamento gratuito, rápido em todo o mundo, com HTTPS incluído e sem domínio
próprio necessário: o site fica em `https://<projeto>.pages.dev/`, na raiz.

O Cloudflare está ligado ao repositório no GitHub e recompila sozinho a cada
`push` para o `main` — não há workflow de deploy no repositório.

Foi escolhido em vez do GitHub Pages porque permite **enviar cabeçalhos HTTP**
(`public/_headers`), e é isso que dá a Content-Security-Policy completa, o
`frame-ancestors`, o `X-Frame-Options` e o HSTS. Também funciona com
repositórios **privados**, e mais tarde permite correr a função de servidor de
que o painel `/admin` precisa.

## Fluxo de uma encomenda

1. O visitante abre a página de um artigo.
2. Escolhe um tamanho (se o artigo tiver tamanhos).
3. Carrega em **Encomendar pelo WhatsApp**.
4. Abre o WhatsApp com a mensagem já escrita, em português, com o nome do artigo,
   o tamanho, o preço e o link da página.
5. O visitante carrega em enviar. A partir daí, a conversa é entre pessoas.

A mensagem é construída em `src/lib/whatsapp.ts`. O número está em
`src/config/site.ts`.

## Fases

| Fase | O que inclui                                                          | Estado     |
| ---- | --------------------------------------------------------------------- | ---------- |
| 1    | Estrutura do projeto, build, CI, cabeçalhos de segurança               | Concluída  |
| —    | Publicação no Cloudflare Pages (cabeçalhos de segurança completos)     | Concluída  |
| 2    | Modelo de dados, artigos, páginas de listagem e de artigo              | Concluída  |
| 3    | Painel `/admin`, login por GitHub, guia de edição                      | Por fazer  |
| 4    | Sistema de design: tipografia, cor, espaçamento, componentes           | Por fazer  |
| 5    | Páginas finais e SEO (sitemap, dados estruturados, imagens de partilha) | Por fazer  |
| 6    | Fluxo de WhatsApp completo e medição de cliques                        | Por fazer  |
| 7    | Endurecimento de segurança e orçamento de desempenho                   | Por fazer  |
| 8    | Estatísticas, revisão final e entrega                                  | Por fazer  |

## O que falta decidir

- **Preços e tamanhos** — todos os artigos estão como "Preço sob consulta".
- **Nomes e descrições** dos 12 artigos importados do catálogo do fornecedor
  foram escritos a partir das fotografias e precisam de revisão.
- **Domínio próprio** — não há, e por agora não é preciso. Quando houver,
  aponta-se no Cloudflare e muda-se o `SITE_URL`.
- **Categorias** — as atuais (`src/config/site.ts`) são uma proposta.
