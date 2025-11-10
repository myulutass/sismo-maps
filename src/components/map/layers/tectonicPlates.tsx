
import { FeatureCollection, Polygon, MultiPolygon } from 'geojson';

// --- Type Definitions ---
export interface PlateProperties {
    PlateName?: string;
    Code?: string;
}

export type PlateGeoJSON = FeatureCollection<Polygon | MultiPolygon, PlateProperties>;


/**
 * Fetches and processes tectonic plate GeoJSON data.
 * @returns A promise that resolves to an array of Polygon objects for the map.
 */
export const loadTectonicPlates = async (): Promise<PlateGeoJSON> => {
    try {
        const response = await fetch('/assets/GeoJSON/tectonicPlates.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const geojsonData: PlateGeoJSON = await response.json();

        return geojsonData;

    } catch (error) {
        console.error("Failed to load tectonic plates data:", error);
        return { type: 'FeatureCollection', features: [] };
    }
};