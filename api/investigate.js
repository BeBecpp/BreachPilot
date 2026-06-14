const EVENTS = [
  {
    "_time": "2026-06-14T10:01:12Z",
    "index": "breachpilot",
    "sourcetype": "auth",
    "category": "auth",
    "user": "jane.admin",
    "src_ip": "45.77.12.8",
    "host": "idp-01",
    "action": "failed_login",
    "status": "failure",
    "risk_signal": "failed_login_burst",
    "risk_score": 35,
    "message": "12 failed login attempts observed for jane.admin from 45.77.12.8."
  },
  {
    "_time": "2026-06-14T10:02:03Z",
    "index": "breachpilot",
    "sourcetype": "auth",
    "category": "auth",
    "user": "jane.admin",
    "src_ip": "45.77.12.8",
    "host": "idp-01",
    "action": "failed_login",
    "status": "failure",
    "risk_signal": "failed_login_burst",
    "risk_score": 35,
    "message": "Credential stuffing pattern continued against jane.admin."
  },
  {
    "_time": "2026-06-14T10:04:31Z",
    "index": "breachpilot",
    "sourcetype": "auth",
    "category": "auth",
    "user": "jane.admin",
    "src_ip": "45.77.12.8",
    "host": "idp-01",
    "action": "successful_login",
    "status": "success",
    "risk_signal": "success_after_fail",
    "risk_score": 72,
    "message": "Successful login from same source IP immediately after failed-login burst."
  },
  {
    "_time": "2026-06-14T10:05:02Z",
    "index": "breachpilot",
    "sourcetype": "auth",
    "category": "auth",
    "user": "jane.admin",
    "src_ip": "45.77.12.8",
    "host": "idp-01",
    "action": "mfa_challenge",
    "status": "bypassed",
    "risk_signal": "mfa_not_satisfied",
    "risk_score": 68,
    "message": "MFA challenge did not show a normal satisfied state before session creation."
  },
  {
    "_time": "2026-06-14T10:06:16Z",
    "index": "breachpilot",
    "sourcetype": "vpn",
    "category": "vpn",
    "user": "jane.admin",
    "src_ip": "45.77.12.8",
    "host": "vpn-gw-02",
    "action": "vpn_login",
    "status": "success",
    "risk_signal": "first_seen_ip",
    "risk_score": 74,
    "message": "VPN session created from a first-seen IP for jane.admin."
  },
  {
    "_time": "2026-06-14T10:06:40Z",
    "index": "breachpilot",
    "sourcetype": "vpn",
    "category": "vpn",
    "user": "jane.admin",
    "src_ip": "45.77.12.8",
    "host": "vpn-gw-02",
    "action": "vpn_login",
    "status": "success",
    "risk_signal": "unusual_geo_or_asn",
    "risk_score": 78,
    "message": "VPN source ASN and location differ from jane.admin baseline."
  },
  {
    "_time": "2026-06-14T10:08:21Z",
    "index": "breachpilot",
    "sourcetype": "app",
    "category": "access",
    "user": "jane.admin",
    "src_ip": "45.77.12.8",
    "host": "admin-portal-01",
    "action": "admin_console_access",
    "status": "success",
    "risk_signal": "admin_console_access",
    "risk_score": 70,
    "message": "Admin console opened shortly after unusual authentication activity."
  },
  {
    "_time": "2026-06-14T10:10:05Z",
    "index": "breachpilot",
    "sourcetype": "app",
    "category": "data",
    "user": "jane.admin",
    "src_ip": "45.77.12.8",
    "host": "admin-portal-01",
    "action": "customer_export",
    "status": "requested",
    "risk_signal": "sensitive_export",
    "risk_score": 91,
    "message": "Sensitive customer export requested from admin console."
  },
  {
    "_time": "2026-06-14T10:12:17Z",
    "index": "breachpilot",
    "sourcetype": "dns",
    "category": "network",
    "user": "jane.admin",
    "src_ip": "45.77.12.8",
    "host": "checkout-api-01",
    "dest": "cdn-sync-storage.example",
    "action": "dns_query",
    "status": "allowed",
    "risk_signal": "suspicious_egress",
    "risk_score": 84,
    "message": "Suspicious domain contacted after customer export request."
  },
  {
    "_time": "2026-06-14T10:12:48Z",
    "index": "breachpilot",
    "sourcetype": "proxy",
    "category": "network",
    "user": "jane.admin",
    "src_ip": "45.77.12.8",
    "host": "checkout-api-01",
    "dest": "cdn-sync-storage.example",
    "action": "proxy_connect",
    "status": "allowed",
    "risk_signal": "suspicious_egress",
    "risk_score": 86,
    "message": "Outbound proxy connection allowed to newly observed destination."
  },
  {
    "_time": "2026-06-14T10:13:30Z",
    "index": "breachpilot",
    "sourcetype": "endpoint",
    "category": "endpoint",
    "user": "jane.admin",
    "src_ip": "45.77.12.8",
    "host": "checkout-api-01",
    "action": "process_start",
    "status": "success",
    "risk_signal": "endpoint_process_anomaly",
    "risk_score": 76,
    "message": "Unexpected compression process started on checkout-api-01."
  },
  {
    "_time": "2026-06-14T10:14:09Z",
    "index": "breachpilot",
    "sourcetype": "app",
    "category": "app",
    "user": "jane.admin",
    "src_ip": "45.77.12.8",
    "host": "checkout-api-01",
    "action": "api_error_spike",
    "status": "anomaly",
    "risk_signal": "api_error_spike",
    "risk_score": 62,
    "message": "checkout-api-01 error rate spiked after suspicious admin activity."
  },
  {
    "_time": "2026-06-14T09:45:00Z",
    "index": "breachpilot",
    "sourcetype": "auth",
    "category": "auth",
    "user": "alex.dev",
    "src_ip": "10.20.3.14",
    "host": "idp-01",
    "action": "successful_login",
    "status": "success",
    "risk_signal": "",
    "risk_score": 5,
    "message": "Normal employee login from known office network."
  },
  {
    "_time": "2026-06-14T09:51:00Z",
    "index": "breachpilot",
    "sourcetype": "app",
    "category": "app",
    "user": "alex.dev",
    "src_ip": "10.20.3.14",
    "host": "build-api-01",
    "action": "deploy",
    "status": "success",
    "risk_signal": "",
    "risk_score": 8,
    "message": "Normal deployment event."
  },
  {
    "_time": "2026-06-14T11:02:00Z",
    "index": "breachpilot",
    "sourcetype": "auth",
    "category": "auth",
    "user": "maria.finance",
    "src_ip": "193.22.119.40",
    "host": "idp-01",
    "action": "failed_login",
    "status": "failure",
    "risk_signal": "failed_login_burst",
    "risk_score": 35,
    "message": "Multiple failed login attempts for maria.finance."
  },
  {
    "_time": "2026-06-14T11:07:00Z",
    "index": "breachpilot",
    "sourcetype": "auth",
    "category": "auth",
    "user": "maria.finance",
    "src_ip": "193.22.119.40",
    "host": "idp-01",
    "action": "successful_login",
    "status": "success",
    "risk_signal": "success_after_fail",
    "risk_score": 70,
    "message": "Successful login after failures for maria.finance."
  },
  {
    "_time": "2026-06-14T11:12:00Z",
    "index": "breachpilot",
    "sourcetype": "app",
    "category": "data",
    "user": "maria.finance",
    "src_ip": "193.22.119.40",
    "host": "finance-app-02",
    "action": "sensitive_search",
    "status": "success",
    "risk_signal": "sensitive_export",
    "risk_score": 80,
    "message": "Sensitive finance records searched after suspicious login."
  }
];

