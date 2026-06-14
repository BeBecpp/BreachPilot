# Devpost Submission Draft

## Project title

BreachPilot: MCP-Powered Incident Commander for Splunk

## Tagline

An MCP-powered security triage agent that turns Splunk logs into an evidence-backed incident timeline, risk score, and analyst response plan.

## Track

Security

## Bonus prize target

Best Use of Splunk MCP Server

## Inspiration

Security analysts often lose valuable time pivoting between SPL searches during account-takeover and data-access investigations. BreachPilot turns that manual process into a transparent agent workflow powered by Splunk MCP Server.

## What it does

BreachPilot accepts a suspicious user, IP address, or host and runs a structured investigation:

1. discovers relevant Splunk data,
2. pulls a recent entity timeline,
3. correlates authentication, VPN, app, endpoint, DNS, proxy, and application events,
4. scores risk based on evidence,
5. produces an analyst-ready incident brief with timeline, evidence cards, and recommended next actions.

The UI also shows the exact SPL queries and MCP tool calls so the analyst can verify every conclusion.

## How we built it

- Python standard library local API server.
- Web dashboard with HTML, CSS, and JavaScript.
- Synthetic Splunk-style JSONL security dataset.
- Splunk HTTP Event Collector loader script.
- Real-mode MCP adapter using JSON-RPC `tools/call` to invoke `splunk_run_query`.
- Rule-based scoring layer for deterministic, evidence-backed triage.

## How AI is used

The AI/agent layer decomposes an investigation request into multiple Splunk MCP tool calls, retrieves evidence from operational security data, correlates events across sourcetypes, and generates a risk-scored response plan. The result is not a generic chatbot answer; it is an evidence-backed case file.

## Best Use of Splunk MCP Server angle

BreachPilot is built around Splunk MCP Server as the orchestration layer between the agent and Splunk data. It demonstrates how MCP can connect an intelligent workflow to Splunk searches and produce contextual security decisions while keeping the analyst in control.

## Demo video script under 3 minutes

### 0:00-0:20
Security analysts often lose time jumping between SPL searches after an alert. BreachPilot turns that process into an MCP-powered investigation workflow for Splunk.

### 0:20-1:20
I enter `jane.admin` and start the investigation. The agent plans the investigation, runs scoped SPL searches through the MCP layer, and builds a timeline from Splunk security events.

### 1:20-2:10
Here we see failed logins, a successful login from the same IP, unusual VPN activity, admin access, a sensitive export request, suspicious egress, and an application anomaly. BreachPilot assigns a critical risk score and shows the exact evidence.

### 2:10-2:45
The important part is human-in-the-loop transparency. The agent does not hide the evidence. It shows the SPL queries, the MCP tool calls, the raw timeline, and recommended response actions.

### 2:45-3:00
BreachPilot is built for the Security track and the Best Use of Splunk MCP Server prize.

## What is next

- Add saved-search execution for approved detections.
- Add Splunk AI Assistant integration for SPL explanation.
- Add case export to Jira, GitHub Issues, or SOAR.
- Add analyst feedback loops for scoring calibration.
