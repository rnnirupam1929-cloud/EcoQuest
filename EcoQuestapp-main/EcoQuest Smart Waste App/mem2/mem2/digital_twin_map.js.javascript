/**
 * ============================================================================
 * SMART WASTE MANAGEMENT SYSTEM - DIGITAL TWIN GIS CONTROLLER
 * Campus: Dayananda Sagar University (DSU) Main Campus, Harohalli, Bengaluru
 * Role: Member 2 (Digital Twin Engineer Scope)
 * ============================================================================
 * Features:
 *  - High-Tech Leaflet Map with Multiple Tile Layers (Dark Matter, Satellite, OSM)
 *  - Dynamic Fill-Level SVG Markers with pulsating radar rings for critical bins
 *  - Real-time Priority Ranking Engine (Multi-criteria formula)
 *  - Event Simulator: Manual waste injection & fill adjustment
 *  - Automated Truck Collection Simulation with smooth waypoint animation & audio feedback
 *  - Citizen Navigation: "Find Nearest Bin" walking path & arrival card
 *  - Pluggable API service layer for Flask endpoints (GET /api/twin/bins, POST /api/twin/simulated-collection)
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // CONFIGURATION & CONSTANTS
  // --------------------------------------------------------------------------
  const DSU_CAMPUS_CENTER = [12.6618, 77.4495];
  const DEFAULT_ZOOM = 17;

  const API_CONFIG = {
    // Teammate can switch USE_LOCAL_MOCK to false once Flask backend is running:
    USE_LOCAL_MOCK: true,
    BASE_URL: 'http://localhost:5000/api/twin',
    ENDPOINTS: {
      GET_BINS: '/bins',
      UPDATE_BIN: '/bins/',
      DISPATCH_COLLECTION: '/simulated-collection'
    }
  };

  // Color Palette Constants
  const PALETTE = {
    optimal: '#00ff9d',
    warning: '#ffb703',
    critical: '#ff3366',
    routeCyan: '#00f0ff',
    routeGreen: '#10b981',
    truck: '#00f0ff'
  };

  // --------------------------------------------------------------------------
  // GLOBAL STATE
  // --------------------------------------------------------------------------
  const state = {
    map: null,
    tileLayers: {},
    currentTileLayer: 'dark',
    bins: [],
    markers: new Map(), // binId -> L.marker
    userMarker: null,
    userLocation: [12.6612, 77.4485], // Simulated student location near Engineering quad
    citizenRouteLine: null,
    truckMarker: null,
    truckRouteLine: null,
    isCollecting: false,
    filters: {
      search: '',
      wasteType: 'all',
      status: 'all'
    },
    stats: {
      totalCollectedKg: 420.5,
      totalRuns: 3
    },
    audioCtx: null,
    soundEnabled: true
  };

  // --------------------------------------------------------------------------
  // WEB AUDIO SYNTHESIZER (No external audio files required!)
  // --------------------------------------------------------------------------
  function initAudio() {
    if (!state.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        state.audioCtx = new AudioContext();
      }
    }
  }

  function playTone(freq, duration = 0.15, type = 'sine') {
    if (!state.soundEnabled) return;
    try {
      initAudio();
      if (!state.audioCtx) return;
      if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
      }
      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, state.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, state.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, state.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(state.audioCtx.destination);
      osc.start();
      osc.stop(state.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  function playCollectionChime() {
    playTone(523.25, 0.1, 'sine'); // C5
    setTimeout(() => playTone(659.25, 0.1, 'sine'), 100); // E5
    setTimeout(() => playTone(783.99, 0.2, 'sine'), 200); // G5
  }

  function playAlertSound() {
    playTone(880, 0.12, 'sawtooth');
    setTimeout(() => playTone(440, 0.18, 'sawtooth'), 120);
  }

  function playSuccessTone() {
    playTone(587.33, 0.1, 'triangle');
    setTimeout(() => playTone(880.00, 0.2, 'triangle'), 120);
  }

  // --------------------------------------------------------------------------
  // INITIALIZATION
  // --------------------------------------------------------------------------
  async function init() {
    console.log('[Digital Twin] Initializing Smart Waste Management Map...');
    setupMap();
    setupTileLayers();
    setupEventListeners();
    await loadBinsData();
    renderAllMarkers();
    updateDashboardMetrics();
    renderPriorityQueue();
    populateSimulatorDropdown();
    showToast('Digital Twin Map active. Real-time telemetry synchronized with DSU Campus.');
  }

  // --------------------------------------------------------------------------
  // LEAFLET MAP & TILE PROVIDERS SETUP
  // --------------------------------------------------------------------------
  function setupMap() {
    state.map = L.map('map', {
      center: DSU_CAMPUS_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: true
    });

    // Custom Zoom controls at bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(state.map);

    // Simulated Campus Boundary Ring (DSU Harohalli)
    const campusZone = L.circle(DSU_CAMPUS_CENTER, {
      radius: 380,
      color: '#00f0ff',
      weight: 1,
      dashArray: '4, 8',
      fillColor: '#00f0ff',
      fillOpacity: 0.03
    }).addTo(state.map);
    campusZone.bindTooltip('DSU Harohalli Digital Twin Geofence', {
      permanent: false,
      direction: 'top',
      className: 'campus-geofence-tooltip'
    });
  }

  function setupTileLayers() {
    // 1. CartoDB Dark Matter (Futuristic Cyberpunk dark)
    state.tileLayers.dark = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        subdomains: 'abcd',
        maxZoom: 20,
        attribution: '&copy; OpenStreetMap &copy; CARTO'
      }
    );

    // 2. Esri World Imagery (High-Resolution Satellite)
    state.tileLayers.satellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution: '&copy; Esri, Maxar, Earthstar Geographics'
      }
    );

    // 3. OpenStreetMap Standard
    state.tileLayers.streets = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }
    );

    // Default to Dark Mode
    state.tileLayers.dark.addTo(state.map);
  }

  function setTileLayer(type) {
    if (!state.tileLayers[type] || state.currentTileLayer === type) return;
    state.map.removeLayer(state.tileLayers[state.currentTileLayer]);
    state.tileLayers[type].addTo(state.map);
    state.currentTileLayer = type;

    // Update bottom toolbar buttons
    document.querySelectorAll('.layer-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.layer === type);
    });

    showToast(`Switched map basemap to: ${type.toUpperCase()}`);
  }

  // --------------------------------------------------------------------------
  // DATA LOADING (Local Mock or Live Flask API)
  // --------------------------------------------------------------------------
  async function loadBinsData() {
    if (!API_CONFIG.USE_LOCAL_MOCK) {
      try {
        console.log(`[API] Fetching bins from ${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_BINS}`);
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_BINS}`);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data = await response.json();
        state.bins = data;
        return;
      } catch (err) {
        console.warn('[API] Flask backend unreachable. Gracefully falling back to sample_bins.json:', err.message);
      }
    }

    try {
      const response = await fetch('./sample_bins.json');
      if (!response.ok) throw new Error('Could not load sample_bins.json');
      state.bins = await response.json();
    } catch (e) {
      console.error('[Data] Error loading sample_bins.json, generating default fallback dataset', e);
      state.bins = getDefaultFallbackBins();
    }
  }

  // --------------------------------------------------------------------------
  // DYNAMIC SVG MARKER CREATION
  // --------------------------------------------------------------------------
  function createBinMarkerIcon(bin) {
    const fill = bin.fillLevel;
    let color = PALETTE.optimal;
    let statusClass = 'optimal';

    if (fill > 80) {
      color = PALETTE.critical;
      statusClass = 'critical';
    } else if (fill > 50) {
      color = PALETTE.warning;
      statusClass = 'warning';
    }

    // High-tech SVG Pin Marker with dynamic meter fill
    const pulseRingHtml = fill > 50
      ? `<div class="radar-pulse-ring ${statusClass}"></div>`
      : '';

    const html = `
      <div class="smart-bin-marker ${statusClass}" data-id="${bin.id}">
        ${pulseRingHtml}
        <div class="marker-wrapper">
          <svg class="marker-icon-svg" viewBox="0 0 44 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Pin Outer Shield -->
            <path d="M22 2C12.059 2 4 10.059 4 20C4 29.5 22 46 22 46C22 46 40 29.5 40 20C40 10.059 31.941 2 22 2Z" 
                  fill="#0B0F19" stroke="${color}" stroke-width="2.2" />
            <!-- Inner Glow Disc -->
            <circle cx="22" cy="19" r="13" fill="${color}" fill-opacity="0.22" />
            
            <!-- Trash Bin Icon Silhouette -->
            <path d="M16 16.5H28M18 16.5V24C18 25.1 18.9 26 20 26H24C25.1 26 26 25.1 26 24V16.5M19.5 14H24.5" 
                  stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="marker-pin-label">${fill}%</span>
        </div>
      </div>
    `;

    return L.divIcon({
      html: html,
      className: 'custom-bin-leaflet-icon',
      iconSize: [44, 52],
      iconAnchor: [22, 48],
      popupAnchor: [0, -46]
    });
  }

  function renderAllMarkers() {
    // Clear existing markers
    state.markers.forEach(marker => state.map.removeLayer(marker));
    state.markers.clear();

    const filteredBins = getFilteredBins();

    filteredBins.forEach(bin => {
      const icon = createBinMarkerIcon(bin);
      const marker = L.marker([bin.lat, bin.lng], { icon: icon }).addTo(state.map);

      // Bind rich interactive popup
      marker.bindPopup(buildPopupHtml(bin), {
        maxWidth: 320,
        className: 'custom-twin-popup'
      });

      marker.on('click', () => {
        playTone(600, 0.08, 'sine');
        // Auto-select this bin in the simulator dropdown
        const select = document.getElementById('sim-bin-select');
        if (select) select.value = bin.id;
      });

      state.markers.set(bin.id, marker);
    });
  }

  // --------------------------------------------------------------------------
  // RICH POPUP GENERATOR
  // --------------------------------------------------------------------------
  function buildPopupHtml(bin) {
    const statusClass = bin.fillLevel > 80 ? 'critical' : bin.fillLevel > 50 ? 'warning' : 'optimal';
    const statusLabel = bin.fillLevel > 80 ? 'CRITICAL / FULL' : bin.fillLevel > 50 ? 'HALF-FULL' : 'OPTIMAL';
    const priority = calculateBinPriority(bin);
    const lastCleanedDate = new Date(bin.lastCleaned);
    const timeFormatted = isNaN(lastCleanedDate) ? bin.lastCleaned : lastCleanedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Waste Type Badge Colors & Icons
    let typeIcon = 'fa-recycle';
    if (bin.wasteType === 'Organic') typeIcon = 'fa-leaf';
    else if (bin.wasteType === 'Hazardous') typeIcon = 'fa-biohazard';
    else if (bin.wasteType === 'E-Waste') typeIcon = 'fa-microchip';

    return `
      <div class="twin-popup-card">
        <div class="popup-top-info">
          <div>
            <span class="popup-id-badge">${bin.id}</span>
            <div class="popup-location-name">${bin.name}</div>
            <div class="popup-block-tag"><i class="fa-solid fa-building"></i> ${bin.block}</div>
          </div>
          <span class="popup-status-badge ${statusClass}">${statusLabel}</span>
        </div>

        <!-- Fill Progress Bar -->
        <div class="popup-fill-progress">
          <div class="fill-bar-labels">
            <span>Capacity Fill Level</span>
            <strong>${bin.fillLevel}% (${Math.round((bin.capacityLiters * bin.fillLevel) / 100)} / ${bin.capacityLiters} L)</strong>
          </div>
          <div class="progress-track">
            <div class="progress-fill ${statusClass}" style="width: ${bin.fillLevel}%;"></div>
          </div>
        </div>

        <!-- Sensor Telemetry Data Grid -->
        <div class="popup-grid">
          <div class="popup-grid-item">
            <span class="grid-key"><i class="fa-solid ${typeIcon}"></i> Waste Stream</span>
            <span class="grid-val">${bin.wasteType}</span>
          </div>
          <div class="popup-grid-item">
            <span class="grid-key"><i class="fa-solid fa-bolt"></i> Sensor Battery</span>
            <span class="grid-val">${bin.batteryLevel}%</span>
          </div>
          <div class="popup-grid-item">
            <span class="grid-key"><i class="fa-solid fa-weight-scale"></i> Live Weight</span>
            <span class="grid-val">${bin.weightKg} kg</span>
          </div>
          <div class="popup-grid-item">
            <span class="grid-key"><i class="fa-solid fa-temperature-half"></i> Internal Temp</span>
            <span class="grid-val">${bin.temperatureC}°C</span>
          </div>
          <div class="popup-grid-item">
            <span class="grid-key"><i class="fa-solid fa-clock-rotate-left"></i> Last Emptied</span>
            <span class="grid-val">${timeFormatted}</span>
          </div>
          <div class="popup-grid-item">
            <span class="grid-key"><i class="fa-solid fa-arrow-up-wide-short"></i> Priority Score</span>
            <span class="grid-val" style="color: ${priority.score > 75 ? PALETTE.critical : PALETTE.optimal};">${priority.score} / 100</span>
          </div>
        </div>

        <!-- In-Popup Action Buttons -->
        <div class="popup-action-row">
          <button class="popup-mini-btn" onclick="window.twinMap.quickFill('${bin.id}', 25)">
            <i class="fa-solid fa-plus"></i> +25% Fill
          </button>
          <button class="popup-mini-btn empty-btn" onclick="window.twinMap.quickEmpty('${bin.id}')">
            <i class="fa-solid fa-trash-can-arrow-up"></i> Empty Bin
          </button>
          <button class="popup-mini-btn" onclick="window.twinMap.routeToBin('${bin.id}')">
            <i class="fa-solid fa-diamond-turn-right"></i> Route
          </button>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // PRIORITY RANKING ALGORITHM
  // --------------------------------------------------------------------------
  /**
   * Computes multi-criteria priority score (0 to 100):
   *  - 60% weight on Fill Level percentage
   *  - 25% weight on hours elapsed since last collection
   *  - 15% weight penalty for Hazardous or E-Waste streams (sanitary safety)
   */
  function calculateBinPriority(bin) {
    const fillScore = Math.min(100, bin.fillLevel) * 0.60;

    // Time elapsed calculation (hours)
    let hoursElapsed = 4;
    try {
      const last = new Date(bin.lastCleaned).getTime();
      const now = new Date().getTime();
      if (!isNaN(last)) {
        hoursElapsed = Math.max(0, (now - last) / (1000 * 60 * 60));
      }
    } catch (e) {
      hoursElapsed = 6;
    }
    const timeScore = Math.min(25, hoursElapsed * 2.5);

    // Hazard stream weight multiplier
    let hazardScore = 0;
    if (bin.wasteType === 'Hazardous') hazardScore = 15;
    else if (bin.wasteType === 'E-Waste') hazardScore = 8;
    else if (bin.wasteType === 'Organic' && bin.fillLevel > 70) hazardScore = 10; // smells/spoilage

    const totalScore = Math.min(100, Math.round(fillScore + timeScore + hazardScore));

    let tier = 'optimal';
    if (totalScore >= 75 || bin.fillLevel >= 80) tier = 'critical';
    else if (totalScore >= 50 || bin.fillLevel >= 50) tier = 'warning';

    return {
      score: totalScore,
      tier: tier,
      hoursElapsed: hoursElapsed.toFixed(1)
    };
  }

  function getSortedPriorityQueue() {
    return [...state.bins].sort((a, b) => {
      const pA = calculateBinPriority(a).score;
      const pB = calculateBinPriority(b).score;
      return pB - pA;
    });
  }

  function renderPriorityQueue() {
    const container = document.getElementById('priority-queue-list');
    if (!container) return;

    const sorted = getSortedPriorityQueue();
    container.innerHTML = '';

    const criticalCount = sorted.filter(b => b.fillLevel > 80).length;
    const countBadge = document.getElementById('queue-critical-count');
    if (countBadge) {
      countBadge.textContent = `${criticalCount} OVERDUE`;
      countBadge.style.display = criticalCount > 0 ? 'inline-block' : 'none';
    }

    sorted.slice(0, 8).forEach((bin, idx) => {
      const priority = calculateBinPriority(bin);
      const item = document.createElement('div');
      item.className = `queue-item rank-${priority.tier}`;
      item.innerHTML = `
        <div class="queue-item-info">
          <div class="queue-item-id">#${idx + 1} • ${bin.id} • ${bin.wasteType}</div>
          <div class="queue-item-name">${bin.name}</div>
          <div class="queue-item-meta">${bin.block}</div>
        </div>
        <div class="queue-item-metric">
          <div class="queue-fill-pct">${bin.fillLevel}%</div>
          <div class="queue-priority-tag">Score: ${priority.score}</div>
        </div>
      `;

      item.addEventListener('click', () => {
        focusOnBin(bin.id);
      });

      container.appendChild(item);
    });
  }

  // --------------------------------------------------------------------------
  // DASHBOARD TELEMETRY METRICS
  // --------------------------------------------------------------------------
  function updateDashboardMetrics() {
    const total = state.bins.length;
    const critical = state.bins.filter(b => b.fillLevel > 80).length;
    const totalFill = state.bins.reduce((sum, b) => sum + b.fillLevel, 0);
    const avgFill = total > 0 ? Math.round(totalFill / total) : 0;
    const totalKg = state.bins.reduce((sum, b) => sum + (b.weightKg || 0), 0);

    const elTotal = document.getElementById('stat-total-bins');
    const elCritical = document.getElementById('stat-critical-bins');
    const elAvgFill = document.getElementById('stat-avg-fill');
    const elWasteKg = document.getElementById('stat-waste-kg');

    if (elTotal) elTotal.textContent = total;
    if (elCritical) elCritical.textContent = critical;
    if (elAvgFill) elAvgFill.textContent = `${avgFill}%`;
    if (elWasteKg) elWasteKg.textContent = `${Math.round(totalKg)} kg`;
  }

  // --------------------------------------------------------------------------
  // EVENT SIMULATOR: MANUAL DISPOSAL
  // --------------------------------------------------------------------------
  function populateSimulatorDropdown() {
    const select = document.getElementById('sim-bin-select');
    if (!select) return;
    select.innerHTML = '';

    state.bins.forEach(bin => {
      const opt = document.createElement('option');
      opt.value = bin.id;
      opt.textContent = `${bin.id} - ${bin.name} (${bin.fillLevel}%)`;
      select.appendChild(opt);
    });
  }

  function simulateDisposalEvent(binId, deltaFill, customType = null) {
    const bin = state.bins.find(b => b.id === binId);
    if (!bin) return;

    const prevFill = bin.fillLevel;
    bin.fillLevel = Math.min(100, Math.max(0, bin.fillLevel + deltaFill));
    bin.weightKg = +(bin.weightKg + (deltaFill * 0.45)).toFixed(1);

    if (customType) {
      bin.wasteType = customType;
    }

    if (bin.fillLevel > 80) {
      bin.status = 'critical';
      playAlertSound();
    } else if (bin.fillLevel > 50) {
      bin.status = 'warning';
      playTone(450, 0.1);
    } else {
      bin.status = 'optimal';
      playTone(550, 0.1);
    }

    // Refresh UI
    updateSingleBinMarker(bin);
    updateDashboardMetrics();
    renderPriorityQueue();
    populateSimulatorDropdown();

    // Select this bin again in the dropdown
    const select = document.getElementById('sim-bin-select');
    if (select) select.value = bin.id;

    showToast(`Disposal simulated on ${bin.id}: Fill ${prevFill}% → ${bin.fillLevel}% (+${deltaFill}%)`);

    // Post to Flask backend if live API is enabled
    if (!API_CONFIG.USE_LOCAL_MOCK) {
      fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPDATE_BIN}${bin.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fillLevel: bin.fillLevel, weightKg: bin.weightKg })
      }).catch(err => console.warn('Could not sync disposal to Flask API', err));
    }
  }

  function updateSingleBinMarker(bin) {
    const marker = state.markers.get(bin.id);
    if (marker) {
      marker.setIcon(createBinMarkerIcon(bin));
      marker.setPopupContent(buildPopupHtml(bin));
      if (marker.isPopupOpen()) {
        marker.openPopup();
      }
    }
  }

  // --------------------------------------------------------------------------
  // EVENT SIMULATOR: AUTOMATED TRUCK COLLECTION RUN
  // --------------------------------------------------------------------------
  async function simulateTruckCollectionRun() {
    if (state.isCollecting) {
      showToast('Collection vehicle is already actively executing a route!');
      return;
    }

    // Identify bins that need collection: Critical (>80%) or Warning (>50%)
    const binsToCollect = state.bins.filter(b => b.fillLevel >= 50);

    if (binsToCollect.length === 0) {
      showToast('All bins are currently below threshold (<50%). Fleet dispatch not required.');
      return;
    }

    // Sort by priority (highest priority visited first)
    binsToCollect.sort((a, b) => calculateBinPriority(b).score - calculateBinPriority(a).score);

    state.isCollecting = true;
    showToast(`Dispatching Automated Collection Vehicle to ${binsToCollect.length} overdue bins...`);
    playTone(440, 0.15, 'sawtooth');

    // Central Sustainability Processing Yard as Depot
    const depotCoords = [12.6595, 77.4478];
    const waypoints = [depotCoords, ...binsToCollect.map(b => [b.lat, b.lng]), depotCoords];

    // Draw planned collection route polyline
    if (state.truckRouteLine) state.map.removeLayer(state.truckRouteLine);
    state.truckRouteLine = L.polyline(waypoints, {
      color: PALETTE.routeCyan,
      weight: 3.5,
      dashArray: '8, 8',
      opacity: 0.8
    }).addTo(state.map);

    // Create or position truck marker
    const truckIcon = L.divIcon({
      html: `
        <div class="truck-marker-container">
          <i class="fa-solid fa-truck-fast"></i>
        </div>
      `,
      className: 'custom-truck-leaflet-icon',
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    if (state.truckMarker) state.map.removeLayer(state.truckMarker);
    state.truckMarker = L.marker(depotCoords, { icon: truckIcon }).addTo(state.map);

    // Pan map to overview
    state.map.flyToBounds(L.latLngBounds(waypoints), { padding: [50, 50], duration: 1.2 });

    // Animate truck movement along waypoints
    let collectedWeightKg = 0;

    for (let i = 0; i < binsToCollect.length; i++) {
      const targetBin = binsToCollect[i];
      const startCoord = waypoints[i];
      const targetCoord = [targetBin.lat, targetBin.lng];

      // Smooth interpolation animation between waypoints
      await animateMarkerAlongSegment(state.truckMarker, startCoord, targetCoord, 1200);

      // Truck Arrived at Target Bin!
      collectedWeightKg += targetBin.weightKg;
      playCollectionChime();

      // Reset bin to empty state
      targetBin.fillLevel = 0;
      targetBin.weightKg = +(Math.random() * 2 + 1).toFixed(1);
      targetBin.lastCleaned = new Date().toISOString();
      targetBin.status = 'optimal';

      updateSingleBinMarker(targetBin);
      updateDashboardMetrics();
      renderPriorityQueue();

      showToast(`Collected [${targetBin.id}] at ${targetBin.name}. Bin emptied to 0%.`);
      await delay(400); // brief pause at bin for realistic pickup effect
    }

    // Return to Depot
    const lastBinCoord = [binsToCollect[binsToCollect.length - 1].lat, binsToCollect[binsToCollect.length - 1].lng];
    await animateMarkerAlongSegment(state.truckMarker, lastBinCoord, depotCoords, 1000);

    // Route complete celebration
    playSuccessTone();
    state.stats.totalCollectedKg += collectedWeightKg;
    state.stats.totalRuns += 1;

    showToast(`Collection Run Finished! Total Waste Collected: ${Math.round(collectedWeightKg)} kg across ${binsToCollect.length} stations.`);

    setTimeout(() => {
      if (state.truckRouteLine) state.map.removeLayer(state.truckRouteLine);
      if (state.truckMarker) state.map.removeLayer(state.truckMarker);
      state.truckRouteLine = null;
      state.truckMarker = null;
      state.isCollecting = false;
      populateSimulatorDropdown();
    }, 2500);

    // Call teammate's Flask API if available
    if (!API_CONFIG.USE_LOCAL_MOCK) {
      fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DISPATCH_COLLECTION}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectedBinIds: binsToCollect.map(b => b.id),
          totalCollectedKg: collectedWeightKg,
          timestamp: new Date().toISOString()
        })
      }).catch(err => console.warn('Flask collection API logging skipped:', err));
    }
  }

  function animateMarkerAlongSegment(marker, start, end, duration) {
    return new Promise(resolve => {
      const startTime = performance.now();
      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const lat = start[0] + (end[0] - start[0]) * progress;
        const lng = start[1] + (end[1] - start[1]) * progress;
        marker.setLatLng([lat, lng]);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(step);
    });
  }

  function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  // --------------------------------------------------------------------------
  // CITIZEN FEATURE: FIND NEAREST BIN & WALKING NAVIGATION (Matches Image 2)
  // --------------------------------------------------------------------------
  function findNearestAvailableBin() {
    playTone(520, 0.1);

    // Try HTML5 Geolocation or use simulated campus coordinates
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          // If within 50km of DSU campus, use real coordinates, otherwise keep DSU campus student point
          const userLat = pos.coords.latitude;
          const userLng = pos.coords.longitude;
          const distToCampus = calculateDistanceMeters([userLat, userLng], DSU_CAMPUS_CENTER);
          if (distToCampus < 50000) {
            state.userLocation = [userLat, userLng];
          }
          executeNearestRouting();
        },
        () => {
          // Geolocation denied or unavailable -> Use simulated student spot at DSU Harohalli
          executeNearestRouting();
        },
        { timeout: 3000 }
      );
    } else {
      executeNearestRouting();
    }
  }

  function executeNearestRouting() {
    // Find all bins that are NOT critical (fill < 80%)
    const candidateBins = state.bins.filter(b => b.fillLevel < 80);

    if (candidateBins.length === 0) {
      showToast('All campus bins are currently at critical capacity! Alerting administration.');
      return;
    }

    // Sort by distance to userLocation
    candidateBins.sort((a, b) => {
      const distA = calculateDistanceMeters(state.userLocation, [a.lat, a.lng]);
      const distB = calculateDistanceMeters(state.userLocation, [b.lat, b.lng]);
      return distA - distB;
    });

    const nearest = candidateBins[0];
    const distMeters = Math.round(calculateDistanceMeters(state.userLocation, [nearest.lat, nearest.lng]));
    const walkMins = Math.max(1, Math.round(distMeters / 75)); // ~75 meters/min walking speed
    const co2SavedGrams = Math.round(distMeters * 0.18); // 180g CO2 saved per km walking vs driving

    // Render User Marker
    if (!state.userMarker) {
      const userIcon = L.divIcon({
        html: `<div class="user-marker-container"><i class="fa-solid fa-person-walking"></i></div>`,
        className: 'user-leaflet-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      state.userMarker = L.marker(state.userLocation, { icon: userIcon }).addTo(state.map);
    } else {
      state.userMarker.setLatLng(state.userLocation);
    }

    // Draw glowing animated route polyline
    if (state.citizenRouteLine) state.map.removeLayer(state.citizenRouteLine);

    // Intermediate realistic campus walkway bezier point
    const midPoint = [
      (state.userLocation[0] + nearest.lat) / 2 + 0.0003,
      (state.userLocation[1] + nearest.lng) / 2 - 0.0002
    ];

    const routeCoords = [state.userLocation, midPoint, [nearest.lat, nearest.lng]];

    state.citizenRouteLine = L.polyline(routeCoords, {
      color: PALETTE.optimal,
      weight: 4,
      dashArray: '10, 8',
      opacity: 0.95
    }).addTo(state.map);

    // Zoom map to show both user and target bin
    state.map.flyToBounds(L.latLngBounds([state.userLocation, [nearest.lat, nearest.lng]]), {
      padding: [70, 70],
      duration: 1.2
    });

    // Display Citizen Route Card overlay (Matches User Reference Image 2)
    displayCitizenRouteCard(nearest, distMeters, walkMins, co2SavedGrams);
  }

  function displayCitizenRouteCard(bin, distanceMeters, walkMins, co2Grams) {
    let overlay = document.getElementById('citizen-route-panel');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'citizen-route-panel';
      overlay.className = 'citizen-route-card';
      document.querySelector('.right-dock').prepend(overlay);
    }

    overlay.style.display = 'flex';
    overlay.innerHTML = `
      <div class="route-header">
        <span class="route-title"><i class="fa-solid fa-route"></i> Optimized Green Route</span>
        <button class="modal-close-btn" onclick="window.twinMap.closeCitizenRoute()" title="Close route">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="route-stats-grid">
        <div class="route-stat-item">
          <span class="route-stat-num">${distanceMeters}m</span>
          <span class="route-stat-desc">Distance</span>
        </div>
        <div class="route-stat-item">
          <span class="route-stat-num">${walkMins} min</span>
          <span class="route-stat-desc">Walk Time</span>
        </div>
        <div class="route-stat-item">
          <span class="route-stat-num" style="color: var(--neon-green);">${co2Grams}g</span>
          <span class="route-stat-desc">CO₂ Offset</span>
        </div>
      </div>

      <div class="route-steps-text">
        <strong>Destination:</strong> ${bin.name} (${bin.id})<br/>
        <span style="font-size: 0.72rem; color: var(--text-muted);"><i class="fa-solid fa-location-dot"></i> ${bin.block} • Status: ${bin.fillLevel}% (${bin.wasteType})</span>
      </div>

      <button class="btn-glow green" onclick="window.twinMap.simulateArrival('${bin.id}')">
        <i class="fa-solid fa-circle-check"></i> I've Arrived at Bin
      </button>
    `;

    showToast(`Calculated route to nearest bin: ${bin.name} (${distanceMeters}m)`);
  }

  function simulateArrival(binId) {
    playSuccessTone();
    const bin = state.bins.find(b => b.id === binId);
    showToast(`You have arrived at ${bin ? bin.name : 'your destination bin'}! Dispose waste safely.`);

    // Quick disposal simulation option
    if (bin) {
      simulateDisposalEvent(bin.id, 15);
    }

    closeCitizenRoute();
  }

  function closeCitizenRoute() {
    const overlay = document.getElementById('citizen-route-panel');
    if (overlay) overlay.style.display = 'none';
    if (state.citizenRouteLine) {
      state.map.removeLayer(state.citizenRouteLine);
      state.citizenRouteLine = null;
    }
  }

  function calculateDistanceMeters(coord1, coord2) {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (coord1[0] * Math.PI) / 180;
    const phi2 = (coord2[0] * Math.PI) / 180;
    const deltaPhi = ((coord2[0] - coord1[0]) * Math.PI) / 180;
    const deltaLambda = ((coord2[1] - coord1[1]) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // --------------------------------------------------------------------------
  // SEARCH & FILTER LOGIC
  // --------------------------------------------------------------------------
  function getFilteredBins() {
    return state.bins.filter(bin => {
      // Search query filter (matches ID, Name, or Block)
      if (state.filters.search) {
        const q = state.filters.search.toLowerCase();
        const matchesQuery =
          bin.id.toLowerCase().includes(q) ||
          bin.name.toLowerCase().includes(q) ||
          bin.block.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Waste Type filter
      if (state.filters.wasteType !== 'all') {
        if (bin.wasteType.toLowerCase() !== state.filters.wasteType.toLowerCase()) {
          return false;
        }
      }

      // Status filter
      if (state.filters.status !== 'all') {
        if (state.filters.status === 'critical' && bin.fillLevel <= 80) return false;
        if (state.filters.status === 'warning' && (bin.fillLevel <= 50 || bin.fillLevel > 80)) return false;
        if (state.filters.status === 'optimal' && bin.fillLevel > 50) return false;
      }

      return true;
    });
  }

  function applyFilters() {
    renderAllMarkers();
  }

  // --------------------------------------------------------------------------
  // UI EVENT HANDLERS & BINDINGS
  // --------------------------------------------------------------------------
  function setupEventListeners() {
    // Search Input
    const searchInput = document.getElementById('search-bins-input');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        state.filters.search = e.target.value.trim();
        applyFilters();
      });
    }

    // Waste Type Filter Chips
    document.querySelectorAll('[data-filter-type]').forEach(chip => {
      chip.addEventListener('click', e => {
        document.querySelectorAll('[data-filter-type]').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        state.filters.wasteType = e.target.dataset.filterType;
        applyFilters();
        playTone(500, 0.05);
      });
    });

    // Status Filter Chips
    document.querySelectorAll('[data-filter-status]').forEach(chip => {
      chip.addEventListener('click', e => {
        document.querySelectorAll('[data-filter-status]').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        state.filters.status = e.target.dataset.filterStatus;
        applyFilters();
        playTone(500, 0.05);
      });
    });

    // Simulator: Fill Slider
    const simSlider = document.getElementById('sim-fill-slider');
    const simSliderVal = document.getElementById('sim-fill-value');
    if (simSlider && simSliderVal) {
      simSlider.addEventListener('input', e => {
        simSliderVal.textContent = `+${e.target.value}%`;
      });
    }

    // Simulator: Quick Amount Buttons
    document.querySelectorAll('.btn-quick').forEach(btn => {
      btn.addEventListener('click', e => {
        const val = parseInt(e.target.dataset.val, 10);
        if (simSlider) {
          simSlider.value = val;
          if (simSliderVal) simSliderVal.textContent = `+${val}%`;
        }
        playTone(650, 0.05);
      });
    });

    // Simulator: "Inject Waste" Button
    const btnSimulateDisposal = document.getElementById('btn-simulate-disposal');
    if (btnSimulateDisposal) {
      btnSimulateDisposal.addEventListener('click', () => {
        const select = document.getElementById('sim-bin-select');
        const slider = document.getElementById('sim-fill-slider');
        const typeSelect = document.getElementById('sim-type-select');
        if (!select || !slider) return;

        const binId = select.value;
        const delta = parseInt(slider.value, 10) || 25;
        const customType = typeSelect ? typeSelect.value : null;

        simulateDisposalEvent(binId, delta, customType);
      });
    }

    // Simulator: "Dispatch Collection Truck" Button
    const btnDispatchTruck = document.getElementById('btn-dispatch-truck');
    if (btnDispatchTruck) {
      btnDispatchTruck.addEventListener('click', () => {
        simulateTruckCollectionRun();
      });
    }

    // Citizen: "Find Nearest Bin" Button
    const btnFindNearest = document.getElementById('btn-find-nearest');
    if (btnFindNearest) {
      btnFindNearest.addEventListener('click', () => {
        findNearestAvailableBin();
      });
    }

    // Basemap Layer Buttons
    document.querySelectorAll('.layer-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const layer = e.currentTarget.dataset.layer;
        setTileLayer(layer);
      });
    });

    // 360 Campus Tour Modal Open/Close
    const btnTour = document.getElementById('btn-open-360-tour');
    const modalTour = document.getElementById('modal-360-tour');
    const btnCloseTour = document.getElementById('btn-close-360-modal');

    if (btnTour && modalTour) {
      btnTour.addEventListener('click', () => {
        modalTour.classList.add('open');
        playTone(600, 0.08);
      });
    }

    if (btnCloseTour && modalTour) {
      btnCloseTour.addEventListener('click', () => {
        modalTour.classList.remove('open');
      });
    }

    if (modalTour) {
      modalTour.addEventListener('click', e => {
        if (e.target === modalTour) {
          modalTour.classList.remove('open');
        }
      });
    }

    // Audio Mute Toggle
    const audioBtn = document.getElementById('btn-toggle-audio');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        audioBtn.innerHTML = state.soundEnabled
          ? '<i class="fa-solid fa-volume-high"></i>'
          : '<i class="fa-solid fa-volume-xmark"></i>';
        showToast(state.soundEnabled ? 'Synthesizer Audio Enabled' : 'Audio Muted');
      });
    }
  }

  // --------------------------------------------------------------------------
  // HELPER FUNCTIONS & EXPOSED PUBLIC API
  // --------------------------------------------------------------------------
  function focusOnBin(binId) {
    const bin = state.bins.find(b => b.id === binId);
    if (!bin) return;

    state.map.flyTo([bin.lat, bin.lng], 18, { duration: 1.1 });
    const marker = state.markers.get(binId);
    if (marker) {
      setTimeout(() => marker.openPopup(), 1100);
    }
  }

  function showToast(msg) {
    let toast = document.getElementById('telemetry-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'telemetry-toast';
      toast.className = 'telemetry-toast';
      document.querySelector('.map-workspace').appendChild(toast);
    }

    toast.innerHTML = `<i class="fa-solid fa-satellite-dish"></i> <span>${msg}</span>`;
    toast.classList.add('visible');

    if (window._toastTimeout) clearTimeout(window._toastTimeout);
    window._toastTimeout = setTimeout(() => {
      toast.classList.remove('visible');
    }, 4500);
  }

  function getDefaultFallbackBins() {
    return [
      { id: "BIN-DSU-01", name: "School of Engineering Quad", block: "Block A", lat: 12.6625, lng: 77.4485, wasteType: "Recyclable", capacityLiters: 120, fillLevel: 92, batteryLevel: 88, temperatureC: 26.4, weightKg: 44.2, lastCleaned: "2026-10-14T08:30:00Z", status: "critical" },
      { id: "BIN-DSU-02", name: "Central Library Hub", block: "Academic Blvd", lat: 12.6628, lng: 77.4502, wasteType: "Organic", capacityLiters: 100, fillLevel: 78, batteryLevel: 94, temperatureC: 24.8, weightKg: 32.0, lastCleaned: "2026-10-14T11:15:00Z", status: "warning" },
      { id: "BIN-DSU-03", name: "CDSIMER Hospital Wing", block: "CDSIMER Medical", lat: 12.6605, lng: 77.4498, wasteType: "Hazardous", capacityLiters: 80, fillLevel: 88, batteryLevel: 91, temperatureC: 22.1, weightKg: 38.6, lastCleaned: "2026-10-14T06:45:00Z", status: "critical" },
      { id: "BIN-DSU-04", name: "Central Cafeteria Plaza", block: "Student Amenities", lat: 12.6622, lng: 77.4496, wasteType: "Organic", capacityLiters: 240, fillLevel: 85, batteryLevel: 76, temperatureC: 28.5, weightKg: 94.2, lastCleaned: "2026-10-14T07:15:00Z", status: "critical" },
      { id: "BIN-DSU-05", name: "Innovation Hub AIC-DSU", block: "Research Wing", lat: 12.6635, lng: 77.4490, wasteType: "E-Waste", capacityLiters: 90, fillLevel: 34, batteryLevel: 96, temperatureC: 23.9, weightKg: 16.5, lastCleaned: "2026-10-13T16:00:00Z", status: "optimal" },
      { id: "BIN-DSU-06", name: "Student Poshtel Alpha", block: "Hostel Zone", lat: 12.6640, lng: 77.4478, wasteType: "Recyclable", capacityLiters: 180, fillLevel: 64, batteryLevel: 82, temperatureC: 25.1, weightKg: 48.0, lastCleaned: "2026-10-14T09:00:00Z", status: "warning" },
      { id: "BIN-DSU-11", name: "Biotech & Genetics Lab", block: "Life Sciences", lat: 12.6616, lng: 77.4482, wasteType: "Hazardous", capacityLiters: 80, fillLevel: 95, batteryLevel: 79, temperatureC: 21.8, weightKg: 42.1, lastCleaned: "2026-10-14T05:20:00Z", status: "critical" },
      { id: "BIN-DSU-15", name: "Sustainability Processing Yard", block: "Depot", lat: 12.6595, lng: 77.4478, wasteType: "E-Waste", capacityLiters: 300, fillLevel: 22, batteryLevel: 99, temperatureC: 26.0, weightKg: 34.0, lastCleaned: "2026-10-14T16:00:00Z", status: "optimal" }
    ];
  }

  // --------------------------------------------------------------------------
  // EXPOSE GLOBAL API FOR IN-POPUP ACTIONS & TEAMMATE INTEGRATION
  // --------------------------------------------------------------------------
  window.twinMap = {
    quickFill: (binId, amount) => simulateDisposalEvent(binId, amount),
    quickEmpty: binId => {
      const bin = state.bins.find(b => b.id === binId);
      if (bin) {
        bin.fillLevel = 0;
        bin.weightKg = +(Math.random() * 2 + 1).toFixed(1);
        bin.lastCleaned = new Date().toISOString();
        bin.status = 'optimal';
        updateSingleBinMarker(bin);
        updateDashboardMetrics();
        renderPriorityQueue();
        playCollectionChime();
        showToast(`Manually emptied ${bin.id} to 0%.`);
      }
    },
    routeToBin: binId => {
      const bin = state.bins.find(b => b.id === binId);
      if (!bin) return;
      focusOnBin(binId);
      const dist = Math.round(calculateDistanceMeters(state.userLocation, [bin.lat, bin.lng]));
      displayCitizenRouteCard(bin, dist, Math.max(1, Math.round(dist / 75)), Math.round(dist * 0.18));
    },
    simulateArrival: simulateArrival,
    closeCitizenRoute: closeCitizenRoute,
    focusOnBin: focusOnBin,
    getState: () => state,
    setMockMode: enabled => {
      API_CONFIG.USE_LOCAL_MOCK = enabled;
      showToast(`Switched API mode: ${enabled ? 'LOCAL MOCK' : 'LIVE FLASK BACKEND'}`);
    }
  };

  // Launch on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
