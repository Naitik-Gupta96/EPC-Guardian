import hashlib
import json
from pathlib import Path
from datetime import datetime


class ExtractionCache:
    def __init__(self, cache_dir: str = "./var/cache/llm"):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)

    def _key(self, provider: str, model: str, prompt_version: str, block_text: str) -> str:
        raw = f"{provider}:{model}:{prompt_version}:{block_text}"
        return hashlib.sha256(raw.encode()).hexdigest()

    def get(self, provider: str, model: str, prompt_version: str, block_text: str) -> dict | None:
        path = self.cache_dir / f"{self._key(provider, model, prompt_version, block_text)}.json"
        if path.exists():
            with open(path) as f:
                return json.load(f)
        return None

    def set(self, provider: str, model: str, prompt_version: str, block_text: str, data: dict) -> None:
        path = self.cache_dir / f"{self._key(provider, model, prompt_version, block_text)}.json"
        data["_cached_at"] = datetime.utcnow().isoformat()
        with open(path, "w") as f:
            json.dump(data, f, indent=2)
