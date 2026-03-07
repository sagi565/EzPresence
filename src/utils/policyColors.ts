/**
 * policyColors.ts
 *
 * Deterministically maps a policy's scheduleUuid to a light pastel background color.
 * Because the mapping is pure (hash of string → palette index), the color is always
 * the same for a given UUID — no localStorage / sessionStorage required.
 */

/** Curated palette of 12 distinct, light pastel colors */
const POLICY_PALETTE = [
    'rgba(255, 182, 162, 0.30)', // soft coral
    'rgba(162, 210, 255, 0.30)', // sky blue
    'rgba(167, 243, 208, 0.35)', // mint green
    'rgba(253, 224, 128, 0.30)', // warm yellow
    'rgba(216, 180, 254, 0.30)', // lavender
    'rgba(252, 196, 171, 0.30)', // peach
    'rgba(147, 230, 233, 0.30)', // teal
    'rgba(255, 171, 196, 0.30)', // pink
    'rgba(185, 219, 255, 0.30)', // powder blue
    'rgba(196, 251, 188, 0.30)', // light lime
    'rgba(253, 210, 163, 0.30)', // apricot
    'rgba(221, 182, 255, 0.30)', // soft purple
];

/** Matching slightly-darker border-left accent colors (same hue, a bit more saturated) */
const POLICY_ACCENT_PALETTE = [
    'rgba(239, 100, 70, 0.60)',  // coral
    'rgba(59, 130, 246, 0.60)',  // blue
    'rgba(52, 211, 153, 0.60)',  // green
    'rgba(251, 191, 36, 0.60)',  // yellow
    'rgba(167, 139, 250, 0.60)', // violet
    'rgba(249, 115, 22, 0.60)',  // orange
    'rgba(20, 184, 166, 0.60)',  // teal
    'rgba(236, 72, 153, 0.60)',  // pink
    'rgba(99, 102, 241, 0.60)',  // indigo
    'rgba(101, 163, 13, 0.60)',  // lime
    'rgba(234, 119, 41, 0.60)',  // amber
    'rgba(139, 92, 246, 0.60)',  // purple
];

/**
 * Simple djb2-style string hash → non-negative integer.
 */
function hashString(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    }
    return Math.abs(hash);
}

/**
 * Returns a light pastel rgba background color for the given scheduleUuid.
 * Returns null for empty / undefined inputs (= one-time posts, no color).
 */
export function getPolicyBackground(scheduleUuid?: string | null): string | null {
    if (!scheduleUuid) return null;
    const index = hashString(scheduleUuid) % POLICY_PALETTE.length;
    return POLICY_PALETTE[index];
}

/**
 * Returns the accent (border-left) color paired with the policy background.
 */
export function getPolicyAccent(scheduleUuid?: string | null): string | null {
    if (!scheduleUuid) return null;
    const index = hashString(scheduleUuid) % POLICY_ACCENT_PALETTE.length;
    return POLICY_ACCENT_PALETTE[index];
}
