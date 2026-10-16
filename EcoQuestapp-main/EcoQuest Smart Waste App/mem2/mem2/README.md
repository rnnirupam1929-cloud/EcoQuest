# 🌐 EcoTwin DSU - Smart Waste Management Digital Twin Map Component
**Member 2 Scope:** Digital Twin & Interactive GIS Engineer  
**Target Location:** Dayananda Sagar University (DSU) Main Campus, Harohalli, Kanakapura Road, Bengaluru ([Google Maps Pin](https://share.google/4aASNhmMrxQgGJ8JQ) | [360° Virtual Campus Tour](https://www.turiya.co/360/DSU/Harohalli/))

---

## 🎯 Component Overview
This component is a **production-ready, self-contained interactive Digital Twin GIS Map** designed for real-time campus waste management. It provides a cyberpunk / high-tech glassmorphism dashboard where campus administrators and citizens can:
- Monitor live bin capacities, fill percentages, sensor telemetry, and waste stream classifications.
- View dynamic visual status indicators (Green = Empty/Normal, Yellow = Half-Full, Red = Critical/Overdue with radar beacon pulse).
- Simulate live waste disposal events with custom amounts (+10%, +25%, +50%) and stream types.
- Dispatch automated truck collection runs with waypoint interpolation animations, empty resets, and audio chime feedback.
- Allow students & staff to preview a selected bin's walking route, start GPS tracking, and see the routed walking path, turn guidance, and live remaining ETA/distance.
- Open directly in **High-Res Satellite (Esri)** view, with **OpenStreetMap** available as an alternate basemap.
- Preview the interactive 360° Harohalli campus virtual tour directly in a modal.

---

## 📁 File Structure

```
├── index.html              # Main dashboard view with responsive glassmorphism panels & map container
├── styles.css              # Cyberpunk/glassmorphism design, pulsing radar animations, responsive layout
├── digital_twin_map.js     # Leaflet map logic, SVG marker generation, priority algorithms & simulators
├── sample_bins.json        # 15 realistic smart bin datasets mapped to DSU Harohalli campus landmarks
└── README.md               # Integration manual for teammates & backend engineers
```

---

## 🚀 Quick Start (Run Out of the Box)

You can run this project instantly with any static web server:

### Option A: Using Python (Recommended)
```bash
# Navigate to the project directory
cd smart-waste-digital-twin

# Start a local HTTP server
python3 -m http.server 8000
```
Then open: [http://localhost:8000](http://localhost:8000)

Live walking navigation requires browser location permission and an internet connection. Walking paths and turn instructions are provided by the OpenStreetMap foot-routing service.

### Option B: Using Node.js (npx)
```bash
npx serve . -p 8000
```

### Option C: Direct Browser Launch
Simply double-click `index.html` to open it in Google Chrome, Microsoft Edge, or Firefox.

---

## 🔌 Teammate Backend Integration Guide (Flask API)

This component was engineered with a modular API service layer. By default, it runs with local mock state (`sample_bins.json`) so it works out of the box without waiting for the backend to be online.

### Step 1: Connect to your Flask Backend
Open `digital_twin_map.js` and set `USE_LOCAL_MOCK` to `false`:

```javascript
const API_CONFIG = {
  USE_LOCAL_MOCK: false, // <-- Set to false to consume your live Flask API
  BASE_URL: 'http://localhost:5000/api/twin',
  ENDPOINTS: {
    GET_BINS: '/bins',
    UPDATE_BIN: '/bins/',
    DISPATCH_COLLECTION: '/simulated-collection'
  }
};
```

---

### Step 2: Flask API Endpoints Contract

To integrate with this map, Member 1 should implement the following three Flask routes:

#### 1. `GET /api/twin/bins`
Returns all smart waste bins with their telemetry.

**Sample Response (`200 OK`):**
```json
[
  {
    "id": "BIN-DSU-01",
    "name": "School of Engineering (SoE) - Main Quad",
    "block": "Block A - Engineering & Tech",
    "lat": 12.6625,
    "lng": 77.4485,
    "wasteType": "Recyclable",
    "capacityLiters": 120,
    "fillLevel": 92,
    "batteryLevel": 88,
    "temperatureC": 26.4,
    "weightKg": 44.2,
    "lastCleaned": "2026-10-14T08:30:00Z",
    "status": "critical"
  }
]
```

#### 2. `PATCH /api/twin/bins/<bin_id>`
Fired when a disposal event is simulated or manual bin adjustments occur.

**Request Payload:**
```json
{
  "fillLevel": 95,
  "weightKg": 48.5
}
```

#### 3. `POST /api/twin/simulated-collection`
Fired when the truck collection sequence completes.

**Request Payload:**
```json
{
  "collectedBinIds": ["BIN-DSU-01", "BIN-DSU-03", "BIN-DSU-04", "BIN-DSU-11"],
  "totalCollectedKg": 219.1,
  "timestamp": "2026-10-14T12:00:00Z"
}
```

---

### Step 3: Ready-to-use Flask Controller Snippet

Copy and paste this snippet into your Flask backend (`app.py`):

```python
from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # Enables cross-origin requests from the digital twin map frontend

# Load initial campus bin state
with open('sample_bins.json') as f:
    BINS_DB = json.load(f)

@app.route('/api/twin/bins', methods=['GET'])
def get_bins():
    return jsonify(BINS_DB), 200

@app.route('/api/twin/bins/<bin_id>', methods=['PATCH'])
def update_bin(bin_id):
    data = request.json or {}
    for b in BINS_DB:
        if b['id'] == bin_id:
            b['fillLevel'] = data.get('fillLevel', b['fillLevel'])
            b['weightKg'] = data.get('weightKg', b['weightKg'])
            return jsonify({'success': True, 'bin': b}), 200
    return jsonify({'error': 'Bin not found'}), 404

@app.route('/api/twin/simulated-collection', methods=['POST'])
def collection_event():
    data = request.json or {}
    collected_ids = data.get('collectedBinIds', [])
    for b in BINS_DB:
        if b['id'] in collected_ids:
            b['fillLevel'] = 0
            b['weightKg'] = 2.0
            b['status'] = 'optimal'
    return jsonify({
        'status': 'COLLECTION_PROCESSED',
        'binsEmptied': len(collected_ids),
        'totalWeightCollected': data.get('totalCollectedKg', 0)
    }), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)
```

---

## 🧠 Priority Ranking Algorithm Formula

The system dynamically calculates the urgency of collecting each bin using a multi-factor weighting formula:

$$\text{Priority Score} = \min\left(100, (\text{Fill Level} \times 0.60) + (\Delta t_{\text{hours}} \times 2.5) + W_{\text{stream}}\right)$$

Where:
- **$\text{Fill Level}$**: Bin fill percentage ($0$ to $100\%$)
- **$\Delta t_{\text{hours}}$**: Time elapsed in hours since last emptying (capped at 25 points)
- **$W_{\text{stream}}$**: Hazard weighting penalty:
  - Hazardous stream (Hospital/Lab): $+15$ points
  - E-Waste stream: $+8$ points
  - Organic stream with fill $>70\%$: $+10$ points (spoilage prevention)

**Tiers:**
- **Critical (Red Beacon Pulse)**: Score $\ge 75$ or Fill $>80\%$
- **Warning (Amber)**: Score $50 - 74$ or Fill $51 - 80\%$
- **Optimal (Green)**: Score $< 50$ and Fill $\le 50\%$

---

## 🎨 UI/UX Highlights
- **Zero Audio Assets Required**: Uses the native browser **Web Audio API** to generate futuristic UI chimes, dispatch alerts, and arrival confirmation tones.
- **Dynamic SVG Pins**: Hand-crafted SVG markers that display the percentage value inside the pin and emit radar ripple rings.
- **Citizen "Optimized Green Route"**: Shows walking time and grams of $\text{CO}_2$ saved by walking to the nearest available recycling depot.
- **360° Campus Twin Integration**: Dedicated button that opens the 360° Harohalli campus virtual tour in an embedded modal or fullscreen tab.
