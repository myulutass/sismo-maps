// src/components/map/layers/FaultLinesLayer.tsx

import React, { useState, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';
import { FeatureCollection, MultiLineString } from 'geojson';
import { faultLineStyler } from '../utils/mapStyling';
import { FaultLineProperties } from '../layers/layerTypes';
// Define the specific GeoJSON type for clarity
type FaultLineGeoJSON = FeatureCollection<MultiLineString, FaultLineProperties>;

// --- Caching Logic (outside the component) ---
// This cache will persist across component re-renders and toggling the layer off/on.
let cachedFaultData: FaultLineGeoJSON | null = null;

/**
 * Fetches the fault line data ONCE and stores it in the module-level cache.
 */
const fetchAndCacheFaultLines = async (): Promise<FaultLineGeoJSON> => {
    if (cachedFaultData) {
        return cachedFaultData;
    }
    try {
        const response = await fetch('/assets/GeoJSON/faultLines.geojson');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const geojsonData = await response.json() as FaultLineGeoJSON;
        cachedFaultData = geojsonData;
        console.log(`[Data Layer] Fetched and cached ${cachedFaultData.features.length} fault line features.`);
        return cachedFaultData;
    } catch (error) {
        console.error("Failed to load fault lines data:", error);
        return { type: 'FeatureCollection', features: [] };
    }
};


// --- The Component ---
interface FaultLinesLayerProps {
    onLoadingChange: (isLoading: boolean) => void;
}

const FaultLinesLayer: React.FC<FaultLinesLayerProps> = ({ onLoadingChange }) => {
    // We will store each processed chunk of GeoJSON in an array
    const [chunks, setChunks] = useState<FaultLineGeoJSON[]>([]);

    useEffect(() => {
        let isMounted = true; // Flag to prevent state updates on unmounted component

        const streamData = async () => {
            onLoadingChange(true);
            const fullData = await fetchAndCacheFaultLines();

            if (!isMounted || !fullData || fullData.features.length === 0) {
                if (isMounted) onLoadingChange(false);
                return;
            }

            const chunkSize = 300;
            const delayMs = 5;
            let currentIndex = 0;
            const totalFeatures = fullData.features.length;

            console.log('[FaultLinesLayer] Starting batched feature streaming...');

            function processNextChunk() {
                if (!isMounted || currentIndex >= totalFeatures) {
                    if (isMounted) {
                        console.log('[FaultLinesLayer] Finished streaming all features.');
                        onLoadingChange(false);
                    }
                    return;
                }

                const end = Math.min(currentIndex + chunkSize, totalFeatures);
                const featureChunk = fullData.features.slice(currentIndex, end);

                const chunkAsGeoJSON: FaultLineGeoJSON = {
                    type: 'FeatureCollection',
                    features: featureChunk,
                };

                // Update state with the new chunk
                setChunks(prevChunks => [...prevChunks, chunkAsGeoJSON]);
                currentIndex += chunkSize;

                // Use setTimeout to yield to the main thread, keeping the UI responsive
                setTimeout(processNextChunk, delayMs);
            }

            processNextChunk();
        };

        streamData();

        // Cleanup function: runs when the component unmounts (layer is toggled off)
        return () => {
            isMounted = false;
        };
    }, [onLoadingChange]); // The effect runs only once when the component mounts

    // Render a separate GeoJSON component for each chunk
    return (
        <>
            {chunks.map((chunk, index) => (
                <GeoJSON key={`fault-chunk-${index}`} data={chunk} style={faultLineStyler} />
            ))}
        </>
    );
};

export default FaultLinesLayer;