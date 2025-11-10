import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';

import { IonContent, IonSpinner } from '@ionic/react';
import { PlateGeoJSON, loadTectonicPlates } from './layers/tectonicPlates';
import { BoundaryGeoJSON, loadBoundaries } from './layers/bound';

import 'leaflet/dist/leaflet.css';
import { boundaryStyler, plateStyler } from './utils/mapStyling';
import FaultLinesLayer from './layers/faultLines';

interface LayerVisibility {
    faultLines: boolean;
    plates: boolean;
    boundaries: boolean;
}

interface MapComponentProps {
    layerVisibility: LayerVisibility;
    onLoadingChange: (isLoading: boolean) => void;
}


// Helper component to fix rendering issues inside Ionic tabs/modals
const ResizeMap: React.FC = () => {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => map.invalidateSize(), 200);
        return () => clearTimeout(timer);
    }, [map]);
    return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ layerVisibility, onLoadingChange }) => {
    const [isLoading, setIsLoading] = useState(true);
    // State will now hold the raw GeoJSON data
    const [plateData, setPlateData] = useState<PlateGeoJSON | null>(null);
    const [boundaryData, setBoundaryData] = useState<BoundaryGeoJSON | null>(null);

    // Effect for loading initial GeoJSON data
    useEffect(() => {
        const loadAllData = async () => {
            onLoadingChange(true);
            setIsLoading(true);
            try {
                const [plates, boundaries] = await Promise.all([
                    loadTectonicPlates(),
                    loadBoundaries(),
                ]);

                setPlateData(plates);
                setBoundaryData(boundaries);

            } catch (e) {
                console.error(`[MapComponent] Error loading GeoJSON data:`, e);
            } finally {
                setIsLoading(false);
                onLoadingChange(false);
            }
        };

        loadAllData();
    }, [onLoadingChange]);

    return (
        <IonContent>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {isLoading && (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        zIndex: 1000, // Make sure it's above the map
                        flexDirection: 'column'
                    }}>
                        <IonSpinner name="crescent" />
                        <p style={{ color: 'white', marginTop: '10px' }}>Deprem Haritası Yükleniyor...</p>
                    </div>
                )}
                <MapContainer
                    center={[39.0, 35.0]}
                    zoom={6}
                    style={{ height: '100%', width: '100%', backgroundColor: '#f0f0f0' }}
                >
                    <ResizeMap />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Conditionally and declaratively render layers */}
                    {layerVisibility.faultLines && (
                        <FaultLinesLayer onLoadingChange={onLoadingChange} />
                    )}
                    {layerVisibility.plates && plateData && (
                        <GeoJSON key="plates" data={plateData} style={plateStyler} />
                    )}
                    {layerVisibility.boundaries && boundaryData && (
                        <GeoJSON key="boundaries" data={boundaryData} style={boundaryStyler} />
                    )}
                </MapContainer>
            </div>
        </IonContent>
    );
};



export default React.memo(MapComponent);