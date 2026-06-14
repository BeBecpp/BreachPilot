#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import ssl
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'data' / 'breachpilot_events.jsonl'


def main() -> int:
    url = os.getenv('SPLUNK_HEC_URL', 'https://localhost:8088/services/collector/event')
    token = os.getenv('SPLUNK_HEC_TOKEN')
    verify_tls = os.getenv('SPLUNK_HEC_VERIFY_TLS', 'false').lower() in {'1', 'true', 'yes'}
    if not token:
        print('Missing SPLUNK_HEC_TOKEN', file=sys.stderr)
        return 2
    context = None if verify_tls else ssl._create_unverified_context()
    count = 0
    for line in DATA.read_text(encoding='utf-8').splitlines():
        event = json.loads(line)
        payload = {
            'time': event.get('_time'),
            'index': event.get('index', 'breachpilot'),
            'sourcetype': event.get('sourcetype', 'json'),
            'host': event.get('host', 'breachpilot-demo'),
            'event': event,
        }
        req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), method='POST', headers={'Authorization': f'Splunk {token}', 'Content-Type': 'application/json'})
        with urllib.request.urlopen(req, timeout=20, context=context) as res:
            if res.status >= 300:
                print(res.read().decode('utf-8', errors='replace'), file=sys.stderr)
                return 1
        count += 1
    print(f'Loaded {count} events into Splunk HEC')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
