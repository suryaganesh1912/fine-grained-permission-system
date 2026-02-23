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
