// Conteúdo para o novo arquivo: app/mapa/MapComponent.tsx

"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { Utensils, Store, Wrench, Heart, Car, Home as HomeIcon, MapPin } from 'lucide-react';
import Link from 'next/link';
import "leaflet/dist/leaflet.css";

// Tipos necessários para o componente
type Business = {
  id: string;
  businessName: string;
  category: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

type MapComponentProps = {
  businesses: Business[];
  userPosition: LatLng | null;
  setUserPosition: React.Dispatch<React.SetStateAction<LatLng | null>>;
};

// Corrigindo o problema do ícone padrão do Leaflet
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const getCategoryIcon = (category: string) => {
    let iconComponent;
    let color = "#4B5563";

    switch (category) {
        case "Restaurante": case "restaurante":
            iconComponent = <Utensils size={18} color="white" />; color = "#F59E0B"; break;
        case "Comércio": case "comercio":
            iconComponent = <Store size={18} color="white" />; color = "#3B82F6"; break;
        case "Serviços": case "servicos":
            iconComponent = <Wrench size={18} color="white" />; color = "#6B7280"; break;
        case "Saúde": case "saude":
            iconComponent = <Heart size={18} color="white" />; color = "#EF4444"; break;
        case "Automotivo": case "automotivo":
            iconComponent = <Car size={18} color="white" />; color = "#1F2937"; break;
        case "Casa": case "casa":
            iconComponent = <HomeIcon size={18} color="white" />; color = "#10B981"; break;
        default:
            iconComponent = <MapPin size={18} color="white" />; break;
    }

    const iconHtml = ReactDOMServer.renderToString(
        <div style={{ backgroundColor: color, borderRadius: '50%', padding: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
            {iconComponent}
        </div>
    );

    return L.divIcon({
        html: iconHtml,
        className: 'custom-leaflet-icon',
        iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -15]
    });
};

const userLocationIcon = L.divIcon({
    html: ReactDOMServer.renderToString(
        <div style={{ backgroundColor: '#3B82F6', borderRadius: '50%', width: '20px', height: '20px', border: '3px solid white', boxShadow: '0 0 10px rgba(0,0,0,0.3)' }} />
    ),
    className: 'custom-user-location-icon',
    iconSize: [20, 20], iconAnchor: [10, 10],
});

function CenterMapToUserLocation({ setUserPosition }: { setUserPosition: React.Dispatch<React.SetStateAction<LatLng | null>> }) {
    const map = useMap();
  
    useEffect(() => {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          const { latitude, longitude } = location.coords;
          const userLatLng = new L.LatLng(latitude, longitude);
          map.flyTo(userLatLng, 15);
          setUserPosition(userLatLng);
        },
        () => {
          console.log("Não foi possível obter a localização do usuário.");
        }
      );
    }, [map, setUserPosition]);
  
    return null;
}

export default function MapComponent({ businesses, userPosition, setUserPosition }: MapComponentProps) {
    return (
        <MapContainer center={[-5.0892, -42.8028]} zoom={14} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <CenterMapToUserLocation setUserPosition={setUserPosition} />
            
            {userPosition && (
                <Marker position={userPosition} icon={userLocationIcon}>
                    <Popup>Você está aqui</Popup>
                </Marker>
            )}

            {businesses.map(business => (
                <Marker 
                    key={business.id} 
                    position={[business.location.latitude, business.location.longitude]}
                    icon={getCategoryIcon(business.category)}
                >
                    <Popup>
                       <div className="font-bold">{business.businessName}</div>
                       <div>{business.category}</div>
                       <Link href={`/estabelecimento/${business.id}`} className="text-primary text-sm hover:underline">
                         Ver mais
                       </Link>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}