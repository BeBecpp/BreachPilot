from __future__ import annotations

import json
import os
import ssl
import time
import urllib.error
import urllib.request
from typing import Any


class MCPError(RuntimeError):
    pass


class SplunkMCPClient:
    def __init__(self, server_url: str | None = None, auth_token: str | None = None, timeout: int = 45) -> None:
        self.server_url = (server_url or os.getenv('MCP_SERVER_URL') or '').strip()
        self.auth_token = (auth_token or os.getenv('MCP_AUTH_TOKEN') or '').strip()
        self.timeout = int(os.getenv('MCP_TIMEOUT_SECONDS', str(timeout)))
        self.verify_tls = os.getenv('MCP_VERIFY_TLS', 'true').lower() not in {'0', 'false', 'no'}

    def configured(self) -> bool:
        return bool(self.server_url)

    def call_tool(self, tool_name: str, arguments: dict[str, Any]) -> dict[str, Any]:
        if not self.server_url:
            raise MCPError('MCP_SERVER_URL is not configured')
        payload = {
            'jsonrpc': '2.0',
            'id': f'breachpilot-{int(time.time() * 1000)}',
            'method': 'tools/call',
            'params': {'name': tool_name, 'arguments': arguments},
        }
        headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
        if self.auth_token:
            headers['Authorization'] = f'Bearer {self.auth_token}'
        request = urllib.request.Request(self.server_url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
        context = None if self.verify_tls else ssl._create_unverified_context()
        try:
            with urllib.request.urlopen(request, timeout=self.timeout, context=context) as response:
                raw = response.read().decode('utf-8')
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode('utf-8', errors='replace')
            raise MCPError(f'MCP HTTP {exc.code}: {detail}') from exc
        except urllib.error.URLError as exc:
            raise MCPError(f'MCP connection failed: {exc.reason}') from exc
        result = json.loads(raw)
        if 'error' in result:
            raise MCPError(f"MCP tool error: {result['error']}")
        return result.get('result', result)


def extract_rows(mcp_result: dict[str, Any]) -> list[dict[str, Any]]:
    if isinstance(mcp_result.get('rows'), list):
        return mcp_result['rows']
    if isinstance(mcp_result.get('results'), list):
        return mcp_result['results']
    content = mcp_result.get('content')
    if isinstance(content, list):
        for item in content:
            if isinstance(item, dict) and item.get('text'):
                try:
                    parsed = json.loads(item['text'])
                    if isinstance(parsed, list):
                        return parsed
                    if isinstance(parsed, dict) and isinstance(parsed.get('results'), list):
                        return parsed['results']
                except json.JSONDecodeError:
                    pass
    return []
