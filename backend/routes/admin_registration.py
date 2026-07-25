from fastapi import APIRouter, Depends, HTTPException

from utils.roles import require_admin

from services.admin_registration_service import (
    get_registration_requests,
    approve_registration_request,
    reject_registration_request,
)

from schemas.reject_registration import RejectRequest

router = APIRouter(
    prefix="/registration-requests",
    tags=["Registration Requests"]
)


@router.get("")
def registration_requests(
    current_user=Depends(require_admin),
):

    return {
        "requests": get_registration_requests()
    }

# ---------------------------------------------------------
# Approve Registration Request
# ---------------------------------------------------------
@router.post("/{request_id}/approve")
def approve_request(
    request_id: int,
    current_user=Depends(require_admin),
):

    try:

        return approve_registration_request(

            request_id,

            current_user["user_id"]

        )

    except ValueError as e:

        raise HTTPException(

            status_code=400,

            detail=str(e)

        )

    except Exception:

        raise HTTPException(

            status_code=500,

            detail="Internal Server Error"

        )

# ---------------------------------------------------------
# Reject Registration Request
# ---------------------------------------------------------
@router.post("/{request_id}/reject")
def reject_request(
    request_id: int,
    request: RejectRequest,
    current_user=Depends(require_admin),
):

    try:

        return reject_registration_request(
            request_id=request_id,
            admin_id=current_user["user_id"],
            reason=request.reason,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception:

        raise HTTPException(
            status_code=500,
            detail="Internal Server Error",
        )