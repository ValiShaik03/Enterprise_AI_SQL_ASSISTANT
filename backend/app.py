from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.sql_service import get_connection
from api.audit import router as audit_router
from api.chat import router as chat_router
from api.database import router as database_router
from api.analytics import router as analytics_router
from api.auth import router as auth_router
from fastapi import Depends
from utils.roles import require_analyst,require_viewer
from api.admin import router as admin_router
from api.history import router as history_router
from api.export import router as export_router
from routes.registration import router as registration_router
from routes.admin_registration import router as admin_registration_router
app = FastAPI(
    title="AI SQL RAG Assistant",
    version="1.0.0"
)

# -----------------------------------------
# CORS Configuration
# -----------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Restrict to your frontend domain later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------
# Register Routers
# -----------------------------------------

app.include_router(chat_router)
app.include_router(database_router)
app.include_router(analytics_router)
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(audit_router)
app.include_router(history_router)
app.include_router(export_router)
app.include_router(registration_router)
app.include_router(admin_registration_router)

# -----------------------------------------
# Home
# -----------------------------------------

@app.get("/")
def home():

    return {
        "status": "success",
        "message": "AI SQL RAG Assistant Backend Running Successfully",
        "version": "1.0.0"
    }


# -----------------------------------------
# Health Check
# -----------------------------------------

@app.get("/health")
def health():

    try:

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute("SELECT 1")

        cursor.fetchone()

        cursor.close()
        conn.close()

        return {
            "status": "healthy",
            "database": "connected"
        }

    except Exception as e:

        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }


# -----------------------------------------
# Employees
# -----------------------------------------

@app.get("/employees")
def employees(current_user=Depends(require_analyst)):

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute("SELECT * FROM employees")

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    return {
        "employees": rows
    }

