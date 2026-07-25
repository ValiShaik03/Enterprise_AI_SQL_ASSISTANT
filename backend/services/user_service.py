from services.db_service import get_connection
from utils.password import hash_password
from services.audit_service import log_activity

# ----------------------------------------
# Allowed Roles
# ----------------------------------------

ALLOWED_ROLES = [
    "Admin",
    "Manager",
    "Analyst",
    "Viewer"
]


# ----------------------------------------
# Get All Users
# ----------------------------------------

def get_all_users():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            user_id,
            full_name,
            email,
            role,
            is_active,
            created_at
        FROM users
        ORDER BY user_id
    """)

    users = cursor.fetchall()
    print(users)
    cursor.close()
    conn.close()

    return users


# ----------------------------------------
# Create User
# ----------------------------------------

def create_user(
    full_name,
    email,
    password,
    role,
    current_user_id
):

    # -----------------------------
    # Validate Role
    # -----------------------------

    if role not in ALLOWED_ROLES:
        return {
            "status": "failed",
            "message": f"Invalid role. Allowed roles: {', '.join(ALLOWED_ROLES)}"
        }

    conn = get_connection()
    cursor = conn.cursor()

    try:

        # -----------------------------
        # Check Duplicate Email
        # -----------------------------

        cursor.execute(
            """
            SELECT user_id
            FROM users
            WHERE email = %s
            """,
            (email,)
        )

        existing_user = cursor.fetchone()

        if existing_user:
            return {
                "status": "failed",
                "message": "Email already exists."
            }

        # -----------------------------
        # Hash Password
        # -----------------------------

        password_hash = hash_password(password)

        # -----------------------------
        # Insert User
        # -----------------------------

        cursor.execute(
            """
            INSERT INTO users
            (
                full_name,
                email,
                password_hash,
                role,
                is_active
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s,
                TRUE
            )
            """,
            (
                full_name,
                email,
                password_hash,
                role
            )
        )

        conn.commit()

        log_activity(
            user_id=current_user_id,
            action="CREATE_USER",
            description=f"Created user '{full_name}' ({email}) with role '{role}'."
        )

        return {
            "status": "success",
            "message": "User created successfully."
        }

    finally:

        cursor.close()
        conn.close()

def update_user(
    user_id: int,
    full_name: str,
    email: str,
    role: str,
    current_user_id : int
):

    if role not in ALLOWED_ROLES:
        return {
            "status": "failed",
            "message": f"Invalid role. Allowed roles: {', '.join(ALLOWED_ROLES)}"
        }

    conn = get_connection()
    cursor = conn.cursor()

    try:

        # Check if user exists
        cursor.execute(
            """
            SELECT user_id
            FROM users
            WHERE user_id=%s
            """,
            (user_id,)
        )

        user = cursor.fetchone()

        if not user:
            return {
                "status": "failed",
                "message": "User not found."
            }

        # Check duplicate email
        cursor.execute(
            """
            SELECT user_id
            FROM users
            WHERE email=%s
            AND user_id<>%s
            """,
            (
                email,
                user_id
            )
        )

        duplicate = cursor.fetchone()

        if duplicate:
            return {
                "status": "failed",
                "message": "Email already exists."
            }

        cursor.execute(
            """
            UPDATE users
            SET
                full_name=%s,
                email=%s,
                role=%s
            WHERE user_id=%s
            """,
            (
                full_name,
                email,
                role,
                user_id
            )
        )

        conn.commit()

        log_activity(
            user_id=current_user_id,
            action="UPDATE_USER",
            description=f"Updated user '{full_name}' ({email}) with role '{role}'."
        )

        return {
            "status": "success",
            "message": "User updated successfully."
        }

    finally:

        cursor.close()
        conn.close()

def delete_user(
    user_id: int,
    current_user_id: int
):

    conn = get_connection()
    cursor = conn.cursor()

    try:

        # ----------------------------------
        # Check if user exists
        # ----------------------------------

        cursor.execute(
            """
            SELECT user_id
            FROM users
            WHERE user_id=%s
            """,
            (user_id,)
        )

        user = cursor.fetchone()

        if not user:
            return {
                "status": "failed",
                "message": "User not found."
            }

        # ----------------------------------
        # Prevent self deletion
        # ----------------------------------

        if user_id == current_user_id:

            return {
                "status": "failed",
                "message": "You cannot delete your own account."
            }

        # ----------------------------------
        # Delete user
        # ----------------------------------

        cursor.execute(
            """
            DELETE FROM users
            WHERE user_id=%s
            """,
            (user_id,)
        )

        conn.commit()

        log_activity(
            user_id=current_user_id,
            action="DELETE_USER",
            description=f"Deleted user with ID {user_id}."
        )

        return {
            "status": "success",
            "message": "User deleted successfully."
        }

    finally:

        cursor.close()
        conn.close()

def update_user_status(
    user_id: int,
    is_active: bool,
    current_user_id: int
):

    conn = get_connection()
    cursor = conn.cursor()

    try:

        # -----------------------------
        # Check user exists
        # -----------------------------

        cursor.execute(
            """
            SELECT user_id
            FROM users
            WHERE user_id=%s
            """,
            (user_id,)
        )

        user = cursor.fetchone()

        if not user:
            return {
                "status": "failed",
                "message": "User not found."
            }

        # -----------------------------
        # Prevent self deactivation
        # -----------------------------

        if user_id == current_user_id and not is_active:
            return {
                "status": "failed",
                "message": "You cannot deactivate your own account."
            }

        # -----------------------------
        # Update Status
        # -----------------------------

        cursor.execute(
            """
            UPDATE users
            SET is_active=%s
            WHERE user_id=%s
            """,
            (
                is_active,
                user_id
            )
        )

        conn.commit()

        log_activity(
            user_id=current_user_id,
            action="UPDATE_USER_STATUS",
            description=(
                f"Activated user with ID {user_id}."
                if is_active
                else f"Deactivated user with ID {user_id}."
            )
        )

        return {
            "status": "success",
            "message": (
                "User activated successfully."
                if is_active
                else "User deactivated successfully."
            )
        }

    finally:

        cursor.close()
        conn.close()

def reset_password(
    user_id: int,
    new_password: str,
    current_user_id: int
):

    conn = get_connection()
    cursor = conn.cursor()

    try:

        # -----------------------
        # Check User Exists
        # -----------------------

        cursor.execute(
            """
            SELECT user_id
            FROM users
            WHERE user_id=%s
            """,
            (user_id,)
        )

        user = cursor.fetchone()

        if not user:

            return {
                "status": "failed",
                "message": "User not found."
            }

        # -----------------------
        # Prevent resetting own password
        # -----------------------

        if user_id == current_user_id:

            return {
                "status": "failed",
                "message": "Use the Change Password feature for your own account."
            }

        password_hash = hash_password(new_password)

        cursor.execute(
            """
            UPDATE users
            SET password_hash=%s
            WHERE user_id=%s
            """,
            (
                password_hash,
                user_id
            )
        )

        conn.commit()

        log_activity(
            user_id=current_user_id,
            action="RESET_PASSWORD",
            description=f"Reset password for user ID {user_id}."
        )

        return {
            "status": "success",
            "message": "Password reset successfully."
        }

    finally:

        cursor.close()
        conn.close()