
// --- Type Definitions for Plate Boundary GeoJSON ---

interface BoundaryProperties {
    Name: string; // e.g., "AF-AN", "PA\\NA"
    PlateA: string;
    PlateB: string;
}

interface BoundaryFeature {
    type: 'Feature';
    geometry: {
        type: 'LineString';
        coordinates: number[][];
    };
    properties: BoundaryProperties;
}

interface BoundaryGeoJSON {
    type: 'FeatureCollection';
    features: BoundaryFeature[];
}

interface MapPolyline {
    path: { lat: number; lng: number }[];
    strokeColor: string;
    strokeOpacity: number;
    strokeWeight: number;
    geodesic: boolean;
}

/**
 * Assigns a color based on the boundary type encoded in the "Name" property.
 * @param name The "Name" property from the GeoJSON (e.g., "AF-AN").
 * @returns A hex color string.
 */
const getColorFromBoundaryName = (name: string): string => {
    // Check for subduction zones (collision)
    if (name.includes('/') || name.includes('\\')) {
        return '#FF0000'; // Red for Subduction
    }
    // All other types (ridges, transforms) are non-subducting
    if (name.includes('-')) {
        return '#0000FF'; // Blue for Non-Subduction (Ridges/Transforms)
    }
    // Default color if format is unexpected
    return '#FFFFFF'; // White
};


export const loadBoundaries = async (): Promise<MapPolyline[]> => {
    try {
        // Using the fraxen/tectonicplates data file as you intended
        const response = await fetch('/assets/GeoJSON/boundaries.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const geojsonData: BoundaryGeoJSON = await response.json();

        const allPolylines: (MapPolyline | null)[] = geojsonData.features.map(feature => {
            if (feature.geometry?.type !== 'LineString') {
                return null;
            }

            const { Name } = feature.properties;
            if (!Name) return null;

            const path = feature.geometry.coordinates.map(coords => ({
                lat: coords[1],
                lng: coords[0]
            }));

            return {
                path,
                strokeColor: getColorFromBoundaryName(Name),
                strokeOpacity: 0.9,
                strokeWeight: 2,
                geodesic: true,
            };
        });

        console.log(`[Data Layer] Loaded ${allPolylines.length} plate boundary segments.`);
        return allPolylines.filter((p): p is MapPolyline => p !== null);

    } catch (error) {
        console.error("Failed to load plate boundaries data:", error);
        return [];
    }
};
