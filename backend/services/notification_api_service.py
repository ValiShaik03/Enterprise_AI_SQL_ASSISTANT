from services.db_service import get_connection


# ---------------------------------------------------------
# Get Notifications
# ---------------------------------------------------------
def get_notifications(user_id: int):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            notification_id,
            title,
            message,
            type,
            is_read,
            created_at
        FROM notifications
        WHERE user_id=%s
        ORDER BY created_at DESC
        """,
        (user_id,),
    )

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    return rows


# ---------------------------------------------------------
# Mark Read
# ---------------------------------------------------------
def mark_notification_read(
    notification_id: int,
    user_id: int,
):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE notifications
        SET is_read=1
        WHERE notification_id=%s
        AND user_id=%s
        """,
        (
            notification_id,
            user_id,
        ),
    )

    conn.commit()

    cursor.close()
    conn.close()

    return {
        "success": True
    }


# ---------------------------------------------------------
# Mark All Read
# ---------------------------------------------------------
def mark_all_notifications_read(
    user_id: int,
):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE notifications
        SET is_read=1
        WHERE user_id=%s
        """,
        (user_id,),
    )

    conn.commit()

    cursor.close()
    conn.close()

    return {
        "success": True
    }