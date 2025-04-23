import re

from pydantic import BaseModel, constr, model_validator, ValidationError


class UserSchemaLogin(BaseModel):
    password: constr(min_length=8, max_length=60)
    username: str

    @model_validator(mode='after')
    def validate_password(self):
        pattern = r"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
        if re.fullmatch(pattern, self.password):
            return self

        raise ValidationError("The password does not "
                              "meet security standards.r")

