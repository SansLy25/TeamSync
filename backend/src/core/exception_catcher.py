import json
from functools import wraps

from flask import Response
from werkzeug.exceptions import HTTPException


def exception_catcher(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except HTTPException as e:
            response_kwargs = {
                "content_type": "application/json",
                "status": e.code
            }
            if e.description is not None:
                response_kwargs["response"] = json.dumps({"detail": e.description})

            return Response(**response_kwargs)

    return wrapper