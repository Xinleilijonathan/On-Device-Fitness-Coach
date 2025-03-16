# example_usage.py

import time
import requests

from projector_calibration.calibration_service import start_calibration_service_nonblocking

def main():
    images = {
        "base1": "image1.png",
        "base2": "image2.png",
        "overlayA": "overlay1.png",
        "overlayB": "overlay2.png"
    }

    print("Launching the calibration service in a non-blocking way...")

    # Start both Flask & Pygame in background threads
    shared_state, app, flask_thread, pygame_thread = start_calibration_service_nonblocking(
        images_to_load=images,
        host="127.0.0.1",
        port=5000,
        debug=False
    )

    print("Service started! We'll do a series of requests to demonstrate usage.")
    time.sleep(2)

    # 1) Switch base image to "base2"
    print("[1] Switch base image to 'base2'")
    requests.post("http://127.0.0.1:5000/api/set_image", json={"image": "base2"})
    time.sleep(3)
    # 1) Switch base image to "base2"
    print("[1] Switch base image to 'base1'")
    requests.post("http://127.0.0.1:5000/api/set_image", json={"image": "base1"})
    time.sleep(3)
    # 2) Adjust base offset, scale, etc.
    print("[2] Changing base offset & scale")
    requests.post("http://127.0.0.1:5000/api/set_base", json={
        "offset_x_percent": 30,
        "offset_y_percent": 70,
        "width_percent": 120,
        "height_percent": 80,
        "scale_percent": 140
    })
    time.sleep(3)

    # 3) Enable overlay w/ alpha
    print("[3] Enabling overlay 'overlayB' w/ alpha=180")
    requests.post("http://127.0.0.1:5000/api/set_overlay", json={
        "overlay_image": "overlayB",
        "overlay_enabled": True,
        "overlay_alpha": 180,
        "overlay_offset_x_percent": 60,
        "overlay_offset_y_percent": 20,
        "overlay_width_percent": 80,
        "overlay_height_percent": 80,
        "overlay_scale_percent": 100
    })
    time.sleep(3)

    # 4) Tweak overlay alpha
    print("[4] Tweak overlay alpha=50")
    requests.post("http://127.0.0.1:5000/api/set_overlay", json={
        "overlay_enabled": True,
        "overlay_alpha": 50
    })
    time.sleep(3)

    # 5) Done demo; shutdown everything
    print("Done with demonstration. Let's cleanly shut down the server & Pygame.")
    requests.post("http://127.0.0.1:5000/shutdown")

    # The /shutdown route sets shared_state["running"]=False and calls the internal
    # werkzeug.server.shutdown, so both threads should stop soon.

    # We'll just wait a bit for the threads to exit
    flask_thread.join(timeout=5)
    pygame_thread.join(timeout=2)

    print("All threads ended. The program can now exit cleanly.")

if __name__ == "__main__":
    main()
