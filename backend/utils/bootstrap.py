from services.sql_service import get_connection
from utils.password import hash_password


def create_default_admin():
    conn = get_connection()
    cursor = conn.cursor()

    # Check if any admin already exists
    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM users
        WHERE LOWER(role) = 'admin'
    """)

    result = cursor.fetchone()

    if result["total"] == 0:

        password_hash = hash_password("Admin@123")

        cursor.execute("""
            INSERT INTO users
            (
                full_name,
                email,
                password_hash,
                role,
                is_active
            )
            VALUES
            (%s, %s, %s, %s, %s)
        """, (
            "Administrator",
            "admin@company.com",
            password_hash,
            "Admin",
            True
        ))

        conn.commit()

        print("✅ Default Administrator created successfully.")

    else:

        print("ℹ️ Administrator already exists.")

    cursor.close()
    conn.close()