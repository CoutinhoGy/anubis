import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

// An isolated local reproduction of ingress routing. Does not connect to the VPS.
const binary = path.resolve(process.argv[2] || 'var/anubis.exe');
const upstream = path.resolve(process.argv[3] || 'var/upstream-release/anubis-1.28.1-windows-amd64/bin/anubis.exe');
assert.ok(fs.existsSync(binary), `Build the candidate binary first: ${binary}`);
assert.ok(fs.existsSync(upstream), `Missing upstream comparison binary: ${upstream}`);
const productionPolicy = process.env.POTIGY_POLICY_FILE;
assert.ok(productionPolicy, 'Set POTIGY_POLICY_FILE to the read-only production policy copy');
const output = path.resolve(process.env.POTIGY_EVIDENCE_DIR || 'var/branding-evidence');
fs.mkdirSync(output, { recursive: true });
const servers = [], processes = [], results = [];
const log = (name, result) => { results.push({ name, ...result }); console.log(name, JSON.stringify(result)); };
const serve = async handler => {
  const server = http.createServer(handler);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); servers.push(server);
  return server.address().port;
};
const freePort = async () => { const p = await serve((_req,res)=>res.end()); await new Promise(r=>servers.at(-1).close(r)); return p; };
const target = await serve((req, res) => { res.setHeader('content-type','text/html; charset=utf-8'); res.end('<!doctype html><title>Proof target</title><p id="proof-target">Proof target '+req.url+'</p>'); });
const policyText = fs.readFileSync(productionPolicy,'utf8');
async function start(executable, name) {
  const port = await freePort();
  const policy = path.join(output, `${name}-policy.yaml`);
  // Rules are copied verbatim. Only isolated bbolt path and metrics bind differ.
  fs.writeFileSync(policy, policyText.replace('/data/anubis.bdb', path.join(output,`${name}.bdb`).replaceAll('\\','/'))+'\nmetrics:\n  bind: 127.0.0.1:0\n  network: tcp\n');
  const child = spawn(executable,['--bind',`127.0.0.1:${port}`,'--target',`http://127.0.0.1:${target}`,'--policy-fname',policy,'--cookie-secure=false','--cookie-partitioned=false'],{windowsHide:true,stdio:['ignore','pipe','pipe']}); processes.push(child);
  const stream = fs.createWriteStream(path.join(output,`${name}.log`)); child.stdout.pipe(stream); child.stderr.pipe(stream);
  let ready=false;
  for(let n=0;n<120;n++) { try { const r=await fetch(`http://127.0.0.1:${port}/`,{headers:{'X-Real-IP':'203.0.113.5'}});if(r.ok){ready=true;break;} } catch {} if(child.exitCode!==null)break; await new Promise(r=>setTimeout(r,250)); }
  assert.ok(ready,`Anubis ${name} failed to start; see ${name}.log`);
  const ingress = await serve((req,res)=>{
    const guarded = req.url==='/'||req.url?.startsWith('/?')||req.url?.startsWith('/login')||req.url?.startsWith('/.within.website/');
    const proxy=http.request({hostname:'127.0.0.1',port:guarded?port:target,path:req.url,method:req.method,headers:{...req.headers,'x-real-ip':req.headers['x-real-ip']||'203.0.113.5'}},up=>{res.writeHead(up.statusCode,up.headers);up.pipe(res);});
    proxy.on('error',()=>{res.statusCode=502;res.end();});req.pipe(proxy);
  });
  return `http://127.0.0.1:${ingress}`;
}
let browser;
try {
  const base=await start(binary,'potigy');
  const old=await start(upstream,'upstream');
  const ua='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/145.0.0.0 Safari/537.36';
  for(const route of ['/','/login','/.within.website/x/xess/xess.min.css','/.within.website/x/cmd/anubis/static/js/main.mjs','/app','/api/potigy/health']) {
    const a=await fetch(base+route,{headers:{'User-Agent':ua}}), b=await fetch(old+route,{headers:{'User-Agent':ua}});
    assert.equal(a.status,b.status,route);assert.equal(a.status,200,route);
    if(route==='/'||route==='/login') { const body=await a.text();for(const t of ['Potigy','Techaro','CELPHASE'])assert.ok(body.includes(t)); }
    if(route==='/app'||route.endsWith('/health'))assert.match(await a.text(),/proof-target/);
    log(`HTTP ${route}`,{status:a.status,upstream:b.status});
  }
  const botHeaders={'User-Agent':'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)','X-Real-IP':'2001:4860:4801:10::123'};
  for(const url of [base,old]) assert.match(await(await fetch(url+'/',{headers:botHeaders})).text(),/proof-target/);
  log('Googlebot verified range',{pass:true});
  browser=await chromium.launch({headless:true,channel:process.env.POTIGY_BROWSER_CHANNEL||'chrome'});
  for(const lang of ['pt-BR','en']) {
    for(const route of ['/','/login']) {
      const context=await browser.newContext({locale:lang,viewport:{width:1280,height:900},colorScheme:'light'});
      const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
      // Capture the real server-rendered interstitial before the fast challenge redirects.
      await page.route('**/static/js/main.mjs?*',r=>r.abort());
      await page.goto(base+route);await page.getByRole('heading',{level:1}).waitFor();
      assert.equal(await page.locator('html').getAttribute('lang'),lang);
      const expected=lang==='en'?'Before opening Potigy':'Antes de abrir a Potigy';
      assert.equal(await page.locator('h1').innerText(),expected);
      assert.equal(await page.locator('#status').getAttribute('aria-live'),'polite');
      assert.ok(await page.locator('#image').evaluate(e=>e.getBoundingClientRect().width<=28), 'Mascot must remain a small footer credit');
      assert.ok(await page.locator('.potigy-brand').evaluate(e=>e.getBoundingClientRect().height>=60), 'Potigy is the visual focus');
      await page.screenshot({path:path.join(output,`${lang}-${route==='/'?'home':'login'}.png`),fullPage:true});
      assert.deepEqual(errors,[]);await context.close();
    }
    const context=await browser.newContext({locale:lang,viewport:{width:1280,height:900}});
    const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base+'/login');await page.locator('#proof-target').waitFor({timeout:60000});
    assert.deepEqual(errors,[]);log(`Real challenge ${lang}`,{pass:true});await context.close();
    const errorContext=await browser.newContext({locale:lang,viewport:{width:1280,height:900}});
    const errorPage=await errorContext.newPage();
    const rejected=await errorPage.goto(base+'/.within.website/x/cmd/anubis/api/pass-challenge?id=invalid&response=x&nonce=0');
    assert.ok(rejected.status()>=400);
    for(const text of ['Potigy','Techaro','CELPHASE']) assert.ok((await errorPage.locator('body').innerText()).includes(text));
    assert.ok(await errorPage.locator('#image').evaluate(e=>e.getBoundingClientRect().width<=28));
    await errorPage.screenshot({path:path.join(output,`${lang}-error.png`),fullPage:true});
    log(`Error page ${lang}`,{status:rejected.status(),pass:true});await errorContext.close();
  }
  // Hold only the already-computed redirect to inspect and activate the reading continuation.
  const context=await browser.newContext({locale:'pt-BR',reducedMotion:'reduce',viewport:{width:1280,height:900}});
  const page=await context.newPage();
  let release;const gate=new Promise(r=>{release=r;});
  await page.route('**/static/js/worker/*',async route=>{await gate;await route.continue();});
  await page.goto(base+'/login',{waitUntil:'domcontentloaded'});
  await page.locator('#progress').waitFor({state:'visible'});
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('summary').evaluate(e=>e===document.activeElement),true);
  await page.keyboard.press('Enter');assert.equal(await page.locator('details').getAttribute('open'),'');
  release();await page.getByRole('button',{name:'Continuar para a Potigy'}).waitFor({timeout:60000});
  for(let tabs=0;tabs<12 && !await page.locator('#progress').evaluate(e=>e===document.activeElement);tabs++) await page.keyboard.press('Tab');
  assert.equal(await page.locator('#progress').evaluate(e=>e===document.activeElement),true);
  const focus=await page.locator('#progress').evaluate(e=>({height:e.getBoundingClientRect().height,outline:getComputedStyle(e).outlineStyle}));
  assert.ok(focus.height>=44);assert.notEqual(focus.outline,'none');
  const motions=await page.locator('body').evaluate(()=>[...document.querySelectorAll('*')].every(e=>{const s=getComputedStyle(e);return s.animationName==='none'&&s.transitionDuration.split(',').every(v=>parseFloat(v)===0);}));
  assert.ok(motions);await page.screenshot({path:path.join(output,'pt-BR-reduced-motion.png'),fullPage:true});
  await page.keyboard.press('Enter');await page.locator('#proof-target').waitFor({timeout:60000});log('Keyboard continuation and reduced motion',{pass:true,...focus});await context.close();
  // Theme and narrow layout are measured on the real page, with the module held for capture.
  for(const [name,width,scheme] of [['dark',1280,'dark'],['mobile',390,'light']]) {
    const c=await browser.newContext({locale:'pt-BR',colorScheme:scheme,viewport:{width,height:900}});const p=await c.newPage();
    await p.route('**/static/js/main.mjs?*',r=>r.abort());await p.goto(base+'/login');
    const metrics=await p.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,background:getComputedStyle(document.body).backgroundColor,text:getComputedStyle(document.body).color}));
    assert.ok(metrics.scroll<=metrics.width);await p.screenshot({path:path.join(output,`pt-BR-${name}.png`),fullPage:true});log(name,metrics);await c.close();
  }
  // Local upstream replay proves that the same isolated ingress can return to upstream.
  const c=await browser.newContext({locale:'en'}),p=await c.newPage();await p.goto(old+'/login');await p.locator('#proof-target').waitFor({timeout:60000});await c.close();log('Local upstream rollback replay',{pass:true});
  fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({result:'PASS',scope:'isolated local processes; same routing and production rules; temporary bbolt paths; no VPS/container deployment',results},null,2));
} finally {
  await browser?.close();for(const child of processes)child.kill();for(const server of servers)server.close();
}
