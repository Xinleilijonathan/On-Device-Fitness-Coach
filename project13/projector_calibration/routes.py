# projector_calibration/routes.py

import pygame
from flask import Flask, request, jsonify

def create_app(shared_state, image_manager):
    """
    Returns a Flask app that:
     1) Serves a web-based calibration UI at '/'
     2) Provides /api/* endpoints for changing images, offsets, scales, etc.
    """
    app = Flask(__name__)

    @app.route("/")
    def index():
        # Return HTML with two sets of sliders: base & overlay
        return """
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title>Projector Calibration</title>
    <style>
      body { font-family: sans-serif; }
      label { display: inline-block; width: 130px; }
      .slider-value { width: 40px; text-align: right; display: inline-block; }
      .slider-wrapper { margin-bottom: 1rem; }
      #displaySelect, #imgSelect, #overlaySelect { width: 200px; }
    </style>
</head>
<body>
    <h1>Projector Calibration - Base & Overlay</h1>

    <!-- Just a quick demonstration; your real UI might be bigger. -->

    <p>See /api/status for current calibration state as JSON.</p>

</body>
</html>
        """

    # If you like, you can store the actual UI in a separate file or add sliders here.
    # We'll keep it minimal but still provide the API below:

    @app.route("/api/status", methods=["GET"])
    def api_status():
        desktop_sizes = pygame.display.get_desktop_sizes()
        image_list = list(image_manager.images.keys())

        return jsonify({
            "running": shared_state["running"],
            "display_index": shared_state["display_index"],
            "desktop_sizes": desktop_sizes,
            "image_list": image_list,

            # Base
            "selected_image": shared_state["selected_image"],
            "offset_x_percent": shared_state["offset_x_percent"],
            "offset_y_percent": shared_state["offset_y_percent"],
            "width_percent": shared_state["width_percent"],
            "height_percent": shared_state["height_percent"],
            "scale_percent": shared_state["scale_percent"],

            # Overlay
            "overlay_image": shared_state["overlay_image"],
            "overlay_enabled": shared_state["overlay_enabled"],
            "overlay_alpha": shared_state["overlay_alpha"],
            "overlay_offset_x_percent": shared_state["overlay_offset_x_percent"],
            "overlay_offset_y_percent": shared_state["overlay_offset_y_percent"],
            "overlay_width_percent": shared_state["overlay_width_percent"],
            "overlay_height_percent": shared_state["overlay_height_percent"],
            "overlay_scale_percent": shared_state["overlay_scale_percent"]
        })

    @app.route("/api/set_display", methods=["POST"])
    def api_set_display():
        data = request.get_json()
        idx = data.get("display_index", 0)
        shared_state["display_index"] = idx
        return jsonify({"status": "ok", "display_index": idx})

    @app.route("/api/set_base", methods=["POST"])
    def api_set_base():
        data = request.get_json()
        # clamp values
        ox = max(0, min(100, data.get("offset_x_percent", 50)))
        oy = max(0, min(100, data.get("offset_y_percent", 50)))
        w = max(0, min(200, data.get("width_percent", 100)))
        h = max(0, min(200, data.get("height_percent", 100)))
        s = max(0, min(200, data.get("scale_percent", 100)))

        shared_state["offset_x_percent"] = ox
        shared_state["offset_y_percent"] = oy
        shared_state["width_percent"] = w
        shared_state["height_percent"] = h
        shared_state["scale_percent"] = s
        return jsonify({"status": "ok"})

    @app.route("/api/set_image", methods=["POST"])
    def api_set_image():
        data = request.get_json()
        new_img = data.get("image", "image1.png")
        shared_state["selected_image"] = new_img
        return jsonify({"status": "ok", "selected_image": new_img})

    @app.route("/api/set_overlay", methods=["POST"])
    def api_set_overlay():
        data = request.get_json()
        shared_state["overlay_image"] = data.get("overlay_image", "overlay1.png")
        shared_state["overlay_enabled"] = data.get("overlay_enabled", False)

        alpha = data.get("overlay_alpha", 128)
        alpha = max(0, min(255, alpha))
        shared_state["overlay_alpha"] = alpha

        ox = max(0, min(100, data.get("overlay_offset_x_percent", 50)))
        oy = max(0, min(100, data.get("overlay_offset_y_percent", 50)))
        w = max(0, min(200, data.get("overlay_width_percent", 100)))
        h = max(0, min(200, data.get("overlay_height_percent", 100)))
        s = max(0, min(200, data.get("overlay_scale_percent", 100)))

        shared_state["overlay_offset_x_percent"] = ox
        shared_state["overlay_offset_y_percent"] = oy
        shared_state["overlay_width_percent"] = w
        shared_state["overlay_height_percent"] = h
        shared_state["overlay_scale_percent"] = s

        return jsonify({"status": "ok"})

    return app

