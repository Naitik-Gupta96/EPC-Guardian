from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from packages.shared.config import settings
from packages.shared.logging import setup_logging
from apps.api.epc_api.errors import AppError, app_error_handler
from apps.api.epc_api.routes.health import router as health_router
from apps.api.epc_api.routes.projects import router as projects_router
from apps.api.epc_api.routes.deviations import router as deviations_router
from apps.api.epc_api.routes.workflows import router as workflows_router
from apps.api.epc_api.routes.documents import router as documents_router
from apps.api.epc_api.routes.audit import router as audit_router
from apps.api.epc_api.routes.benchmark import router as benchmark_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging(settings.LOG_LEVEL)
    from apps.api.epc_api.store import get_store
    get_store()
    yield


app = FastAPI(
    title="EPC Guardian API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.WEB_BASE_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(AppError, app_error_handler)

app.include_router(health_router)
app.include_router(projects_router)
app.include_router(deviations_router)
app.include_router(workflows_router)
app.include_router(documents_router)
app.include_router(audit_router)
app.include_router(benchmark_router)
