from pydantic import BaseModel, EmailStr, Field, model_validator
from typing import Literal


class RegistrationRequest(BaseModel):
    full_name: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)
    confirm_password: str
    requested_role: Literal["Manager", "Analyst", "Viewer"]

    @model_validator(mode="after")
    def validate_passwords(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self


class RegistrationResponse(BaseModel):
    success: bool
    message: str