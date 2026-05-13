// Headless smoke test via CDP. No external deps — uses ws over fetch+WebSocket.
const http = require('http');

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

const WebSocket = require('ws');

const APP_URL = process.env.APP_URL || 'http://localhost:8082/';

(async () => {
  const targetsRaw = await httpGet('http://127.0.0.1:9222/json/list');
  const targets = JSON.parse(targetsRaw);
  let target = targets.find((t) => t.type === 'page');
  if (!target) {
    const newRaw = await httpGet('http://127.0.0.1:9222/json/new?about:blank');
    target = JSON.parse(newRaw);
  }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let nextId = 1;
  const pending = new Map();
  const events = [];

  ws.on('message', (raw) => {
    const msg = JSON.parse(raw);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(msg.error.message));
      else resolve(msg.result);
    } else if (msg.method) {
      events.push(msg);
    }
  });

  await new Promise((r) => ws.once('open', r));

  function send(method, params = {}) {
    const id = nextId++;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Runtime.enable');
  await send('Log.enable');
  await send('Page.enable');
  await send('Network.enable');

  // Track fetch calls (we want to detect submission attempts)
  const networkRequests = [];
  ws.on('message', (raw) => {
    const msg = JSON.parse(raw);
    if (msg.method === 'Network.requestWillBeSent') {
      const u = msg.params.request.url;
      if (!u.startsWith('http://localhost') && !u.startsWith('ws://') && u.includes('telegram') === false) {
        // ignore
      }
      networkRequests.push({ url: u, method: msg.params.request.method });
    }
  });

  await send('Page.navigate', { url: APP_URL });
  // wait for load
  await new Promise((resolve) => {
    const t = setInterval(() => {
      const loaded = events.find((e) => e.method === 'Page.loadEventFired');
      if (loaded) {
        clearInterval(t);
        resolve();
      }
    }, 100);
    setTimeout(() => { clearInterval(t); resolve(); }, 10000);
  });

  // give Vue time to mount
  await new Promise((r) => setTimeout(r, 1500));

  // Collect errors
  const jsErrors = events.filter((e) => e.method === 'Runtime.exceptionThrown');
  const consoleErrors = events
    .filter((e) => e.method === 'Runtime.consoleAPICalled' && e.params.type === 'error');
  const logErrors = events.filter((e) => e.method === 'Log.entryAdded' && e.params.entry.level === 'error');

  // Check sections present
  const checkText = async (needle) => {
    const r = await send('Runtime.evaluate', {
      expression: `document.body.innerText.indexOf(${JSON.stringify(needle)}) >= 0`,
      returnByValue: true,
    });
    return r.result.value;
  };

  const sectionChecks = {};
  for (const grp of [
    ['О проекте', 'Про проєкт'],
    ['Целевое действие', 'Цільова дія'],
    ['Конкуренты', 'Конкуренти'],
    ['Брендбук', 'Брендбук'],
    ['Устройства', 'Пристрої'],
    ['Интеграции', 'Інтеграції'],
  ]) {
    let found = false;
    for (const v of grp) if (await checkText(v)) { found = true; break; }
    sectionChecks[grp.join(' / ')] = found;
  }

  // Try submitting empty form
  const submitResult = await send('Runtime.evaluate', {
    expression: `(() => {
      const f = document.querySelector('form');
      if (!f) return { ok: false, reason: 'no form' };
      f.requestSubmit ? f.requestSubmit() : f.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      return { ok: true };
    })()`,
    returnByValue: true,
  });

  // Wait a moment for Vue to render error state
  await new Promise((r) => setTimeout(r, 500));

  const errCount = await send('Runtime.evaluate', {
    expression: `document.querySelectorAll('.has-error, .section-error, .form-error-summary').length`,
    returnByValue: true,
  });

  // Screenshot
  try {
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    require('fs').writeFileSync('tests/_headless-screenshot.png', Buffer.from(shot.data, 'base64'));
  } catch (e) {
    console.log('screenshot failed:', e.message);
  }

  // Network: did any POST to telegram fire?
  const postReqs = networkRequests.filter((r) => r.method === 'POST');

  console.log('\n=== HEADLESS REPORT ===');
  console.log('JS exceptions:', jsErrors.length);
  jsErrors.forEach((e) => console.log('  ex:', e.params.exceptionDetails.text, e.params.exceptionDetails.exception?.description));
  console.log('Console errors:', consoleErrors.length);
  consoleErrors.forEach((e) => console.log('  ce:', e.params.args.map((a) => a.value || a.description).join(' ')));
  console.log('Log errors:', logErrors.length);
  logErrors.forEach((e) => console.log('  le:', e.params.entry.text));
  console.log('Submit invoked:', submitResult.result.value);
  console.log('.has-error/.section-error count:', errCount.result.value);
  console.log('POST requests after submit:', postReqs.length);
  postReqs.forEach((r) => console.log('  POST →', r.url));
  console.log('Section presence:');
  for (const [k, v] of Object.entries(sectionChecks)) console.log('  ', v ? '✓' : '✗', k);

  ws.close();
  process.exit(0);
})().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
