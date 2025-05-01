from typing import List

from pydantic import BaseModel, ConfigDict
from pydantic.fields import Field
from datetime import date


class GameSchemaWrite(BaseModel):
    name: str = Field(max_length=100)
    description: str = Field(max_length=500)
    release_date: date
    url_image: str | None = None


class GameSchemaRead(GameSchemaWrite):
    id: int
    model_config = ConfigDict(from_attributes=True)


class GameListSchema(BaseModel):
    games: List[GameSchemaRead]