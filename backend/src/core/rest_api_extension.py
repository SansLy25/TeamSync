from functools import wraps
from typing import Optional, List, Dict, Type, Any

from pydantic import BaseModel
from core.exception_catcher import exception_catcher
from core.jwt_auth import jwt_auth
from core.swagger_docs import swagger_docs
from core.pydantic_validation import pydantic_validation

import inspect


def rest_api(
    responses: Optional[List[Dict[int, Type[BaseModel]]]] = None,
    description: Optional[str] = None,
    query_params: Optional[List[str]] = None,
):
    def decorator(view):
        original_sig = inspect.signature(view)
        original_annotations = view.__annotations__

        wrapped = view
        wrapped = pydantic_validation(wrapped)
        wrapped = jwt_auth(wrapped)
        wrapped = exception_catcher(wrapped)
        wrapped = swagger_docs(description=description, responses=responses, query_params=query_params)(wrapped)

        wrapped.__signature__ = original_sig
        wrapped.__annotations__ = original_annotations

        return wrapped

    return decorator