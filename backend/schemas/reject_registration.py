from pydantic import BaseModel, Field


class RejectRequest(BaseModel):
    reason: str = Field(..., min_length=5, max_length=500)

