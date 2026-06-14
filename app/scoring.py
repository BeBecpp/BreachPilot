from __future__ import annotations

from collections import defaultdict
from typing import Any

SIGNAL_WEIGHTS = {
    'failed_login_burst': 15,
    'success_after_fail': 22,
    'first_seen_ip': 12,
    'unusual_geo_or_asn': 15,
    'mfa_not_satisfied': 12,
    'admin_console_access': 10,
    'sensitive_export': 24,
    'suspicious_egress': 18,
    'endpoint_process_anomaly': 13,
    'api_error_spike': 8,
    'role_change': 20,
}

CATEGORY_LABELS = {
    'auth': 'Authentication evidence',
    'vpn': 'VPN / identity context',
    'access': 'Privileged access evidence',
    'data': 'Data access evidence',
    'network': 'Network and egress evidence',
    'endpoint': 'Endpoint evidence',
    'app': 'Application reliability evidence',
}


def risk_score(events: list[dict[str, Any]]) -> dict[str, Any]:
    signals = {event.get('risk_signal') for event in events if event.get('risk_signal')}
    base = 10 if events else 0
    weighted = base + sum(SIGNAL_WEIGHTS.get(signal, 4) for signal in signals)
    max_event = max([int(event.get('risk_score') or 0) for event in events] + [0])
    score = min(96, max(weighted, max_event))
    if score >= 85:
        severity = 'Critical'
    elif score >= 70:
        severity = 'High'
    elif score >= 45:
        severity = 'Medium'
    elif score > 0:
        severity = 'Low'
    else:
        severity = 'Informational'
    confidence = 'High' if len(signals) >= 5 and len(events) >= 6 else 'Medium' if events else 'Low'
    return {
        'score': score,
        'severity': severity,
        'confidence': confidence,
        'incident_type': classify_incident(signals),
        'signals': sorted(signals),
        'signal_count': len(signals),
    }


def classify_incident(signals: set[str]) -> str:
    if {'success_after_fail', 'sensitive_export', 'suspicious_egress'} <= signals:
        return 'Suspected account takeover with data-exfiltration preparation'
    if {'failed_login_burst', 'success_after_fail'} <= signals:
        return 'Suspected account takeover'
    if 'suspicious_egress' in signals:
        return 'Suspicious outbound activity'
    if 'api_error_spike' in signals:
        return 'Application anomaly requiring triage'
    return 'Security event requiring review'


def build_evidence_cards(events: list[dict[str, Any]]) -> list[dict[str, Any]]:
    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for event in events:
        grouped[event.get('category', 'access')].append(event)
    cards = []
    for category, rows in grouped.items():
        bullets = []
        seen = set()
        for row in rows:
            msg = row.get('message') or str(row.get('action'))
            if msg not in seen:
                bullets.append(msg)
                seen.add(msg)
            if len(bullets) == 4:
                break
        cards.append({
            'category': category,
            'title': CATEGORY_LABELS.get(category, f'{category.title()} evidence'),
            'count': len(rows),
            'highest_risk': max([int(r.get('risk_score') or 0) for r in rows] + [0]),
            'bullets': bullets,
        })
    return sorted(cards, key=lambda c: c['highest_risk'], reverse=True)


def recommended_actions(score_data: dict[str, Any], events: list[dict[str, Any]]) -> list[dict[str, str]]:
    signals = set(score_data.get('signals', []))
    actions: list[dict[str, str]] = []
    if {'failed_login_burst', 'success_after_fail'} & signals:
        actions.append({'priority': 'P0', 'action': 'Disable active sessions for the affected user and force password reset.'})
        actions.append({'priority': 'P0', 'action': 'Require MFA re-enrollment and review recent MFA challenge outcomes.'})
    if 'first_seen_ip' in signals or 'unusual_geo_or_asn' in signals:
        src_ips = sorted({e.get('src_ip') for e in events if e.get('src_ip')})
        if src_ips:
            actions.append({'priority': 'P1', 'action': f'Block or rate-limit suspicious source IPs: {", ".join(src_ips[:3])}.'})
    if 'sensitive_export' in signals:
        actions.append({'priority': 'P0', 'action': 'Review export logs and verify whether customer data left the environment.'})
    if 'suspicious_egress' in signals:
        actions.append({'priority': 'P1', 'action': 'Block suspicious egress destination and preserve proxy/DNS evidence.'})
    if 'api_error_spike' in signals:
        actions.append({'priority': 'P2', 'action': 'Correlate security timeline with application error spike for blast-radius analysis.'})
    actions.append({'priority': 'P2', 'action': 'Create a Splunk detection for failed-login burst followed by success, admin access, and export activity.'})
    return actions[:6]


def attack_path(events: list[dict[str, Any]]) -> list[str]:
    steps = []
    for action in ['failed_login', 'successful_login', 'vpn_login', 'admin_console_access', 'customer_export', 'dns_query', 'proxy_connect', 'api_error_spike']:
        if any(e.get('action') == action for e in events):
            steps.append(action.replace('_', ' ').title())
    return steps
