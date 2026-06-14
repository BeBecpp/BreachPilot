# BreachPilot Architecture Diagram

```mermaid
flowchart LR
    A[Security analyst] --> B[BreachPilot Web Console]
    B --> C[Local BreachPilot HTTP API]
    C --> D[Investigation Agent]
    D --> E[SPL Query Planner]
    D --> F[Risk Scoring Engine]
    D --> G[Evidence Correlator]
    E --> H{MCP_MODE}
    H -->|demo| I[Sample Splunk Events JSONL]
    H -->|real| J[Splunk MCP Server]
    J --> K[Splunk Enterprise or Splunk Cloud]
    K --> L[breachpilot index / security logs]
    G --> M[Timeline]
    G --> N[Evidence Cards]
    F --> O[Risk Score + Severity]
    D --> P[Recommended Actions]
    M --> B
    N --> B
    O --> B
    P --> B
```

## Data flow

1. The analyst enters a user, IP address, or host in the BreachPilot console.
2. The agent decomposes the request into a sequence of scoped SPL queries.
3. In real mode, BreachPilot calls Splunk MCP Server tool `splunk_run_query` for each query.
4. Splunk MCP Server executes the searches against Splunk data and returns rows to the agent.
5. The agent correlates authentication, VPN, app, endpoint, DNS, proxy, and application evidence.
6. The dashboard displays an analyst-ready incident brief with transparent SPL queries.

## AI / agent integration

BreachPilot is intentionally agentic rather than chat-only. It performs a repeatable workflow: plan investigation steps, call Splunk MCP tools, correlate evidence, score risk signals, and generate human-in-the-loop response actions.
