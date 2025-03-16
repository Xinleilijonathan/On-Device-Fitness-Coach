# routes.py
import pygame
from flask import Flask, request, jsonify

def create_app(shared_state, image_manager):
    app = Flask(__name__)

    @app.route("/")
    def index():
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

    <div>
      <label for="displaySelect">Select Display:</label>
      <select id="displaySelect" onchange="changeDisplay()"></select>
    </div>
    <hr>

    <!-- Base Image Selection -->
    <div>
      <label for="imgSelect">Base Image:</label>
      <select id="imgSelect" onchange="changeImage()"></select>
    </div>

    <!-- Base Sliders -->
    <div class="slider-wrapper">
      <label>Base Offset X (0–100):</label>
      <input type="range" id="baseOffsetX" min="0" max="100" value="50" oninput="updateBase()" />
      <span id="baseOffsetXVal" class="slider-value">50</span>
    </div>

    <div class="slider-wrapper">
      <label>Base Offset Y (0–100):</label>
      <input type="range" id="baseOffsetY" min="0" max="100" value="50" oninput="updateBase()" />
      <span id="baseOffsetYVal" class="slider-value">50</span>
    </div>

    <div class="slider-wrapper">
      <label>Base Width % (0–200):</label>
      <input type="range" id="baseWidth" min="0" max="200" value="100" oninput="updateBase()" />
      <span id="baseWidthVal" class="slider-value">100</span>
    </div>

    <div class="slider-wrapper">
      <label>Base Height % (0–200):</label>
      <input type="range" id="baseHeight" min="0" max="200" value="100" oninput="updateBase()" />
      <span id="baseHeightVal" class="slider-value">100</span>
    </div>

    <div class="slider-wrapper">
      <label>Base Scale % (0–200):</label>
      <input type="range" id="baseScale" min="0" max="200" value="100" oninput="updateBase()" />
      <span id="baseScaleVal" class="slider-value">100</span>
    </div>
    <hr>

    <!-- Overlay Selection -->
    <div>
      <label for="overlayEnabled">Overlay Enabled?</label>
      <input type="checkbox" id="overlayEnabled" onchange="updateOverlay()" />
    </div>

    <div>
      <label for="overlaySelect">Overlay Image:</label>
      <select id="overlaySelect" onchange="updateOverlay()"></select>
    </div>

    <div class="slider-wrapper">
      <label>Overlay Alpha (0–255):</label>
      <input type="range" id="overlayAlpha" min="0" max="255" value="128" oninput="updateOverlay()" />
      <span id="overlayAlphaVal" class="slider-value">128</span>
    </div>

    <!-- Overlay Sliders -->
    <div class="slider-wrapper">
      <label>Overlay Offset X:</label>
      <input type="range" id="overlayOffsetX" min="0" max="100" value="50" oninput="updateOverlay()" />
      <span id="overlayOffsetXVal" class="slider-value">50</span>
    </div>

    <div class="slider-wrapper">
      <label>Overlay Offset Y:</label>
      <input type="range" id="overlayOffsetY" min="0" max="100" value="50" oninput="updateOverlay()" />
      <span id="overlayOffsetYVal" class="slider-value">50</span>
    </div>

    <div class="slider-wrapper">
      <label>Overlay Width % (0–200):</label>
      <input type="range" id="overlayWidth" min="0" max="200" value="100" oninput="updateOverlay()" />
      <span id="overlayWidthVal" class="slider-value">100</span>
    </div>

    <div class="slider-wrapper">
      <label>Overlay Height % (0–200):</label>
      <input type="range" id="overlayHeight" min="0" max="200" value="100" oninput="updateOverlay()" />
      <span id="overlayHeightVal" class="slider-value">100</span>
    </div>

    <div class="slider-wrapper">
      <label>Overlay Scale % (0–200):</label>
      <input type="range" id="overlayScale" min="0" max="200" value="100" oninput="updateOverlay()" />
      <span id="overlayScaleVal" class="slider-value">100</span>
    </div>


    <script>
      window.onload = fetchStatus;

      async function fetchStatus() {
        let res = await fetch('/api/status');
        let data = await res.json();
        populateDisplaySelect(data);
        populateMainImageSelect(data);
        populateOverlaySelect(data);
        setUIFromStatus(data);
      }

      function populateDisplaySelect(data) {
        let sel = document.getElementById('displaySelect');
        sel.innerHTML = '';
        data.desktop_sizes.forEach((size, i) => {
          let opt = document.createElement('option');
          opt.value = i;
          opt.textContent = 'Display '+ i +' ('+ size[0] +'x'+ size[1] +')';
          sel.appendChild(opt);
        });
        sel.value = data.display_index;
      }

      function populateMainImageSelect(data) {
        let sel = document.getElementById('imgSelect');
        sel.innerHTML = '';
        data.image_list.forEach(img => {
          let opt = document.createElement('option');
          opt.value = img;
          opt.textContent = img;
          sel.appendChild(opt);
        });
        sel.value = data.selected_image;
      }

      function populateOverlaySelect(data) {
        let sel = document.getElementById('overlaySelect');
        sel.innerHTML = '';
        data.image_list.forEach(img => {
          let opt = document.createElement('option');
          opt.value = img;
          opt.textContent = img;
          sel.appendChild(opt);
        });
        sel.value = data.overlay_image;
      }

      function setUIFromStatus(data) {
        // Display
        document.getElementById('displaySelect').value = data.display_index;

        // Base image
        document.getElementById('imgSelect').value = data.selected_image;
        document.getElementById('baseOffsetX').value = data.offset_x_percent;
        document.getElementById('baseOffsetXVal').textContent = data.offset_x_percent;
        document.getElementById('baseOffsetY').value = data.offset_y_percent;
        document.getElementById('baseOffsetYVal').textContent = data.offset_y_percent;
        document.getElementById('baseWidth').value = data.width_percent;
        document.getElementById('baseWidthVal').textContent = data.width_percent;
        document.getElementById('baseHeight').value = data.height_percent;
        document.getElementById('baseHeightVal').textContent = data.height_percent;
        document.getElementById('baseScale').value = data.scale_percent;
        document.getElementById('baseScaleVal').textContent = data.scale_percent;

        // Overlay
        document.getElementById('overlaySelect').value = data.overlay_image;
        document.getElementById('overlayEnabled').checked = data.overlay_enabled;
        document.getElementById('overlayAlpha').value = data.overlay_alpha;
        document.getElementById('overlayAlphaVal').textContent = data.overlay_alpha;
        document.getElementById('overlayOffsetX').value = data.overlay_offset_x_percent;
        document.getElementById('overlayOffsetXVal').textContent = data.overlay_offset_x_percent;
        document.getElementById('overlayOffsetY').value = data.overlay_offset_y_percent;
        document.getElementById('overlayOffsetYVal').textContent = data.overlay_offset_y_percent;
        document.getElementById('overlayWidth').value = data.overlay_width_percent;
        document.getElementById('overlayWidthVal').textContent = data.overlay_width_percent;
        document.getElementById('overlayHeight').value = data.overlay_height_percent;
        document.getElementById('overlayHeightVal').textContent = data.overlay_height_percent;
        document.getElementById('overlayScale').value = data.overlay_scale_percent;
        document.getElementById('overlayScaleVal').textContent = data.overlay_scale_percent;
      }

      function changeDisplay() {
        let val = parseInt(document.getElementById('displaySelect').value);
        fetch('/api/set_display', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ display_index: val })
        });
      }

      function changeImage() {
        let val = document.getElementById('imgSelect').value;
        fetch('/api/set_image',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ image: val })
        });
      }

      function updateBase() {
        let ox = parseInt(document.getElementById('baseOffsetX').value);
        let oy = parseInt(document.getElementById('baseOffsetY').value);
        let w = parseInt(document.getElementById('baseWidth').value);
        let h = parseInt(document.getElementById('baseHeight').value);
        let s = parseInt(document.getElementById('baseScale').value);

        document.getElementById('baseOffsetXVal').textContent = ox;
        document.getElementById('baseOffsetYVal').textContent = oy;
        document.getElementById('baseWidthVal').textContent = w;
        document.getElementById('baseHeightVal').textContent = h;
        document.getElementById('baseScaleVal').textContent = s;

        fetch('/api/set_base', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({
            offset_x_percent: ox,
            offset_y_percent: oy,
            width_percent: w,
            height_percent: h,
            scale_percent: s
          })
        });
      }

      function updateOverlay() {
        let overlayImg = document.getElementById('overlaySelect').value;
        let enabled = document.getElementById('overlayEnabled').checked;
        let alpha = parseInt(document.getElementById('overlayAlpha').value);
        document.getElementById('overlayAlphaVal').textContent = alpha;

        let ox = parseInt(document.getElementById('overlayOffsetX').value);
        let oy = parseInt(document.getElementById('overlayOffsetY').value);
        let w = parseInt(document.getElementById('overlayWidth').value);
        let h = parseInt(document.getElementById('overlayHeight').value);
        let s = parseInt(document.getElementById('overlayScale').value);

        document.getElementById('overlayOffsetXVal').textContent = ox;
        document.getElementById('overlayOffsetYVal').textContent = oy;
        document.getElementById('overlayWidthVal').textContent = w;
        document.getElementById('overlayHeightVal').textContent = h;
        document.getElementById('overlayScaleVal').textContent = s;

        fetch('/api/set_overlay', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({
            overlay_image: overlayImg,
            overlay_enabled: enabled,
            overlay_alpha: alpha,
            overlay_offset_x_percent: ox,
            overlay_offset_y_percent: oy,
            overlay_width_percent: w,
            overlay_height_percent: h,
            overlay_scale_percent: s
          })
        });
      }
    </script>
</body>
</html>
        """

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
        new_idx = data.get("display_index", 0)
        shared_state["display_index"] = new_idx
        return jsonify({"status":"ok","display_index":new_idx})

    @app.route("/api/set_image", methods=["POST"])
    def api_set_image():
        data = request.get_json()
        new_img = data.get("image","image1.png")
        shared_state["selected_image"] = new_img
        return jsonify({"status":"ok","selected_image":new_img})

    @app.route("/api/set_base", methods=["POST"])
    def api_set_base():
        """
        Updates the base image transforms: offset_x, offset_y, width, height, scale.
        """
        data = request.get_json()
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

        return jsonify({"status":"ok"})

    @app.route("/api/set_overlay", methods=["POST"])
    def api_set_overlay():
        """
        Update overlay image, alpha, offset, scale, etc.
        """
        data = request.get_json()
        shared_state["overlay_image"] = data.get("overlay_image","overlay1.png")
        shared_state["overlay_enabled"] = data.get("overlay_enabled", False)
        alpha = data.get("overlay_alpha", 128)
        alpha = max(0, min(255, alpha))
        shared_state["overlay_alpha"] = alpha

        # clamp transforms
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

        return jsonify({"status":"ok"})

    return app
