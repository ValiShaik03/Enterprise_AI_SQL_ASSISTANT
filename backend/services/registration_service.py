import bcrypt

from services.db_service import get_connection


# ---------------------------------------------------------
# Check if email already exists in users table
# ---------------------------------------------------------
def email_exists_in_users(email: str):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT user_id
        FROM users
        WHERE email = %s
        """,
        (email,)
    )

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    return user is not None


# ---------------------------------------------------------
# Check if email already has a pending request
# ---------------------------------------------------------
def email_exists_in_requests(email: str):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT request_id
        FROM registration_requests
        WHERE email = %s
          AND status = 'Pending'
        """,
        (email,)
    )

    request = cursor.fetchone()

    cursor.close()
    conn.close()

    return request is not None


# ---------------------------------------------------------
# Hash Password
# ---------------------------------------------------------
def hash_password(password: str):

    hashed = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    )

    return hashed.decode("utf-8")


# ---------------------------------------------------------
# Create Registration Request
# ---------------------------------------------------------
def create_registration_request(data):

    if email_exists_in_users(data.email):
        raise ValueError("Email is already registered.")

    if email_exists_in_requests(data.email):
        raise ValueError(
            "A registration request is already pending."
        )

    password_hash = hash_password(data.password)

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO registration_requests
        (
            full_name,
            email,
            password_hash,
            requested_role,
            status
        )
        VALUES
        (
            %s,
            %s,
            %s,
            %s,
            'Pending'
        )
        """,
        (
            data.full_name,
            data.email,
            password_hash,
            data.requested_role,
        )
    )

    conn.commit()

    cursor.close()
    conn.close()

    return {
        "success": True,
        "message": "Registration request submitted successfully. Please wait for admin approval."
    }