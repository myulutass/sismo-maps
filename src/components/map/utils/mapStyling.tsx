/**
 * Generates a simple, deterministic hex color from a string seed (e.g., a plate name).
 */
export const getRandomColor = (seed: string): string => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = (hash & 0x00FFFFFF)
        .toString(16)
        .toUpperCase()
        .padStart(6, '0');
    return `#${color}`;
};

/**
 * Returns a distinct, high-contrast base color for one of the 6 main fault types.
 */
export const getBaseColorForSens1 = (sens1: string): string => {
    switch (sens1) {
        case 'R': return '#F50057'; // Vibrant Pink/Red
        case 'T': return '#D500F9'; // Vivid Purple
        case 'N': return '#00B0FF'; // Bright Cyan
        case 'E': return '#00E676'; // Saturated Green
        case 'D': return '#FF9100'; // Bright Orange
        case 'S': return '#009688'; // Teal
        default: return '#9E9E9E'; // Neutral Grey for unknowns
    }
};

/**
 * Darkens or lightens a hex color by a given percentage.
 * @param hex The input hex color (e.g., '#FF0000').
 * @param percent A value from -1.0 to 1.0 (e.g., -0.2 for 20% darker).
 */
export const adjustColor = (hex: string, percent: number): string => {
    const f = parseInt(hex.slice(1), 16);
    const t = percent < 0 ? 0 : 255;
    const p = percent < 0 ? percent * -1 : percent;
    const R = f >> 16;
    const G = (f >> 8) & 0x00FF;
    const B = f & 0x0000FF;
    const newR = Math.round((t - R) * p) + R;
    const newG = Math.round((t - G) * p) + G;
    const newB = Math.round((t - B) * p) + B;
    return `#${(0x1000000 + (newR << 16) + (newG << 8) + newB).toString(16).slice(1).toUpperCase()}`;
};

/**
 * Determines the final fault line color by getting its base type-color
 * and adjusting the brightness based on its activity rate.
 */
export const getColorForFault = (sens1: string, rate: string): string => {
    const baseColor = getBaseColorForSens1(sens1);
    // Don't adjust the color if it's the 'unknown' type
    if (baseColor === '#9E9E9E') return baseColor;

    switch (rate) {
        case '1': return baseColor;         // High Activity -> Pure, bright color
        case '2': return adjustColor(baseColor, -0.3); // Medium -> 30% Darker
        case '3': return adjustColor(baseColor, -0.5); // Low -> 50% Darker
        default: return adjustColor(baseColor, -0.7); // Unknown Rate -> Very dark
    }
};
