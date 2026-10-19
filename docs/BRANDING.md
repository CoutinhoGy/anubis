# Potigy sobre Anubis v1.28.1

## Base e limites

Base: tag `v1.28.1`, commit `da1270fcb927e2feac922711f7a5ce54b6a09ef5`.
Branch: `potigy/branding`. Release prevista: `v1.28.1-potigy1`.
Fork público: https://github.com/CoutinhoGy/anubis. Registry escolhido após
autorização do dono: `ghcr.io/coutinhogy/anubis`. O código está publicado;
a publicação manual da imagem é acompanhada separadamente da implantação.
A licença desta tag é MIT; LICENSE e atribuições são preservados.

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

- Por instrução posterior do dono, o rodapé contém somente uma linha:
  “Desenvolvido por Techaro e CELPHASE”, com os dois links. A frase é localizada
  nos 29 idiomas. Não há versão, país, crédito Potigy extra ou mascote na interface.
- Os arquivos originais dos mascotes conservam seus bytes e atribuição no
  código-fonte, mas nenhuma imagem é renderizada ou carregada pela interface.
  O lockup Potigy é o foco. Um span oculto mantém o ponto de apresentação
  #image esperado pelo JS upstream, sem imagem ou requisição de rede.
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
possuem as mesmas chaves, incluindo `developed_by`, `credit_and`, `error_next_action`,
`imprint_label` e os rótulos do benchmark. Nomes próprios, créditos e rótulos
técnicos corretos são mantidos; as mensagens de acesso explicam a computação
e a próxima ação. Diagnósticos originais continuam disponíveis.

A apresentação comum está em `web/index.templ` e `xess/xess.css`.
O lockup usa as coordenadas do símbolo existente Potigy. As imagens CELPHASE
não são exibidas. O rodapé contém somente o crédito de desenvolvimento dos
dois autores, com links, sem país ou versão.
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
tema escuro, movimento reduzido, logs e `results.json`. O teste exige zero elementos de imagem
e uma única linha de crédito, completa o desafio de verdade nos dois idiomas, abre a explicação
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

Os workflows que publicariam imagem em push/PR estão bloqueados no fork.
Após autorização do dono em 19/10/2026, `docker.yml` permite execução manual
somente em `CoutinhoGy/anubis`, com destino `ghcr.io/coutinhogy/anubis`.
O build continua usando assets e containerbuild/ko upstream, configuração
`.ko.yaml`, base estática e USER 1000; testes Go, vet e guarda precedem o push.
Uma imagem candidata não equivale à tag de release aceita nem à implantação.

## Integração e reversão na VPS: pendentes

Não foram alterados compose, Caddy, policy, Vault, secrets ou sync-docs do Potigy.
Fork e registry foram definidos e o código enviado. Antes de
integrar: comprovar backup Oracle verde, publicar no destino autorizado, registrar
o digest real e revisar a troca restrita de imagem no compose e do alvo de docs.

Na operação autorizada, usar recreate somente do Anubis, com `--no-deps`,
preservando user/userns/volumes/envs/POLICY_FNAME e sem porta pública nova.
Repetir a bateria pela entrada pública e guardar as provas. Reverter é restaurar
a referência anterior da imagem upstream, recriar somente Anubis com `--no-deps`
e repetir a bateria. Esse rollback de produção permanece pendente.

A resposta HTTP textual `authorization_required` permanece literalmente igual
ao upstream em todos os idiomas, por ser parte da resposta de API, e não do
rodapé/página do desafio. O verificador compara esse valor com a tag original.

## Resultado da implementação local

| Verificação | Resultado |
|---|---|
| `node scripts/verificar-branding.mjs` | PASS: 29 catálogos; fontes protegidas e fluxo de cálculo intactos |
| Testes Go de apresentação, localização e desafios no Windows | PASS |
| `SKIP_INTEGRATION=1 go test -p 2 ./...` no Linux | PASS; suíte de integração upstream separada não executada |
| `go vet -p 2 ./...` no Linux | PASS |
| Navegador real PT/EN | PASS: cálculo, erros, HTTP 401 literal, teclado, foco, reduced-motion, dark/mobile |
| Crédito único e ausência de imagens | PASS em páginas PT/EN; renderização de erro nos 29 idiomas |
| ko, tar local, `--push=false` | PASS: base estática original, USER 1000, entrypoint `/ko-app/anubis`, nenhum shell |
| Execução local em container com keep-id e user 1000:1000 | PASS: entrypoint executado, container removido ao sair |

As provas estão em `docs/branding/evidence/`; `docs/branding/preview.html`
apresenta PT/EN lado a lado. O tar local está em `var/potigy-anubis-proof.tar`.
Seu digest local consta em `image-inspect.json` e não representa uma publicação
em registry. A imagem de prova vem de snapshot sem tag e informa `devel` na CLI;
o binário Linux de prova informa `v1.28.1-potigy1` pelo ldflag descrito acima.
Nenhuma versão é exibida na interface.

O teste em container foi apenas do entrypoint, sem rede. A bateria completa
de navegação usou os processos locais e o ingresso isolado descritos acima;
não é uma afirmação de aceitação do compose real ou de implantação na VPS.
As provas acima descrevem a implementação local anterior à publicação.
O código foi enviado ao fork em 19/10/2026. Não houve tag de release, alteração
de produção ou rollback na VPS. A integração e o hook específico da stack
continuam pendentes.

## Portão de implantação medido em 19/10/2026

A aferição do backend retornou exit 0. A verificação por SSH, como `potigy`,
encontrou o container `potigy-anubis` ainda usando a imagem upstream v1.28.1.
O serviço `potigy-backup-pg.service` terminou em 19/10/2026 às 03:22:44 UTC
com `Result=exit-code`, `ExecMainStatus=1`. Os uploads à Oracle falharam com
`StorageLimitExceeded`, inclusive as peças Vault e Stalwart. Portanto, o
pré-requisito de backup verde não foi atendido: implantação e rollback de
produção não são executados enquanto essa condição persistir. Nenhum backup
foi apagado e nenhuma configuração de armazenamento foi alterada.

## Publicação verificada

Workflow https://github.com/CoutinhoGy/anubis/actions/runs/39248837254:
sucesso no build upstream, testes Go (`SKIP_INTEGRATION=1`), vet, guarda de
apresentação, publicação ko e atestação de proveniência. Fonte:
`234035c787e0349259c38de9ad1e04d31b106c81`.

Imagem candidata: `ghcr.io/coutinhogy/anubis:potigy-branding`.
Referência imutável:
`ghcr.io/coutinhogy/anubis@sha256:8651d5853bf49e8c5369d7d2252d182994796330133b5832b0ac504396f272b5`.
O manifesto do registry retornou HTTP 200 com token anônimo, confirmando
acesso sem login; plataformas publicadas: linux/amd64 e linux/arm64.
O pull por digest e a execução do entrypoint da imagem publicada passaram
no Podman local isolado, com keep-id e user 1000:1000, sem rede no container.
Provas resumidas em `docs/branding/evidence/publication.json`.

O build upstream atribuiu à CLI a pseudoversão
`v1.28.2-0.20261019120059-234035c787e0+dirty`: ela identifica o commit do
candidato e a geração de assets, não uma mudança da base v1.28.1 para v1.28.2.
Não há versão na interface. A tag de release `v1.28.1-potigy1` continua
reservada à aceitação completa; não foi criada para contornar o portão do
backup ou a aceitação na VPS.