const SIGNAL_WEIGHTS = {
  failed_login_burst: 15,
  success_after_fail: 22,
  first_seen_ip: 12,
  unusual_geo_or_asn: 15,
  mfa_not_satisfied: 12,
  admin_console_access: 10,
  sensitive_export: 24,
  suspicious_egress: 18,
  endpoint_process_anomaly: 13,
  api_error_spike: 8,
  role_change: 20,
};

const CATEGORY_LABELS = {
  auth: 'Authentication evidence',
  vpn: 'VPN / identity context',
  access: 'Privileged access evidence',
  data: 'Data access evidence',
  network: 'Network and egress evidence',
  endpoint: 'Endpoint evidence',
  app: 'Application reliability evidence',
};

function readBody(req) {
  return new Promise((resolve) => {
    if (req.body && typeof req.body === 'object') return resolve(req.body);
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); } catch (_) { resolve({}); }
    });
  });
}

function escapeSpl(value) {
  return String(value || '').split('\\').join('\\\\').replace(/\"/g, '\\\"');
}

function buildQueries(entity, lookback = '-24h') {
  const e = escapeSpl(entity.trim());
  const entityFilter = `(user="${e}" OR src_ip="${e}" OR host="${e}")`;
  return [
    { id: 'discover_indexes', title: 'Discover security indexes', purpose: 'Confirm that the breachpilot index exists and is searchable.', spl: `index=breachpilot earliest=${lookback} | stats count by index sourcetype | sort -count`, tool: 'splunk_get_indexes' },
    { id: 'entity_timeline', title: 'Build entity timeline', purpose: 'Pull recent events connected to the investigated user, IP, or host.', spl: `index=breachpilot ${entityFilter} earliest=${lookback} | table _time sourcetype user src_ip host action status risk_signal risk_score message | sort _time`, tool: 'splunk_run_query' },
    { id: 'auth_pattern', title: 'Correlate authentication pattern', purpose: 'Find failed-login bursts followed by successful access from the same source.', spl: `index=breachpilot ${entityFilter} earliest=${lookback} action IN ("failed_login", "successful_login", "mfa_challenge", "vpn_login") | stats count values(status) as statuses values(risk_signal) as signals by user src_ip action | sort -count`, tool: 'splunk_run_query' },
    { id: 'privileged_access', title: 'Check privileged and data-access activity', purpose: 'Identify admin console activity, export behavior, and sensitive-data access.', spl: `index=breachpilot ${entityFilter} earliest=${lookback} action IN ("admin_console_access", "customer_export", "sensitive_search", "role_change") | table _time user src_ip host action status risk_signal risk_score message | sort _time`, tool: 'splunk_run_query' },
    { id: 'network_egress', title: 'Check endpoint and network signals', purpose: 'Look for suspicious DNS/proxy/endpoint activity after privileged access.', spl: `index=breachpilot ${entityFilter} earliest=${lookback} sourcetype IN ("proxy", "dns", "endpoint", "app") | table _time sourcetype user src_ip host dest action status risk_signal risk_score message | sort _time`, tool: 'splunk_run_query' },
    { id: 'risk_rollup', title: 'Generate risk rollup', purpose: 'Aggregate the risk signals that justify severity and next actions.', spl: `index=breachpilot ${entityFilter} earliest=${lookback} risk_signal=* | stats values(risk_signal) as signals max(risk_score) as max_event_risk count by user src_ip host | sort -max_event_risk`, tool: 'splunk_run_query' },
  ];
}

function filterEvents(entity) {
  const e = String(entity || '').trim().toLowerCase();
  return EVENTS.filter(row => [row.user, row.src_ip, row.host].some(v => String(v || '').toLowerCase() === e));
}

function simulatedRows(queryId, entity) {
  const rows = filterEvents(entity);
  if (queryId === 'discover_indexes') {
    const counts = {};
    for (const r of EVENTS) {
      const key = `${r.index}|${r.sourcetype}`;
      counts[key] = (counts[key] || 0) + 1;
    }
    return Object.entries(counts).map(([key, count]) => {
      const [index, sourcetype] = key.split('|');
      return { index, sourcetype, count };
    }).sort((a,b) => b.count - a.count);
  }
  if (queryId === 'auth_pattern') return rows.filter(r => ['failed_login','successful_login','mfa_challenge','vpn_login'].includes(r.action));
  if (queryId === 'privileged_access') return rows.filter(r => ['admin_console_access','customer_export','sensitive_search','role_change'].includes(r.action));
  if (queryId === 'network_egress') return rows.filter(r => ['proxy','dns','endpoint','app'].includes(r.sourcetype));
  if (queryId === 'risk_rollup') {
    const signals = [...new Set(rows.map(r => r.risk_signal).filter(Boolean))];
    const max_event_risk = Math.max(0, ...rows.map(r => Number(r.risk_score || 0)));
    return rows.length ? [{ user: rows[0].user, src_ip: rows[0].src_ip, host: rows[0].host, signals, max_event_risk, count: rows.length }] : [];
  }
  return rows;
}

function classifyIncident(signals) {
  const has = s => signals.has(s);
  if (has('success_after_fail') && has('sensitive_export') && has('suspicious_egress')) return 'Suspected account takeover with data-exfiltration preparation';
  if (has('failed_login_burst') && has('success_after_fail')) return 'Suspected account takeover';
  if (has('suspicious_egress')) return 'Suspicious outbound activity';
  if (has('api_error_spike')) return 'Application anomaly requiring triage';
  return 'Security event requiring review';
}

function riskScore(events) {
  const signals = new Set(events.map(e => e.risk_signal).filter(Boolean));
  const base = events.length ? 10 : 0;
  const weighted = base + [...signals].reduce((sum, signal) => sum + (SIGNAL_WEIGHTS[signal] || 4), 0);
  const maxEvent = Math.max(0, ...events.map(e => Number(e.risk_score || 0)));
  const score = Math.min(96, Math.max(weighted, maxEvent));
  let severity = 'Informational';
  if (score >= 85) severity = 'Critical'; else if (score >= 70) severity = 'High'; else if (score >= 45) severity = 'Medium'; else if (score > 0) severity = 'Low';
  const confidence = signals.size >= 5 && events.length >= 6 ? 'High' : events.length ? 'Medium' : 'Low';
  return { score, severity, confidence, incident_type: classifyIncident(signals), signals: [...signals].sort(), signal_count: signals.size };
}

function buildEvidenceCards(events) {
  const groups = {};
  for (const e of events) {
    const cat = e.category || 'access';
    groups[cat] ||= [];
    groups[cat].push(e);
  }
  return Object.entries(groups).map(([category, rows]) => {
    const seen = new Set();
    const bullets = [];
    for (const row of rows) {
      const msg = row.message || String(row.action || 'event');
      if (!seen.has(msg)) { bullets.push(msg); seen.add(msg); }
      if (bullets.length === 4) break;
    }
    return { category, title: CATEGORY_LABELS[category] || `${category} evidence`, count: rows.length, highest_risk: Math.max(0, ...rows.map(r => Number(r.risk_score || 0))), bullets };
  }).sort((a,b) => b.highest_risk - a.highest_risk);
}

function attackPath(events) {
  const actions = ['failed_login','successful_login','vpn_login','admin_console_access','customer_export','dns_query','proxy_connect','api_error_spike'];
  return actions.filter(action => events.some(e => e.action === action)).map(action => action.split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' '));
}

