from services.db_service import get_connection
from datetime import datetime

# ---------------------------------------------------------
# Get All Registration Requests
# ---------------------------------------------------------
def get_registration_requests():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT

            request_id,
            full_name,
            email,
            requested_role,
            status,
            created_at

        FROM registration_requests

        ORDER BY created_at DESC
        """
    )

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    return rows


# ---------------------------------------------------------
# Approve Registration Request
# ---------------------------------------------------------
def approve_registration_request(
    request_id: int,
    admin_id: int,
):

    conn = get_connection()
    cursor = conn.cursor()

    try:

        # ------------------------------------
        # Fetch Request
        # ------------------------------------
        cursor.execute(
            """
            SELECT *
            FROM registration_requests
            WHERE request_id=%s
            """,
            (request_id,)
        )

        request = cursor.fetchone()

        if not request:
            raise ValueError("Registration request not found.")

        if request["status"] != "Pending":
            raise ValueError("Request has already been processed.")

        # ------------------------------------
        # Check Existing User
        # ------------------------------------
        cursor.execute(
            """
            SELECT user_id
            FROM users
            WHERE email=%s
            """,
            (request["email"],)
        )

        existing = cursor.fetchone()

        if existing:
            raise ValueError("User already exists.")

        # ------------------------------------
        # Insert User
        # ------------------------------------
        cursor.execute(
            """
            INSERT INTO users
            (
                full_name,
                email,
                password_hash,
                role
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s
            )
            """,
            (
                request["full_name"],
                request["email"],
                request["password_hash"],
                request["requested_role"],
            )
        )

        # ------------------------------------
        # Update Registration Request
        # ------------------------------------
        cursor.execute(
            """
            UPDATE registration_requests
            SET

                status='Approved',

                approved_by=%s,

                approved_at=%s

            WHERE request_id=%s
            """,
            (
                admin_id,
                datetime.now(),
                request_id,
            )
        )

        conn.commit()

        return {

            "success": True,

            "message": "Registration approved successfully."

        }

    except Exception:

        conn.rollback()

        raise

    finally:

        cursor.close()

        conn.close()


# ---------------------------------------------------------
# Reject Registration Request
# ---------------------------------------------------------
def reject_registration_request(
    request_id: int,
    admin_id: int,
    reason: str,
):

    conn = get_connection()
    cursor = conn.cursor()

    try:

        cursor.execute(
            """
            SELECT *
            FROM registration_requests
            WHERE request_id=%s
            """,
            (request_id,)
        )

        request = cursor.fetchone()

        if not request:
            raise ValueError("Registration request not found.")

        if request["status"] != "Pending":
            raise ValueError("Request has already been processed.")

        cursor.execute(
            """
            UPDATE registration_requests
            SET
                status='Rejected',
                rejection_reason=%s,
                approved_by=%s,
                approved_at=%s
            WHERE request_id=%s
            """,
            (
                reason,
                admin_id,
                datetime.now(),
                request_id,
            )
        )

        conn.commit()

        return {
            "success": True,
            "message": "Registration rejected successfully."
        }

    except Exception:
        conn.rollback()
        raise

    finally:
        cursor.close()
        conn.close()