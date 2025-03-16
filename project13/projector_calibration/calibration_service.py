# projector_calibration/calibration_service.py

import threading
import ctypes

from flask import Flask, request
import pygame

from .image_manager import ImageManager
from .routes import create_app
from .run_pygame import run_pygame


def start_calibration_service_nonblocking(images_to_load=None, host="127.0.0.1", port=5000, debug=False):
    """
    Start the projector calibration service in a non-blocking way:
      1) Creates the shared state & loads images
      2) Creates the Flask app & a /shutdown route
      3) Spawns a thread for Flask (werkzeug dev server)
      4) Spawns a thread for Pygame
      5) Returns references so your main code can do more stuff and then shut it down
    """
    try:
        ctypes.windll.user32.SetProcessDPIAware()
    except AttributeError:
        pass

    shared_state = _create_default_state()
    image_manager = ImageManager()

    if images_to_load:
        for name, path in images_to_load.items():
            image_manager.load_image(name, path)

    app = create_app(shared_state, image_manager)

    # Add a "/shutdown" route for a graceful exit
    def shutdown_server():
        func = request.environ.get('werkzeug.server.shutdown')
        if func is None:
            raise RuntimeError("Not running with the Werkzeug Server")
        func()

    @app.route("/shutdown", methods=["POST"])
    def shutdown_route():
        # We'll also stop Pygame at the same time
        shared_state["running"] = False
        shutdown_server()
        return "Server shutting down..."

    # Start Pygame in a background thread
    pygame_thread = threading.Thread(
        target=run_pygame,
        args=(shared_state, image_manager),
        daemon=True
    )
    pygame_thread.start()

    # Now run Flask (Werkzeug) in a background thread
    def run_flask():
        app.run(host=host, port=port, debug=debug, use_reloader=False)

    flask_thread = threading.Thread(target=run_flask, daemon=True)
    flask_thread.start()

    return shared_state, app, flask_thread, pygame_thread


def _create_default_state():
    """Create the default dictionary for shared_state."""
    return {
        "running": True,
        "display_index": 1,
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
        "overlay_scale_percent": 100
    }

