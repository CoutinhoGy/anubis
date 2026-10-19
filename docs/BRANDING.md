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
  Por orientação do dono durante a implementação, sua exibição fica restrita
  a 28px no canto do rodapé. O lockup Potigy é o foco da página. A limitação
  vale também para a imagem recriada pelo desafio Preact e é medida no navegador.
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

## Onde editar e como construir

Os textos ficam em `lib/localization/locales/<idioma>.json`. Os 29 catálogos
possuem as mesmas chaves, incluindo `potigy_credit`, `error_next_action`,
`imprint_label` e os rótulos do benchmark. Nomes próprios, créditos e rótulos
técnicos corretos são mantidos; as mensagens de acesso explicam a computação
e a próxima ação. Diagnósticos originais continuam disponíveis.

A apresentação comum está em `web/index.templ` e `xess/xess.css`.
O lockup usa as coordenadas do símbolo existente Potigy; o mascote original
fica no canto do rodapé a 28px. Não há substituição de arte CELPHASE.
As quatro fontes WOFF2 locais estão em `xess/static/potigy/`, com as três
licenças OFL originais ao lado. O postcss upstream incorpora as fontes no CSS;
`font-display: swap` e os fallbacks permitem a primeira pintura sem aguardar fonte.

Build Linux pelo sistema upstream, sem alteração de dependências:

```sh
npm ci
npm run assets
SKIP_INTEGRATION=1 go test ./...
go vet ./...
node scripts/verificar-branding.mjs
go build -buildvcs=false -ldflags '-X github.com/TecharoHQ/anubis.Version=v1.28.1-potigy1' -o var/anubis ./cmd/anubis
```

Use os pré-requisitos upstream: Go 1.26+, Node compatível com o lockfile
(CI desta tag usa 24.15.0), Rust com wasm32-unknown-unknown, esbuild, gzip,
brotli, zstd e Wasmtime/Binaryen 130. O Node 24.14 local precisou de
`--experimental-wasm-exnref` no invocador do WASM do compilador. Isso foi
resolvido por um wrapper temporário em `var/`, sem alteração dos scripts
upstream ou de configuração do host.

`-buildvcs=false` no binário de prova evita que o Go substitua o ldflag pela
pseudoversão do checkout sujo. O código de versão upstream permanece intacto.
A tag de release só deve ser criada depois de toda a aceitação exigida.

## Verificações locais

```powershell
$env:POTIGY_POLICY_FILE = '<caminho absoluto da cópia da botPolicy.yaml>'
node scripts/verificar-navegador.mjs var/anubis.exe <binário oficial upstream>
```

O verificador sobe somente processos locais, um alvo HTTP de prova e um ingresso
de teste que reproduz a separação de `/`, `/login`, recursos Anubis e rotas diretas.
Usa as regras da policy real sem alterações. Os caminhos bbolt e o bind de métricas
são temporários. Os cookies Secure/Partitioned são desligados **somente nos dois
processos de prova sobre HTTP local**; configuração e defaults de produção não mudam.

Evidências são gravadas em `var/branding-evidence/`: capturas PT/EN, mobile,
tema escuro, movimento reduzido, logs e `results.json`. O teste mede o mascote
em até 28px, completa o desafio de verdade nos dois idiomas, abre a explicação
com Tab/Enter e aciona o botão de continuação exclusivamente por teclado.
Googlebot é testado com UA e endereço da faixa curada; apenas falsificar o UA
não satisfaz a regra upstream. O replay do binário oficial prova o retorno
ao upstream no ingresso local. Isso não equivale a rollback executado na VPS.

`scripts/verificar-branding.mjs` reprova mudanças fora da apresentação, compara
o fluxo do cálculo e do benchmark com a tag base, verifica os bytes dos mascotes,
robots, manifest, dependências e configuração ko. Também verifica cobertura
dos 29 catálogos, atribuições, foco, reduced-motion e contrastes sRGB.

No Windows, a suíte global upstream depende de sockets Unix/permissões POSIX
e inclui um pacote de integração que não compila nessa plataforma. Não
removemos esses testes nem alteramos código para contorná-los. Os testes dos
pacotes de apresentação, localização e desafio passam no Windows; a suíte
global deve ser executada no Linux, com seus resultados registrados como tal.

## Atualização sem resolver conflitos automaticamente

```sh
POTIGY_POLICY_FILE=/copia/somente-leitura/botPolicy.yaml \
POTIGY_ACCEPTANCE_HOOK=/caminho/absoluto/aceitar-stack-de-prova \
  bash scripts/reatualizar-anubis.sh vX.Y.Z
```

O script exige checkout limpo e ferramentas locais, busca a tag no remote
`upstream`, cria `potigy/update-vX.Y.Z` e aplica a série de commits de
`potigy/branding` com `cherry-pick -x`. Qualquer conflito termina com exit 3,
preservando o estado para um humano. Nenhuma resolução de texto é automática.

Depois constrói os assets, roda testes/vet/guardas e cria a imagem com o ko
original, base estática, USER 1000, `--push=false` e tar local. O container de
prova usa userns keep-id, user 1000:1000, policy real somente leitura e bbolt
temporário. O hook obrigatório deve preparar o alvo/ingresso de prova e
executar a aceitação completa contra `POTIGY_PROOF_URL`, registrando
`POTIGY_PROOF_OUTPUT/acceptance.json` com todos os itens true:
`pt`, `en`, `staticCss`, `realChallenge`, `googlebot`, `bypassApp`,
`bypassHealth`, `contrast`, `keyboard`, `reducedMotion`, `upstreamRollback`.
O hook é específico da stack do operador e ainda precisa ser fornecido/configurado;
ausência de hook ou prova não passa silenciosamente. A tag local só nasce após
todos os gates; o script nunca publica, dá push ou modifica a VPS.

Os workflows upstream que publicariam imagem em push/PR estão bloqueados no
fork por condição de repositório. O sistema de build e `.ko.yaml` continuam iguais.
Publicação autorizada futuramente exige um fluxo manual com destino explícito.

## Integração e reversão na VPS: pendentes

Não foram alterados compose, Caddy, policy, Vault, secrets ou sync-docs do Potigy.
Faltam o fork remoto confirmado e o registry escolhido pelo dono. Antes de
integrar: comprovar backup Oracle verde, publicar no destino autorizado, registrar
o digest real e revisar a troca restrita de imagem no compose e do alvo de docs.

Na operação autorizada, usar recreate somente do Anubis, com `--no-deps`,
preservando user/userns/volumes/envs/POLICY_FNAME e sem porta pública nova.
Repetir a bateria pela entrada pública e guardar as provas. Reverter é restaurar
a referência anterior da imagem upstream, recriar somente Anubis com `--no-deps`
e repetir a bateria. Esse rollback de produção permanece pendente.
