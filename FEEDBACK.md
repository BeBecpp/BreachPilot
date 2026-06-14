# Feedback Notes for Splunk MCP / AI Tooling

These notes can be refined into the hackathon feedback form.

## Useful parts

- MCP makes the boundary between an AI agent and Splunk data clearer than a custom REST integration.
- Namespaced tools such as `splunk_run_query` and `saia_explain_spl` are easy to reason about in an agent workflow.
- Guardrails around destructive or long-running searches are important for security operations use cases.

## Suggested improvements

1. Provide a tiny end-to-end sample app that shows an MCP client calling `splunk_run_query` from a Python web app.
2. Document the exact JSON-RPC request/response examples for streamable HTTP mode.
3. Add a hackathon starter dataset with auth, VPN, endpoint, DNS, proxy, and application sourcetypes.
4. Add clearer examples for token creation and role capabilities required by local Splunk Enterprise users.
5. Add a recommended pattern for safe fallback/demo mode so public hackathon submissions can be tested without private Splunk tokens.

## Potential impact

These improvements would make it faster for builders to create secure, judge-testable Splunk MCP projects without spending most of their time on environment setup.
