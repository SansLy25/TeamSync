

class APIException(Exception):
    def __init__(self, message="API error"):
        self.message = message
        super().__init__(message)

