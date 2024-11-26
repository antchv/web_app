from flask import Blueprint, request, jsonify
import math

simulation_routes = Blueprint('simulations', __name__)

@simulation_routes.route('/api/dilution', methods=['POST'])
def dilution():
    data = request.get_json()
    c1 = float(data['c1'])
    v1 = float(data['v1'])
    v2 = float(data['v2'])
    c2 = (c1 * v1) / v2
    return jsonify({"c2": c2})

@simulation_routes.route('/api/trajectory', methods=['POST'])
def trajectory():
    data = request.get_json()
    velocity = float(data['velocity'])
    angle = float(data['angle'])
    g = 9.81

    # Calcul de la trajectoire (points x, y)
    angle_rad = math.radians(angle)
    time_total = (2 * velocity * math.sin(angle_rad)) / g
    time_intervals = [i / 50 * time_total for i in range(51)]
    points = [
        {
            "x": velocity * math.cos(angle_rad) * t,
            "y": velocity * math.sin(angle_rad) * t - 0.5 * g * t ** 2,
        }
        for t in time_intervals
    ]
    return jsonify(points)
