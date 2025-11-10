import { Polygon } from '@capacitor/google-maps';
import { getRandomColor } from '../utils/mapStyling';

// --- Type Definitions (Discriminated Union) ---
interface PolygonGeometry {
    type: 'Polygon';
    coordinates: number[][][];
}

interface MultiPolygonGeometry {
    type: 'MultiPolygon';
    coordinates: number[][][][];
}

interface PlateProperties {
    PlateName?: string;
    Code?: string;
}

interface PlateFeature {
    type: 'Feature';
    geometry: PolygonGeometry | MultiPolygonGeometry;
    properties: PlateProperties;
}

interface PlateGeoJSON {
    type: 'FeatureCollection';
    features: PlateFeature[];
}

/**
 * Fetches and processes tectonic plate GeoJSON data.
 * @returns A promise that resolves to an array of Polygon objects for the map.
 */
export const loadTectonicPlates = async (): Promise<Polygon[]> => {
    try {
        const response = await fetch('/assets/GeoJSON/PB2002_plates.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const geojsonData: PlateGeoJSON = await response.json();

        const allPolygons: Polygon[] = geojsonData.features.flatMap(feature => {
            const { geometry, properties } = feature;
            const name = properties?.PlateName || 'UnknownPlate';
            const color = getRandomColor(name);

            const createPolygonFromPath = (path: number[][]): Polygon => ({
                paths: path.map(([lon, lat]) => ({ lat, lng: lon })),
                strokeColor: color,
                strokeOpacity: 0.6,
                strokeWeight: 1.2,
                fillColor: color,
                fillOpacity: 0.15,
            });

            if (geometry.type === 'Polygon') {
                const outerRing = geometry.coordinates[0];
                return [createPolygonFromPath(outerRing)];
            }

            if (geometry.type === 'MultiPolygon') {
                return geometry.coordinates.map(polygonCoords => {
                    const outerRing = polygonCoords[0];
                    return createPolygonFromPath(outerRing);
                });
            }

            return [];
        });

        console.log(`[Data Layer] Loaded ${allPolygons.length} tectonic plate polygons.`);
        return allPolygons; // Return the processed data

    } catch (error) {
        console.error("Failed to load tectonic plates data:", error);
        return []; // Return an empty array on failure
    }
};