# BreachPilot: MCP-Powered Incident Commander for Splunk

BreachPilot is a security triage agent that turns Splunk events into an evidence-backed incident timeline, risk score, and analyst response plan. It is built for the Splunk Agentic Ops Hackathon Security track and targets the **Best Use of Splunk MCP Server** bonus prize.

## Tagline

An MCP-powered security triage agent that turns Splunk logs into an evidence-backed incident timeline, risk score, and analyst response plan.

## Features

- Polished web dashboard for a 3-minute demo video.
- Entity investigation for user, IP address, or host.
- Multi-step agent workflow with visible MCP tool calls.
- SPL query panel so judges can see the exact searches.
- Demo mode with synthetic Splunk-style JSONL events.
- Real mode adapter for Splunk MCP Server via JSON-RPC `tools/call`.
- Risk scoring, evidence cards, attack path, and response actions.
- Root-level `architecture_diagram.md` for Devpost requirements.


## Vercel live demo

This repo is Vercel-ready. The public live demo uses a Node serverless function at `/api/investigate` with bundled synthetic Splunk-style security events, so it works without exposing Splunk credentials.

```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

For the full local Splunk MCP path, keep using the Python runtime described below.

## Quick start: demo mode

```bash
cd breachpilot-splunk
python -m app.main
```

Open:

```text
http://127.0.0.1:8000
```

Try these entities:

```text
jane.admin
45.77.12.8
checkout-api-01
maria.finance
```

## Real Splunk MCP Server mode

1. Create a Splunk account and install Splunk Enterprise Trial or use Splunk Cloud.
2. Install **Splunk MCP Server** from Splunkbase on the search head.
3. Enable token authentication and grant MCP access capabilities to the user/role.
4. Create an index named `breachpilot`.
5. Enable HTTP Event Collector and load the sample data:

```bash
export SPLUNK_HEC_URL=https://localhost:8088/services/collector/event
export SPLUNK_HEC_TOKEN=YOUR_HEC_TOKEN
python scripts/load_sample_data_to_splunk.py
```

Verify in Splunk:

```spl
index=breachpilot earliest=-24h | table _time sourcetype user src_ip host action status risk_signal risk_score message | sort _time
```

Run BreachPilot in real MCP mode:

```bash
cp .env.example .env
export MCP_MODE=real
export MCP_SERVER_URL=http://localhost:8001/mcp
export MCP_AUTH_TOKEN=YOUR_SPLUNK_MCP_TOKEN
python -m app.main
```

Different Splunk MCP deployments may expose different HTTP paths/transports. The adapter is intentionally small and configurable in `app/mcp_client.py`.

## Core SPL used by the agent

```spl
index=breachpilot (user="jane.admin" OR src_ip="jane.admin" OR host="jane.admin") earliest=-24h
| table _time sourcetype user src_ip host action status risk_signal risk_score message
| sort _time
```

```spl
index=breachpilot (user="jane.admin" OR src_ip="jane.admin" OR host="jane.admin") earliest=-24h action IN ("failed_login", "successful_login", "mfa_challenge", "vpn_login")
| stats count values(status) as statuses values(risk_signal) as signals by user src_ip action
| sort -count
```

## Demo story

Entity: `jane.admin`

The dataset simulates a possible account takeover followed by suspicious data access:

- failed-login burst from `45.77.12.8`,
- successful login from the same source,
- VPN session from first-seen / unusual ASN,
- admin console access,
- sensitive customer export request,
- suspicious DNS/proxy egress,
- endpoint process anomaly,
- checkout API error spike.

Expected verdict: **Critical** risk with high confidence.

## Repository structure

```text
app/                         Python agent, scoring, MCP adapter, local HTTP server
web/                         Dashboard UI
data/breachpilot_events.jsonl Synthetic Splunk-style sample events
scripts/load_sample_data_to_splunk.py HEC loader for Splunk Enterprise / Cloud
architecture_diagram.md       Required Devpost architecture diagram
SUBMISSION.md                 Devpost-ready description and video script
FEEDBACK.md                   Feedback prize notes
LICENSE                       MIT license
```

## Testing

No dependency is required to run the app. Optional pytest test:

```bash
pip install -r requirements.txt
pytest
```

Plain Python check:

```bash
python -c "from app.agent import BreachPilotAgent; print(BreachPilotAgent(mode='demo').investigate('jane.admin')['score'])"
```

## Devpost submission checklist

- [ ] Public GitHub repository
- [ ] MIT license visible at the repository root
- [ ] README with setup and run instructions
- [ ] Example dataset in `data/`
- [ ] `architecture_diagram.md` at repository root
- [ ] Public demo video under 3 minutes
- [ ] Track: Security
- [ ] Bonus prize target: Best Use of Splunk MCP Server
