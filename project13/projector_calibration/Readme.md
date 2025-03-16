# Projector Calibration (Base & Overlay)

This Python package provides a local web-based interface for calibrating images on a projector/HDMI display, with separate positioning and scaling for a **base** image and an optional **overlay** image.

## Features

- **Base Image**: Choose one image, set offset (X/Y), width%, height%, and scale% in real time.
- **Overlay Image**: Optionally enable a second image on top, with its own offset/scale and a transparency slider.
- **Local Web UI**: Access at `http://127.0.0.1:5000` (or whichever host/port you choose).
- **Program-Friendly**: Import and start the service from another Python script.

## Installation

1. Clone or copy this `projector_calibration` folder locally.
2. Install dependencies:
   ```bash
   pip install pygame flask

## Usage
from projector_calibration.calibration_service import start_calibration_service

def my_app():
    images = {
       "baseA": "base_image.png",
       "overB": "overlay_image.png"
    }
    shared, app = start_calibration_service(images_to_load=images, port=8080)

    # 'shared' is a dict containing offsets, scaling, etc.
    # 'app' is the Flask application object (if you want further customization).
    print("Calibration finished or server stopped.")


## Local Deployment:

All functionality is local – no external server needed. By default:

Pygame uses your local display for fullscreen output.
Flask serves the UI at http://127.0.0.1:5000.
You can run it on a single machine (e.g. a Raspberry Pi or Windows PC) with an HDMI/projector attached.

+---------------------+             +-----------------+
| Python + Pygame     |  <--- HDMI  | Projector/TV    |
| (fullscreen window) |             +-----------------+
|
| Flask server -> Web UI at 127.0.0.1:5000
|
+----------------------------------------------------+


## Putting It All Together

With this structure:

- **Human-Friendly**: Run it standalone (`python -m projector_calibration.calibration_service`) and open the browser UI to calibrate images.
- **Program-Friendly**: Another Python script can import `start_calibration_service(...)` from `calibration_service.py`, pass in images, and let the calibration run in parallel with the rest of the program.  

Everything is local, no cloud needed, and you can adapt or extend the code as you see fit!