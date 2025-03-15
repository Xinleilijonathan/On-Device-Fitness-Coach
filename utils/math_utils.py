import numpy as np


def calculate_angle(a, b, c):
    """
    Calculate the angle between three points.
    Parameters:
    a, b, c -- Tuples representing the (x, y) coordinates of the points.
    Returns:
    Angle in degrees.
    """
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)

    ba = a - b
    bc = c - b

    cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
    angle = np.degrees(np.arccos(cosine_angle))

    return angle
