// src/pages/Home.tsx
import React, { useEffect, useRef, useState } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import axios from "axios";
import "../Styles/Home.css";
import SidebarAuth from "../Pages/SiderBarAuth"; // 🔹 Ajusta ruta si cambia

type LatLng = [number, number];

const TOMTOM_KEY = "j61cU0eEQvodLFnjgRRcWvA2pX94KWzA";

// 🔹 Tipos de reportes permitidos
const REPORT_TYPES: Record<string, string> = {
  RETEN: "reten",
  CALLE_DANIADA: "calle dañada",
  TRAFICO_EXTENSO: "trafico extenso",
  ACCIDENTE: "accidente",
  OTRO: "otro",
};

// 🔹 Asociar emojis a cada tipo
const REPORT_EMOJIS: Record<string, string> = {
  [REPORT_TYPES.RETEN]: "🚓",
  [REPORT_TYPES.CALLE_DANIADA]: "🛠️",
  [REPORT_TYPES.TRAFICO_EXTENSO]: "🚦",
  [REPORT_TYPES.ACCIDENTE]: "💥",
  [REPORT_TYPES.OTRO]: "⚠️",
};

const Home: React.FC = () => {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);

  const originRef = useRef<LatLng | null>(null);
  const destRef = useRef<LatLng | null>(null);

  const [origin, setOrigin] = useState<LatLng | null>(null);
  const [dest, setDest] = useState<LatLng | null>(null);

  const markersRef = useRef<any[]>([]);
  const trafficMarkersRef = useRef<any[]>([]);
  const reportMarkersRef = useRef<any[]>([]);
  const routeLayerRef = useRef<any>(null);

  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  // Inicializar mapa
  useEffect(() => {
    if (mapRef.current || !mapElement.current) return;

    mapRef.current = tt.map({
      key: TOMTOM_KEY,
      container: mapElement.current,
      center: [-77.285, 1.214], // Pasto (lng,lat)
      zoom: 14,
    });

    if (token) {
      setIsLogged(true);
      const storedUser = localStorage.getItem("username"); // 🔹 Guardado al hacer login
      if (storedUser) setUsername(storedUser);
    }

    const onMapClick = (e: any) => {
      if (!mapRef.current) return;
      if (originRef.current && destRef.current) return;

      const coords: LatLng = [e.lngLat.lng, e.lngLat.lat];

      if (!originRef.current) {
        originRef.current = coords;
        setOrigin(coords);
        const m = new tt.Marker({ color: "green" }).setLngLat(coords).addTo(mapRef.current);
        markersRef.current.push(m);
      } else if (!destRef.current) {
        destRef.current = coords;
        setDest(coords);
        const m = new tt.Marker({ color: "red" }).setLngLat(coords).addTo(mapRef.current);
        markersRef.current.push(m);
      }
    };

    mapRef.current.on("click", onMapClick);

    // 🔹 Al cargar el mapa, traemos reportes iniciales
    fetchReports();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Traer reportes del backend
  const fetchReports = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/reportes");
      data.forEach((report: any) => {
        placeReportMarker(report.type, report.longitude, report.latitude, report.user?.name);
      });
    } catch (err) {
      console.error("Error cargando reportes:", err);
    }
  };

  // 🔹 Crear marcador con emoji
  const placeReportMarker = (type: string, lng: number, lat: number, user?: string) => {
    if (!mapRef.current) return;

    const el = document.createElement("div");
    el.className = "emoji-marker";
    el.innerText = REPORT_EMOJIS[type] || "📍";

    const marker = new tt.Marker({ element: el })
      .setLngLat([lng, lat])
      .setPopup(
        new tt.Popup().setHTML(
          `<b>Reporte:</b> ${type}<br/>${user ? `<b>Usuario:</b> ${user}` : ""}`
        )
      )
      .addTo(mapRef.current);

    reportMarkersRef.current.push(marker);
  };

  // Registrar reporte
  const registerReport = async (type: string, lng: number, lat: number) => {
    if (!token) {
      alert("Debes iniciar sesión para registrar un reporte");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/reportes",
        {
          type,
          latitude: lat,
          longitude: lng,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🔹 Importante
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Reporte guardado:", data);

      placeReportMarker(type, lng, lat, username || "Anónimo");
      alert("✅ Reporte registrado con éxito");
    } catch (err: any) {
      console.error("Error guardando reporte:", err.response?.data || err);
      alert("❌ No se pudo registrar el reporte. Verifica el login y token.");
    }
  };

  // Drag & Drop
  const onDragStart = (e: React.DragEvent<HTMLDivElement>, type: string) => {
    e.dataTransfer.setData("reportType", type);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isLogged) {
      alert("Debes iniciar sesión para reportar");
      return;
    }

    e.preventDefault();
    const type = e.dataTransfer.getData("reportType");

    if (!mapRef.current) return;
    const rect = mapElement.current?.getBoundingClientRect();
    if (!rect) return;

    const lngLat = mapRef.current.unproject([
      e.clientX - rect.left,
      e.clientY - rect.top,
    ]);

    registerReport(type, lngLat.lng, lngLat.lat);
  };

  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  // Ruta + tráfico + reportes
  const fetchRuta = async () => {
    if (!originRef.current || !destRef.current) return;

    // 🔹 Limpiar tráfico y reportes anteriores
    trafficMarkersRef.current.forEach((m) => m.remove());
    trafficMarkersRef.current = [];

    reportMarkersRef.current.forEach((m) => m.remove());
    reportMarkersRef.current = [];

    if (routeLayerRef.current) {
      mapRef.current.removeLayer("route");
      mapRef.current.removeSource("route");
      routeLayerRef.current = null;
    }

    try {
      // 1️⃣ Ruta desde TomTom
      const routingUrl = `https://api.tomtom.com/routing/1/calculateRoute/${originRef.current[1]},${originRef.current[0]}:${destRef.current[1]},${destRef.current[0]}/json?key=${TOMTOM_KEY}`;
      const routeRes = await axios.get(routingUrl);

      const geojson = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: routeRes.data.routes[0].legs[0].points
              ? {
                  type: "LineString",
                  coordinates: routeRes.data.routes[0].legs[0].points.map(
                    (p: any) => [p.longitude, p.latitude]
                  ),
                }
              : { type: "LineString", coordinates: [] },
          },
        ],
      };

      mapRef.current.addSource("route", { type: "geojson", data: geojson });
      mapRef.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        paint: {
          "line-color": "blue",
          "line-width": 5,
        },
      });

      routeLayerRef.current = "route";

      // 2️⃣ Tráfico desde tu backend
      const url = `http://localhost:3000/api/ruta?origen=${originRef.current[0]},${originRef.current[1]}&destino=${destRef.current[0]},${destRef.current[1]}`;
      const { data } = await axios.get(url);

      if (data?.trafico && mapRef.current) {
        data.trafico.forEach((p: any) => {
          const lng = parseFloat(p.lng);
          const lat = parseFloat(p.lat);

          const marker = new tt.Marker({ color: "orange" })
            .setLngLat([lng, lat])
            .setPopup(
              new tt.Popup().setHTML(
                `<div><b>Velocidad:</b> ${p.velocidad}<br/><b>Congestión:</b> ${p.nivelCongestion}</div>`
              )
            )
            .addTo(mapRef.current);

          trafficMarkersRef.current.push(marker);
        });
      }

      // 3️⃣ Reportes desde la BD
      const reportesRes = await axios.get("http://localhost:3000/api/reportes");
      const reportes = reportesRes.data;

      reportes.forEach((r: any) => {
        placeReportMarker(r.type, r.longitude, r.latitude, r.user?.name);
      });
    } catch (err: any) {
      console.error("Error obteniendo ruta:", err);
      alert("Error obteniendo ruta: " + (err?.message || err));
    }
  };

  // Resetear mapa
  const resetMap = () => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    trafficMarkersRef.current.forEach((m) => m.remove());
    trafficMarkersRef.current = [];
    reportMarkersRef.current.forEach((m) => m.remove());
    reportMarkersRef.current = [];
    originRef.current = null;
    destRef.current = null;
    setOrigin(null);
    setDest(null);

    if (routeLayerRef.current) {
      mapRef.current.removeLayer("route");
      mapRef.current.removeSource("route");
      routeLayerRef.current = null;
    }
  };

  return (
    <div className="home-container">
      <SidebarAuth />

      {/* 🔹 Mostrar usuario logueado */}
      {isLogged && username && (
        <div className="user-info">
          👤 Bienvenido, <b>{username}</b>
        </div>
      )}

      {/* 🔹 Zona de arrastre con emojis */}
      <div className="report-icons">
        {Object.values(REPORT_TYPES).map((type) => (
          <div
            key={type}
            className="report-icon"
            draggable
            onDragStart={(e) => onDragStart(e, type)}
          >
            {REPORT_EMOJIS[type] || "📍"} {type}
          </div>
        ))}
      </div>

      {/* 🔹 Mapa con drop */}
      <div
        ref={mapElement}
        className="map"
        onDrop={onDrop}
        onDragOver={allowDrop}
      />

      {origin && dest && (
        <button onClick={fetchRuta} className="btn btn-primary">
          Mostrar ruta y tráfico
        </button>
      )}

      <button onClick={resetMap} className="btn btn-danger">
        Reiniciar
      </button>

      <div className="instructions">
        Haz click para colocar <b>origen</b> (verde) y luego <b>destino</b> (rojo).
        <br />
        Arrastra un ícono para reportar en el mapa (si estás logueado).
      </div>
    </div>
  );
};

export default Home;
