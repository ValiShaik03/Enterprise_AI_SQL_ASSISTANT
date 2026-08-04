# 🚀 Enterprise AI SQL Assistant

An AI-powered enterprise platform that enables users to query SQL databases using natural language while providing secure authentication, role-based access control, analytics, employee management, notifications, and an admin approval workflow.

> Built with **FastAPI**, **React + Vite**, **TanStack Router**, **MySQL**, **JWT Authentication**, **Google Gemini**, and **Brevo SMTP**.

---

## 📌 Features

### 🤖 AI SQL Assistant
- Convert natural language into SQL queries
- Execute SQL securely on MySQL
- AI-generated explanations
- SQL syntax highlighting
- Query execution history

### 🔐 Authentication & Security
- JWT Authentication
- Secure password hashing
- Role-Based Access Control (RBAC)
- Protected routes
- Session management

### 👥 Registration Approval Workflow
- Public user registration
- Admin approval/rejection system
- Role assignment
- Pending request management
- Registration status tracking

### 🔔 Notification System
- Real-time notification bell
- Registration notifications
- Approval notifications
- Individual "Mark as Read"
- "Mark All as Read"
- Automatic unread badge updates

### 📧 Email Notifications
- Brevo SMTP integration
- Registration approval emails
- Registration rejection emails
- Professional email templates

### 👨‍💼 Employee Management
- Employee CRUD operations
- Search employees
- Department filtering
- Salary insights

### 📊 Analytics Dashboard
- Employee statistics
- Department distribution
- Salary analytics
- AI-generated insights
- Database metrics

### 🗂 Database Explorer
- View database statistics
- Table information
- Row counts
- Database health monitoring

### ⚙ Settings
- Theme switching (Dark / Light)
- Backend URL configuration
- User session information

---

# 🏗 System Architecture

```
                    +----------------------+
                    |      React App       |
                    |   (Vite + TS)        |
                    +----------+-----------+
                               |
                               |
                      REST API (JWT)
                               |
                               |
                +--------------v--------------+
                |        FastAPI Backend      |
                +--------------+--------------+
                               |
        +----------------------+----------------------+
        |                      |                      |
        |                      |                      |
   Google Gemini          MySQL Database        Brevo SMTP
   AI SQL Generation      Employee Data        Email Service
                           Notifications
```

---

# 🛠 Tech Stack

## Frontend

- React 19
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- Tailwind CSS
- Radix UI
- Lucide Icons

---

## Backend

- FastAPI
- Python
- Uvicorn
- JWT Authentication
- Pydantic

---

## Database

- MySQL
- Railway Cloud MySQL

---

## AI

- Google Gemini API
- Prompt Engineering
- Natural Language to SQL

---

## Notifications

- In-App Notification System
- Brevo SMTP Email Service

---

## Deployment

### Frontend

- Vercel

### Backend

- Render

### Database

- Railway MySQL

---

# 📁 Project Structure

```
Enterprise_AI_SQL_ASSISTANT/

│
├── backend/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── models/
│   ├── schemas/
│   ├── app.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── routes/
│   │   ├── lib/
│   │   ├── types/
│   │   └── main.tsx
│   └── package.json
│
└── README.md
```

---

# 🔐 User Roles

| Role | Permissions |
|-------|-------------|
| Admin | Full access, registration approval, analytics, employee management |
| Manager | Manage employees, analytics |
| Analyst | Analytics & AI SQL |
| Viewer | Read-only access |

---

# 📸 Screenshots

### Login

<img width="100%" src="docs/login.png">

### Dashboard

<img width="100%" src="docs/dashboard.png">

### AI SQL Assistant

<img width="100%" src="docs/assistant.png">

### Registration Requests

<img width="100%" src="docs/registration.png">

### Notifications

<img width="100%" src="docs/notifications.png">

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/ValiShaik03/Enterprise_AI_SQL_ASSISTANT.git

cd Enterprise_AI_SQL_ASSISTANT
```

---

## Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn app:app --reload
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# ⚙ Environment Variables

## Backend (.env)

```env
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=

JWT_SECRET_KEY=

GOOGLE_API_KEY=

SMTP_SERVER=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USERNAME=
SMTP_PASSWORD=
EMAIL_FROM=
```

---

# API Documentation

After running the backend:

```
http://localhost:8000/docs
```

---

# Deployment

## Frontend

Deploy to:

- Vercel

## Backend

Deploy to:

- Render

## Database

- Railway MySQL

---

# Future Enhancements

- Password reset
- Email verification
- Audit trail improvements
- User profile management
- Multi-database support
- AI conversation history
- Export reports (PDF/Excel)
- Admin dashboard charts

---

# Author

**Shaik Mahaboob Vali**

- GitHub: https://github.com/ValiShaik03
- LinkedIn: https://linkedin.com/in/mahaboobvalishaik/

---

# License

This project is licensed under the MIT License.
