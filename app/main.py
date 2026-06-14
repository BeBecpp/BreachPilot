from __future__ import annotations

import json
import mimetypes
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

from .agent import BreachPilotAgent
from .demo_data import load_events

ROOT = Path(__file__).resolve().parents[1]
WEB_ROOT = ROOT / 'web'


class Handler(BaseHTTPRequestHandler):
    server_version = 'BreachPilot/1.0'

    def _send_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload, indent=2).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self) -> None:
        path = urlparse(self.path).path
        if path == '/api/health':
            agent = BreachPilotAgent()
            return self._send_json(200, {'ok': True, 'mode': agent.mode, 'mcp_configured': agent.mcp.configured()})
        if path == '/api/events':
            return self._send_json(200, {'events': load_events()})
        self._serve_static(path)

    def do_POST(self) -> None:
        if urlparse(self.path).path != '/api/investigate':
            return self._send_json(404, {'error': 'not found'})
        length = int(self.headers.get('Content-Length', '0') or '0')
        raw = self.rfile.read(length).decode('utf-8') if length else '{}'
        try:
            payload = json.loads(raw or '{}')
            agent = BreachPilotAgent(mode=payload.get('mode'))
            result = agent.investigate(payload.get('entity') or 'jane.admin', payload.get('lookback') or '-24h')
            return self._send_json(200, result)
        except Exception as exc:
            return self._send_json(500, {'error': str(exc)})

    def _serve_static(self, path: str) -> None:
        if path in {'', '/'}:
            file_path = WEB_ROOT / 'index.html'
        else:
            normalized = unquote(path).lstrip('/')
            if normalized.startswith('web/'):
                normalized = normalized[4:]
            file_path = (WEB_ROOT / normalized).resolve()
            if not str(file_path).startswith(str(WEB_ROOT.resolve())):
                return self._send_json(403, {'error': 'forbidden'})
        if not file_path.exists() or not file_path.is_file():
            return self._send_json(404, {'error': 'not found'})
        body = file_path.read_bytes()
        self.send_response(200)
        self.send_header('Content-Type', mimetypes.guess_type(str(file_path))[0] or 'application/octet-stream')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt: str, *args) -> None:
        print('[breachpilot]', fmt % args)


def main() -> None:
    host = os.getenv('HOST', '127.0.0.1')
    port = int(os.getenv('PORT', '8000'))
    print(f'BreachPilot running at http://{host}:{port}')
    print('Demo entity: jane.admin')
    ThreadingHTTPServer((host, port), Handler).serve_forever()


if __name__ == '__main__':
    main()
