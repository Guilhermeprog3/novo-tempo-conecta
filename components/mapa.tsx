"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from 'leaflet'
import { useEffect, useState } from "react"

// Definição do tipo para os dados do negócio
type Business = {
  id: string;
  businessName: string;
  address: string;
  category: string;
  rating?: number;
  isOpen?: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
};

// Corrigindo o problema do ícone padrão do Leaflet
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


export default function Map({ establishments }: { establishments: Business[] }) {
  const [userPosition, setUserPosition] = useState<L.LatLng | null>(null)

  return (
    <MapContainer center={[-5.0892, -42.8028]} zoom={14} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {establishments.map(business => (
        <Marker
          key={business.id}
          position={[business.location.latitude, business.location.longitude]}
        >
          <Popup>
            <div className="font-bold">{business.businessName}</div>
            <div>{business.category}</div>
            <a href={`/estabelecimento/${business.id}`} className="text-primary text-sm hover:underline">
              Ver mais
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}