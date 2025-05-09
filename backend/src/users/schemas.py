import re
from typing import Optional

from pydantic import BaseModel, constr, field_validator, HttpUrl


class UserBaseSchema(BaseModel):
    username: str
    avatar: Optional[HttpUrl]
    gender: str = "male"
    telegram_contact: Optional[constr(max_length=50)]
    discord_contact: Optional[constr(max_length=50)]
    steam_contact: Optional[constr(max_length=50)]
    bio: str


class UserSchemaLogin(BaseModel):
    password: constr(min_length=8, max_length=60)
    username: str

    @field_validator('password')
    def validate_password(cls, password):
        pattern = (r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[\]\[@$!%*#?&,./^\-={}:;"\''
                   r'<>~`|\\])[A-Za-z\d\]\[@$!%*#?&,./^\-={}:;"\'<>~`|\\]{8,}$')
        if re.match(pattern, password):
            return password

        raise ValueError("The password does not "
                         "meet security standards.")


class UserSchemaSignUp(UserBaseSchema, UserSchemaLogin):
    pass


class UserReadSchema(UserBaseSchema):
    id: int


class UsersListSchema(BaseModel):
    users: list[UserReadSchema]


class TokenSchema(UserReadSchema):
    token: str


class UserIdSchema(BaseModel):
    id: int


class UserNotFoundSchema(BaseModel):
    detail: str = "User not found"