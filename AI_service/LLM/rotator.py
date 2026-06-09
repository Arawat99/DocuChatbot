from typing import List

class GeminiModelRotator:
    def __init__(self, models: List[str], default: int = 0):
        if not models:
            raise ValueError("Model list cannot be empty")

        self.models = models
        self.index = default % len(models)

    def get_model(self) -> str:
        """Return current model without advancing."""
        return self.models[self.index]

    def next_model(self) -> str:
        """Advance rotation and return next model."""
        self.index = (self.index + 1) % len(self.models)
        return self.models[self.index]

    def rotate(self) -> str:
        """Alias for next_model (cleaner semantic)."""
        return self.next_model()