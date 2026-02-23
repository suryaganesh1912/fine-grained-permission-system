import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_login(email, password):
    print(f"\n--- Testing Login for {email} ---")
    response = requests.post(f"{BASE_URL}/login/", json={"email": email, "password": password})
    if response.status_code == 200:
        print("Login Successful")
        return response.json()["access"]
    else:
        print(f"Login Failed: {response.status_code}")
        print(response.text)
        return None

def test_endpoint(token, path, method="GET", data=None):
    headers = {"Authorization": f"Bearer {token}"}
    if method == "GET":
        response = requests.get(f"{BASE_URL}{path}", headers=headers)
    elif method == "POST":
        response = requests.post(f"{BASE_URL}{path}", headers=headers, json=data)
    
    print(f"{method} {path} -> Status: {response.status_code}")
    return response

if __name__ == "__main__":
    # 1. Admin Login (Has ASSIGN_PERMISSION)
    admin_token = test_login("admin@example.com", "admin123")
    if admin_token:
        test_endpoint(admin_token, "/users/")
        test_endpoint(admin_token, "/assign-permissions/", "POST", {"user_id": 2, "permissions": ["VIEW_EMPLOYEE"]})

    # 2. Staff Login (Has VIEW_EMPLOYEE)
    manager_token = test_login("manager@example.com", "manager123")
    if manager_token:
        test_endpoint(manager_token, "/employees/")
        test_endpoint(manager_token, "/assign-permissions/", "POST", {"user_id": 3, "permissions": ["VIEW_EMPLOYEE"]}) # Should be 403

    # 3. Employee Login (Has VIEW_SELF)
    employee_token = test_login("employee@example.com", "employee123")
    if employee_token:
        test_endpoint(employee_token, "/employees/") # Should be 403
        test_endpoint(employee_token, "/employees/me/") # Should be 200
