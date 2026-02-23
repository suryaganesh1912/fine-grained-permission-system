# Fine-Grained User Permissions System

A robust full-stack application featuring a dynamic user-to-function permission model, built with Django REST Framework and React.

## 🚀 Features
- **Dynamic Permissions**: Assign/revoke individual functions (e.g., `CREATE_EMPLOYEE`, `ASSIGN_PERMISSION`) directly to users.
- **JWT Authentication**: Secure token-based access.
- **Permission-Aware UI**: Frontend dynamically adapts based on user permissions.
- **Modern Design**: Premium aesthetic with vanilla CSS and Inter typography.

## 🛠️ Tech Stack
- **Backend**: Django, Django REST Framework, SimpleJWT
- **Frontend**: React, Vite
- **Database**: PostgreSQL
- **Styling**: Vanilla CSS (Custom Design System)

## 📋 Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL

## ⚙️ Setup Instructions

### Backend Setup
1. Navigate to `permission_system/`.
2. Install dependencies: `pip install django djangorestframework djangorestframework-simplejwt django-cors-headers psycopg2-binary`.
3. Configure environment variables (DB settings in `settings.py`).
4. Run migrations: `python manage.py migrate`.
5. Seed permissions: `python manage.py seed_permissions`.
6. Create test users: `python create_test_users.py`.
7. Start server: `python manage.py runserver`.

### Frontend Setup
1. Navigate to `permission-frontend/`.
2. Install dependencies: `npm install`.
3. Start dev server: `npm run dev`.

## 🔑 Sample Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin (Permission Mgr)** | `admin@example.com` | `admin123` |
| **Manager (Employee Mgr)** | `manager@example.com` | `manager123` |
| **Employee** | `employee@example.com` | `employee123` |

## 📦 Postman Collection
A Postman collection is available in the root directory: `Permissions_System.postman_collection.json`.

# API Documentation - ShieldCore Permissions System

This document outlines the available API endpoints, authentication requirements, and data schemas for the ShieldCore Permissions System.

## 🔒 Authentication
The API uses **JWT (JSON Web Token)** for authentication.

- **Login Endpoint**: `/login/`
- **Header Format**: `Authorization: Bearer <your_token>`

---

## 🔑 Authentication Endpoints

### 1. User Login
`POST /login/`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response (200 OK):**
```json
{
  "refresh": "...",
  "access": "..."
}
```

### 2. Current User Info
`GET /accounts/me/`
*Requires Authentication*

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "jdoe",
  "permissions": ["VIEW_EMPLOYEE", "CREATE_EMPLOYEE"]
}
```

---

## 👥 User & Permission Management

### 3. List Users
`GET /users/`
*Requires Authentication*

### 4. List Available Permissions
`GET /permissions/`
*Requires Authentication*

### 5. Assign Permissions
`POST /assign-permissions/`
*Requires `ASSIGN_PERMISSION`*

**Request Body:**
```json
{
  "user_id": 2,
  "permissions": ["VIEW_EMPLOYEE", "EDIT_EMPLOYEE"]
}
```

---

## 📁 Employee Management
All employee endpoints (except `me`) require specific permissions.

### 6. List/Search Employees
`GET /employees/`
*Requires `VIEW_EMPLOYEE`*

- **Query Params**: `page=<int>` (Pagination: 5 per page)

### 7. Register New Employee (Unified)
`POST /employees/`
*Requires `CREATE_EMPLOYEE`*

**Request Body (Linked to existing user):**
```json
{
  "user": 2, 
  "name": "Jane Smith",
  "position": "Manager",
  "salary": 95000
}
```

**Request Body (New user + Employee):**
```json
{
  "email": "newuser@example.com",
  "username": "newuser",
  "password": "securepassword123",
  "name": "New Employee",
  "position": "Developer",
  "salary": 80000
}
```

### 8. Update Employee
`PUT /employees/<id>/`
*Requires `EDIT_EMPLOYEE`*

### 9. Delete Employee
`DELETE /employees/<id>/`
*Requires `DELETE_EMPLOYEE`*

### 10. My Employee Profile
`GET /employees/me/`
*Requires `VIEW_SELF` (Granted by default to all logged-in employees)*

---

## ⚠️ Error Codes

| Status Code | Meaning | Description |
| :--- | :--- | :--- |
| **401** | Unauthorized | Invalid or missing JWT token. |
| **403** | Forbidden | User does not have the required fine-grained permission. |
| **404** | Not Found | The requested resource (User/Employee) does not exist. |
| **400** | Bad Request | Validation error (e.g., missing mandatory fields). |