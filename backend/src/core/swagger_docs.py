from dataclasses import dataclass
from typing import Type

from pydantic import BaseModel


@dataclass
class SwaggerDocsExtension:
    query_params: list[str]
    description: str
    responses: list[dict[int, Type[BaseModel]]]
    request_body: Type[BaseModel] = None


def swagger_docs(responses=[{200: BaseModel}], description=None, query_params: list[str] = []):
    def decorator(func):
        func._swagger_docs = SwaggerDocsExtension(
            description=description,
            responses=responses,
            request_body=func.pydantic_schema,
            query_params=query_params
        )

        return func

    return decorator