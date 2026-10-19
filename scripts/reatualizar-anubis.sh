#!/usr/bin/env bash
set -euo pipefail

# Local candidate only. No push, registry publication or production mutation.
version="${1:?Uso: scripts/reatualizar-anubis.sh vX.Y.Z}"
[[ "$version" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo 'Versão inválida' >&2; exit 2; }
cd "$(git rev-parse --show-toplevel)"
[[ -z "$(git status --porcelain)" ]] || { echo 'Checkout sujo: pare e preserve as alterações.' >&2; exit 2; }
for command in git node npm go ko podman; do command -v "$command" >/dev/null || { echo "Falta $command" >&2; exit 2; }; done
: "${POTIGY_POLICY_FILE:?Informe a policy real de produção, em caminho absoluto}"
: "${POTIGY_ACCEPTANCE_HOOK:?Informe o executável de aceitação completo da stack de prova}"
[[ "$POTIGY_POLICY_FILE" = /* && -r "$POTIGY_POLICY_FILE" ]] || exit 2
[[ -x "$POTIGY_ACCEPTANCE_HOOK" ]] || exit 2
[[ "${CONTAINER_HOST:-}" != ssh://* && "${DOCKER_HOST:-}" != ssh://* ]] || { echo 'Use um engine local de prova, sem conexão SSH com produção.' >&2; exit 2; }
# Windows can have the VPS as the saved default even with no env variable set.
# Force the local engine; an unavailable local engine must fail closed.
podman_local() { command podman --remote=false "$@"; }
podman_local info >/dev/null

mapfile -t series < <(git rev-list --reverse v1.28.1..potigy/branding)
[[ "${#series[@]}" -gt 0 ]] || exit 2
git fetch upstream "refs/tags/$version:refs/tags/$version"
branch="potigy/update-$version"
git switch -c "$branch" "$version"
for commit in "${series[@]}"; do
  if ! git cherry-pick -x "$commit"; then
    echo 'Conflito: pare aqui. Um humano deve revisar e resolver; nada será reconstruído ou tagueado.' >&2
    exit 3
  fi
done

npm ci
npm run assets
SKIP_INTEGRATION=1 go test ./...
go vet ./...
node scripts/verificar-branding.mjs "$version"

proof="$(mktemp -d)"
name="potigy-anubis-proof-$$"
cleanup() { podman_local rm -f "$name" >/dev/null 2>&1 || true; }
trap cleanup EXIT
image=localhost/potigy-anubis-proof
# Same ko config and static base as upstream. One platform makes a loadable tar.
CGO_ENABLED=0 KO_DOCKER_REPO="$image" ko build --bare --push=false \
  --platform=linux/amd64 --image-user=1000 --tarball="$proof/image.tar" ./cmd/anubis
podman_local load --input "$proof/image.tar"
id="$(podman_local image inspect "$image:latest" --format '{{.Id}}')"
[[ "$(podman_local image inspect "$id" --format '{{.Config.User}}')" == 1000 ]] || exit 4
podman_local image inspect "$id" > "$proof/image-inspect.json"
podman_local run -d --name "$name" --pids-limit=2048 --userns=keep-id --user=1000:1000 \
  --publish 127.0.0.1::8923 \
  --volume "$POTIGY_POLICY_FILE:/proof/policy.yaml:ro" \
  --volume "$proof:/data:Z" \
  "$id" --policy-fname=/proof/policy.yaml
port="$(podman_local port "$name" 8923/tcp)"
# The hook must configure the test target, exercise PT/EN, workers, Googlebot,
# bypass routes, keyboard, contrast and reduced motion against THIS container.
# It must also prove upstream rollback on the isolated stack and return nonzero
# on any missing proof. No default hook can silently treat an absent check as PASS.
POTIGY_PROOF_CONTAINER="$name" POTIGY_PROOF_URL="http://$port" \
  POTIGY_PROOF_OUTPUT="$proof" "$POTIGY_ACCEPTANCE_HOOK"
[[ -s "$proof/acceptance.json" ]] || { echo 'Falta acceptance.json do hook.' >&2; exit 4; }
node --input-type=module - "$proof/acceptance.json" <<'NODE'
import fs from 'node:fs';
const report=JSON.parse(fs.readFileSync(process.argv[2]));
for(const key of ['pt','en','staticCss','realChallenge','googlebot','bypassApp','bypassHealth','contrast','keyboard','reducedMotion','upstreamRollback']) {
 if(report[key] !== true) throw new Error(`Aceitação incompleta: ${key}`);
}
NODE
tag="$version-potigy1"
git tag -a "$tag" -m "Potigy branding; proof: $proof"
printf 'Candidato local: %s\nProvas: %s\nImagem local: %s\nNenhum push ou deploy realizado.\n' "$tag" "$proof" "$id"
