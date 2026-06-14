from __future__ import annotations


def _escape(value: str) -> str:
    return value.replace('\\', '\\\\').replace('"', '\\"')


def build_queries(entity: str, lookback: str = '-24h') -> list[dict[str, str]]:
    e = _escape(entity.strip())
    entity_filter = f'(user="{e}" OR src_ip="{e}" OR host="{e}")'
    return [
        {
            'id': 'discover_indexes',
            'title': 'Discover security indexes',
            'purpose': 'Confirm that the breachpilot index exists and is searchable.',
            'spl': f'index=breachpilot earliest={lookback} | stats count by index sourcetype | sort -count',
            'tool': 'splunk_get_indexes',
        },
        {
            'id': 'entity_timeline',
            'title': 'Build entity timeline',
            'purpose': 'Pull recent events connected to the investigated user, IP, or host.',
            'spl': f'index=breachpilot {entity_filter} earliest={lookback} | table _time sourcetype user src_ip host action status risk_signal risk_score message | sort _time',
            'tool': 'splunk_run_query',
        },
        {
            'id': 'auth_pattern',
            'title': 'Correlate authentication pattern',
            'purpose': 'Find failed-login bursts followed by successful access from the same source.',
            'spl': f'index=breachpilot {entity_filter} earliest={lookback} action IN ("failed_login", "successful_login", "mfa_challenge", "vpn_login") | stats count values(status) as statuses values(risk_signal) as signals by user src_ip action | sort -count',
            'tool': 'splunk_run_query',
        },
        {
            'id': 'privileged_access',
            'title': 'Check privileged and data-access activity',
            'purpose': 'Identify admin console activity, export behavior, and sensitive-data access.',
            'spl': f'index=breachpilot {entity_filter} earliest={lookback} action IN ("admin_console_access", "customer_export", "sensitive_search", "role_change") | table _time user src_ip host action status risk_signal risk_score message | sort _time',
            'tool': 'splunk_run_query',
        },
        {
            'id': 'network_egress',
            'title': 'Check endpoint and network signals',
            'purpose': 'Look for suspicious DNS/proxy/endpoint activity after privileged access.',
            'spl': f'index=breachpilot {entity_filter} earliest={lookback} sourcetype IN ("proxy", "dns", "endpoint", "app") | table _time sourcetype user src_ip host dest action status risk_signal risk_score message | sort _time',
            'tool': 'splunk_run_query',
        },
        {
            'id': 'risk_rollup',
            'title': 'Generate risk rollup',
            'purpose': 'Aggregate the risk signals that justify severity and next actions.',
            'spl': f'index=breachpilot {entity_filter} earliest={lookback} risk_signal=* | stats values(risk_signal) as signals max(risk_score) as max_event_risk count by user src_ip host | sort -max_event_risk',
            'tool': 'splunk_run_query',
        },
    ]
