# projector_calibration/image_manager.py

import pygame

class ImageManager:
    def __init__(self):
        self.images = {}

    def load_image(self, name: str, path: str):
        """
        Load an image from 'path' and store it under the given 'name'.
        """
        surface = pygame.image.load(path)
        self.images[name] = surface.copy()

    def remove_image(self, name: str):
        """
        Remove an image from the manager if it exists.
        """
        if name in self.images:
            del self.images[name]

    def get_image(self, name: str):
        """
        Retrieve the pygame.Surface for the given name, or None if not found.
        """
        return self.images.get(name, None)

    def clear(self):
        """
        Remove all loaded images.
        """
        self.images.clear()
