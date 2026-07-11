import { useEffect, useRef, useState } from "react";
import { Cpu, Globe, RefreshCw, Radio } from "lucide-react";
import toast from "react-hot-toast";

export default function LiveWorldMap({ nodes = [], selectedNode = null, onSelectNode = () => {} }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const markerGroupRef = useRef(null);
  const polylineGroupRef = useRef(null);
  
  // Real world coordinates & metadata registry for mock nodes
  const [resolvedCoords, setResolvedCoords] = useState({
    host: {
      coords: [23.0225, 72.5714], // Gujarat, India
      city: "Gujarat",
      region: "Gujarat",
      country: "India",
      isp: "Jio Fiber Network (Core Host)"
    },
    "node-1": {
      coords: [38.9072, -77.0369], // Washington DC
      city: "Washington D.C.",
      region: "District of Columbia",
      country: "United States",
      isp: "Amazon Web Services (Validator Node)"
    },
    "node-2": {
      coords: [50.1109, 8.6821], // Frankfurt
      city: "Frankfurt",
      region: "Hesse",
      country: "Germany",
      isp: "DigitalOcean LLC (Anchor Node)"
    },
    "node-3": {
      coords: [12.9716, 77.5946], // Bangalore
      city: "Bangalore",
      region: "Karnataka",
      country: "India",
      isp: "Tata Communications (Peer Node)"
    },
    "node-4": {
      coords: [-23.5505, -46.6333], // Sao Paulo
      city: "São Paulo",
      region: "São Paulo",
      country: "Brazil",
      isp: "Claro Brasil (Syncing Peer)"
    }
  });

  // Helper to validate coordinates layout
  const isValidCoords = (c) => {
    return Array.isArray(c) && 
           c.length === 2 && 
           typeof c[0] === 'number' && !isNaN(c[0]) &&
           typeof c[1] === 'number' && !isNaN(c[1]);
  };

  // Robust multi-provider geolocation fetcher to bypass rate limits (tries ipapi -> ip-api -> ipinfo)
  const geolocateIP = async (ip) => {
    // 1. Try ipapi.co
    try {
      const url = ip ? `https://ipapi.co/${ip}/json/` : `https://ipapi.co/json/`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.latitude && data.longitude) {
          return {
            coords: [data.latitude, data.longitude],
            city: data.city || "Unknown",
            region: data.region || "Unknown",
            country: data.country_name || "Unknown",
            isp: data.org || "Jio Network"
          };
        }
      }
    } catch (e) {}

    // 2. Try ip-api.com (Works perfectly in HTTP dev servers, has high rate-limits)
    try {
      const url = ip ? `http://ip-api.com/json/${ip}` : `http://ip-api.com/json/`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.status === "success" && data.lat && data.lon) {
          return {
            coords: [data.lat, data.lon],
            city: data.city || "Unknown",
            region: data.regionName || "Unknown",
            country: data.country || "Unknown",
            isp: data.isp || "Network Provider"
          };
        }
      }
    } catch (e) {}

    // 3. Try ipinfo.io as last resort
    try {
      const url = ip ? `https://ipinfo.io/${ip}/json` : `https://ipinfo.io/json`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.loc) {
          const [lat, lng] = data.loc.split(",").map(Number);
          return {
            coords: [lat, lng],
            city: data.city || "Unknown",
            region: data.region || "Unknown",
            country: data.country || "Unknown",
            isp: data.org || "Network Provider"
          };
        }
      }
    } catch (e) {}

    return null;
  };

  // Helper to get coordinates for any node (resolves real IP geolocation or fallback)
  const getCoordinates = (node) => {
    if (!node) return resolvedCoords.host.coords;
    const nodeId = node.id || "";
    if (nodeId === "host") return resolvedCoords.host.coords;
    
    // Check if real-world IP coordinates have resolved first
    const resolved = resolvedCoords[nodeId]?.coords;
    if (isValidCoords(resolved)) return resolved;
    
    // Fallback: generate deterministic coordinates based on the IP address string
    const ip = node.address || "";
    let hash = 0;
    for (let i = 0; i < ip.length; i++) {
      hash = ip.charCodeAt(i) + ((hash << 5) - hash);
    }
    const lat = ((hash % 90) * 1) + (hash % 2 === 0 ? 10 : -10);
    const lng = ((hash % 180) * 1) + (hash % 3 === 0 ? 20 : -20);
    return [Math.max(-60, Math.min(70, lat)), lng];
  };

  // Geolocation effect to query real locations of the IPs dynamically
  useEffect(() => {
    if (!leafletLoaded) return;

    // Filter nodes that are not host and don't have resolved coordinates/metadata yet
    const lookupNodes = nodes.filter(n => n && n.id !== "host" && !resolvedCoords[n.id]);
    if (lookupNodes.length === 0) return;

    lookupNodes.forEach(async (node) => {
      const address = node.address || "";
      const ipOnly = address.split(":")[0].trim();
      
      // Skip lookup for local private IPs/localhost
      if (
        ipOnly === "127.0.0.1" || 
        ipOnly === "localhost" || 
        ipOnly.startsWith("192.168.") || 
        ipOnly.startsWith("10.") ||
        ipOnly.startsWith("172.16.") ||
        ipOnly.startsWith("172.31.")
      ) {
        return;
      }

      const geo = await geolocateIP(ipOnly);
      if (geo) {
        setResolvedCoords(prev => ({
          ...prev,
          [node.id]: geo
        }));
      }
    });
  }, [nodes, leafletLoaded, resolvedCoords]);

  // Query actual Host public IP location on mount to map user's location dynamically
  useEffect(() => {
    const fetchHostLocation = async () => {
      const geo = await geolocateIP();
      if (geo) {
        setResolvedCoords(prev => ({
          ...prev,
          host: geo
        }));
      }
    };
    fetchHostLocation();
  }, []);

  // 1. Dynamic script loading for Leaflet to prevent bundle/React-19 conflicts
  useEffect(() => {
    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(cssLink);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => {
      if (window.L) {
        setLeafletLoaded(true);
      } else {
        let retries = 0;
        const interval = setInterval(() => {
          if (window.L) {
            setLeafletLoaded(true);
            clearInterval(interval);
          } else if (retries++ > 5) {
            setLoadingError(true);
            clearInterval(interval);
          }
        }, 150);
      }
    };
    script.onerror = () => {
      setLoadingError(true);
    };
    document.body.appendChild(script);
  }, []);

  // 2. Initialize Map Instance
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;

    const L = window.L;
    if (!L) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      setMapInitialized(false);
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: [20, 0],
        zoom: 2,
        minZoom: 1.5,
        maxZoom: 10,
        zoomControl: false,
        attributionControl: false
      });

      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 20
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      markerGroupRef.current = L.layerGroup().addTo(map);
      polylineGroupRef.current = L.layerGroup().addTo(map);

      setMapInitialized(true);
    } catch (e) {
      console.error("Leaflet map initialization error:", e);
      setLoadingError(true);
    }

    return () => {
      setMapInitialized(false);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {}
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded]);

  // 3. Update Markers & Connections dynamically on Node changes
  useEffect(() => {
    if (!mapInitialized || !mapInstanceRef.current) return;
    if (!markerGroupRef.current || !polylineGroupRef.current) return;

    const L = window.L;
    if (!L) return;
    const map = mapInstanceRef.current;
    
    markerGroupRef.current.clearLayers();
    polylineGroupRef.current.clearLayers();

    const hostCoords = resolvedCoords.host.coords;
    if (!isValidCoords(hostCoords)) return;

    const createCustomIcon = (color, isHost) => {
      const size = isHost ? 24 : 16;
      return L.divIcon({
        className: "custom-leaflet-icon",
        html: `
          <div style="
            width: ${size}px; 
            height: ${size}px; 
            border-radius: 50%; 
            background: rgba(15, 23, 42, 0.9); 
            border: 2px solid ${color}; 
            box-shadow: 0 0 10px ${color}; 
            display: flex; 
            align-items: center; 
            justify-content: center;
          ">
            <div style="
              width: ${isHost ? 8 : 6}px; 
              height: ${isHost ? 8 : 6}px; 
              border-radius: 50%; 
              background: ${color};
              ${isHost ? 'animation: pulse 1.5s infinite alternate;' : ''}
            "></div>
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      });
    };

    const hostIcon = createCustomIcon("#06b6d4", true);
    const peerIcon = createCustomIcon("#8b5cf6", false);

    // Render Host Core Marker
    const hostMarker = L.marker(hostCoords, { icon: hostIcon })
      .addTo(markerGroupRef.current)
      .on("click", () => {
        onSelectNode({
          name: "Local Host Console",
          address: "127.0.0.1:8080",
          latency: 0,
          status: "ONLINE",
          id: "host",
          city: resolvedCoords.host.city,
          region: resolvedCoords.host.region,
          country: resolvedCoords.host.country,
          isp: resolvedCoords.host.isp
        });
      });

    hostMarker.bindTooltip("HOST CORE (NEW YORK)", {
      direction: "top",
      className: "leaflet-node-tooltip"
    });

    // Render Peer Markers
    nodes.forEach(node => {
      if (!node || !node.id) return;
      const coords = getCoordinates(node);
      if (!isValidCoords(coords)) return;

      const meta = resolvedCoords[node.id] || {};

      const marker = L.marker(coords, { icon: peerIcon })
        .addTo(markerGroupRef.current)
        .on("click", () => {
          // Merge metadata directly so parent component can render it
          onSelectNode({
            ...node,
            city: meta.city || "Unknown Location",
            region: meta.region || "Unknown Region",
            country: meta.country || "Unknown Country",
            isp: meta.isp || "Geolocated Peer"
          });
        });

      marker.bindTooltip(`${node.name.toUpperCase()} (${node.latency}ms)`, {
        direction: "top",
        className: "leaflet-node-tooltip"
      });

      // Draw connection lines to host with pulsing dash offset animation
      const isSyncing = node.status === "SYNCING";
      const lineOpts = {
        color: isSyncing ? "#8b5cf6" : "#06b6d4",
        weight: 1.5,
        opacity: 0.6,
        dashArray: "6, 6",
        className: "syncing-polyline"
      };

      L.polyline([coords, hostCoords], lineOpts).addTo(polylineGroupRef.current);
    });

  }, [mapInitialized, nodes, resolvedCoords]);

  // 4. Pan to selected node on change
  useEffect(() => {
    if (!mapInitialized || !mapInstanceRef.current || !selectedNode) return;
    
    const coords = selectedNode.id === "host" ? resolvedCoords.host.coords : getCoordinates(selectedNode);
    if (!isValidCoords(coords)) return;
    
    mapInstanceRef.current.setView(coords, 4, { animate: true });
  }, [selectedNode, mapInitialized]);

  // Initiates radar ripple expanding sweep from host
  const runPingSweep = () => {
    const L = window.L;
    if (!mapInstanceRef.current || !L) return;
    const map = mapInstanceRef.current;
    
    toast("Initiating geographic latency probe sweep...", { icon: "📡" });
    
    const sweepCircle = L.circle(resolvedCoords.host.coords, {
      radius: 10000,
      color: "#06b6d4",
      fillColor: "#06b6d4",
      fillOpacity: 0.15,
      weight: 1.5
    }).addTo(map);

    let radius = 10000;
    const interval = setInterval(() => {
      radius += 180000;
      sweepCircle.setRadius(radius);
      sweepCircle.setStyle({
        fillOpacity: Math.max(0, 0.15 - (radius / 6000000)),
        opacity: Math.max(0, 1 - (radius / 6000000))
      });
      
      if (radius > 6000000) {
        clearInterval(interval);
        try {
          map.removeLayer(sweepCircle);
        } catch (e) {}
      }
    }, 25);
  };

  if (loadingError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center font-mono text-xs text-slate-500 gap-2">
        <Globe className="w-8 h-8 text-cyber-rose animate-bounce" />
        <span>Failed to load geographic mapping services.</span>
      </div>
    );
  }

  if (!leafletLoaded) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center font-mono text-xs text-slate-500 gap-3">
        <RefreshCw className="w-8 h-8 text-cyber-cyan animate-spin" />
        <span>Initializing satellite coordinate mapping overlay...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden border border-white/5 bg-slate-950">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      
      {/* Radar sweep trigger button overlay */}
      <button
        onClick={runPingSweep}
        className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-lg border border-cyber-cyan/30 bg-[#020617]/90 hover:bg-[#090d16] font-mono text-[9px] font-bold text-cyber-cyan tracking-wider flex items-center gap-1.5 transition-all shadow-md cursor-pointer hover:shadow-cyan-glow"
      >
        <Radio className="w-3.5 h-3.5 animate-pulse" /> PROBE PING SWEEP
      </button>

      {/* Global map styles to override Leaflet default popups/styling with cyberpunk aesthetic */}
      <style>{`
        .leaflet-container {
          background: #020617 !important;
        }
        .leaflet-node-tooltip {
          background: rgba(15, 23, 42, 0.95) !important;
          border: 1px solid rgba(6, 182, 212, 0.2) !important;
          color: #f1f5f9 !important;
          font-family: 'JetBrains Mono', monospace !important;
          font-size: 9px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
          border-radius: 6px !important;
          padding: 4px 8px !important;
        }
        .leaflet-node-tooltip::before {
          border-top-color: rgba(6, 182, 212, 0.2) !important;
        }
        .syncing-polyline {
          animation: leaflet-dash-flow 1.2s linear infinite !important;
        }
        @keyframes leaflet-dash-flow {
          to {
            stroke-dashoffset: -24;
          }
        }
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.7; }
          100% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
