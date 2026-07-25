from fastapi import APIRouter, HTTPException

from schemas.registration import (
    RegistrationRequest,
    RegistrationResponse,
)

from services.registration_service import (
    create_registration_request,
)

router = APIRouter(
    prefix="/register",
    tags=["Registration"],
)


# ---------------------------------------------------------
# Submit Registration Request
# ---------------------------------------------------------
@router.post(
    "",
    response_model=RegistrationResponse,
)
def register(
    request: RegistrationRequest,
):
    try:

        return create_registration_request(request)

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