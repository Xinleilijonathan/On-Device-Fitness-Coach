# run_pygame.py

import pygame
import sys
import os

def create_borderless_window_on_monitor(w, h, x, y):
    """
    Create a borderless window sized (w,h),
    top-left corner at (x,y).
    This is effectively "fullscreen" if (w,h) matches the monitor's resolution.
    """
    # Tell SDL where to place the window
    os.environ['SDL_VIDEO_WINDOW_POS'] = f"{x},{y}"

    # Create a borderless window
    flags = pygame.NOFRAME  # no window border
    screen = pygame.display.set_mode((w, h), flags)
    return screen

def run_pygame(shared_state, image_manager):
    pygame.init()

    num_displays = pygame.display.get_num_displays()
    desktop_sizes = pygame.display.get_desktop_sizes()  # e.g. [(1920,1080), (1920,1080)] if 2 monitors

    d_idx = max(0, min(shared_state["display_index"], num_displays - 1))

    # Hardcode: if user picks display #1, we treat that as second monitor offset 1920,0
    # (assuming first monitor is 1920 wide). If your arrangement differs, change these numbers.
    if d_idx == 1:
        second_monitor_w = desktop_sizes[1][0] if len(desktop_sizes) > 1 else 1920
        second_monitor_h = desktop_sizes[1][1] if len(desktop_sizes) > 1 else 1080

        # Hardcode offset. Example: (1920,0) for side-by-side
        offset_x = 2560
        offset_y = 0

        screen = create_borderless_window_on_monitor(
            w=second_monitor_w,
            h=second_monitor_h,
            x=offset_x,
            y=offset_y
        )
    else:
        # For display #0 or anything else, just do a normal window
        # (You can also do borderless at (0,0) if you prefer.)
        w, h = desktop_sizes[0] if len(desktop_sizes) > 0 else (800, 600)
        screen = pygame.display.set_mode((w, h))  # windowed mode

    pygame.display.set_caption("Projector Calibration - Base + Overlay")

    clock = pygame.time.Clock()
    last_display_index = d_idx

    while shared_state["running"]:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                shared_state["running"] = False

        # If user changes display in real-time, you could re-init again if needed.
        if shared_state["display_index"] != last_display_index:
            # re-init in the same fashion
            # (For brevity, skip an example. Usually, we do a code block or function.)
            last_display_index = shared_state["display_index"]

        # Fill background
        screen.fill((0, 0, 0))

        # 1) Draw base image
        base_name = shared_state["selected_image"]
        base_surf = image_manager.get_image(base_name)
        if base_surf:
            draw_image(
                screen,
                base_surf,
                offset_x=shared_state["offset_x_percent"],
                offset_y=shared_state["offset_y_percent"],
                width_pct=shared_state["width_percent"],
                height_pct=shared_state["height_percent"],
                scale_pct=shared_state["scale_percent"],
                alpha=None
            )

        # 2) Draw overlay if enabled
        if shared_state["overlay_enabled"]:
            overlay_surf = image_manager.get_image(shared_state["overlay_image"])
            if overlay_surf:
                draw_image(
                    screen,
                    overlay_surf,
                    offset_x=shared_state["overlay_offset_x_percent"],
                    offset_y=shared_state["overlay_offset_y_percent"],
                    width_pct=shared_state["overlay_width_percent"],
                    height_pct=shared_state["overlay_height_percent"],
                    scale_pct=shared_state["overlay_scale_percent"],
                    alpha=shared_state["overlay_alpha"]
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
               alpha):
    """
    1) Scale the image by width_pct, height_pct, scale_pct
    2) Position so center is at (offset_x%, offset_y%) of the screen
    3) If alpha not None, set alpha
    """
    screen_w, screen_h = screen.get_size()
    orig_w, orig_h = surface.get_width(), surface.get_height()

    w = int(orig_w * (width_pct / 100.0))
    h = int(orig_h * (height_pct / 100.0))
    w = int(w * (scale_pct / 100.0))
    h = int(h * (scale_pct / 100.0))
    w = max(1, w)
    h = max(1, h)

    scaled_surf = pygame.transform.scale(surface, (w, h))
    if alpha is not None:
        scaled_surf.set_alpha(alpha)

    center_x = screen_w * (offset_x / 100.0)
    center_y = screen_h * (offset_y / 100.0)
    final_x = int(center_x - w / 2)
    final_y = int(center_y - h / 2)

    screen.blit(scaled_surf, (final_x, final_y))
