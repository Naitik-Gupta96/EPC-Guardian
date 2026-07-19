import pytest
from httpx import AsyncClient, ASGITransport
from apps.api.epc_api.main import app


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


async def test_get_project(client):
    resp = await client.get("/api/projects/DC-TIER3-DEMO-001")
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == "DC-TIER3-DEMO-001"


async def test_list_deviations(client):
    resp = await client.get("/api/projects/DC-TIER3-DEMO-001/deviations")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] >= 1


async def test_get_deviation(client):
    resp = await client.get("/api/deviations/DEV-UPS-001")
    assert resp.status_code == 200
    data = resp.json()
    assert data["delta"] == -5.0
    assert data["severity"] == "critical"


async def test_impact_graph(client):
    resp = await client.get("/api/deviations/DEV-UPS-001/impact-graph")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["nodes"]) >= 5


async def test_simulate(client):
    resp = await client.post("/api/deviations/DEV-UPS-001/simulate", json={"extra_delay_days": 9})
    assert resp.status_code == 200
    data = resp.json()
    assert data["baseline_duration_days"] > 0


async def test_workflow(client):
    resp = await client.post("/api/deviations/DEV-UPS-001/workflow")
    assert resp.status_code == 200
    data = resp.json()
    assert "rfi" in data
    assert "ncr" in data
    assert "risk_entry" in data
