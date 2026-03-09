"use client"

import React, { useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet"
import L, { LatLng } from 'leaflet'
import "leaflet/dist/leaflet.css"

// Correção de ícones do Leaflet para o Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

type MapProps = {
  position: { lat: number, lng: number } | null;
  setPosition: (pos: { lat: number, lng: number }) => void;
}

function LocationMarker({ position, setPosition }: MapProps) {
  const map = useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : <Marker position={[position.lat, position.lng]} />;
}

function CenterMap({ setPosition }: { setPosition: any }) {
  const map = useMap();
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((location) => {
      const { latitude, longitude } = location.coords;
      const userLatLng = new L.LatLng(latitude, longitude);
      map.flyTo(userLatLng, 15);
      setPosition({ lat: latitude, lng: longitude });
    });
  }, [map, setPosition]);
  return null;
}

export default function MapRegistrationComponent({ position, setPosition }: MapProps) {
  return (
    <MapContainer center={[-5.0892, -42.8028]} zoom={13} style={{ height: '300px', width: '100%', zIndex: 0 }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker position={position} setPosition={setPosition} />
      <CenterMap setPosition={setPosition} />
    </MapContainer>
  );
}