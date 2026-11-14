import React from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MUMBAI_CENTER = [19.076, 72.8777];
const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

function ViewportSync({ center, zoom }) {
    const map = useMap();

    React.useEffect(() => {
        if (!Array.isArray(center) || center.length !== 2) return;
        map.setView(center, zoom, { animate: true });
    }, [map, center, zoom]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            try {
                map.invalidateSize();
            } catch { }
        }, 200);
        return () => clearTimeout(timer);
    }, [map]);

    return null;
}

export default function MapComponent({ children, center = MUMBAI_CENTER, zoom = 12, style }) {
    const containerStyle = {
        width: '100%',
        height: '520px',
        minHeight: '320px',
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--border-default, rgba(14, 165, 233, 0.25))',
        boxShadow: '0 16px 38px -20px rgba(14, 165, 233, 0.3)',
        ...style,
    };

    return (
        <div className="map-container" style={containerStyle}>
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom
                style={{ width: '100%', height: '100%' }}
            >
                <ViewportSync center={center} zoom={zoom} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url={TILE_URL}
                />
                {children}
            </MapContainer>
        </div>
    );
}
