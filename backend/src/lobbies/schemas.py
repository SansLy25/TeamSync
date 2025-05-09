from datetime import datetime

from pydantic import BaseModel, constr, conint

from users.schemas import UserReadSchema


class LobbyBaseSchema(BaseModel):
    platform: constr(max_length=30)
    skill_level: conint(le=10)
    goal: constr(max_length=100)
    slots: conint(le=20)
    description: str
    start_time: datetime

    class Config:
        from_attributes = True


class LobbyReadSchema(LobbyBaseSchema):
    id: int
    members: list[UserReadSchema]
    author: UserReadSchema
    filled_slots: int


class LobbyWriteSchema(LobbyBaseSchema):
    pass