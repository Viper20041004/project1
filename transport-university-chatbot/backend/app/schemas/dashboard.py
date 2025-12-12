from pydantic import BaseModel
from typing import List

class DashboardStats(BaseModel):
    total_users: int
    total_questions: int
    frequent_questions: List[str]
