from typing import Dict, Optional, Type

from flask import Flask
from openapi_pydantic import OpenAPI, Info, PathItem, Operation, Response, \
    Schema, Components, RequestBody, SecurityScheme, SecurityRequirement
from openapi_pydantic.util import PydanticSchema
from pydantic import BaseModel
from typing_extensions import List

from core.swagger_docs import SwaggerDocsExtension


def generate_openapi_spec(app: Flask, title: str = "API",
                          version: str = "1.0.0") -> OpenAPI:
    paths: Dict[str, PathItem] = {}
    components_schemas: Dict[str, Schema] = {}
    security_schemes = {
        "jwt_scheme": SecurityScheme(
            type="http",
            scheme="bearer",
            bearerFormat="JWT",
            description=""
        )
    }

    for rule in app.url_map.iter_rules():
        if rule.endpoint.startswith('_'):
            continue  # Пропускаем служебные endpoint'ы

        endpoint = app.view_functions[rule.endpoint]
        swagger_docs: Optional[SwaggerDocsExtension] = getattr(endpoint,
                                                               '_swagger_docs',
                                                               None)
        if not swagger_docs:
            continue

        path_item = PathItem()
        methods = [method.lower() for method in rule.methods if
                   method.lower() in {'get', 'post', 'put', 'delete', 'patch',
                                      'head', 'options'}]

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

    return OpenAPI(
        info=Info(title=title, version=version),
        paths=paths,
        components=Components(
            schemas=components_schemas) if components_schemas else None,
        security=[SecurityRequirement(seq={"jwt_scheme": []})],
    )


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

