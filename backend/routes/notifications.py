from fastapi import APIRouter, Depends, HTTPException

from utils.roles import require_viewer
from services.notification_api_service import (
    get_notifications,
    mark_notification_read,
    mark_all_notifications_read,
)

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)


@router.get("")
def notifications(
    current_user=Depends(require_viewer),
):
    return {
        "notifications": get_notifications(
            current_user["user_id"]
        )
    }


@router.put("/{notification_id}/read")
def read_notification(
    notification_id: int,
    current_user=Depends(require_viewer),
):
    return mark_notification_read(
        notification_id,
        current_user["user_id"],
    )


@router.put("/read-all")
def read_all(
    current_user=Depends(require_viewer),
):
    return mark_all_notifications_read(
        current_user["user_id"]
    )