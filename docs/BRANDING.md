# Potigy sobre Anubis v1.28.1

## Base e limites

Base: tag `v1.28.1`, commit `da1270fcb927e2feac922711f7a5ce54b6a09ef5`.
Branch local: `potigy/branding`. Destino previsto: `v1.28.1-potigy1`.
O fork remoto e o registry ainda não foram definidos/confirmados. Nenhum push,
publicação de imagem, compose, Caddy, Vault ou serviço de produção faz parte
da implementação local. A licença desta tag é MIT; LICENSE e atribuições são preservados.

## Inventário anterior ao branding

Executado o binário oficial do release Windows amd64:

```powershell
anubis.exe --version
# Anubis v1.28.1
anubis.exe --extract-resources ./var/upstream-resources
```

Extraídos 158 arquivos: 71 de dados/policies e 87 recursos estáticos.
A extração NÃO inclui templates Go nem o FS de Xess: esses foram inventariados
diretamente no checkout. O manifesto de hashes e chaves anterior às alterações
está em `docs/branding/upstream-inventory.json`.

| Superfície | Fonte | Decisão |
|---|---|---|
| Documento, título, créditos, versão, imprint | `web/index.templ` | Marca e acessibilidade; links/créditos originais preservados |
| Desafio proof-of-work | `lib/challenge/proofofwork/proofofwork.templ` | Texto localizado, apresentação e status acessível |
| Desafio WASM | `lib/challenge/wasm/wasm.templ` | Mesma apresentação; algoritmo intacto |
| Explicação e falha de carregamento | `lib/challenge/challengepage/` | Texto e summary; bootstrap intacto |
| Desafio por refresh | `lib/challenge/metarefresh/metarefresh.templ` | Texto/ARIA; tempo, URL e Refresh intactos |
| Desafio Preact | `lib/challenge/preact/` | Texto/ARIA; cálculo, efeitos e redirecionamento intactos |
| Erro, reject e diagnóstico de proxy | `web/index.templ`, `lib/localization/locales/` | Próxima ação localizada; código e HTTP intactos |
| Benchmark, controles e resultados | `web/index.templ`, `web/js/bench.ts` | Rótulos localizados; cálculo intacto |
| Imprint de policy | `web/index.templ`, configuração do operador | Conteúdo da policy preservado |
| Honeypot e labirinto | `internal/honeypot/naive/`, `web/index.go` | Intactos: superfície deliberada para bots, parte do mecanismo |
| robots.txt servido | `web/static/robots.txt` | Bytes intactos: regras de crawling não são branding |
| CSS e fontes | `xess/xess.css`, `xess/static/`, estilo inline de `web/index.templ` | Tokens exatos e fallbacks locais |
| Mascote pensativo | `web/static/img/pensive.webp` | Original, 256 × 256, CELPHASE |
| Mascote feliz | `web/static/img/happy.webp` | Original, 256 × 256, CELPHASE |
| Mascote de bloqueio | `web/static/img/reject.webp` | Original, 256 × 256, CELPHASE |
| Atribuição das imagens | `web/static/img/ATTRIBUTIONS.txt` | Bytes intactos |
| JS/Workers/WASM | `web/js/`, `wasm/` | Algoritmos e transporte intactos; apenas apresentação declarada |
| Locales servidos | `lib/localization/locales/*.json` | Todos os 29 catálogos, inclusive eu/th ausentes do manifest upstream |

Locales: bg, cs, de, en, es, et, eu, fi, fil, fr, hr, is, it, ja, lt,
nb, nl, nn, pl, pt-BR, pt-PT, ru, sv, th, tr, uk, vi, zh-CN, zh-TW.
O `manifest.json` original permanece intacto: mudar a negociação de idioma
está fora do escopo. Textos de crédito, nomes próprios, unidades e rótulos
técnicos corretos podem conservar sua tradução; todos os estados são revisados.

## Identidade verificada

Fontes: DESIGN.md, paleta_potigy.svg, packages/config/tailwind/preset.cjs,
apps/web-solid/src/app.css e packages/ui-solid/src/brand/logo.tsx do Potigy.

| Papel | Token | Contraste no par indicado |
|---|---|---|
| Papel quente / corpo | #F6F6F2 / #1A2F26 | 13,11:1 |
| Verde da marca / papel | #183729 / #F6F6F2 | 11,98:1 |
| Neutro / papel | #3E564F / #F6F6F2 | 7,32:1 |
| Dourado / texto sobre dourado | #F1BE49 / #3E2A00 | 7,94:1 |
| Tinta / texto claro | #0F241A / #EBEBEB | 13,68:1 |
| Erro forte / papel | #8F3A34 / #F6F6F2 | 6,87:1 |

Razões calculadas por luminância relativa sRGB, cores opacas. O dourado
sobre papel (1,59:1) não é texto. Telha #C0544C sobre papel (4,20:1) não é
texto pequeno. Bricolage Grotesque para títulos, Inter na UI e IBM Plex Mono
para código, sempre com fallback do sistema e sem requisição a webfont externa.

## Invariantes

- Techaro e CELPHASE continuam visíveis. A linha Potigy fica imediatamente
  abaixo dos créditos originais e em tamanho menor.
- Mascotes originais conservam nomes, dimensões, bytes e atribuição.
- A barra upstream é uma estimativa probabilística derivada de tentativas
  reais, não uma fração mensurável de conclusão. Sua fórmula permanece intacta;
  a explicação deixa isso explícito e não promete prazo.
- `prefers-reduced-motion: reduce` mantém barra/estado legíveis sem transição,
  pulso ou animação contínua. Atualização numérica continua disponível.
- Nenhum algoritmo, policy, status HTTP, cookie, porta, env, retry, timeout,
  endpoint, worker ou payload de validação é alterado.
- Build de imagem continua pelo ko upstream, base estática, USER 1000 e
  entrypoint direto. Nunca executar o publicador sem ordem e destino explícitos.

## Situação de entrega

Inventário concluído antes da edição de branding. Implementação e evidências
locais serão registradas abaixo. Publicação, digest e bateria na VPS só podem
ser declarados após execução real; não há digest reservado ou inventado.
