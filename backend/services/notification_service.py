def create_notification(
    cursor,
    user_id: int,
    title: str,
    message: str,
    notification_type: str,
):
    cursor.execute(
        """
        INSERT INTO notifications
        (
            user_id,
            title,
            message,
            type
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
            user_id,
            title,
            message,
            notification_type,
        )
    )