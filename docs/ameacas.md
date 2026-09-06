# Modelo de ameaças

O que pode correr mal neste site, e o que está feito quanto a isso.

## O que há a proteger

1. **O site em si** — que não seja desfigurado nem usado para distribuir malware.
2. **O acesso ao painel de administração** — quem lá entra pode alterar o site.
3. **A reputação do número de WhatsApp** — que não seja abusado.

Não há dados de clientes armazenados: não há contas, não há pagamentos, não há base
de dados. Uma falha aqui não expõe dados pessoais de ninguém, porque não existem.

## Riscos e mitigações

### 1. Alguém toma conta do painel de administração — risco alto

O painel `/admin` (fase 3) autentica pelo GitHub. Quem controlar essa conta pode
publicar o que quiser no site.

- Acesso só a contas GitHub explicitamente autorizadas no repositório.
- **Autenticação de dois fatores obrigatória** nas contas GitHub com acesso.
- O segredo da aplicação OAuth vive nas variáveis de ambiente do Cloudflare, nunca
  no repositório.
- Todas as alterações ficam registadas no histórico do Git — dá para ver quem mudou
  o quê e reverter.
- Proteção do ramo `main` no GitHub.

### 2. Dependências comprometidas (supply chain) — risco médio

O site usa pacotes npm de terceiros. Um pacote comprometido corre no build.

- `package-lock.json` commitado: as versões são exatas e reproduzíveis.
- `npm audit --audit-level=high` na CI; o build falha com vulnerabilidades graves.
- Dependabot semanal, com atualizações pequenas agrupadas.
- Poucas dependências, e todas de projetos conhecidos.

### 3. Injeção de código através do conteúdo (XSS) — risco médio

Quem edita artigos escreve texto que vai parar ao HTML. Markdown permite HTML.

- A Content-Security-Policy em `public/_headers` bloqueia scripts e estilos que não
  venham do próprio site (`script-src 'self'`, `style-src 'self'`, `object-src 'none'`),
  sem qualquer `'unsafe-inline'`.
- O esquema em `src/content.config.ts` valida e limita os campos.
- Na fase 2, o Markdown dos artigos será processado sem HTML embutido.

### 4. Fuga de segredos para o repositório — risco médio

- `gitleaks` corre na CI em cada alteração e no histórico completo.
- `.env` está no `.gitignore`; só `.env.example` é commitado, sem valores reais.
- Nada no site precisa de segredos: é um site estático, sem chaves nem tokens.
- O repositório pode ser privado — o Cloudflare Pages funciona com repositórios
  privados, ao contrário do GitHub Pages gratuito.

### 5. Interceção de tráfego — risco baixo

- HTTPS obrigatório, com certificado gerido pelo Cloudflare.
- HSTS (`Strict-Transport-Security`) ativo, com um ano de validade.
- Sem domínio próprio não há risco de o perder nem de alguém o transferir. Em
  contrapartida, o site depende das contas GitHub e Cloudflare: **2FA obrigatória
  nas duas**.

### 6. Enquadramento do site noutro site (clickjacking) — risco baixo

- `X-Frame-Options: DENY` e `frame-ancestors 'none'`, ambos em cabeçalho HTTP.

### 7. Abuso do número de WhatsApp — risco baixo

O número é público por definição: está no link de cada artigo. É inevitável e é o
objetivo. O risco real é spam.

- Usar um **número dedicado ao negócio** (WhatsApp Business), nunca o pessoal.
- O link não envia nada sozinho: o cliente vê a mensagem e decide enviar.
- Nunca colocar dados sensíveis na mensagem pré-preenchida.

### 8. Cópia do catálogo por robôs / excesso de tráfego — risco baixo

- Cloudflare à frente do site: cache global, proteção contra robôs e contra
  ataques de negação de serviço, tudo no plano gratuito.
- Sendo estático, o site aguenta picos de tráfego sem esforço.

### 9. SSRF através de imagens externas — mitigado por construção

- `astro.config.mjs` não permite domínios remotos de imagem. Só se otimizam
  imagens locais.

## Limitações conhecidas (a resolver na fase 7)

- A CSP de `/admin` terá de ser mais permissiva (o painel comunica com a API do
  GitHub). Será uma regra separada em `_headers`, só para esse caminho.
- Ainda não há análise estática (CodeQL) nem verificação de acessibilidade na CI.
- Decidir, antes de haver domínio próprio, se se submete à lista HSTS preload
  (é eficaz mas difícil de reverter).

## Verificações antes do lançamento

- [ ] `securityheaders.com` com nota A ou superior
- [ ] Mozilla Observatory sem falhas graves
- [ ] `npm audit` limpo
- [ ] Análise CodeQL sem alertas
- [ ] Revisão com as skills OWASP e `security-review`
- [ ] 2FA ativa nas contas GitHub e Cloudflare
- [ ] Testar que o link de WhatsApp funciona em Android, iPhone e computador
- [ ] Testar o site com teclado apenas e com leitor de ecrã
