from fastapi.testclient import TestClient
from app.main import app
import sys

client = TestClient(app)

def test_routes():
    print("Testing API Routes...")
    
    # 1. Health Check
    res = client.get("/")
    assert res.status_code == 200
    print("[PASS] Health Check")

    # 2. National Summary
    res = client.get("/api/national/summary")
    assert res.status_code == 200
    data = res.json()
    assert "total_enrolments" in data
    assert "high_risk_districts" in data
    print(f"[PASS] National Summary: {data}")

    # 3. Map Data
    res = client.get("/api/map")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    if data:
        print(f"[PASS] Map Data (first record): {data[0]}")
    else:
        print("[WARN] Map Data is empty (DB might be empty)")

    # 4. Top Risk
    res = client.get("/api/risk/top?limit=5")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    if data:
        top_district = data[0]['district']
        print(f"[PASS] Top Risk Districts found. Highest: {top_district}")
        
        # 5. District Details
        res = client.get(f"/api/district/{top_district}")
        assert res.status_code == 200
        print(f"[PASS] District Details for {top_district}")
        
        # 6. District Trends
        res = client.get(f"/api/district/{top_district}/trends")
        assert res.status_code == 200
        print(f"[PASS] District Trends for {top_district}")
        
    else:
        print("[WARN] No risk data found")

if __name__ == "__main__":
    try:
        test_routes()
        print("\nAll Tests Passed Successfully!")
    except Exception as e:
        print(f"\n[FAIL] Test Failed: {e}")
        sys.exit(1)