function recommendedActions(scoreData, events) {
  const signals = new Set(scoreData.signals || []);
  const actions = [];
  if (signals.has('failed_login_burst') || signals.has('success_after_fail')) {
    actions.push({ priority: 'P0', action: 'Disable active sessions for the affected user and force password reset.' });
    actions.push({ priority: 'P0', action: 'Require MFA re-enrollment and review recent MFA challenge outcomes.' });
  }
  if (signals.has('first_seen_ip') || signals.has('unusual_geo_or_asn')) {
    const ips = [...new Set(events.map(e => e.src_ip).filter(Boolean))].sort();
    if (ips.length) actions.push({ priority: 'P1', action: `Block or rate-limit suspicious source IPs: ${ips.slice(0,3).join(', ')}.` });
  }
  if (signals.has('sensitive_export')) actions.push({ priority: 'P0', action: 'Review export logs and verify whether customer data left the environment.' });
  if (signals.has('suspicious_egress')) actions.push({ priority: 'P1', action: 'Block suspicious egress destination and preserve proxy/DNS evidence.' });
  if (signals.has('api_error_spike')) actions.push({ priority: 'P2', action: 'Correlate security timeline with application error spike for blast-radius analysis.' });
  actions.push({ priority: 'P2', action: 'Create a Splunk detection for failed-login burst followed by success, admin access, and export activity.' });
  return actions.slice(0,6);
}

