import json
from functools import wraps
from typing import get_type_hints
from pydantic import BaseModel, ValidationError
from flask import request, Response
from werkzeug.exceptions import BadRequest


def pydantic_validation(view):
    def get_pydantic_scheme(args_types):
        pydantic_scheme, arg_name = None, None
        for arg in args_types:
            arg_type = args_types[arg]
            if issubclass(arg_type, BaseModel):
                pydantic_scheme = arg_type
                arg_name = arg

        return pydantic_scheme, arg_name

    def validate_request_body(json_data, schema):
        try:
            return schema(**json_data)
        except ValidationError as e:
            raise BadRequest(e)

    def get_response_object(view_res):
        if not isinstance(view_res, tuple):
            view_res = (view_res,)

        if len(view_res) == 1:
            view_res = (view_res[0], None)
        elif len(view_res) > 2:
            raise IndexError("Returned args count > 2")

        object_content = view_res[0]
        status_code = view_res[1]

        if isinstance(object_content, Response):
            return object_content
        elif isinstance(object_content, dict):
            content = object_content
        elif issubclass(type(object_content), BaseModel):
            content = object_content.model_dump()
        else:
            content = {}

        if status_code is None:
            status_code = 200

        return Response(
            json.dumps(content), status=status_code, content_type="application/json"
        )

    @wraps(view)
    def wrapper(*args, **kwargs):
        pydantic_schema, arg_name = get_pydantic_scheme(get_type_hints(view))
        if pydantic_schema is not None:
            try:
                json_data = request.get_json()
            except BadRequest:
                raise BadRequest("JSON parse error, data is not valid JSON")

            item = validate_request_body(json_data, pydantic_schema)

            kwargs[arg_name] = item

        return get_response_object(view(*args, **kwargs))

    pydantic_schema, _ = get_pydantic_scheme(get_type_hints(view))

    # Устанавливаем атрибут pydantic_schema для wrapper
    wrapper.pydantic_schema = pydantic_schema

    return wrapper
