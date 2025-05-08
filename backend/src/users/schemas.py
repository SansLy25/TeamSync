import re
from typing import Optional

from pydantic import BaseModel, constr, field_validator, HttpUrl


class UserBaseSchema(BaseModel):
    username: str
    avatar: HttpUrl
    gender: str = "male"
    telegram_contact: constr(max_length=50)
    discord_contact: constr(max_length=50)
    steam_contact: constr(max_length=50)
    bio: Optional[str] = None


class UserSchemaLogin(BaseModel):
    password: constr(min_length=8, max_length=60)
    username: str

    @field_validator('password')
    def validate_password(cls, password):
        pattern = r"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&,./])[\w@$!%*#?&.,/]{8,}$"
        if re.match(pattern, password):
            return password

        raise ValueError("The password does not "
                         "meet security standards.")


class UserSchemaSignUp(UserBaseSchema, UserSchemaLogin):
    pass


class UserReadSchema(UserBaseSchema):
    id: int


class TokenSchema(BaseModel):
    token: str


class UserIdSchema(BaseModel):
    id: int