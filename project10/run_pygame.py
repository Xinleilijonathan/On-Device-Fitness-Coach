# run_pygame.py
import pygame
import sys

def run_pygame(shared_state, image_manager):
    pygame.init()

    num_displays = pygame.display.get_num_displays()
    desktop_sizes = pygame.display.get_desktop_sizes()

    display_index = max(0, min(shared_state["display_index"], num_displays - 1))
    screen_w, screen_h = (800, 600)
    if 0 <= display_index < len(desktop_sizes):
        screen_w, screen_h = desktop_sizes[display_index]

    screen = pygame.display.set_mode(
        (screen_w, screen_h),
        pygame.FULLSCREEN,
        display=display_index
    )
    pygame.display.set_caption("Projector Calibration with Overlay")

    clock = pygame.time.Clock()
    last_display_index = display_index

    while shared_state["running"]:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                shared_state["running"] = False

        # If display changed
        if shared_state["display_index"] != last_display_index:
            new_idx = max(0, min(shared_state["display_index"], num_displays - 1))
            if 0 <= new_idx < len(desktop_sizes):
                screen_w, screen_h = desktop_sizes[new_idx]
            else:
                screen_w, screen_h = (800, 600)
            screen = pygame.display.set_mode(
                (screen_w, screen_h),
                pygame.FULLSCREEN,
                display=new_idx
            )
            last_display_index = new_idx

        screen.fill((0, 0, 0))

        # Draw the main image
        main_img_name = shared_state["selected_image"]
        main_surf = image_manager.get_image(main_img_name)
        if main_surf:
            main_surf = scale_image(main_surf,
                                    shared_state["width_percent"],
                                    shared_state["height_percent"],
                                    shared_state["scale_percent"])
            mx, my = compute_offset(shared_state["offset_x_percent"],
                                    shared_state["offset_y_percent"],
                                    main_surf.get_width(),
                                    main_surf.get_height(),
                                    screen_w,
                                    screen_h)
            screen.blit(main_surf, (mx, my))

        # Draw overlay if enabled
        if shared_state.get("overlay_enabled", False):
            overlay_name = shared_state.get("overlay_image", "overlay1.png")
            overlay_surf = image_manager.get_image(overlay_name)
            if overlay_surf:
                overlay_surf = scale_image(overlay_surf,
                                           shared_state["width_percent"],
                                           shared_state["height_percent"],
                                           shared_state["scale_percent"])
                alpha_val = shared_state.get("overlay_alpha", 128)
                overlay_surf.set_alpha(alpha_val)  # 0..255

                # For simplicity, place overlay at the same offset as the main image
                ox, oy = compute_offset(shared_state["offset_x_percent"],
                                        shared_state["offset_y_percent"],
                                        overlay_surf.get_width(),
                                        overlay_surf.get_height(),
                                        screen_w,
                                        screen_h)
                screen.blit(overlay_surf, (ox, oy))

        pygame.display.flip()
        clock.tick(30)

    pygame.quit()
    sys.exit()


def scale_image(surface, width_pct, height_pct, scale_pct):
    """Apply the width%, height%, and scale% transformations."""
    orig_w, orig_h = surface.get_width(), surface.get_height()

    w = int(orig_w * (width_pct / 100.0))
    h = int(orig_h * (height_pct / 100.0))
    w = int(w * (scale_pct / 100.0))
    h = int(h * (scale_pct / 100.0))

    w = max(1, w)
    h = max(1, h)

    return pygame.transform.scale(surface, (w, h))

def compute_offset(off_x_pct, off_y_pct, surf_w, surf_h, screen_w, screen_h):
    """
    Position the image so its center is at (off_x_pct, off_y_pct) of the screen.
    """
    center_x = screen_w * (off_x_pct / 100.0)
    center_y = screen_h * (off_y_pct / 100.0)

    final_x = int(center_x - surf_w / 2)
    final_y = int(center_y - surf_h / 2)
    return final_x, final_y
