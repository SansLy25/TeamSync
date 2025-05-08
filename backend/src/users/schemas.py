import re

from pydantic import BaseModel, constr, field_validator


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

class UserSchema(BaseModel):
    id: int
    username: str
    


class TokenSchema(BaseModel):
    token: str


class UserIdSchema(BaseModel):
    id: int