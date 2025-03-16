# projector_calibration/run_pygame.py

import pygame
import sys

def run_pygame(shared_state, image_manager):
    """
    Continuously draws the base + overlay images based on 'shared_state'.
    Runs in a separate thread so your main app can keep running.
    """
    pygame.init()

    num_displays = pygame.display.get_num_displays()
    desktop_sizes = pygame.display.get_desktop_sizes()

    d_idx = max(0, min(shared_state["display_index"], num_displays - 1))
    if 0 <= d_idx < len(desktop_sizes):
        screen_w, screen_h = desktop_sizes[d_idx]
    else:
        screen_w, screen_h = (800, 600)

    screen = pygame.display.set_mode((screen_w, screen_h), pygame.FULLSCREEN, display=d_idx)
    pygame.display.set_caption("Projector Calibration - Base & Overlay")

    clock = pygame.time.Clock()
    last_display_index = d_idx

    while shared_state["running"]:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                shared_state["running"] = False

        # If user changed the display (via shared_state)
        if shared_state["display_index"] != last_display_index:
            new_idx = max(0, min(shared_state["display_index"], num_displays - 1))
            if 0 <= new_idx < len(desktop_sizes):
                screen_w, screen_h = desktop_sizes[new_idx]
            else:
                screen_w, screen_h = (800, 600)
            screen = pygame.display.set_mode((screen_w, screen_h),
                                             pygame.FULLSCREEN,
                                             display=new_idx)
            last_display_index = new_idx

        screen.fill((0, 0, 0))

        # ----- Draw base image -----
        base_name = shared_state["selected_image"]
        base_surf = image_manager.get_image(base_name)
        if base_surf:
            draw_image(
                screen=screen,
                surface=base_surf,
                offset_x=shared_state["offset_x_percent"],
                offset_y=shared_state["offset_y_percent"],
                width_pct=shared_state["width_percent"],
                height_pct=shared_state["height_percent"],
                scale_pct=shared_state["scale_percent"],
                alpha=None,  # base image is opaque
                screen_w=screen_w,
                screen_h=screen_h
            )

        # ----- Draw overlay if enabled -----
        if shared_state["overlay_enabled"]:
            overlay_name = shared_state["overlay_image"]
            overlay_surf = image_manager.get_image(overlay_name)
            if overlay_surf:
                draw_image(
                    screen=screen,
                    surface=overlay_surf,
                    offset_x=shared_state["overlay_offset_x_percent"],
                    offset_y=shared_state["overlay_offset_y_percent"],
                    width_pct=shared_state["overlay_width_percent"],
                    height_pct=shared_state["overlay_height_percent"],
                    scale_pct=shared_state["overlay_scale_percent"],
                    alpha=shared_state["overlay_alpha"],  # 0..255
                    screen_w=screen_w,
                    screen_h=screen_h
                )

        pygame.display.flip()
        clock.tick(30)

    pygame.quit()
    sys.exit()

def draw_image(screen,
               surface,
               offset_x,
               offset_y,
               width_pct,
               height_pct,
               scale_pct,
               alpha,
               screen_w,
               screen_h):
    """
    1) Scale 'surface' according to width_pct, height_pct, scale_pct.
    2) Position it so center is at (offset_x%, offset_y%) of the screen.
    3) If alpha is set, apply it.
    4) Blit onto the screen.
    """
    orig_w, orig_h = surface.get_width(), surface.get_height()

    # Scale
    w = int(orig_w * (width_pct / 100.0))
    h = int(orig_h * (height_pct / 100.0))
    w = int(w * (scale_pct / 100.0))
    h = int(h * (scale_pct / 100.0))
    w = max(1, w)
    h = max(1, h)

    scaled_surf = pygame.transform.scale(surface, (w, h))
    if alpha is not None:
        scaled_surf.set_alpha(alpha)

    # Position
    center_x = screen_w * (offset_x / 100.0)
    center_y = screen_h * (offset_y / 100.0)
    final_x = int(center_x - w / 2)
    final_y = int(center_y - h / 2)

    screen.blit(scaled_surf, (final_x, final_y))
