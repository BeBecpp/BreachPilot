from __future__ import annotations

import os
import time
from typing import Any

from .demo_data import filter_events, load_events, simulated_query_result
from .mcp_client import MCPError, SplunkMCPClient, extract_rows
from .scoring import attack_path, build_evidence_cards, recommended_actions, risk_score
from .spl_query_templates import build_queries


class BreachPilotAgent:
    def __init__(self, mode: str | None = None) -> None:
        self.mode = (mode or os.getenv('MCP_MODE') or 'demo').lower()
        self.mcp = SplunkMCPClient()
        self.allow_demo_fallback = os.getenv('ALLOW_DEMO_FALLBACK', 'true').lower() not in {'0', 'false', 'no'}
        self.events = load_events()

    def investigate(self, entity: str, lookback: str = '-24h') -> dict[str, Any]:
        entity = (entity or '').strip()
        if not entity:
            raise ValueError('entity is required')
        started = time.time()
        workflow = []
        query_outputs: dict[str, Any] = {}
        all_rows: list[dict[str, Any]] = []
        mcp_errors: list[str] = []

        for index, query in enumerate(build_queries(entity, lookback), start=1):
            t0 = time.time()
            status = 'demo'
            error_message = ''
            if self.mode == 'real' and self.mcp.configured():
                try:
                    result = self.mcp.call_tool(query.get('tool') or 'splunk_run_query', {
                        'query': query['spl'],
                        'earliest_time': lookback,
                        'latest_time': 'now',
                        'max_results': 200,
                    })
                    rows = extract_rows(result)
                    status = 'ok'
                except MCPError as exc:
                    error_message = str(exc)
                    mcp_errors.append(f"{query['id']}: {error_message}")
                    if self.allow_demo_fallback:
                        rows = simulated_query_result(query['id'], entity, self.events)
                        status = 'fallback'
                    else:
                        rows = []
                        status = 'error'
            else:
                rows = simulated_query_result(query['id'], entity, self.events)

            if query['id'] in {'entity_timeline', 'auth_pattern', 'privileged_access', 'network_egress'}:
                for row in rows:
                    if isinstance(row, dict) and row.get('_time') and row not in all_rows:
                        all_rows.append(row)
            workflow.append({
                'step': index,
                'id': query['id'],
                'title': query['title'],
                'purpose': query['purpose'],
                'tool': query.get('tool', 'splunk_run_query'),
                'status': status,
                'duration_ms': int((time.time() - t0) * 1000),
                'row_count': len(rows),
                'error': error_message,
                'spl': query['spl'],
            })
            query_outputs[query['id']] = rows[:50]

        if self.mode != 'real' or not all_rows:
            all_rows = filter_events(entity, self.events)
        all_rows = sorted(all_rows, key=lambda e: e.get('_time', ''))
        score_data = risk_score(all_rows)
        path = attack_path(all_rows)
        summary = self._summary(entity, score_data, all_rows, path)
        return {
            'project': 'BreachPilot',
            'entity': entity,
            'mode': self.mode,
            'mcp_configured': self.mcp.configured(),
            'generated_at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
            'duration_ms': int((time.time() - started) * 1000),
            'summary': summary,
            'score': score_data,
            'attack_path': path,
            'workflow': workflow,
            'evidence_cards': build_evidence_cards(all_rows),
            'recommended_actions': recommended_actions(score_data, all_rows),
            'timeline': all_rows,
            'query_outputs': query_outputs,
            'mcp_errors': mcp_errors,
        }

    def _summary(self, entity: str, score_data: dict[str, Any], events: list[dict[str, Any]], path: list[str]) -> str:
        if not events:
            return f'No matching events were found for {entity}. Keep the case informational unless new evidence appears.'
        path_text = ' -> '.join(path[:6]) if path else 'multiple correlated signals'
        return (
            f"{entity} shows a {score_data['severity'].lower()}-severity pattern consistent with "
            f"{score_data['incident_type']}. The agent correlated {len(events)} events and "
            f"{score_data['signal_count']} distinct risk signals. Observed path: {path_text}."
        )
