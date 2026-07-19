"""Global in-memory store for the seeded demo mode."""

from scripts.seed_demo import DemoStore, seed

_store: DemoStore | None = None


def get_store() -> DemoStore:
    global _store
    if _store is None:
        _store = seed()
    return _store
