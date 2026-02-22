"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { Utensils, Store, Wrench, Heart, Car, Home as HomeIcon, MapPin } from 'lucide-react';
import Link from 'next/link';
import "leaflet/dist/leaflet.css";

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

// Corrige caminhos de ícones do Leaflet que falham no build
if (typeof window !== 'undefined') {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
}

const getCategoryIcon = (category: string) => {
    let iconComponent = <MapPin size={18} color="white" />;
    let color = "#002240"; // Azul Escuro padrão para categoria genérica

    const cat = category.toLowerCase();
    if (cat === "restaurante") { iconComponent = <Utensils size={18} color="#002240" />; color = "#F7B000"; } // Novo Amarelo com ícone azul escuro
    else if (cat === "comércio" || cat === "comercio") { iconComponent = <Store size={18} color="#002240" />; color = "#00CCFF"; } // Novo Azul Claro
    else if (cat === "serviços" || cat === "servicos") { iconComponent = <Wrench size={18} color="white" />; color = "#002240"; }
    else if (cat === "saúde" || cat === "saude") { iconComponent = <Heart size={18} color="white" />; color = "#EF4444"; }

    const iconHtml = ReactDOMServer.renderToString(
        <div style={{ backgroundColor: color, borderRadius: '50%', padding: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid white' }}>
            {iconComponent}
        </div>
    );

    return L.divIcon({ html: iconHtml, className: 'custom-icon', iconSize: [30, 30], iconAnchor: [15, 15] });
};

function CenterMapToUserLocation({ setUserPosition }: { setUserPosition: any }) {
    const map = useMap();
    useEffect(() => {
      navigator.geolocation.getCurrentPosition((pos) => {
          const latlng = new L.LatLng(pos.coords.latitude, pos.coords.longitude);
          map.flyTo(latlng, 15);
          setUserPosition(latlng);
      });
    }, [map, setUserPosition]);
    return null;
}

export default function MapComponent({ businesses, userPosition, setUserPosition }: MapComponentProps) {
    return (
        <MapContainer center={[-5.0892, -42.8028]} zoom={14} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <CenterMapToUserLocation setUserPosition={setUserPosition} />
            {userPosition && <Marker position={userPosition}><Popup>Você está aqui</Popup></Marker>}
            {businesses.map(b => (
                <Marker key={b.id} position={[b.location.latitude, b.location.longitude]} icon={getCategoryIcon(b.category)}>
                    <Popup>
                        <div className="font-bold">{b.businessName}</div>
                        <Link href={`/estabelecimento/${b.id}`} className="text-[#00CCFF] hover:text-[#002240] underline">Ver mais</Link>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}