function buildSummary(entity, scoreData, events, path) {
  if (!events.length) return `No matching events were found for ${entity}. Keep the case informational unless new evidence appears.`;
  const pathText = path.length ? path.slice(0,6).join(' -> ') : 'multiple correlated signals';
  return `${entity} shows a ${scoreData.severity.toLowerCase()}-severity pattern consistent with ${scoreData.incident_type}. The agent correlated ${events.length} events and ${scoreData.signal_count} distinct risk signals. Observed path: ${pathText}.`;
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST /api/investigate' });
  const started = Date.now();
  const body = await readBody(req);
  const entity = String(body.entity || '').trim();
  const lookback = String(body.lookback || '-24h');
  const mode = String(body.mode || 'demo').toLowerCase();
  if (!entity) return res.status(400).json({ error: 'entity is required' });

  const workflow = [];
  const queryOutputs = {};
  for (const [index, query] of buildQueries(entity, lookback).entries()) {
    const t0 = Date.now();
    const rows = simulatedRows(query.id, entity);
    const status = mode === 'real' ? 'fallback' : 'demo';
    workflow.push({
      step: index + 1,
      id: query.id,
      title: query.title,
      purpose: query.purpose,
      tool: query.tool,
      status,
      duration_ms: Math.max(1, Date.now() - t0),
      row_count: rows.length,
      error: mode === 'real' ? 'Vercel live demo cannot reach your local Splunk MCP server; using bundled demo data fallback.' : '',
      spl: query.spl,
    });
    queryOutputs[query.id] = rows.slice(0, 50);
  }

  const timeline = filterEvents(entity).sort((a,b) => String(a._time).localeCompare(String(b._time)));
  const scoreData = riskScore(timeline);
  const path = attackPath(timeline);
  return res.status(200).json({
    project: 'BreachPilot',
    entity,
    mode,
    mcp_configured: false,
    generated_at: new Date().toISOString(),
    duration_ms: Math.max(1, Date.now() - started),
    summary: buildSummary(entity, scoreData, timeline, path),
    score: scoreData,
    attack_path: path,
    workflow,
    evidence_cards: buildEvidenceCards(timeline),
    recommended_actions: recommendedActions(scoreData, timeline),
    timeline,
    query_outputs: queryOutputs,
    mcp_errors: mode === 'real' ? ['Vercel live demo uses bundled demo fallback. Real Splunk MCP mode is available in the Python local runtime.'] : [],
  });
};
