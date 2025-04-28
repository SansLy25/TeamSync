from dataclasses import dataclass
from functools import wraps
from typing import Type

from pydantic import BaseModel


@dataclass
class SwaggerDocsExtension:
    description: str
    responses: list[dict[int, Type[BaseModel]]]
    request_body: Type[BaseModel] = None



def swagger_docs(description=None, responses=[{200: BaseModel}]):
    def decorator(func):
        func._swagger_docs = SwaggerDocsExtension(
            description=description,
            responses=responses,
            request_body=func.pydantic_schema,
        )

        return func

    return decorator