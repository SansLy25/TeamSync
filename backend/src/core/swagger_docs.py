from dataclasses import dataclass
from typing import Optional, List, Dict, Type

from pydantic import BaseModel


@dataclass
class SwaggerDocsExtension:
    query_params: list[str]
    description: str
    responses: list[dict[int, Type[BaseModel]]]
    request_body: Type[BaseModel] = None


class EmptySchema(BaseModel):
    pass


def swagger_docs(
        responses: Optional[List[Dict[int, Type[BaseModel]]]] = None,
        description: Optional[str] = None,
        query_params: Optional[List[str]] = None,
):
    if responses is None:
        responses = [{200: EmptySchema}]
    if query_params is None:
        query_params = []

    def decorator(func):
        func._swagger_docs = SwaggerDocsExtension(
            description=description,
            responses=responses,
            request_body=func.pydantic_schema,
            query_params=query_params
        )

        return func

    return decorator