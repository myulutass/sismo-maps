import { Polyline } from '@capacitor/google-maps';
import { getColorForFault } from '../utils/mapStyling';

// --- Type Definitions ---
type GeoJSONPosition = [number, number, number?];
type LineStringCoordinates = GeoJSONPosition[];

interface MultiLineStringGeometry {
    type: 'MultiLineString';
    coordinates: LineStringCoordinates[];
}

interface FaultLineProperties {
    RATE: string;
    SENS1: string;
}

interface FaultLineFeature {
    type: 'Feature';
    geometry: MultiLineStringGeometry;
    properties: FaultLineProperties;
}

interface FaultLineGeoJSON {
    type: 'FeatureCollection';
    features: FaultLineFeature[];
}

/**
 * Fetches and processes fault line GeoJSON data.
 * @returns A promise that resolves to an array of Polyline objects for the map.
 */
export const loadFaultLines = async (): Promise<Polyline[]> => {
    try {
        // Ensure this path is correct for your /public folder structure
        const response = await fetch('/assets/GeoJSON/faultLines.geojson');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const geojsonData: FaultLineGeoJSON = await response.json();

        const allPolylines: Polyline[] = geojsonData.features.flatMap(feature => {
            if (feature.geometry?.type !== 'MultiLineString') {
                return [];
            }

            const { RATE, SENS1 } = feature.properties;

            return feature.geometry.coordinates.map(lineSegment => {
                const path = lineSegment.map(coords => ({ lat: coords[1], lng: coords[0] }));

                return {
                    path,
                    strokeColor: getColorForFault(SENS1, RATE),
                    strokeWeight: 2.4,
                    geodesic: true,
                };
            });
        });

        console.log(`[Data Layer] Loaded ${allPolylines.length} fault line segments.`);
        return allPolylines; // Return the processed data

    } catch (error) {
        console.error("Failed to load fault lines data:", error);
        return []; // Return an empty array on failure
    }
};