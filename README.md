# BreachPilot

**MCP-powered security triage agent for Splunk**

BreachPilot is an agentic security investigation console that turns Splunk security logs into an evidence-backed incident timeline, risk score, and analyst response plan.

It is built for the **Splunk Agentic Ops Hackathon** with a focus on the **Security** track and the **Best Use of Splunk MCP Server** bonus prize.

---

## Live Demo

**Vercel:** `PASTE_YOUR_VERCEL_URL_HERE`

Demo entity:

```txt
jane.admin
```

---

## What BreachPilot Does

Security analysts often lose time switching between multiple SPL searches after an alert. BreachPilot turns that manual triage process into a structured investigation workflow.

Given a user, IP, or host, BreachPilot:

1. Plans an investigation workflow.
2. Runs scoped Splunk-style queries through the MCP investigation layer.
3. Correlates authentication, VPN, admin, data access, endpoint, and network events.
4. Builds an incident timeline.
5. Calculates a risk score and severity.
6. Generates analyst-ready evidence cards and response actions.
7. Shows the SPL/MCP workflow transparently so the analyst can verify the result.

BreachPilot is not a generic chatbot. It is a focused, human-in-the-loop security triage workflow designed for Splunk data.

---

## Demo Scenario

The included demo dataset simulates a possible account takeover followed by suspicious data access.

Entity:

```txt
jane.admin
```

Incident chain:

```txt
Multiple failed logins
→ Successful login from same suspicious IP
→ VPN session from unusual location
→ Admin console access
→ Sensitive customer export request
→ Suspicious network egress
→ Service error spike
```

Expected output:

```txt
Severity: Critical
Risk Score: High
Incident Type: Suspected account takeover and data exfiltration preparation
Confidence: High
```

---

## Key Features

* **MCP-style investigation workflow**

  * Shows each agent step from planning to response recommendation.

* **Evidence-backed timeline**

  * Converts raw security events into a chronological attack path.

* **Risk scoring**

  * Scores suspicious behavior based on authentication, access, data movement, and network signals.

* **Analyst response plan**

  * Recommends concrete next actions such as disabling sessions, resetting credentials, blocking IPs, and reviewing export logs.

* **SPL query transparency**

  * Displays the scoped SPL-style queries used during investigation.

* **Demo and real integration modes**

  * Demo mode works immediately with sample data.
  * Real mode is structured for Splunk MCP Server / Splunk Enterprise integration.

* **Vercel-ready**

  * Includes a static frontend and serverless API for public live demo deployment.

---

## Architecture

```txt
User / Analyst
    |
    v
BreachPilot Web Console
    |
    v
Investigation API
    |
    v
Agent Workflow Engine
    |
    +--> Query Planner
    +--> MCP Client Adapter
    +--> Evidence Correlator
    +--> Risk Scoring Engine
    +--> Response Recommendation Generator
    |
    v
Splunk / Demo Security Events
```

See [`architecture_diagram.md`](./architecture_diagram.md) for the required architecture diagram.

---

## Tech Stack

* Frontend: HTML, CSS, JavaScript
* API: Vercel Serverless Function / Node.js
* Local backend: Python
* Data: JSONL synthetic Splunk-style security events
* Deployment: Vercel
* Target platform: Splunk Enterprise + Splunk MCP Server

---

## Project Structure

```txt
.
├── index.html
├── style.css
├── app.js
├── api/
│   └── investigate.js
├── app/
│   ├── main.py
│   ├── agent.py
│   ├── mcp_client.py
│   └── scoring.py
├── data/
│   └── breachpilot_events.jsonl
├── scripts/
│   └── load_sample_data_to_splunk.py
├── architecture_diagram.md
├── SUBMISSION.md
├── FEEDBACK.md
├── DEPLOY_VERCEL.md
├── package.json
├── vercel.json
├── requirements.txt
├── .env.example
└── LICENSE
```

---

## Run the Vercel Demo Locally

Install Vercel CLI:

```bash
npm install -g vercel
```

