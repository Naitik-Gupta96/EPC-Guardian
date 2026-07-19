from fastapi import Request
from fastapi.responses import JSONResponse


class AppError(Exception):
    def __init__(self, code: str, message: str, details: dict | None = None):
        self.code = code
        self.message = message
        self.details = details or {}


ERROR_RESPONSES = {
    "PROJECT_NOT_FOUND": (404, "The requested project does not exist."),
    "DOCUMENT_NOT_FOUND": (404, "The requested document does not exist."),
    "DEVIATION_NOT_FOUND": (404, "The requested deviation does not exist."),
    "WORKFLOW_NOT_FOUND": (404, "The requested workflow does not exist."),
    "EVIDENCE_NOT_FOUND": (404, "The requested evidence record does not exist."),
    "SCHEDULE_CYCLE_DETECTED": (422, "The schedule contains a dependency cycle."),
    "SCHEDULE_INVALID": (422, "The schedule data is invalid."),
    "WORKFLOW_EVIDENCE_INCOMPLETE": (422, "Cannot generate workflow: evidence payload is incomplete."),
    "VERSION_CONFLICT": (409, "The record has been modified since you last read it."),
    "VALIDATION_ERROR": (422, "Request validation failed."),
    "CONFIG_ERROR": (500, "Server configuration error."),
}


async def app_error_handler(request: Request, exc: AppError):
    status, _ = ERROR_RESPONSES.get(exc.code, (500, "Internal server error."))
    return JSONResponse(
        status_code=status,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details,
                "request_id": getattr(request.state, "request_id", None),
            }
        },
    )
