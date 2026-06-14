from __future__ import annotations

import json
from pathlib import Path
from typing import Any

DATA_PATH = Path(__file__).resolve().parents[1] / 'data' / 'breachpilot_events.jsonl'


def load_events(path: Path | None = None) -> list[dict[str, Any]]:
    source = path or DATA_PATH
    events = []
    with source.open('r', encoding='utf-8') as f:
        for line in f:
            if line.strip():
                events.append(json.loads(line))
    return sorted(events, key=lambda e: e.get('_time', ''))


def entity_matches(event: dict[str, Any], entity: str) -> bool:
    entity = entity.strip().lower()
    fields = ['user', 'src_ip', 'host', 'dest', 'session_id']
    return any(str(event.get(field, '')).lower() == entity for field in fields)


def filter_events(entity: str, events: list[dict[str, Any]] | None = None) -> list[dict[str, Any]]:
    data = events if events is not None else load_events()
    return [event for event in data if entity_matches(event, entity)]


def simulated_query_result(query_id: str, entity: str, events: list[dict[str, Any]]) -> list[dict[str, Any]]:
    if query_id == 'discover_indexes':
        counts: dict[str, int] = {}
        for event in load_events():
            st = event.get('sourcetype', 'unknown')
            counts[st] = counts.get(st, 0) + 1
        return [{'index': 'breachpilot', 'sourcetype': k, 'count': v} for k, v in sorted(counts.items())]

    rows = filter_events(entity, events)
    if query_id == 'entity_timeline':
        return rows
    if query_id == 'auth_pattern':
        return [e for e in rows if e.get('action') in {'failed_login', 'successful_login', 'mfa_challenge', 'vpn_login'}]
    if query_id == 'privileged_access':
        return [e for e in rows if e.get('action') in {'admin_console_access', 'customer_export', 'sensitive_search', 'role_change'}]
    if query_id == 'network_egress':
        return [e for e in rows if e.get('sourcetype') in {'proxy', 'dns', 'endpoint', 'app'}]
    if query_id == 'risk_rollup':
        signals = sorted({e.get('risk_signal') for e in rows if e.get('risk_signal')})
        return [{'entity': entity, 'signals': signals, 'max_event_risk': max([int(e.get('risk_score') or 0) for e in rows] + [0]), 'count': len(rows)}]
    return rows
