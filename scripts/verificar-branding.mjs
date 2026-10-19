import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const base = process.argv[2] || 'v1.28.1';
const read = p => fs.readFileSync(p, 'utf8').replaceAll('\r\n', '\n');
const original = p => execFileSync('git', ['show', `${base}:${p}`], { encoding: 'utf8', maxBuffer: 8e6 }).replaceAll('\r\n', '\n');
const changed = execFileSync('git', ['diff', '--name-only', base, '--'], { encoding: 'utf8' }).trim().split('\n');
const allowed = /^(docs\/BRANDING\.md|docs\/branding\/.*|scripts\/.*|\.github\/workflows\/docker(?:-pr)?\.yml|lib\/localization\/localization_test\.go|lib\/localization\/locales\/(?!manifest\.json)[^/]+\.json|xess\/xess\.css|xess\/static\/potigy\/.*|web\/index(?:\.templ|_templ\.go)|web\/js\/(main|bench)\.ts|lib\/challenge\/challengepage\/explanation(?:\.templ|_templ\.go)|lib\/challenge\/(proofofwork|wasm|preact|metarefresh)\/[^/]+(?:\.templ|_templ\.go)|lib\/challenge\/preact\/js\/app\.tsx)$/;
for (const p of changed.filter(Boolean)) if(!['web/branding_test.go','.gitattributes'].includes(p)) assert.match(p, allowed, `Non-presentation change: ${p}`);
assert.equal(read('.gitattributes'), original('.gitattributes').trimEnd()+'\n\nscripts/reatualizar-anubis.sh text eol=lf\n');
for (const p of ['.ko.yaml', 'go.mod', 'go.sum', 'package.json', 'package-lock.json', 'web/static/robots.txt', 'web/static/img/ATTRIBUTIONS.txt', 'lib/localization/locales/manifest.json']) {
  assert.equal(read(p), original(p), `${p} must be unchanged`);
}
for (const name of ['happy', 'pensive', 'reject']) {
  const p = `web/static/img/${name}.webp`;
  assert.deepEqual(fs.readFileSync(p), execFileSync('git', ['show', `${base}:${p}`]), `${p} changed`);
}
// Remove only the explicitly allowed styling and accessibility DOM attributes.
// All computation, branching, timers, payloads, requests and redirects must match.
const maskMain = s => s.replace(/^\s*container\.style\.[^\n]+\n/gm, '')
  .replace(/^\s*container\.(?:setAttribute|removeAttribute)\([^\n]+\n/gm, '');
assert.equal(maskMain(read('web/js/main.ts')), maskMain(original('web/js/main.ts')), 'Challenge control flow changed');
const maskPreact = s => s.replace(/<img\b[^>]*\/>/g, 'MASCOT_PRESENTATION').replace('<span id="image" hidden aria-hidden="true"></span>', 'MASCOT_PRESENTATION').replace(' aria-live="polite" aria-atomic="true"', '');
assert.equal(maskPreact(read('lib/challenge/preact/js/app.tsx')), maskPreact(original('lib/challenge/preact/js/app.tsx')), 'Preact control flow changed');
const maskBench = s => s.replace(/^import \{ j \} from "\.\/lib\/xeact\.mjs";\n\nconst benchmarkText = j\("potigy_benchmark"\);\n/m, '')
  .replace(/^\s*status\.innerText = `(?:Average hashrate:|\$\{benchmarkText\.average\})[^\n]+\n/gm, '')
  .replace(/^\s*status\.innerText \+= [^\n]+\n/gm, '')
  .replace(/^\s*status\.innerText = (?:"Benchmarking\.\.\."|benchmarkText\.running|e|`\$\{benchmarkText\.failure\} \$\{e\}`);\n/gm, '');
assert.equal(maskBench(read('web/js/bench.ts')),maskBench(original('web/js/bench.ts')),'Benchmark control flow changed');
const en = JSON.parse(read('lib/localization/locales/en.json'));
const langs = fs.readdirSync('lib/localization/locales').filter(p => p.endsWith('.json') && p !== 'manifest.json');
for (const file of langs) {
  const messages = JSON.parse(read(`lib/localization/locales/${file}`));
  for (const key of Object.keys(en)) assert.ok(typeof messages[key] === 'string' && messages[key].trim(), `${file}: missing ${key}`);
  for (const [key, value] of Object.entries(messages)) assert.doesNotMatch(value, /[\p{Extended_Pictographic}\p{Regional_Indicator}]/u, `${file}:${key}: emoji`);
  assert.equal(messages.celphase, 'CELPHASE');
  assert.ok(messages.developed_by && messages.credit_and);
  assert.equal(messages.authorization_required, JSON.parse(original(`lib/localization/locales/${file}`)).authorization_required, 'Plain HTTP authorization response changed');
}
assert.equal(en.developed_by, 'Developed by');
assert.equal(JSON.parse(read('lib/localization/locales/pt-BR.json')).developed_by, 'Desenvolvido por');
const css = read('xess/xess.css');
assert.match(css, /prefers-reduced-motion:\s*reduce/);
assert.doesNotMatch(css, /transition:\s*all/);
assert.match(css, /:focus-visible/);
for (const p of ['proofofwork', 'wasm', 'metarefresh', 'preact']) assert.match(read(`lib/challenge/${p}/${p}.templ`), /id="status" aria-live="polite"/);
const template = read('web/index.templ');
assert.match(template, /<p class="credits">\{ localizer\.T\("developed_by"\) \}[^\n]*Techaro[^\n]*CELPHASE/);
assert.doesNotMatch(template, /<img\b|localizer\.T\("(?:version_info|potigy_credit|made_with|mascot_design)"\)/);
for (const p of ['proofofwork', 'wasm', 'metarefresh', 'preact']) assert.doesNotMatch(read(`lib/challenge/${p}/${p}.templ`), /<img\b/);
const lum = hex => {
  const c = hex.match(/[\da-f]{2}/gi).map(v => parseInt(v, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return .2126*c[0]+.7152*c[1]+.0722*c[2];
};
const contrast = (a,b) => (Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
const pairs = [['#1A2F26','#F6F6F2'],['#3E564F','#F6F6F2'],['#3E2A00','#F1BE49'],['#EBEBEB','#0F241A']];
for (const [fg,bg] of pairs) assert.ok(contrast(fg,bg)>=4.5, `${fg}/${bg} contrast`);
console.log(JSON.stringify({result:'PASS',base,locales:langs.length,protectedSources:'unchanged',mainControlFlow:'unchanged',mascotFiles:'unchanged',mascotRendering:'removed',footer:'single developer credit',contrast:pairs.map(([fg,bg])=>({fg,bg,ratio:+contrast(fg,bg).toFixed(2)}))},null,2));
