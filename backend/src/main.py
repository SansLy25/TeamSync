from flask import Flask
from core.pydantic_validation import pydantic_validation

from pydantic import BaseModel, constr, conint

app = Flask(__name__)

class User(BaseModel):
    name: str
    age: conint(le=100)
    city: constr(max_length=50)


@app.route('/users', methods=['POST'])
@pydantic_validation
def example_view(user: User):
    """
    Пример использования кастомной валидации pydantic (через свой декоратор),
    основной код в файле core/pydantic_validation.py
    :return:
    """
    return user, 200

if __name__ == "__main__":
    app.run()