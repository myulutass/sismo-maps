import React, { useRef, useEffect, useState } from 'react';
import { GoogleMap, Polyline, Polygon } from '@capacitor/google-maps';
import { IonContent, IonSpinner } from '@ionic/react';
import { loadTectonicPlates } from './layers/tectonicPlates';
import { loadFaultLines } from './layers/faultLines';
import { loadBoundaries } from './layers/bound';

interface LayerVisibility {
    faultLines: boolean;
    plates: boolean;
    boundaries: boolean;
}

interface MapComponentProps {
    apiKey: string;
    layerVisibility: LayerVisibility;
    onLoadingChange: (isLoading: boolean) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ apiKey, layerVisibility, onLoadingChange }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<GoogleMap | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);

    const faultLineData = useRef<Polyline[]>([]);
    const plateData = useRef<Polygon[]>([]);
    const boundaryData = useRef<Polyline[]>([]);

    const drawnFaultLineIds = useRef<string[]>([]);
    const drawnPlateIds = useRef<string[]>([]);
    const drawnBoundaryIds = useRef<string[]>([]);

    const isAddingFaults = useRef(false);

    // Helper function to add polylines in batches
    const batchAddPolylines = async (
        map: GoogleMap,
        polylines: Polyline[],
        batchSize: number = 100,
        delayMs: number = 10
    ): Promise<string[]> => {
        const allIds: string[] = [];

        for (let i = 0; i < polylines.length; i += batchSize) {
            const batch = polylines.slice(i, i + batchSize);

            try {
                const ids = await map.addPolylines(batch);
                if (ids) {
                    allIds.push(...ids);
                }

                // Give the main thread a break between batches
                if (delayMs > 0 && i + batchSize < polylines.length) {
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                }

                console.log(`[MapComponent] Added batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(polylines.length / batchSize)}`);
            } catch (e) {
                console.error(`[MapComponent] Error adding batch:`, e);
            }
        }

        return allIds;
    };

    useEffect(() => {
        const createMap = async () => {
            if (!mapRef.current) return;

            setIsLoading(true);
            setDataLoaded(false);
            try {
                const newMap = await GoogleMap.create({
                    id: 'my-map',
                    element: mapRef.current,
                    apiKey: apiKey,
                    config: {
                        center: { lat: 39.0, lng: 35.0 },
                        zoom: 6,
                        mapId: 'cc28538f955e1af1b90c37fe',
                        disableDefaultUI: true,
                    },
                });

                mapInstance.current = newMap;
                console.log('[MapComponent] Map created successfully.');

                const [faults, plates, boundaries] = await Promise.all([
                    loadFaultLines(),
                    loadTectonicPlates(),
                    loadBoundaries(),
                ]);

                faultLineData.current = faults;
                plateData.current = plates;
                boundaryData.current = boundaries;

                console.log('[MapComponent] Data loaded:', {
                    faults: faults.length,
                    plates: plates.length,
                    boundaries: boundaries.length
                });

                setDataLoaded(true);
                setIsLoading(false);

            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : String(e);
                console.error(`[MapComponent] Error during map setup: ${errorMessage}`);
                setIsLoading(false);
            }
        };

        createMap();

        return () => {
            if (mapInstance.current) {
                mapInstance.current.destroy();
                mapInstance.current = null;
                console.log('[MapComponent] Map instance destroyed.');
            }
        };
    }, [apiKey]);

    useEffect(() => {
        const toggleLayers = async () => {
            const map = mapInstance.current;
            if (!map || !dataLoaded) return;

            // Prevent concurrent fault line operations
            if (isAddingFaults.current) {
                console.log('[MapComponent] Already processing fault lines, skipping...');
                return;
            }

            // --- Manage Fault Lines with Batching ---
            if (layerVisibility.faultLines && drawnFaultLineIds.current.length === 0 && faultLineData.current.length > 0) {
                isAddingFaults.current = true;
                onLoadingChange(true);

                setTimeout(async () => {
                    try {
                        console.log('[MapComponent] Starting batched fault line addition...');
                        const ids = await batchAddPolylines(
                            map,
                            faultLineData.current,
                            100,  // batchSize - adjust this (50-200) based on performance
                            5    // delayMs - adjust this (5-20) for smoother vs faster
                        );
                        drawnFaultLineIds.current = ids;
                        console.log('[MapComponent] Finished adding all fault lines');
                    } catch (e) {
                        console.error("Error adding fault polylines:", e);
                    } finally {
                        isAddingFaults.current = false;
                        onLoadingChange(false);
                    }
                }, 100);
            }

            if (!layerVisibility.faultLines && drawnFaultLineIds.current.length > 0) {
                setTimeout(async () => {
                    try {
                        const idsToRemove = [...drawnFaultLineIds.current];
                        drawnFaultLineIds.current = [];
                        await map.removePolylines(idsToRemove);
                        console.log('[MapComponent] Fault lines removed');
                    } catch (e) {
                        console.error("Error removing fault polylines:", e);
                    }
                }, 100);
            }

            // --- Manage Plates ---
            if (layerVisibility.plates && drawnPlateIds.current.length === 0) {
                const ids = await map.addPolygons(plateData.current);
                drawnPlateIds.current = ids || [];
            }
            if (!layerVisibility.plates && drawnPlateIds.current.length > 0) {
                await map.removePolygons(drawnPlateIds.current);
                drawnPlateIds.current = [];
            }

            // --- Manage Boundaries ---
            if (layerVisibility.boundaries && drawnBoundaryIds.current.length === 0) {
                const ids = await map.addPolylines(boundaryData.current);
                drawnBoundaryIds.current = ids || [];
            }
            if (!layerVisibility.boundaries && drawnBoundaryIds.current.length > 0) {
                await map.removePolylines(drawnBoundaryIds.current);
                drawnBoundaryIds.current = [];
            }
        };

        toggleLayers();
    }, [layerVisibility, dataLoaded, onLoadingChange]);

    return (
        <IonContent>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {isLoading && (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        zIndex: 10,
                        flexDirection: 'column'
                    }}>
                        <IonSpinner name="crescent" />
                        <p style={{ color: 'white', marginTop: '10px' }}>Deprem Haritası Yükleniyor...</p>
                    </div>
                )}
                <div
                    id="map-container"
                    ref={mapRef}
                    style={{
                        width: '100%',
                        height: '100%',
                        opacity: isLoading ? 0.5 : 1,
                        transition: 'opacity 0.3s ease-in-out',
                        backgroundColor: '#f0f0f0'
                    }}
                ></div>
            </div>
        </IonContent>
    );
};

export default React.memo(MapComponent);