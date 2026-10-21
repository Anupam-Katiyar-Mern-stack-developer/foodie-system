import { useEffect } from "react";
import {
    MapContainer,
    TileLayer,
    CircleMarker,
    Popup,
    Polyline,
    useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

export function getPoint(latitude, longitude) {
    if (
        latitude == null ||
        longitude == null ||
        String(latitude).trim() === "" ||
        String(longitude).trim() === ""
    ) {
        return null;
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    return Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        Math.abs(lat) <= 90 &&
        Math.abs(lng) <= 180
        ? [lat, lng]
        : null;
}

function distanceKm(a, b) {
    if (!a || !b) return null;

    const rad = (value) => (value * Math.PI) / 180;
    const dLat = rad(b[0] - a[0]);
    const dLng = rad(b[1] - a[1]);

    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(rad(a[0])) *
        Math.cos(rad(b[0])) *
        Math.sin(dLng / 2) ** 2;

    return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
}

function Viewport({ agent, destination }) {
    const map = useMap();
    const aLat = agent?.[0];
    const aLng = agent?.[1];
    const dLat = destination?.[0];
    const dLng = destination?.[1];

    useEffect(() => {
        const points = [
            getPoint(aLat, aLng),
            getPoint(dLat, dLng),
        ].filter(Boolean);

        map.invalidateSize();

        if (points.length === 2) {
            map.fitBounds(points, {
                padding: [45, 45],
                maxZoom: 16,
            });
        } else if (points.length === 1) {
            map.setView(points[0], 15);
        }
    }, [map, aLat, aLng, dLat, dLng]);

    return null;
}

export default function DeliveryTrackingMap({
    agent,
    destination,
    destinationLabel = "Customer delivery location",
}) {
    const center = agent || destination;
    const km = distanceKm(agent, destination);

    if (!center) {
        return (
            <div className="p-8 text-center text-slate-500">
                Waiting for location...
            </div>
        );
    }

    return (
        <div>
            <div className="border-b bg-orange-50 p-4">
                <p className="font-bold">{destinationLabel}</p>
                <p className="text-sm text-slate-600">
                    {km == null
                        ? "Waiting for agent GPS..."
                        : `${km.toFixed(2)} km away • straight-line distance`}
                </p>
            </div>

            <MapContainer
                center={center}
                zoom={14}
                scrollWheelZoom
                style={{ height: 380, width: "100%" }}
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Viewport agent={agent} destination={destination} />

                {agent && (
                    <CircleMarker
                        center={agent}
                        radius={10}
                        pathOptions={{
                            color: "#fff",
                            fillColor: "#f97316",
                            fillOpacity: 1,
                            weight: 3,
                        }}
                    >
                        <Popup>Delivery agent live location</Popup>
                    </CircleMarker>
                )}

                {destination && (
                    <CircleMarker
                        center={destination}
                        radius={10}
                        pathOptions={{
                            color: "#fff",
                            fillColor: "#16a34a",
                            fillOpacity: 1,
                            weight: 3,
                        }}
                    >
                        <Popup>{destinationLabel}</Popup>
                    </CircleMarker>
                )}

                {agent && destination && (
                    <Polyline
                        positions={[agent, destination]}
                        pathOptions={{ color: "#f97316", dashArray: "8 8" }}
                    />
                )}
            </MapContainer>
        </div>
    );
}