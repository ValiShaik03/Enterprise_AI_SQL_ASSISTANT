from datetime import datetime

from services.db_service import get_connection
from services.notification_service import create_notification
from utils.email_service import send_email


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
    role: str,
):

    conn = get_connection()
    cursor = conn.cursor()

    try:

        # ------------------------------------
        # Fetch Registration Request
        # ------------------------------------
        cursor.execute(
            """
            SELECT *
            FROM registration_requests
            WHERE request_id=%s
            """,
            (request_id,),
        )

        request = cursor.fetchone()

        if not request:
            raise ValueError("Registration request not found.")

        if request["status"] != "Pending":
            raise ValueError("Request has already been processed.")

        allowed_roles = [
            "Viewer",
            "Analyst",
            "Manager",
        ]

        if role not in allowed_roles:
            raise ValueError("Invalid role selected.")

        # ------------------------------------
        # Check Existing User
        # ------------------------------------
        cursor.execute(
            """
            SELECT user_id
            FROM users
            WHERE email=%s
            """,
            (request["email"],),
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
                role,
            ),
        )

        new_user_id = cursor.lastrowid

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
            ),
        )

        # ------------------------------------
        # Create Notification
        # ------------------------------------
        create_notification(
            cursor=cursor,
            user_id=new_user_id,
            title="Registration Approved",
            message=f"Your account has been approved. Assigned role: {role}. You can now log in.",
            notification_type="Approval",
        )

        conn.commit()

        # ------------------------------------
        # Send Email (Don't Fail Approval)
        # ------------------------------------
        try:

            send_email(
                to_email=request["email"],
                subject="Registration Approved",
                body=f"""Hello {request["full_name"]},

Congratulations!

Your registration request has been approved.

Assigned Role:
{role}

You can now login to SQL RAG Assistant.

Regards,
SQL RAG Assistant Team
""",
            )

        except Exception as email_error:

            print("Approval email failed:", email_error)

        return {
            "success": True,
            "message": "Registration approved successfully.",
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
            (request_id,),
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
            ),
        )

        conn.commit()

        # ------------------------------------
        # Send Rejection Email
        # ------------------------------------
        try:

            send_email(
                to_email=request["email"],
                subject="Registration Rejected",
                body=f"""Hello {request["full_name"]},

Your registration request has been been rejected.

Reason:
{reason}

If you believe this is a mistake, please contact the administrator.

Regards,
SQL RAG Assistant Team
""",
            )

        except Exception as email_error:

            print("Rejection email failed:", email_error)

        return {
            "success": True,
            "message": "Registration rejected successfully.",
        }

    except Exception:

        conn.rollback()
        raise

    finally:

        cursor.close()
        conn.close()