"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Correção dos ícones do Leaflet para Next.js
const icon = L.icon({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

function LocationMarker({ position, setPosition }: any) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  return position === null ? null : <Marker position={position} icon={icon} />
}

function MapResizer() {
  const map = useMap()
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize()
    }, 100)
  }, [map])
  return null
}

export default function MapRegistrationComponent({ position, setPosition }: any) {
  return (
    <MapContainer 
      center={[-5.0892, -42.8028]} 
      zoom={13} 
      style={{ height: '100%', width: '100%', minHeight: '300px' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker position={position} setPosition={setPosition} />
      <MapResizer />
    </MapContainer>
  )
}