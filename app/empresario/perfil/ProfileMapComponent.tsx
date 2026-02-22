"use client"

import React from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from 'leaflet'
import "leaflet/dist/leaflet.css"

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function ProfileMapComponent({ position, setPosition, isEditing }: any) {
  function MapEvents() {
    useMapEvents({
      click(e) {
        if (isEditing) setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  }

  return (
    <MapContainer center={position || [-5.0892, -42.8028]} zoom={15} style={{ height: '300px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {position && <Marker position={[position.lat, position.lng]} />}
      <MapEvents />
    </MapContainer>
  );
}