from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import math
import os

app = Flask(__name__, static_folder="build")  # Dossier React "build"
CORS(app)



def calculate_wave(wave_type, amplitude, wavelength, frequency, phase, x, time):
    """Méthode pour calculer une onde donnée."""
    if wave_type == 'sin':
        return amplitude * math.sin(2 * math.pi * frequency * time - (2 * math.pi * x) / wavelength + phase)
    elif wave_type == 'square':
        sine_value = math.sin(2 * math.pi * frequency * time - (2 * math.pi * x) / wavelength + phase)
        return amplitude if sine_value >= 0 else -amplitude
    elif wave_type == 'triangle':
        sine_value = math.sin(2 * math.pi * frequency * time - (2 * math.pi * x) / wavelength + phase)
        return (2 * amplitude / math.pi) * math.asin(sine_value)
    elif wave_type == 'sawtooth':
        return (2 * amplitude) * (x / wavelength - math.floor(x / wavelength + 0.5))
    else:
        return 0  # Si le type n'est pas reconnu, retourne 0






@app.route('/api/wave', methods=['POST'])
def wave():
    """API pour calculer les points d'une onde."""
    data = request.get_json()
    amplitude = data.get('amplitude', 50)
    wavelength = data.get('wavelength', 100)
    frequency = data.get('frequency', 1)
    wave_type = data.get('wave_type', 'sin')  # 'sin', 'square', 'triangle', 'sawtooth'
    time_step = data.get('time_step', 0.02)  # Intervalle de temps
    num_frames = data.get('num_frames', 50)  # Nombre de frames

    all_points = []
    for frame in range(num_frames):
        time = frame * time_step
        points = []
        for x in range(800):  # Largeur du canvas
            if wave_type == 'sin':
                y = amplitude * math.sin(2 * math.pi * frequency * time - (2 * math.pi * x) / wavelength)
            elif wave_type == 'square':
                y = amplitude * (1 if math.sin(2 * math.pi * frequency * time - (2 * math.pi * x) / wavelength) >= 0 else -1)
            elif wave_type == 'triangle':
                y = (2 * amplitude / math.pi) * math.asin(math.sin(2 * math.pi * frequency * time - (2 * math.pi * x) / wavelength))
            elif wave_type == 'sawtooth':
                y = (2 * amplitude) * (x / wavelength - math.floor(x / wavelength + 0.5))
            else:
                y = 0  # Si le type n'est pas reconnu
            points.append({"x": x, "y": y})
        all_points.append(points)

    return jsonify(all_points)




@app.route('/api/wave-superposition', methods=['POST'])
def wave_superposition():
    """API pour calculer les points de deux ondes et leur superposition."""
    data = request.get_json()

    # Paramètres de la première onde
    amp1 = data.get('amplitude1', 50)
    wavelength1 = data.get('wavelength1', 100)
    freq1 = data.get('frequency1', 1)
    phase1 = data.get('phase1', 0)
    wave_type1 = data.get('wave_type1', 'sin')

    # Paramètres de la deuxième onde
    amp2 = data.get('amplitude2', 50)
    wavelength2 = data.get('wavelength2', 100)
    freq2 = data.get('frequency2', 1)
    phase2 = data.get('phase2', 0)
    wave_type2 = data.get('wave_type2', 'sin')

    # Autres paramètres
    time_step = data.get('time_step', 0.02)
    num_frames = data.get('num_frames', 50)

    all_points = []
    for frame in range(num_frames):
        time = frame * time_step
        points = []
        for x in range(800):
            # Calcul des deux ondes
            y1 = calculate_wave(wave_type1, amp1, wavelength1, freq1, phase1, x, time)
            y2 = calculate_wave(wave_type2, amp2, wavelength2, freq2, phase2, x, time)
            # Superposition des ondes
            y_sum = y1 + y2
            points.append({"x": x, "y1": y1, "y2": y2, "y_sum": y_sum})
        all_points.append(points)

    return jsonify(all_points)




@app.route('/api/pendulum', methods=['POST'])
def pendulum():
    """API pour calculer les positions angulaires d'un pendule."""
    data = request.get_json()
    length = data.get('length', 2)  # Longueur du pendule (mètres)
    gravity = data.get('gravity', 9.8)  # Gravité (m/s²)
    initial_angle = math.radians(data.get('initial_angle', 30))  # Angle initial (radians)
    damping = data.get('damping', 0.01)  # Coefficient d'amortissement
    time_step = data.get('time_step', 0.02)  # Pas de temps
    num_frames = data.get('num_frames', 20)  # Nombre de frames

    omega = 0  # Vitesse angulaire initiale
    angle = initial_angle  # Angle initial
    all_points = []

    for _ in range(num_frames):
        # Équation différentielle du pendule (avec amortissement)
        alpha = -(gravity / length) * math.sin(angle) - damping * omega
        omega += alpha * time_step
        angle += omega * time_step
        all_points.append({"angle": angle})

    return jsonify(all_points)




@app.route('/api/cannon', methods=['POST'])
def cannon_trajectory():
    """API pour calculer la trajectoire d'un boulet de canon."""
    data = request.get_json()

    # Paramètres d'entrée
    angle = math.radians(data.get('angle', 45))  # Convertir en radians
    velocity = data.get('velocity', 50)  # Vitesse initiale en m/s
    gravity = data.get('gravity', 9.8)  # Accélération gravitationnelle en m/s²
    time_step = data.get('time_step', 0.05)  # Intervalle de temps

    trajectory = []
    time = 0
    x, y = 0, 0

    while y >= 0:  # Tant que le boulet est au-dessus du sol
        x = velocity * math.cos(angle) * time
        y = velocity * math.sin(angle) * time - 0.5 * gravity * time**2
        if y >= 0:  # Ajouter uniquement les points valides
            trajectory.append({"x": x, "y": y})
        time += time_step

    return jsonify(trajectory)


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    """Route pour servir les fichiers React."""
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(debug=True)
