from fastapi.testclient import TestClient
from app.main import app
import os
import sys

# Add backend to path so imports work
sys.path.append(os.path.join(os.getcwd(), 'backend'))

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "AARI Backend is running. Access docs at /docs"}
    print("Root endpoint: OK")

def test_national_summary():
    response = client.get("/api/national/summary")
    assert response.status_code == 200
    data = response.json()
    assert "avg_saturation" in data
    assert "high_risk_count" in data
    print(f"National Summary: OK (High Risk Count: {data['high_risk_count']})")

def test_map():
    response = client.get("/api/map")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if len(data) > 0:
        assert "risk_score" in data[0]
    print(f"Map Data: OK ({len(data)} districts)")

def test_risk_top():
    response = client.get("/api/risk/top")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    print("Risk Top List: OK")

if __name__ == "__main__":
    print("Running Tests...")
    try:
        print("Testing read_main...")
        test_read_main()
        print("Testing national_summary...")
        test_national_summary()
        print("Testing map...")
        test_map()
        print("Testing risk_top...")
        test_risk_top()
        print("\nALL TESTS PASSED ✅")
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"\nTEST FAILED ❌: {e}")
        sys.exit(1)
