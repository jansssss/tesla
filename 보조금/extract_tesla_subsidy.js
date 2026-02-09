const fs = require('fs');
const path = require('path');
const https = require('https');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const BASE = 'https://ev.or.kr';
const INIT_PATH = '/nportal/buySupprt/initPsLocalCarPirceAction.do';
const MODEL_PATH = '/nportal/buySupprt/psPopupLocalCarModelPrice.do';
const PNP_PATH = '/nportal/js/pnp4web/pnp4web.js?v=20190219';

const agent = new https.Agent({ rejectUnauthorized: false });

function requestRaw(urlPath, method = 'GET', body = '') {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Connection': 'keep-alive',
  };
  if (method === 'POST') {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    headers['Content-Length'] = Buffer.byteLength(body);
  }

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'ev.or.kr',
        path: urlPath,
        method,
        headers,
        agent,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => resolve(data));
      }
    );
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function buildDecoder(pnpJs) {
  const inMatch = pnpJs.match(/var In=\[(.*?)\],zn=\{/s);
  const znMatch = pnpJs.match(/,zn=\{([\s\S]*?)\};_eb\$=/);
  const vMatch = pnpJs.match(/function v\(e\)\{([\s\S]*?)\}function _\(/);
  if (!inMatch || !znMatch || !vMatch) {
    throw new Error('Failed to parse pnp4web decoder');
  }

  const In = eval('[' + inMatch[1] + ']');
  const zn = eval('({' + znMatch[1] + '})');
  const v = eval('(function(e){' + vMatch[1] + '})');

  return (rawHtml) => {
    const tokenMatch = rawHtml.match(/onload='_0xac\("([\s\S]*?)"\)'/);
    if (!tokenMatch) return rawHtml;
    return v(zn.dc(tokenMatch[1]));
  };
}

function decodeEntities(text) {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function cleanText(htmlChunk) {
  return decodeEntities(
    htmlChunk
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

function numText(v) {
  const n = v.replace(/[^0-9.-]/g, '');
  return n || '';
}

function parseLocalTargets(initHtml) {
  const regex = /psPopupLocalCarModelPrice\('([^']+)','([^']+)','([^']+)'\)/g;
  const seen = new Set();
  const targets = [];
  let m;
  while ((m = regex.exec(initHtml)) !== null) {
    const year = m[1];
    const localCode = m[2];
    const localName = m[3];
    const key = `${year}|${localCode}`;
    if (seen.has(key)) continue;
    seen.add(key);
    targets.push({ year, localCode, localName });
  }
  return targets;
}

function parseTeslaRows(modelHtml, local) {
  const tbodyMatch = modelHtml.match(/<tbody>([\s\S]*?)<\/tbody>/i);
  if (!tbodyMatch) return [];

  const rows = [];
  const trRegex = /<tr[\s\S]*?<\/tr>/gi;
  let tr;
  while ((tr = trRegex.exec(tbodyMatch[1])) !== null) {
    const tds = [];
    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let td;
    while ((td = tdRegex.exec(tr[0])) !== null) {
      tds.push(cleanText(td[1]));
    }
    if (tds.length < 6) continue;

    const maker = tds[1];
    const model = tds[2];
    const isTesla = /테슬라|tesla/i.test(maker) || /model\s*[3ysx]/i.test(model);
    if (!isTesla) continue;

    rows.push({
      year: local.year,
      local_code: local.localCode,
      local_name: local.localName,
      vehicle_type: tds[0],
      maker,
      model,
      national_subsidy_manwon: numText(tds[3]),
      local_subsidy_manwon: numText(tds[4]),
      total_subsidy_manwon: numText(tds[5]),
      source: `${BASE}${MODEL_PATH}`,
    });
  }
  return rows;
}

function toCsv(rows) {
  const headers = [
    'year',
    'local_code',
    'local_name',
    'vehicle_type',
    'maker',
    'model',
    'national_subsidy_manwon',
    'local_subsidy_manwon',
    'total_subsidy_manwon',
    'source',
  ];
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [headers.map(escape).join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(','));
  }
  return '\uFEFF' + lines.join('\n');
}

async function main() {
  const pnpJs = await requestRaw(PNP_PATH);
  const decodePnp = buildDecoder(pnpJs);

  const initRaw = await requestRaw(INIT_PATH);
  const initHtml = decodePnp(initRaw);
  const targets = parseLocalTargets(initHtml);

  if (targets.length === 0) {
    throw new Error('No local targets found from init page');
  }

  const allRows = [];
  for (let i = 0; i < targets.length; i += 1) {
    const t = targets[i];
    const body = `year=${encodeURIComponent(t.year)}&local_cd=${encodeURIComponent(t.localCode)}&local_nm=${encodeURIComponent(t.localName)}&car_type=11`;
    const modelRaw = await requestRaw(MODEL_PATH, 'POST', body);
    const modelHtml = decodePnp(modelRaw);
    const teslaRows = parseTeslaRows(modelHtml, t);
    allRows.push(...teslaRows);

    if ((i + 1) % 20 === 0 || i + 1 === targets.length) {
      console.log(`[${i + 1}/${targets.length}] ${t.localName} -> tesla rows ${teslaRows.length}`);
    }
  }

  const now = new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const outName = `tesla_subsidy_by_local_${ymd}.csv`;
  const outPath = path.join(process.cwd(), outName);
  const csvData = toCsv(allRows);
  fs.writeFileSync(outPath, csvData, 'utf8');

  const appDataDir = path.join(process.cwd(), '..', 'tesla-quote-app', 'data');
  const appDataPath = path.join(appDataDir, 'latest.csv');
  fs.mkdirSync(appDataDir, { recursive: true });
  fs.writeFileSync(appDataPath, csvData, 'utf8');

  console.log(`saved: ${outPath}`);
  console.log(`synced app data: ${appDataPath}`);
  console.log(`rows: ${allRows.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
