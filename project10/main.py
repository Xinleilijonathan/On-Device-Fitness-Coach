import threading
import ctypes
import pygame
from routes import create_app
from run_pygame import run_pygame
from image_manager import ImageManager

def main():
    # Make Windows DPI-aware (safe to ignore on macOS)
    try:
        ctypes.windll.user32.SetProcessDPIAware()
    except AttributeError:
        pass

    shared_state = {
        "running": True,
        "display_index": 0,
        "selected_image": "image1.png",
        "offset_x_percent": 50,
        "offset_y_percent": 50,
        "width_percent": 100,
        "height_percent": 100,
        "scale_percent": 100,
        "overlay_enabled": False,
        "overlay_image": "overlay1.png",
        "overlay_alpha": 128,
        "overlay_offset_x_percent": 50,
        "overlay_offset_y_percent": 50,
        "overlay_width_percent": 100,
        "overlay_height_percent": 100,
        "overlay_scale_percent": 100,
    }

    image_manager = ImageManager()
    image_manager.load_image("image1.png", "image1.png")
    image_manager.load_image("image2.png", "image2.png")
    image_manager.load_image("overlay1.png", "overlay1.png")
    image_manager.load_image("overlay2.png", "overlay2.png")

    app = create_app(shared_state, image_manager)

    # Run Flask in a separate thread instead of Pygame
    flask_thread = threading.Thread(
        target=lambda: app.run(debug=True, use_reloader=False),
        daemon=True
    )
    flask_thread.start()

    # Run Pygame in the main thread
    try:
        run_pygame(shared_state, image_manager)
    finally:
        shared_state["running"] = False
        flask_thread.join()

if __name__ == "__main__":
    main()
