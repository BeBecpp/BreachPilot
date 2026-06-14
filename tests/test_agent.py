from app.agent import BreachPilotAgent


def test_investigation_for_jane_admin():
    result = BreachPilotAgent(mode='demo').investigate('jane.admin')
    assert result['score']['severity'] == 'Critical'
    assert result['score']['score'] >= 90
    assert len(result['timeline']) >= 10
    assert any(step['tool'] == 'splunk_run_query' for step in result['workflow'])
    assert any('customer data' in action['action'].lower() for action in result['recommended_actions'])


def test_ip_entity_matches_same_incident():
    result = BreachPilotAgent(mode='demo').investigate('45.77.12.8')
    assert result['score']['severity'] == 'Critical'
    assert result['entity'] == '45.77.12.8'
