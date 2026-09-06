# Loja de roupa

Site de catálogo em português. Mostra os artigos e, ao carregar em **Comprar**,
abre o WhatsApp com a mensagem de encomenda já escrita.

Não há carrinho, não há pagamentos e não há base de dados: o site é estático,
o que o torna rápido, barato e com muito pouca superfície de ataque.

## Como correr localmente

Requisitos: [Node.js](https://nodejs.org) 22 ou superior.

```bash
npm install      # instalar dependências (só na primeira vez)
npm run dev      # abrir em http://localhost:4321
```

## Comandos

| Comando                | O que faz                                             |
| ---------------------- | ----------------------------------------------------- |
| `npm run dev`          | Servidor local com recarregamento automático           |
| `npm run build`        | Compila o site para a pasta `dist/`                    |
| `npm run preview`      | Vê o resultado do build como ficará em produção        |
| `npm run check`        | Verifica tipos e o conteúdo dos artigos                |
| `npm run lint`         | Analisa o código à procura de erros                    |
| `npm run format`       | Formata o código automaticamente                       |

## Onde está cada coisa

```
src/
  config/site.ts        Nome da loja, número de WhatsApp, categorias
  content.config.ts     Modelo de dados de um artigo (o que cada artigo tem)
  content/products/     Um ficheiro Markdown por artigo
  lib/whatsapp.ts       Constrói o link de encomenda
  lib/i18n.ts           Todo o texto de interface, em português
  layouts/              Estrutura comum das páginas
  pages/                Cada ficheiro aqui é uma página do site
  styles/global.css     Cores, tipografia e espaçamentos
public/
  _headers              Cabeçalhos de segurança (Cloudflare Pages)
  robots.txt            Instruções para os motores de busca
docs/
  arquitetura.md        Como o site está montado e porquê
  ameacas.md            Riscos de segurança e o que fazemos quanto a eles
  guia-de-edicao.md     Como adicionar e editar artigos
```

## Publicação

O site é publicado no **Cloudflare Pages**, que está ligado a este repositório no
GitHub e recompila sozinho a cada `push` para o `main`.

Definições do projeto no Cloudflare:

| Campo                   | Valor           |
| ----------------------- | --------------- |
| Comando de build        | `npm run build` |
| Pasta de saída          | `dist`          |
| Versão do Node          | `24`            |

Os cabeçalhos de segurança vêm de `public/_headers`.

## Estado

Fases 1 e 2 concluídas: estrutura, build, CI, 15 artigos, encomenda por WhatsApp
e publicação no Cloudflare Pages.
Falta: preços e tamanhos, painel de administração, sistema de design, SEO e
endurecimento final. Ver [docs/arquitetura.md](docs/arquitetura.md).
# SiteMarcia
