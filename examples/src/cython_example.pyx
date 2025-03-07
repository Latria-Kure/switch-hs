cimport cython
from libc.math cimport sqrt

def calculate_distance(double x1, double y1, double x2, double y2):
    """Calculate the Euclidean distance between two points."""
    cdef double dx = x2 - x1
    cdef double dy = y2 - y1
    return sqrt(dx * dx + dy * dy) 