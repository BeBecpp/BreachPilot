const $ = (id) => document.getElementById(id);
let lastResult = null;

function esc(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
  }[c]));
}

function chip(text) {
  return `<span class="chip">${esc(text)}</span>`;
}

function setLoading(isLoading) {
  const button = $('runBtn');
  button.disabled = isLoading;
  button.textContent = isLoading ? 'Running MCP investigation...' : 'Run MCP Investigation';
}

function renderEmptyError(message) {
  $('summary').textContent = message;
  $('severity').textContent = 'Error';
  $('confidence').textContent = '--';
  $('duration').textContent = '--';
}

function render(result) {
  lastResult = result;
  const score = Number(result?.score?.score ?? 0);
  const severity = result?.score?.severity ?? 'Unknown';
  const confidence = result?.score?.confidence ?? 'Unknown';
  const signalCount = result?.score?.signal_count ?? result?.score?.signals?.length ?? 0;
  const timelineCount = result?.timeline?.length ?? 0;
  const workflowCount = result?.workflow?.length ?? 0;

  $('score').textContent = score || '--';
  $('scoreRing').style.setProperty('--score', score);
  $('severity').textContent = `${severity} incident`;
  $('confidence').textContent = confidence;
  $('duration').textContent = `${result.duration_ms} ms`;
  $('summary').textContent = result.summary;
  $('caseId').textContent = `${result.entity} • ${result.mode === 'real' ? 'real MCP' : 'demo MCP'} mode`;
  $('heroEvents').textContent = timelineCount;
  $('heroSignals').textContent = signalCount;
  $('heroQueries').textContent = workflowCount;
  $('timelineCount').textContent = `${timelineCount} events`;

  $('signals').innerHTML = (result.score.signals || []).map(chip).join('');
  $('attackPath').classList.remove('empty');
  $('attackPath').innerHTML = (result.attack_path || []).map((step, i, arr) => (
    `<span>${esc(step)}</span>${i < arr.length - 1 ? '<b>→</b>' : ''}`
  )).join('') || 'No attack path detected.';

  $('workflow').innerHTML = (result.workflow || []).map((w) => `
    <article class="workflow-step">
      <div class="step-num">${esc(w.step)}</div>
      <div>
        <div class="step-head">
          <strong>${esc(w.title)}</strong>
          <span class="status ${esc(w.status)}">${esc(w.status)}</span>
        </div>
        <p>${esc(w.purpose)}</p>
        <small>${esc(w.tool)} • ${esc(w.row_count)} rows • ${esc(w.duration_ms)} ms</small>
        ${w.error ? `<div class="error">${esc(w.error)}</div>` : ''}
      </div>
    </article>
  `).join('');

  $('actions').innerHTML = (result.recommended_actions || []).map((a) => `
    <article class="action">
      <span>P${esc(a.priority)}</span>
      <p>${esc(a.action)}</p>
    </article>
  `).join('');

  $('evidence').innerHTML = (result.evidence_cards || []).map((card) => `
    <article class="evidence-card">
      <div class="card-head">
        <strong>${esc(card.title)}</strong>
        <span>${esc(card.count)} events</span>
      </div>
      <ul>${(card.bullets || []).map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
    </article>
  `).join('');

  $('timeline').innerHTML = (result.timeline || []).map((event) => `
    <article class="event">
      <time>${esc(event._time)}</time>
      <strong>${esc(event.action)}</strong>
      <p>${esc(event.message)}</p>
      <small>${esc(event.sourcetype)} • ${esc(event.user)} • ${esc(event.src_ip)} • ${esc(event.host)}</small>
    </article>
  `).join('');

  $('queries').innerHTML = (result.workflow || []).map((w) => `
    <details class="query" ${w.step <= 2 ? 'open' : ''}>
      <summary>${esc(w.step)}. ${esc(w.title)} <span>${esc(w.tool)}</span></summary>
      <pre>${esc(w.spl)}</pre>
    </details>
  `).join('');

  $('raw').textContent = JSON.stringify(result, null, 2);
}

async function runInvestigation() {
  setLoading(true);
  try {
    const response = await fetch('/api/investigate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entity: $('entity').value, lookback: $('lookback').value, mode: $('mode').value })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Investigation failed');
    render(data);
  } catch (err) {
    renderEmptyError(err.message || 'Investigation failed');
  } finally {
    setLoading(false);
  }
}

$('runBtn').addEventListener('click', runInvestigation);
$('entity').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') runInvestigation();
});

document.querySelectorAll('[data-entity]').forEach((button) => {
  button.addEventListener('click', () => {
    $('entity').value = button.dataset.entity;
    runInvestigation();
  });
});

$('copyBtn').addEventListener('click', async () => {
  if (navigator.clipboard) { await navigator.clipboard.writeText(JSON.stringify(lastResult || {}, null, 2)); }
  $('copyBtn').textContent = 'Copied';
  setTimeout(() => { $('copyBtn').textContent = 'Copy JSON'; }, 1000);
});

runInvestigation();
