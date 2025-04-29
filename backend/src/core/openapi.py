from typing import Dict, Optional, Type

from flask import Flask
from openapi_pydantic.v3.v3_0 import Info, PathItem, Operation, Response, \
    Schema, Components, RequestBody, SecurityScheme, SecurityRequirement
from werkzeug.routing import parse_converter_args
from openapi_pydantic.v3.v3_0 import OpenAPI
from openapi_pydantic.v3.v3_0.util import PydanticSchema, construct_open_api_with_schema_class
from pydantic import BaseModel
from typing_extensions import List

from core.swagger_docs import SwaggerDocsExtension
from logging import getLogger


logger = getLogger(__name__)

from dataclasses import dataclass

from pydantic import BaseModel


@dataclass
class SwaggerDocsExtension:
    description: str
    responses: List[Dict[int, Type[BaseModel]]]
    request_body: Optional[Type[BaseModel]] = None


def generate_openapi_spec(app: Flask, title: str = "API",
                          version: str = "1.0.0") -> OpenAPI:
    """
    Генерирует OpenAPI спецификацию на основе правил URL Flask и SwaggerDocsExtension.
    """
    paths: Dict[str, PathItem] = {}
    components_schemas: Dict[str, Schema] = {}

    for rule in app.url_map.iter_rules():

        endpoint = app.view_functions[rule.endpoint]
        swagger_docs: Optional[SwaggerDocsExtension] = getattr(endpoint,
                                                               '_swagger_docs',
                                                               None)

        if not swagger_docs:
            continue



        path_item = PathItem()
        methods = [method.lower() for method in rule.methods if
                   method.lower() in {'get', 'post', 'put', 'delete', 'patch'}]

        for method in methods:
            operation = Operation(
                description=swagger_docs.description,
                responses=_create_responses(swagger_docs.responses,
                                            components_schemas)
            )

            if swagger_docs.request_body:
                operation.requestBody = _create_request_body(
                    swagger_docs.request_body, components_schemas)

            setattr(path_item, method, operation)

            paths[rule.rule] = path_item

    open_api = OpenAPI(
        info=Info(title=title, version=version),
        paths=paths,
        components=Components(
            schemas=components_schemas) if components_schemas else None
    )

    return construct_open_api_with_schema_class(open_api)


def _create_responses(
        responses: List[Dict[int, Type[BaseModel]]],
        components_schemas: Dict[str, Schema]
) -> Dict[str, Response]:
    result = {}

    for response_dict in responses:
        for status_code, model in response_dict.items():
            schema_ref = _add_model_to_schemas(model, components_schemas)
            result[str(status_code)] = Response(
                description=f"Response with {model.__name__}",
                content={
                    "application/json": {
                        "schema": schema_ref
                    }
                }
            )

    return result


def _create_request_body(
        model: Type[BaseModel],
        components_schemas: Dict[str, Schema]
) -> RequestBody:

    schema_ref = _add_model_to_schemas(model, components_schemas)
    return RequestBody(
        content={
            "application/json": {
                "schema": schema_ref
            }
        },
        required=True
    )


def _add_model_to_schemas(
        model: Type[BaseModel],
        components_schemas: Dict[str, Schema]
) -> Dict[str, str]:
    model_name = model.__name__
    if model_name not in components_schemas:
        components_schemas[model_name] = PydanticSchema(schema_class=model)
    return {"$ref": f"#/components/schemas/{model_name}"}


def _extract_flask_route_params(route):
    """Извлекает параметры из URL-шаблона Flask."""
    rules = []

    pass

    return rules

def register_openapi_spec_endpoint(app):
    """
    Эндпоинт генерации swagger документации
    """
    @app.route('/apispec_1.json')
    def get_spec():
        return generate_openapi_spec(app, "api").model_dump_json(by_alias=True, exclude_none=True, indent=2)