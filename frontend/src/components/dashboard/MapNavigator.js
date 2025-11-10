import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useOutletContext } from 'react-router-dom';

import LibrarySearch from './LibrarySearch';
import BlockInfoPopup from './BlockInfoPopup';

// --- Updated styles for bottom-right scrollable popup ---
const styles = `
  .map-page-container {
    position: relative; 
    width: 100%;
    height: 100%;
  }

  .map-container {
    width: 100%;
    height: 100%;
    border-radius: 0.75rem;
  }

  /* --- BOTTOM RIGHT FLOATING PANEL --- */
  .info-panel {
    position: absolute;
    bottom: 20px; /* ⬅️ anchored to bottom */
    right: 20px;  /* ⬅️ anchored to right */

    width: 320px;
    max-height: 60%; /* prevents it from covering the full map height */
    background-color: white;
    z-index: 1000;
    border-radius: 0.75rem;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 
                0 4px 6px -4px rgb(0 0 0 / 0.1);
    
    overflow-y: auto; /* ⬅️ makes it scrollable */
    display: flex;
    flex-direction: column;
    scrollbar-width: thin; /* optional nice scrollbar */
    scrollbar-color: #888 #f0f0f0;
  }

  .info-panel::-webkit-scrollbar {
    width: 8px;
  }
  .info-panel::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 8px;
  }
  .info-panel::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 8px;
  }
`;

let DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

const MapNavigator = () => {
  const { destination, setDestination } = useOutletContext();
  const [userPosition, setUserPosition] = useState(null);
  const [path, setPath] = useState([]);

  const getRoute = useCallback(async (start, end) => {
    const url = `https://router.project-osrm.org/route/v1/walking/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const routeGeometry = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
        setPath(routeGeometry);
      } else {
        setPath([]);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      setPath([]);
    }
  }, []);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newPos = [position.coords.latitude, position.coords.longitude];
        setUserPosition(newPos);
      },
      () => {
        setUserPosition([16.233, 80.550]);
      },
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (destination && userPosition) {
      getRoute(userPosition, destination.coords);
    } else {
      setPath([]);
    }
  }, [destination, userPosition, getRoute]);

  const renderPanelContent = () => {
    if (!destination) return null;
    switch (destination.type) {
      case 'library':
        return <LibrarySearch />;
      case 'block':
        return <BlockInfoPopup blockName={destination.name} onClose={() => setDestination(null)} />;
      default:
        return (
          <div style={{ padding: '1.5rem' }}>
            <h4>{destination.name}</h4>
            <p>Details for this location are coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="map-page-container">
      <style>{styles}</style>
      <MapContainer
        center={userPosition || [16.233, 80.550]}
        zoom={17}
        className="map-container"
      >
        <ChangeView center={destination ? destination.coords : userPosition} zoom={17} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {userPosition && <Marker position={userPosition}><Popup>You are here</Popup></Marker>}
        {destination && <Marker position={destination.coords} />}
        {path.length > 0 && <Polyline pathOptions={{ color: '#0057e7', weight: 6 }} positions={path} />}
      </MapContainer>

      {destination && (
        <div className="info-panel">
          {renderPanelContent()}
        </div>
      )}
    </div>
  );
};

export default MapNavigator;
