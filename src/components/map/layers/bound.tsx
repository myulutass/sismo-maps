import { FeatureCollection, LineString } from 'geojson';

// --- Type Definitions ---
export interface BoundaryProperties {
    Name: string;
    PlateA: string;
    PlateB: string;
}

export type BoundaryGeoJSON = FeatureCollection<LineString, BoundaryProperties>;


export const loadBoundaries = async (): Promise<BoundaryGeoJSON> => {
    try {
        // Using the fraxen/tectonicplates data file as you intended
        const response = await fetch('/assets/GeoJSON/boundaries.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const geojsonData: BoundaryGeoJSON = await response.json();


        return geojsonData

    } catch (error) {
        console.error("Failed to load plate boundaries data:", error);
        return { type: 'FeatureCollection', features: [] };

    }
};
