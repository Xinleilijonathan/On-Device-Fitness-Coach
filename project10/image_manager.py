import pygame

class ImageManager:
    def __init__(self):
        # Dictionary to hold images by name, e.g. {"image1.png": pygame.Surface, ...}
        self.images = {}

    def load_image(self, name: str, path: str):
        """
        Load a single image from 'path' and store it in the images dict under key 'name'.
        If the image is already loaded, this will overwrite.
        """
        surface = pygame.image.load(path)
        self.images[name] = surface.copy()  # keep a copy for later transformations

    def remove_image(self, name: str):
        """Remove an image from the manager if it exists."""
        if name in self.images:
            del self.images[name]

    def get_image(self, name: str):
        """
        Retrieve the pygame.Surface for a given name, or None if not found.
        """
        return self.images.get(name, None)

    def clear(self):
        """Optional: clear out all loaded images."""
        self.images.clear()
