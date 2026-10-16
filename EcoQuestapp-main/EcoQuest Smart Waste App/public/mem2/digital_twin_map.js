/**
 * ============================================================================
 * SMART WASTE MANAGEMENT SYSTEM - DIGITAL TWIN GIS CONTROLLER
 * Campus: Dayananda Sagar University (DSU) Main Campus, Harohalli, Bengaluru
 * Role: Digital Twin Engineer Scope
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // CONFIGURATION & CONSTANTS
  // --------------------------------------------------------------------------
  const DSU_CAMPUS_CENTER = [12.6618, 77.4495];
  const DEFAULT_ZOOM = 17;
  const PREFERRED_LOCATION_ACCURACY_METERS = 25;
  const MAX_LOCATION_ACCURACY_METERS = 150;

  const API_CONFIG = {
    USE_LOCAL_MOCK: true,
    BASE_URL: 'http://localhost:5000/api/twin',
    ENDPOINTS: {
      GET_BINS: '/bins',
      UPDATE_BIN: '/bins/',
      DISPATCH_COLLECTION: '/simulated-collection'
    }
  };

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
    currentTileLayer: 'satellite',
    bins: [],
    markers: new Map(),
    nearestBinId: null,
    userMarker: null,
    userAccuracyCircle: null,
    userLocation: [12.6612, 77.4485],
    hasLiveLocation: false,
    citizenRouteLine: null,
    walkingNavigation: {
      bin: null,
      watchId: null,
      requestId: 0,
      locationRequestId: 0,
      requestController: null,
      lastRoutedLocation: null,
      lastRouteAt: 0,
      route: null,
      remainingDistance: null,
      currentStepIndex: 0,
      tracking: false,
      animationFrame: null,
      dumpRewarded: false,
      arrivalId: null,
      arrivalRewarded: false,
      status: 'idle'
    },
    walkingDestinationKeyHandler: null,
    dumpVerification: null,
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
  // WEB AUDIO SYNTHESIZER
  // --------------------------------------------------------------------------
  function initAudio() {
    if (!state.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) state.audioCtx = new AudioContext();
    }
  }

  function playTone(freq, duration = 0.15, type = 'sine') {
    if (!state.soundEnabled) return;
    try {
      initAudio();
      if (!state.audioCtx) return;
      if (state.audioCtx.state === 'suspended') state.audioCtx.resume();
      
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
      // Audio fallback
    }
  }

  function playCollectionChime() {
    playTone(523.25, 0.1, 'sine');
    setTimeout(() => playTone(659.25, 0.1, 'sine'), 100);
    setTimeout(() => playTone(783.99, 0.2, 'sine'), 200);
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
    showToast('Digital Twin Map active. Telemetry synchronized with DSU Campus.');
  }

  // --------------------------------------------------------------------------
  // LEAFLET MAP & TILE PROVIDERS
  // --------------------------------------------------------------------------
  function setupMap() {
    state.map = L.map('map', {
      center: DSU_CAMPUS_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: true
    });

    L.control.zoom({ position: 'bottomright' }).addTo(state.map);

    const campusZone = L.circle(DSU_CAMPUS_CENTER, {
      radius: 420,
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
    // 1. Dark Mode Tile Layer (Filtered OpenStreetMap - Free & No Watermark)
    state.tileLayers.dark = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        className: 'dark-tiles',
        attribution: '&copy; OpenStreetMap contributors'
      }
    );

    // 2. Satellite View Tile Layer
    state.tileLayers.satellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution: '&copy; Esri, Maxar'
      }
    );

    // 3. OpenStreetMap Standard Layer
    state.tileLayers.streets = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }
    );

    state.tileLayers.satellite.addTo(state.map);
    document.querySelectorAll('.layer-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.layer === 'satellite');
    });
  }

  function setTileLayer(type) {
    if (!state.tileLayers[type] || state.currentTileLayer === type) return;
    state.map.removeLayer(state.tileLayers[state.currentTileLayer]);
    state.tileLayers[type].addTo(state.map);
    state.currentTileLayer = type;

    document.querySelectorAll('.layer-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.layer === type);
    });

    showToast(`Switched basemap to: ${type.toUpperCase()}`);
  }

  // --------------------------------------------------------------------------
  // DATA LOADING
  // --------------------------------------------------------------------------
  async function loadBinsData() {
    if (!API_CONFIG.USE_LOCAL_MOCK) {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_BINS}`);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        state.bins = await response.json();
        return;
      } catch (err) {
        console.warn('[API] Backend unreachable. Falling back to sample_bins.json:', err.message);
      }
    }

    try {
      const response = await fetch('./sample_bins.json');
      if (!response.ok) throw new Error('Could not load sample_bins.json');
      state.bins = await response.json();
    } catch (e) {
      state.bins = getDefaultFallbackBins();
    }
  }

  // --------------------------------------------------------------------------
  // DYNAMIC SVG MARKERS
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

    const pulseRingHtml = fill > 50 ? `<div class="radar-pulse-ring ${statusClass}"></div>` : '';
    const isNearest = state.nearestBinId === bin.id;

    const html = `
      <div class="smart-bin-marker ${statusClass}${isNearest ? ' smart-bin-marker--nearest' : ''}" data-id="${bin.id}">
        ${isNearest ? '<span class="marker-nearest-label">I am Here</span>' : ''}
        ${pulseRingHtml}
        <div class="marker-wrapper">
          <svg class="marker-icon-svg" viewBox="0 0 44 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2C12.059 2 4 10.059 4 20C4 29.5 22 46 22 46C22 46 40 29.5 40 20C40 10.059 31.941 2 22 2Z" fill="#0B0F19" stroke="${color}" stroke-width="2.2" />
            <circle cx="22" cy="19" r="13" fill="${color}" fill-opacity="0.22" />
            <path d="M16 16.5H28M18 16.5V24C18 25.1 18.9 26 20 26H24C25.1 26 26 25.1 26 24V16.5M19.5 14H24.5" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
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

  function highlightNearestBin(binId) {
    state.nearestBinId = binId;
    const bin = state.bins.find(item => item.id === binId);
    if (!bin) return;

    let marker = state.markers.get(binId);
    if (!marker) {
      state.filters.search = '';
      state.filters.wasteType = 'all';
      state.filters.status = 'all';
      const searchInput = document.getElementById('search-bins-input');
      if (searchInput) searchInput.value = '';
      document.querySelectorAll('[data-filter-type]').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.filterType === 'all');
      });
      document.querySelectorAll('[data-filter-status]').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.filterStatus === 'all');
      });
      renderAllMarkers();
      marker = state.markers.get(binId);
    }

    marker.setIcon(createBinMarkerIcon(bin));
    marker.setZIndexOffset(1000);
  }

  function renderAllMarkers() {
    state.markers.forEach(marker => state.map.removeLayer(marker));
    state.markers.clear();

    const filteredBins = getFilteredBins();

    filteredBins.forEach(bin => {
      const icon = createBinMarkerIcon(bin);
      const marker = L.marker([bin.lat, bin.lng], {
        icon: icon,
        zIndexOffset: state.nearestBinId === bin.id ? 1000 : 0
      }).addTo(state.map);

      marker.bindPopup(buildPopupHtml(bin), {
        maxWidth: 320,
        className: 'custom-twin-popup'
      });

      marker.on('click', () => {
        playTone(600, 0.08, 'sine');
        const select = document.getElementById('sim-bin-select');
        if (select) select.value = bin.id;
      });
      marker.on('popupclose', () => marker.setPopupContent(buildPopupHtml(bin)));

      state.markers.set(bin.id, marker);
    });
  }

  // --------------------------------------------------------------------------
  // POPUP CARD
  // --------------------------------------------------------------------------
  function buildPopupHtml(bin, arrival = false) {
    const statusClass = bin.fillLevel > 80 ? 'critical' : bin.fillLevel > 50 ? 'warning' : 'optimal';
    const statusLabel = bin.fillLevel > 80 ? 'CRITICAL / FULL' : bin.fillLevel > 50 ? 'HALF-FULL' : 'OPTIMAL';

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

        <div class="popup-fill-progress">
          <div class="fill-bar-labels">
            <span>Capacity Fill Level</span>
            <strong>${bin.fillLevel}% (${Math.round((bin.capacityLiters * bin.fillLevel) / 100)} / ${bin.capacityLiters} L)</strong>
          </div>
          <div class="progress-track">
            <div class="progress-fill ${statusClass}" style="width: ${bin.fillLevel}%;"></div>
          </div>
        </div>

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
        </div>

        ${arrival ? `
        <div class="popup-action-row popup-action-row--dump">
          ${state.walkingNavigation.dumpRewarded
            ? '<div class="dump-already-completed"><i class="fa-solid fa-circle-check"></i> Disposal task completed</div>'
            : `<button class="dump-it-button" type="button" onclick="window.twinMap.startDumpVerification('${escapeHtml(bin.id)}')">
                <i class="fa-solid fa-camera"></i> DUMP IT
              </button>`}
        </div>
        ` : `<div class="popup-action-row">
          <button class="popup-mini-btn" onclick="window.twinMap.quickFill('${bin.id}', 25)">
            <i class="fa-solid fa-plus"></i> +25%
          </button>
          <button class="popup-mini-btn empty-btn" onclick="window.twinMap.quickEmpty('${bin.id}')">
            <i class="fa-solid fa-trash-can-arrow-up"></i> Empty
          </button>
          <button class="popup-mini-btn" onclick="window.twinMap.routeToBin('${bin.id}')">
            <i class="fa-solid fa-diamond-turn-right"></i> Route
          </button>
        </div>`}
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // PRIORITY QUEUE
  // --------------------------------------------------------------------------
  function calculateBinPriority(bin) {
    const fillScore = Math.min(100, bin.fillLevel) * 0.60;
    let hoursElapsed = 4;
    try {
      const last = new Date(bin.lastCleaned).getTime();
      const now = new Date().getTime();
      if (!isNaN(last)) hoursElapsed = Math.max(0, (now - last) / (1000 * 60 * 60));
    } catch (e) {
      hoursElapsed = 6;
    }
    const timeScore = Math.min(25, hoursElapsed * 2.5);

    let hazardScore = 0;
    if (bin.wasteType === 'Hazardous') hazardScore = 15;
    else if (bin.wasteType === 'E-Waste') hazardScore = 8;
    else if (bin.wasteType === 'Organic' && bin.fillLevel > 70) hazardScore = 10;

    const totalScore = Math.min(100, Math.round(fillScore + timeScore + hazardScore));

    let tier = 'optimal';
    if (totalScore >= 75 || bin.fillLevel >= 80) tier = 'critical';
    else if (totalScore >= 50 || bin.fillLevel >= 50) tier = 'warning';

    return { score: totalScore, tier: tier, hoursElapsed: hoursElapsed.toFixed(1) };
  }

  function getSortedPriorityQueue() {
    return [...state.bins].sort((a, b) => calculateBinPriority(b).score - calculateBinPriority(a).score);
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
          <div class="queue-item-id">#${idx + 1} • ${bin.id} (${bin.wasteType})</div>
          <div class="queue-item-name">${bin.name}</div>
          <div class="queue-item-meta">${bin.block}</div>
        </div>
        <div class="queue-item-metric">
          <div class="queue-fill-pct">${bin.fillLevel}%</div>
          <div class="queue-priority-tag">Score: ${priority.score}</div>
        </div>
      `;

      item.addEventListener('click', () => focusOnBin(bin.id));
      container.appendChild(item);
    });
  }

  // --------------------------------------------------------------------------
  // DASHBOARD METRICS
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
  // EVENT SIMULATOR
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

    if (customType) bin.wasteType = customType;

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

    updateSingleBinMarker(bin);
    updateDashboardMetrics();
    renderPriorityQueue();
    populateSimulatorDropdown();

    const select = document.getElementById('sim-bin-select');
    if (select) select.value = bin.id;

    showToast(`Disposal simulated on ${bin.id}: ${prevFill}% → ${bin.fillLevel}% (+${deltaFill}%)`);
  }

  function updateSingleBinMarker(bin) {
    const marker = state.markers.get(bin.id);
    if (marker) {
      marker.setIcon(createBinMarkerIcon(bin));
      marker.setPopupContent(buildPopupHtml(bin));
      if (marker.isPopupOpen()) marker.openPopup();
    }
  }

  async function simulateTruckCollectionRun() {
    if (state.isCollecting) {
      showToast('Collection truck is already executing a route!');
      return;
    }

    const binsToCollect = state.bins.filter(b => b.fillLevel >= 50);

    if (binsToCollect.length === 0) {
      showToast('All bins are below threshold (<50%). Dispatch not required.');
      return;
    }

    binsToCollect.sort((a, b) => calculateBinPriority(b).score - calculateBinPriority(a).score);

    state.isCollecting = true;
    showToast(`Dispatching Automated Collection Truck to ${binsToCollect.length} bins...`);
    playTone(440, 0.15, 'sawtooth');

    const depotCoords = [12.6595, 77.4478];
    const waypoints = [depotCoords, ...binsToCollect.map(b => [b.lat, b.lng]), depotCoords];

    if (state.truckRouteLine) state.map.removeLayer(state.truckRouteLine);
    state.truckRouteLine = L.polyline(waypoints, {
      color: PALETTE.routeCyan,
      weight: 3.5,
      dashArray: '8, 8',
      opacity: 0.8
    }).addTo(state.map);

    const truckIcon = L.divIcon({
      html: `<div class="truck-marker-container"><i class="fa-solid fa-truck-fast"></i></div>`,
      className: 'custom-truck-leaflet-icon',
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    if (state.truckMarker) state.map.removeLayer(state.truckMarker);
    state.truckMarker = L.marker(depotCoords, { icon: truckIcon }).addTo(state.map);

    state.map.flyToBounds(L.latLngBounds(waypoints), { padding: [50, 50], duration: 1.2 });

    let collectedWeightKg = 0;

    for (let i = 0; i < binsToCollect.length; i++) {
      const targetBin = binsToCollect[i];
      const startCoord = waypoints[i];
      const targetCoord = [targetBin.lat, targetBin.lng];

      await animateMarkerAlongSegment(state.truckMarker, startCoord, targetCoord, 1200);

      collectedWeightKg += targetBin.weightKg;
      playCollectionChime();

      targetBin.fillLevel = 0;
      targetBin.weightKg = +(Math.random() * 2 + 1).toFixed(1);
      targetBin.lastCleaned = new Date().toISOString();
      targetBin.status = 'optimal';

      updateSingleBinMarker(targetBin);
      updateDashboardMetrics();
      renderPriorityQueue();

      showToast(`Collected [${targetBin.id}] at ${targetBin.name}. Emptied to 0%.`);
      await delay(400);
    }

    const lastBinCoord = [binsToCollect[binsToCollect.length - 1].lat, binsToCollect[binsToCollect.length - 1].lng];
    await animateMarkerAlongSegment(state.truckMarker, lastBinCoord, depotCoords, 1000);

    playSuccessTone();
    state.stats.totalCollectedKg += collectedWeightKg;
    state.stats.totalRuns += 1;

    showToast(`Collection Run Complete! ${Math.round(collectedWeightKg)} kg collected.`);

    setTimeout(() => {
      if (state.truckRouteLine) state.map.removeLayer(state.truckRouteLine);
      if (state.truckMarker) state.map.removeLayer(state.truckMarker);
      state.truckRouteLine = null;
      state.truckMarker = null;
      state.isCollecting = false;
      populateSimulatorDropdown();
    }, 2500);
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

        if (progress < 1) requestAnimationFrame(step);
        else resolve();
      }
      requestAnimationFrame(step);
    });
  }

  function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  // --------------------------------------------------------------------------
  // CITIZEN ROUTING
  // --------------------------------------------------------------------------
  function getAccurateLiveLocation(onSuccess, onError) {
    if (!navigator.geolocation) {
      onError({ code: 2 });
      return;
    }

    let watchId = null;
    let timeoutId = null;
    let bestPosition = null;
    let finished = false;

    const finish = (position, error) => {
      if (finished) return;
      finished = true;
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (timeoutId !== null) clearTimeout(timeoutId);
      if (position) onSuccess(position);
      else onError(error);
    };

    timeoutId = setTimeout(() => {
      if (bestPosition && bestPosition.coords.accuracy <= MAX_LOCATION_ACCURACY_METERS) {
        finish(bestPosition);
      } else {
        finish(null, { code: 3 });
      }
    }, 12000);

    watchId = navigator.geolocation.watchPosition(
      position => {
        const { latitude, longitude, accuracy } = position.coords;
        if (![latitude, longitude, accuracy].every(Number.isFinite) || accuracy < 0) return;

        if (!bestPosition || accuracy < bestPosition.coords.accuracy) bestPosition = position;
        if (accuracy <= PREFERRED_LOCATION_ACCURACY_METERS) finish(position);
      },
      error => {
        if (error.code === error.PERMISSION_DENIED) finish(null, error);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    );
    if (finished && watchId !== null) navigator.geolocation.clearWatch(watchId);
  }

  function showLiveLocationError(error, action) {
    const message = error.code === 1
      ? 'Location access was denied. Allow location for this site in your browser settings, then try again.'
      : error.code === 2
        ? 'Live location is unavailable. Turn on device location services and try again.'
        : 'GPS accuracy is too low to locate you reliably. Move outdoors, enable precise location, and try again.';
    showToast(`${message} ${action}`);
  }

  function findNearestAvailableBin() {
    playTone(520, 0.1);

    if (!navigator.geolocation) {
      showToast('This browser does not support live location. Open the map in a location-enabled browser.');
      return;
    }

    showToast('Allow location access and keep the map open while GPS gets a precise fix…');
    getAccurateLiveLocation(
      position => {
        const location = [position.coords.latitude, position.coords.longitude];
        state.userLocation = location;
        state.hasLiveLocation = true;
        updateUserMarker(location, position.coords.accuracy);
        showToast(`Live location found (about ${Math.round(position.coords.accuracy)} m accuracy). Finding the nearest available bin…`);
        executeNearestRouting(location);
      },
      error => {
        showLiveLocationError(error, 'Nearest-bin directions were not started.');
      }
    );
  }

  function executeNearestRouting(location) {
    const candidateBins = state.bins.filter(b => b.fillLevel < 80);

    if (candidateBins.length === 0) {
      showToast('All campus bins are full! Alerting operations team.');
      return;
    }

    candidateBins.sort((a, b) => {
      const distA = calculateDistanceMeters(location, [a.lat, a.lng]);
      const distB = calculateDistanceMeters(location, [b.lat, b.lng]);
      return distA - distB;
    });

    const nearest = candidateBins[0];
    startWalkingNavigation(nearest, location);
  }

  function startWalkingNavigation(bin, initialLocation = null) {
    closeCitizenRoute();
    state.map.closePopup();
    highlightNearestBin(bin.id);
    const navigation = state.walkingNavigation;
    navigation.bin = bin;
    navigation.route = null;
    navigation.remainingDistance = null;
    navigation.lastRoutedLocation = null;
    navigation.tracking = false;
    navigation.dumpRewarded = false;
    navigation.arrivalId = `${bin.id}-${Date.now()}`;
    navigation.arrivalRewarded = false;
    navigation.status = 'locating';
    const locationRequestId = ++navigation.locationRequestId;
    document.getElementById('app-container').classList.add('navigation-active');
    renderWalkingNavigationPanel('Waiting for your location…');
    requestAnimationFrame(() => state.map.invalidateSize({ pan: false }));

    if (initialLocation) {
      state.userLocation = initialLocation;
      state.hasLiveLocation = true;
      updateUserMarker(initialLocation);
      state.map.fitBounds(L.latLngBounds([initialLocation, [bin.lat, bin.lng]]), { padding: [70, 70] });
      updateWalkingRoute(initialLocation);
      return;
    }

    if (!navigator.geolocation) {
      state.walkingNavigation.status = 'error';
      renderWalkingNavigationPanel('Location services are not available in this browser.');
      return;
    }

    getAccurateLiveLocation(
      position => {
        if (navigation.locationRequestId !== locationRequestId || navigation.bin !== bin) return;
        const location = [position.coords.latitude, position.coords.longitude];
        state.userLocation = location;
        state.hasLiveLocation = true;
        updateUserMarker(location, position.coords.accuracy);
        state.map.fitBounds(L.latLngBounds([location, [bin.lat, bin.lng]]), { padding: [70, 70] });
        updateWalkingRoute(location);
      },
      error => {
        if (navigation.locationRequestId !== locationRequestId || navigation.bin !== bin) return;
        navigation.status = 'error';
        const message = error.code === error.PERMISSION_DENIED
          ? 'Location permission is off. Allow location access to preview walking directions.'
          : error.code === error.POSITION_UNAVAILABLE
            ? 'Your current location is unavailable. Check your device location settings.'
            : 'GPS accuracy is too low to route you reliably. Move outdoors and try again.';
        renderWalkingNavigationPanel(message);
      }
    );
  }

  function showWalkingDestinationScreen() {
    const workspace = document.querySelector('.map-workspace');
    if (!workspace) {
      console.error('[Navigation] Could not show the walking destination screen: map workspace is missing.');
      return;
    }

    const screen = document.createElement('div');
    screen.id = 'walking-destination-screen';
    screen.setAttribute('role', 'button');
    screen.setAttribute('tabindex', '0');
    screen.setAttribute('aria-label', 'Walking route finished. Challenge verification is ready.');
    screen.addEventListener('click', closeWalkingDestinationScreen, { once: true });
    screen.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        closeWalkingDestinationScreen();
      }
    });
    state.walkingDestinationKeyHandler = event => {
      if (event.key === 'Escape') closeWalkingDestinationScreen();
    };
    window.addEventListener('keydown', state.walkingDestinationKeyHandler);
    workspace.appendChild(screen);
    const navigation = state.walkingNavigation;
    if (navigation.status === 'arrived' && navigation.bin && !navigation.arrivalRewarded) {
      navigation.arrivalRewarded = true;
      window.parent.postMessage({
        type: 'ecoquest:digital-twin-arrival',
        arrivalId: navigation.arrivalId,
        binId: navigation.bin.id
      }, window.location.origin);
    }
    screen.focus();
  }

  function closeWalkingDestinationScreen() {
    const screen = document.getElementById('walking-destination-screen');
    if (!screen) return;
    screen.remove();
    if (state.walkingDestinationKeyHandler) {
      window.removeEventListener('keydown', state.walkingDestinationKeyHandler);
      state.walkingDestinationKeyHandler = null;
    }
    closeCitizenRoute();
  }

  function animateWalkingMarkerToBin(navigation) {
    const coordinates = navigation.route.geometry.coordinates
      .filter(([longitude, latitude]) => Number.isFinite(longitude) && Number.isFinite(latitude))
      .map(([longitude, latitude]) => [latitude, longitude]);
    if (!coordinates.length) {
      console.error('[Navigation] Could not animate the walking marker: route geometry is empty.');
      navigation.tracking = false;
      navigation.status = 'error';
      renderWalkingNavigationPanel('The walking route has no usable path. Please retry.');
      return;
    }

    const origin = [...state.userLocation];
    if (calculateDistanceMeters(origin, coordinates[0]) > 2) coordinates.unshift(origin);
    coordinates[coordinates.length - 1] = [navigation.bin.lat, navigation.bin.lng];
    const segmentLengths = [];
    let routeLength = 0;
    for (let index = 0; index < coordinates.length - 1; index++) {
      const length = calculateDistanceMeters(coordinates[index], coordinates[index + 1]);
      segmentLengths.push(length);
      routeLength += length;
    }

    const duration = 2600;
    let startedAt = null;
    const animate = timestamp => {
      if (!navigation.tracking || state.walkingNavigation !== navigation) return;
      if (startedAt === null) startedAt = timestamp;
      const progress = Math.min(1, (timestamp - startedAt) / duration);
      const distanceAlongRoute = routeLength * progress;
      let traversed = 0;
      let location = coordinates[coordinates.length - 1];

      for (let index = 0; index < segmentLengths.length; index++) {
        const segmentLength = segmentLengths[index];
        if (distanceAlongRoute <= traversed + segmentLength || index === segmentLengths.length - 1) {
          const fraction = segmentLength === 0
            ? 1
            : Math.max(0, Math.min(1, (distanceAlongRoute - traversed) / segmentLength));
          location = [
            coordinates[index][0] + (coordinates[index + 1][0] - coordinates[index][0]) * fraction,
            coordinates[index][1] + (coordinates[index + 1][1] - coordinates[index][1]) * fraction
          ];
          break;
        }
        traversed += segmentLength;
      }

      state.userLocation = location;
      updateUserMarker(location);
      if (progress < 1) {
        navigation.animationFrame = requestAnimationFrame(animate);
        return;
      }

      navigation.animationFrame = null;
      navigation.tracking = false;
      navigation.status = 'arrived';
      navigation.remainingDistance = 0;
      renderWalkingNavigationPanel();
      showWalkingDestinationScreen();
    };

    navigation.animationFrame = requestAnimationFrame(animate);
  }

  function beginWalkingTracking() {
    const navigation = state.walkingNavigation;
    if (!navigation.bin || !navigation.route || navigation.status !== 'preview') return;

    if (navigation.requestController) {
      navigation.requestController.abort();
      navigation.requestController = null;
      navigation.requestId++;
    }
    if (navigation.watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(navigation.watchId);
      navigation.watchId = null;
    }
    if (navigation.animationFrame !== null) {
      cancelAnimationFrame(navigation.animationFrame);
      navigation.animationFrame = null;
    }

    navigation.tracking = true;
    navigation.locationRequestId++;
    navigation.status = 'active';
    if (state.citizenRouteLine) {
      state.citizenRouteLine.setStyle({
        color: PALETTE.routeCyan,
        weight: 8,
        opacity: 1,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: '2 12'
      });
      state.citizenRouteLine.getElement()?.classList.add('walking-route-active');
      state.citizenRouteLine.bringToFront();
    }
    renderWalkingNavigationPanel();
    animateWalkingMarkerToBin(navigation);
  }

  function showArrivalBinPopup(bin) {
    const panel = document.getElementById('walking-navigation-panel');
    if (panel) panel.remove();

    const marker = state.markers.get(bin.id);
    if (!marker) {
      showToast('You reached the bin, but its map marker is unavailable.');
      return;
    }

    marker.setPopupContent(buildPopupHtml(bin, true));
    marker.openPopup();
  }

  function startDumpVerification(binId) {
    const bin = state.bins.find(item => item.id === binId);
    const navigation = state.walkingNavigation;
    if (!bin || navigation.bin !== bin || navigation.status !== 'arrived') {
      showToast('Reach the selected dustbin before starting disposal verification.');
      return;
    }
    if (navigation.dumpRewarded) return;

    closeDumpVerification();
    const session = {
      binId,
      stream: null,
      detectedLabel: null,
      stage: 'detect',
      busy: false
    };
    state.dumpVerification = session;

    const overlay = document.createElement('section');
    overlay.className = 'dump-verification-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'dump-verification-title');
    overlay.innerHTML = `
      <div class="dump-verification-card">
        <button class="dump-camera-close" type="button" aria-label="Close camera">&times;</button>
        <span class="dump-verification-eyebrow">DISPOSAL CHECK · ${escapeHtml(bin.id)}</span>
        <h2 id="dump-verification-title">Show your waste item</h2>
        <p class="dump-verification-description">AI will look for a recognizable item before and after disposal. This camera-only demo cannot prove the item entered the bin.</p>
        <div class="dump-camera-frame">
          <video class="dump-camera-video" autoplay muted playsinline></video>
          <div class="dump-camera-reticle" aria-hidden="true"></div>
        </div>
        <p class="dump-verification-status" aria-live="polite">Requesting camera access…</p>
        <button class="dump-verify-action" type="button" disabled>
          <i class="fa-solid fa-camera"></i> SCAN WASTE ITEM
        </button>
        <p class="dump-verification-note">Keep the item centered and visible. Allow camera access when your browser asks.</p>
      </div>
    `;
    document.body.appendChild(overlay);

    const closeButton = overlay.querySelector('.dump-camera-close');
    const actionButton = overlay.querySelector('.dump-verify-action');
    closeButton.addEventListener('click', closeDumpVerification);
    overlay.addEventListener('click', event => {
      if (event.target === overlay) closeDumpVerification();
    });
    actionButton.addEventListener('click', () => runDumpVerification(session, overlay));

    openDumpCamera(session, overlay);
  }

  async function openDumpCamera(session, overlay) {
    const status = overlay.querySelector('.dump-verification-status');
    const action = overlay.querySelector('.dump-verify-action');
    if (!navigator.mediaDevices?.getUserMedia) {
      status.textContent = 'Camera access is unavailable. Open the app in a secure browser and enable camera permissions.';
      return;
    }

    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: { ideal: 'environment' } }
        });
      } catch (error) {
        if (!['NotReadableError', 'OverconstrainedError', 'AbortError'].includes(error.name)) throw error;
        stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
      }
      if (state.dumpVerification !== session) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }

      session.stream = stream;
      const video = overlay.querySelector('.dump-camera-video');
      video.srcObject = stream;
      await video.play();
      status.textContent = 'Camera ready. Center the waste item, then scan it.';
      action.disabled = false;
    } catch (error) {
      const message = error.name === 'NotAllowedError' || error.name === 'SecurityError'
        ? 'Camera permission was denied. Allow camera access for this site, then try again.'
        : error.name === 'NotFoundError'
          ? 'No camera was found on this device.'
          : error instanceof Error
            ? `Could not start the camera: ${error.message}`
            : 'Could not start the camera. Check browser permissions and try again.';
      status.textContent = message;
    }
  }

  async function runDumpVerification(session, overlay) {
    if (session.busy || state.dumpVerification !== session) return;
    session.busy = true;
    const action = overlay.querySelector('.dump-verify-action');
    const status = overlay.querySelector('.dump-verification-status');
    const video = overlay.querySelector('.dump-camera-video');
    action.disabled = true;

    try {
      const verifyWasteFrame = window.parent.ecoQuestVerifyWasteFrame;
      if (typeof verifyWasteFrame !== 'function') {
        throw new Error('AI detection is unavailable. Open the map from the EcoQuest app and retry.');
      }

      if (session.stage === 'detect') {
        status.textContent = 'AI is checking the live camera for a waste item…';
        const detections = await verifyWasteFrame(video);
        const match = detections.find(item =>
          item.confidence >= 0.35 && isRecognizableWasteItem(item.label)
        );
        if (!match) {
          status.textContent = 'No recognizable waste item found. Center a bottle, paper, or food item and scan again.';
          return;
        }

        session.detectedLabel = match.label;
        session.stage = 'verify';
        status.textContent = `AI detected ${match.label}. Place it in the bin, then check that it leaves the camera view.`;
        action.innerHTML = '<i class="fa-solid fa-recycle"></i> VERIFY DISPOSAL';
      } else {
        status.textContent = `Checking whether the ${session.detectedLabel} is still visible…`;
        let itemStillVisible = false;
        for (let attempt = 0; attempt < 3; attempt++) {
          await delay(450);
          const detections = await verifyWasteFrame(video);
          if (detections.some(item =>
            item.label.toLowerCase() === session.detectedLabel.toLowerCase() && item.confidence >= 0.35
          )) {
            itemStillVisible = true;
            break;
          }
        }

        if (itemStillVisible) {
          status.textContent = 'The item is still visible. Put it in the bin and try verification again.';
          return;
        }

        const navigation = state.walkingNavigation;
        if (navigation.dumpRewarded) return;
        navigation.dumpRewarded = true;
        const rewardId = `${session.binId}-${Date.now()}`;
        window.parent.postMessage({
          type: 'ecoquest:digital-twin-reward',
          rewardId,
          pointsAwarded: 10
        }, window.location.origin);
        showDumpVerificationSuccess(session, overlay);
      }
    } catch (error) {
      status.textContent = error instanceof Error
        ? error.message
        : 'The live AI check failed. Check the camera and try again.';
    } finally {
      session.busy = false;
      if (state.dumpVerification === session && session.stage !== 'complete') action.disabled = false;
    }
  }

  function isRecognizableWasteItem(label) {
    return new Set([
      'apple', 'banana', 'book', 'bottle', 'broccoli', 'carrot', 'cake',
      'cup', 'donut', 'fork', 'hot dog', 'knife', 'orange', 'pizza',
      'sandwich', 'spoon', 'wine glass'
    ]).has(label.toLowerCase());
  }

  function showDumpVerificationSuccess(session, overlay) {
    session.stage = 'complete';
    if (session.stream) {
      session.stream.getTracks().forEach(track => track.stop());
      session.stream = null;
    }

    const bin = state.bins.find(item => item.id === session.binId);
    playSuccessTone();
    overlay.classList.add('dump-verification-overlay--success');
    overlay.innerHTML = `
      <div class="dump-success-burst" aria-hidden="true">
        ${Array.from({ length: 24 }, (_, index) => `<i style="--burst-index:${index}"></i>`).join('')}
        <span class="dump-success-check"><i class="fa-solid fa-check"></i></span>
      </div>
      <p class="dump-verification-eyebrow">VISUAL CHECK COMPLETE</p>
      <h2>Task Completed!</h2>
      <p>The ${escapeHtml(session.detectedLabel)} is no longer visible in the camera. The camera cannot confirm that it entered the bin.</p>
      <div class="dump-earned-points">+10 <span>EcoPoints</span></div>
      <p class="dump-total-points-note">Points added to your EcoQuest account.</p>
      <button class="dump-verify-action" type="button" onclick="window.twinMap.closeDumpVerification()">DONE</button>
    `;
    const marker = state.markers.get(session.binId);
    if (marker && bin) marker.setPopupContent(buildPopupHtml(bin, true));
  }

  function closeDumpVerification() {
    const session = state.dumpVerification;
    if (session?.stream) session.stream.getTracks().forEach(track => track.stop());
    state.dumpVerification = null;
    document.querySelector('.dump-verification-overlay')?.remove();
  }

  function updateUserMarker(location, accuracy = null) {
    if (!state.userMarker) {
      const userIcon = L.divIcon({
        html: '<div class="user-marker-container"><i class="fa-solid fa-person-walking"></i></div>',
        className: 'user-leaflet-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      state.userMarker = L.marker(location, { icon: userIcon, zIndexOffset: 1000 }).addTo(state.map);
    } else {
      state.userMarker.setLatLng(location);
    }

    if (Number.isFinite(accuracy) && accuracy >= 0) {
      if (!state.userAccuracyCircle) {
        state.userAccuracyCircle = L.circle(location, {
          radius: accuracy,
          color: '#00ff9d',
          weight: 1,
          opacity: 0.75,
          fillColor: '#00ff9d',
          fillOpacity: 0.12,
          interactive: false
        }).addTo(state.map);
      } else {
        state.userAccuracyCircle.setLatLng(location);
        state.userAccuracyCircle.setRadius(accuracy);
      }
    }
  }

  async function updateWalkingRoute(location) {
    const navigation = state.walkingNavigation;
    if (navigation.status === 'error' || navigation.status === 'arrived') return;
    const movedMeters = navigation.lastRoutedLocation
      ? calculateDistanceMeters(navigation.lastRoutedLocation, location)
      : Infinity;
    if (navigation.requestController || (movedMeters < 25 && Date.now() - navigation.lastRouteAt < 12000)) return;

    navigation.requestController = new AbortController();
    const requestId = ++navigation.requestId;
    navigation.status = navigation.route
      ? 'updating'
      : navigation.tracking
        ? 'routing'
        : 'previewing';
    renderWalkingNavigationPanel(
      navigation.lastRoutedLocation ? 'Updating route from your live location…' : 'Finding a walking route…'
    );

    try {
      const bin = navigation.bin;
      const url = `https://routing.openstreetmap.de/routed-foot/route/v1/driving/${location[1]},${location[0]};${bin.lng},${bin.lat}?overview=full&geometries=geojson&steps=true`;
      const response = await fetch(url, { signal: navigation.requestController.signal });
      if (!response.ok) throw new Error(`Walking route service returned ${response.status}.`);
      const data = await response.json();
      const route = data.routes?.[0];
      if (!route || !Array.isArray(route.geometry?.coordinates) || !route.legs?.[0]) {
        throw new Error('No pedestrian route was found to this dustbin.');
      }
      if (requestId !== navigation.requestId) return;

      const points = route.geometry.coordinates.map(([longitude, latitude]) => [latitude, longitude]);
      if (!state.citizenRouteLine) {
        state.citizenRouteLine = L.polyline(points, {
          color: PALETTE.optimal,
          weight: 6,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(state.map);
      } else {
        state.citizenRouteLine.setLatLngs(points);
      }
      state.citizenRouteLine.bringToFront();
      state.map.fitBounds(state.citizenRouteLine.getBounds(), {
        padding: [90, 90],
        maxZoom: 18,
        animate: true
      });

      navigation.lastRoutedLocation = location;
      navigation.lastRouteAt = Date.now();
      navigation.status = navigation.tracking ? 'active' : 'preview';
      navigation.route = route;
      navigation.remainingDistance = route.distance;
      navigation.currentStepIndex = 0;
      renderWalkingNavigationPanel();
    } catch (error) {
      if (error.name === 'AbortError' || requestId !== navigation.requestId) return;
      console.error('[Navigation] Could not fetch a walking route:', error);
      if (navigation.route && navigation.tracking) {
        navigation.status = 'active';
        renderWalkingNavigationPanel('Could not refresh the route; continuing with the current walking directions.');
      } else {
        navigation.status = 'error';
        renderWalkingNavigationPanel('Walking directions could not be loaded. Check your connection and retry.');
      }
    } finally {
      if (requestId === navigation.requestId) {
        navigation.requestController = null;
        if (
          navigation.tracking &&
          navigation.lastRoutedLocation &&
          calculateDistanceMeters(navigation.lastRoutedLocation, state.userLocation) >= 25
        ) {
          updateWalkingRoute(state.userLocation);
        }
      }
    }
  }

  function getRemainingWalkingDistance(route, location) {
    const coordinates = route.geometry.coordinates;
    if (coordinates.length < 2) return route.distance;

    const earthRadius = 6371000;
    const latitudeScale = Math.cos(location[0] * Math.PI / 180);
    const project = ([longitude, latitude]) => [
      earthRadius * longitude * Math.PI / 180 * latitudeScale,
      earthRadius * latitude * Math.PI / 180
    ];
    const userPoint = project([location[1], location[0]]);
    const projected = coordinates.map(project);
    const segmentLengths = [];
    let geometryLength = 0;

    for (let index = 0; index < projected.length - 1; index++) {
      const dx = projected[index + 1][0] - projected[index][0];
      const dy = projected[index + 1][1] - projected[index][1];
      const length = Math.hypot(dx, dy);
      segmentLengths.push(length);
      geometryLength += length;
    }

    let closestDistanceSquared = Infinity;
    let remainingAlongGeometry = geometryLength;
    let traversed = 0;

    for (let index = 0; index < segmentLengths.length; index++) {
      const start = projected[index];
      const end = projected[index + 1];
      const dx = end[0] - start[0];
      const dy = end[1] - start[1];
      const length = segmentLengths[index];
      const fraction = length === 0
        ? 0
        : Math.max(0, Math.min(1, ((userPoint[0] - start[0]) * dx + (userPoint[1] - start[1]) * dy) / (length * length)));
      const nearestX = start[0] + fraction * dx;
      const nearestY = start[1] + fraction * dy;
      const userDx = userPoint[0] - nearestX;
      const userDy = userPoint[1] - nearestY;
      const distanceSquared = userDx * userDx + userDy * userDy;

      if (distanceSquared < closestDistanceSquared) {
        closestDistanceSquared = distanceSquared;
        remainingAlongGeometry = geometryLength - traversed - fraction * length;
      }
      traversed += length;
    }

    return geometryLength > 0
      ? Math.max(0, remainingAlongGeometry * route.distance / geometryLength)
      : route.distance;
  }

  function advanceWalkingInstruction(navigation, location) {
    const steps = navigation.route?.legs[0]?.steps || [];
    const nextStep = steps[navigation.currentStepIndex];
    const nextManeuver = nextStep?.maneuver?.location;
    if (!nextManeuver || nextStep.maneuver.type === 'arrive') return;
    const distanceToManeuver = calculateDistanceMeters(location, [nextManeuver[1], nextManeuver[0]]);
    if (distanceToManeuver <= 25) {
      navigation.currentStepIndex = Math.min(navigation.currentStepIndex + 1, steps.length - 1);
    }
  }

  function getNextWalkingInstruction(route, stepIndex = 0, location = null) {
    const steps = route.legs[0].steps || [];
    const step = steps.slice(stepIndex).find(item => item.maneuver?.type !== 'depart') || steps[0];
    if (!step) return 'Follow the highlighted route to the dustbin.';
    if (step.maneuver?.type === 'arrive') return 'You are approaching the dustbin.';

    const modifier = step.maneuver?.modifier;
    const instruction = modifier
      ? `${modifier[0].toUpperCase()}${modifier.slice(1)}`
      : step.maneuver?.type === 'depart'
        ? 'Start walking'
        : 'Continue';
    const street = step.name ? ` onto ${escapeHtml(step.name)}` : '';
    const maneuverLocation = step.maneuver?.location;
    const distanceToStep = location && maneuverLocation
      ? calculateDistanceMeters(location, [maneuverLocation[1], maneuverLocation[0]])
      : step.distance;
    const distance = distanceToStep < 1000
      ? `${Math.round(distanceToStep)} m`
      : `${(distanceToStep / 1000).toFixed(1)} km`;
    return `${instruction}${street} in ${distance}`;
  }

  function renderWalkingNavigationPanel(message = '') {
    const navigation = state.walkingNavigation;
    const bin = navigation.bin;
    if (!bin) return;

    let panel = document.getElementById('walking-navigation-panel');
    if (!panel) {
      panel = document.createElement('section');
      panel.id = 'walking-navigation-panel';
      panel.className = 'walking-navigation-panel';
      panel.setAttribute('aria-live', 'polite');
      document.querySelector('.map-workspace').appendChild(panel);
    }

    const route = navigation.route;
    const remainingDistance = navigation.remainingDistance ?? route?.distance ?? null;
    const remainingSeconds = route && remainingDistance !== null
      ? Math.max(0, route.duration * remainingDistance / Math.max(1, route.distance))
      : null;
    const eta = navigation.status === 'arrived'
      ? 'Arrived'
      : remainingSeconds !== null
        ? `${Math.max(1, Math.ceil(remainingSeconds / 60))} min`
        : '—';
    const distance = remainingDistance !== null
      ? remainingDistance < 1000
        ? `${Math.round(remainingDistance)} m`
        : `${(remainingDistance / 1000).toFixed(1)} km`
      : '—';
    const instruction = route
      ? navigation.status === 'preview'
        ? `Route ready. ${getNextWalkingInstruction(route, navigation.currentStepIndex, state.hasLiveLocation ? state.userLocation : null)}`
        : getNextWalkingInstruction(route, navigation.currentStepIndex, state.hasLiveLocation ? state.userLocation : null)
      : message;
    const status = navigation.status === 'active'
      ? 'LIVE WALKING DIRECTIONS'
      : navigation.status === 'updating'
        ? 'UPDATING ROUTE'
        : navigation.status === 'preview'
          ? 'WALKING ROUTE READY'
          : navigation.status === 'previewing' || navigation.status === 'routing'
            ? 'FINDING WALKING ROUTE'
        : navigation.status === 'arrived'
          ? 'DESTINATION REACHED'
          : navigation.status === 'error'
            ? 'ROUTE NEEDS ATTENTION'
            : 'LOCATING YOU';
    const origin = state.hasLiveLocation
      ? `&origin=${state.userLocation[0]},${state.userLocation[1]}`
      : '';
    const externalDirections = `https://www.google.com/maps/dir/?api=1&destination=${bin.lat},${bin.lng}${origin}&travelmode=walking`;

    panel.innerHTML = `
      <div class="walking-navigation-header">
        <div>
          <span class="walking-navigation-status">${status}</span>
          <h2>${eta}</h2>
          <span class="walking-navigation-destination">${escapeHtml(bin.name)} · ${distance}</span>
        </div>
        <button class="navigation-close" type="button" aria-label="End walking directions" onclick="window.twinMap.closeCitizenRoute()">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="walking-navigation-instruction">
        <i class="fa-solid ${navigation.status === 'arrived' ? 'fa-circle-check' : navigation.status === 'error' ? 'fa-location-crosshairs' : 'fa-person-walking'}"></i>
        <span>${instruction}</span>
      </div>
      ${navigation.status === 'preview' ? `
        <button class="walking-navigation-start" type="button" onclick="window.twinMap.startWalkingTracking()">
          <i class="fa-solid fa-person-walking"></i> Start walking
        </button>
      ` : ''}
      ${navigation.status === 'error' ? `
        <div class="walking-navigation-actions">
          <button type="button" onclick="window.twinMap.retryWalkingRoute('${escapeHtml(bin.id)}')">Retry location & route</button>
          <a href="${externalDirections}" target="_blank" rel="noopener noreferrer">Open Google Maps</a>
        </div>
      ` : ''}
    `;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
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
        <span class="route-title"><i class="fa-solid fa-route"></i> Green Walking Route</span>
        <button class="modal-close-btn" onclick="window.twinMap.closeCitizenRoute()">
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
          <span class="route-stat-desc">CO₂ Saved</span>
        </div>
      </div>

      <div class="route-steps-text">
        <strong>Destination:</strong> ${bin.name} (${bin.id})<br/>
        <span style="font-size: 0.72rem; color: var(--text-muted);">${bin.block} • Status: ${bin.fillLevel}%</span>
      </div>

      <button class="btn-glow green" onclick="window.twinMap.simulateArrival('${bin.id}')">
        <i class="fa-solid fa-circle-check"></i> Arrived at Station
      </button>
    `;

    showToast(`Route active: ${bin.name} (${distanceMeters}m away)`);
  }

  function simulateArrival(binId) {
    playSuccessTone();
    const bin = state.bins.find(b => b.id === binId);
    showToast(`Arrived at ${bin ? bin.name : 'destination'}! Dispose waste safely.`);
    if (bin) simulateDisposalEvent(bin.id, 15);
    closeCitizenRoute();
  }

  function closeCitizenRoute() {
    closeDumpVerification();
    const navigation = state.walkingNavigation;
    document.getElementById('walking-destination-screen')?.remove();
    if (state.walkingDestinationKeyHandler) {
      window.removeEventListener('keydown', state.walkingDestinationKeyHandler);
      state.walkingDestinationKeyHandler = null;
    }
    if (navigation.animationFrame !== null) {
      cancelAnimationFrame(navigation.animationFrame);
      navigation.animationFrame = null;
    }
    if (navigation.watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(navigation.watchId);
    }
    if (navigation.requestController) navigation.requestController.abort();
    navigation.watchId = null;
    navigation.requestController = null;
    navigation.requestId++;
    navigation.locationRequestId++;
    navigation.bin = null;
    navigation.route = null;
    navigation.remainingDistance = null;
    navigation.currentStepIndex = 0;
    navigation.lastRoutedLocation = null;
    navigation.tracking = false;
    navigation.arrivalId = null;
    navigation.arrivalRewarded = false;
    navigation.status = 'idle';
    const previousNearestBinId = state.nearestBinId;
    state.nearestBinId = null;
    if (previousNearestBinId) {
      const marker = state.markers.get(previousNearestBinId);
      const bin = state.bins.find(item => item.id === previousNearestBinId);
      if (marker && bin) {
        marker.setIcon(createBinMarkerIcon(bin));
        marker.setZIndexOffset(0);
      }
    }
    document.getElementById('app-container').classList.remove('navigation-active');
    const navigationPanel = document.getElementById('walking-navigation-panel');
    if (navigationPanel) navigationPanel.remove();
    requestAnimationFrame(() => state.map.invalidateSize({ pan: false }));
    const overlay = document.getElementById('citizen-route-panel');
    if (overlay) overlay.style.display = 'none';
    if (state.citizenRouteLine) {
      state.map.removeLayer(state.citizenRouteLine);
      state.citizenRouteLine = null;
    }
  }

  function setControlsOpen(isOpen) {
    const container = document.getElementById('app-container');
    const toggle = document.getElementById('btn-toggle-controls');
    container.classList.toggle('controls-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close Control Center' : 'Open Control Center');
    toggle.title = isOpen ? 'Close Control Center' : 'Open Control Center';
    if (isOpen) {
      document.getElementById('btn-close-controls').focus();
    } else {
      toggle.focus();
    }
    requestAnimationFrame(() => state.map.invalidateSize({ pan: false }));
  }

  function calculateDistanceMeters(coord1, coord2) {
    const R = 6371e3;
    const phi1 = (coord1[0] * Math.PI) / 180;
    const phi2 = (coord2[0] * Math.PI) / 180;
    const deltaPhi = ((coord2[0] - coord1[0]) * Math.PI) / 180;
    const deltaLambda = ((coord2[1] - coord1[1]) * Math.PI) / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // --------------------------------------------------------------------------
  // EVENT LISTENERS & FILTERS
  // --------------------------------------------------------------------------
  function getFilteredBins() {
    return state.bins.filter(bin => {
      if (state.filters.search) {
        const q = state.filters.search.toLowerCase();
        const matches = bin.id.toLowerCase().includes(q) || bin.name.toLowerCase().includes(q) || bin.block.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (state.filters.wasteType !== 'all') {
        if (bin.wasteType.toLowerCase() !== state.filters.wasteType.toLowerCase()) return false;
      }
      if (state.filters.status !== 'all') {
        if (state.filters.status === 'critical' && bin.fillLevel <= 80) return false;
        if (state.filters.status === 'warning' && (bin.fillLevel <= 50 || bin.fillLevel > 80)) return false;
        if (state.filters.status === 'normal' && bin.fillLevel > 50) return false;
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
    const controlsToggle = document.getElementById('btn-toggle-controls');
    const controlsClose = document.getElementById('btn-close-controls');
    const controlsBackdrop = document.getElementById('controls-backdrop');
    controlsToggle.addEventListener('click', () => {
      setControlsOpen(!document.getElementById('app-container').classList.contains('controls-open'));
    });
    controlsClose.addEventListener('click', () => setControlsOpen(false));
    controlsBackdrop.addEventListener('click', () => setControlsOpen(false));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && document.getElementById('app-container').classList.contains('controls-open')) {
        setControlsOpen(false);
      }
    });

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
      startWalkingNavigation(bin);
    },
    retryWalkingRoute: binId => {
      const bin = state.bins.find(item => item.id === binId);
      if (bin) startWalkingNavigation(bin);
    },
    startWalkingTracking: beginWalkingTracking,
    startDumpVerification: startDumpVerification,
    closeDumpVerification: closeDumpVerification,
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
