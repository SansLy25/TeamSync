import re

from pydantic import BaseModel, constr, field_validator, ConfigDict
from pydantic.fields import Field
from typing import Optional, List


class BidSchemaWrite(BaseModel):
    game_id: int
    description: str = Field(min_length=20)
    details: Optional[str] = Field()



"""class BidSchemaUpdate(BaseModel):
    game_id: Optional[int] = Field()
    description: Optional[str] = Field()
    details: Optional[str] = Field()"""


class BidSchemaRead(BidSchemaWrite):
    id: int
    model_config = ConfigDict(from_attributes=True)

class BidListSchema(BaseModel):
    bids: List[BidSchemaRead]