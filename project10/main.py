# main.py
import threading
import ctypes

import pygame
from routes import create_app
from run_pygame import run_pygame
from image_manager import ImageManager

def main():
    # Make Windows DPI-aware
    try:
        ctypes.windll.user32.SetProcessDPIAware()
    except AttributeError:
        pass

    shared_state = {
        "running": True,

        # Display and base image
        "display_index": 1,
        "selected_image": "image1.png",

        # Base image transforms
        "offset_x_percent": 50,
        "offset_y_percent": 50,
        "width_percent": 100,
        "height_percent": 100,
        "scale_percent": 100,

        # Overlay usage
        "overlay_enabled": False,
        "overlay_image": "overlay1.png",
        "overlay_alpha": 128,  # 0..255

        # Overlay transforms
        "overlay_offset_x_percent": 50,
        "overlay_offset_y_percent": 50,
        "overlay_width_percent": 100,
        "overlay_height_percent": 100,
        "overlay_scale_percent": 100,
    }

    image_manager = ImageManager()
    # Load images for the base
    image_manager.load_image("image1.png", "image1.png")
    image_manager.load_image("image2.png", "image2.png")
    # Load overlay images
    image_manager.load_image("overlay1.png", "overlay1.png")
    image_manager.load_image("overlay2.png", "overlay2.png")

    app = create_app(shared_state, image_manager)

    # Run Pygame in a thread
    pygame_thread = threading.Thread(
        target=run_pygame,
        args=(shared_state, image_manager),
        daemon=True
    )
    pygame_thread.start()

    try:
        app.run(debug=True, use_reloader=False)
    finally:
        shared_state["running"] = False
        pygame_thread.join()

if __name__ == "__main__":
    main()