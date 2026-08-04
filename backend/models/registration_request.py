from pydantic import BaseModel
from typing import Literal


class ApproveRegistrationRequest(BaseModel):
    role: Literal[
        "Viewer",
        "Analyst",
        "Manager",
    ]