Run locally:

```bash
vercel dev
```

Open:

```txt
http://localhost:3000
```

Test with:

```txt
jane.admin
```

---

## Deploy to Vercel

Import this repository into Vercel.

Recommended settings:

```txt
Framework Preset: Other
Root Directory: ./
Build Command: empty
Output Directory: empty
Install Command: npm install
```

Then deploy.

---

## Run the Python Local Demo

```bash
python -m app.main
```

Open:

```txt
http://127.0.0.1:8000
```

Test with:

```txt
jane.admin
```

---

## Environment Variables

Copy the example env file:

```bash
cp .env.example .env
```

Example values:

```env
MCP_MODE=demo
SPLUNK_HOST=https://localhost:8089
SPLUNK_TOKEN=your_splunk_token_here
SPLUNK_INDEX=breachpilot
```

Modes:

```txt
MCP_MODE=demo
```

Uses local synthetic events.

```txt
MCP_MODE=real
```

Uses the Splunk MCP integration path.

---

## Sample SPL Queries

BreachPilot uses short, scoped investigation queries.

```spl
index=breachpilot user="jane.admin" earliest=-24h
| table _time sourcetype user src_ip host action status risk_signal
| sort _time
```

```spl
index=breachpilot user="jane.admin" action IN ("failed_login", "successful_login")
| stats count by action src_ip
```

```spl
index=breachpilot user="jane.admin" risk_signal=*
| stats values(risk_signal) as signals count by user src_ip host
```

```spl
index=breachpilot (user="jane.admin" OR src_ip="45.77.12.8")
| sort _time
| table _time sourcetype user src_ip host action status risk_score risk_signal
```

The goal is to keep investigation queries narrow, explainable, and analyst-verifiable.

---

## Splunk MCP Server Integration

BreachPilot is designed around the Splunk MCP Server concept: connecting AI agents to Splunk data through controlled tool calls.

The MCP client layer is responsible for:

1. Receiving an investigation plan from the agent.
2. Translating each step into a scoped Splunk query.
3. Sending the query through the MCP/Splunk integration path.
4. Returning normalized events to the evidence correlation engine.
5. Preserving query transparency for human review.

In demo mode, this same workflow runs against included synthetic events so judges can test the product without requiring a live Splunk instance.

---

## Loading Sample Data into Splunk

The repository includes synthetic security events:

```txt
data/breachpilot_events.jsonl
```

To load events into Splunk via HEC, configure your environment:

```env
SPLUNK_HEC_URL=https://localhost:8088/services/collector
SPLUNK_HEC_TOKEN=your_hec_token_here
SPLUNK_INDEX=breachpilot
```

Then run:

```bash
python scripts/load_sample_data_to_splunk.py
```

---

## Why This Matters

SOC teams often face alert fatigue and fragmented investigation workflows. A single alert may require authentication searches, VPN review, endpoint checks, data access validation, and network correlation.

BreachPilot compresses that process into a transparent investigation workflow:

```txt
Alert/entity input
→ MCP-driven Splunk evidence collection
→ Correlated timeline
→ Risk score
→ Recommended response
```

This helps analysts move faster while still keeping the human in control.

---

## Hackathon Fit

BreachPilot aligns with the **Security** track because it helps security teams detect threats faster, investigate incidents more efficiently, and automate parts of the triage workflow using AI and Splunk data.

It targets the **Best Use of Splunk MCP Server** bonus prize by demonstrating an agent-driven experience that connects an AI investigation workflow to Splunk-style operational security data.

---

## Demo Video Script

A suggested script is included in:

```txt
SUBMISSION.md
```

Recommended flow:

```txt
Problem
→ BreachPilot overview
→ Live investigation of jane.admin
→ Timeline, evidence, risk score
→ MCP/SPL workflow transparency
→ Security value
```

Keep the video under 3 minutes.

---

## License

MIT License. See [`LICENSE`](./LICENSE).

---

## Author

Built by BeBecpp for the Splunk Agentic Ops Hackathon.
