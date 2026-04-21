/**
 * policyColors.ts
 *
 * Deterministically maps a policy's scheduleUuid to a light pastel background color.
 * Because the mapping is pure (hash of string → palette index), the color is always
 * the same for a given UUID — no localStorage / sessionStorage required.
 */

/** Curated palette of 12 distinct, light pastel colors */
const POLICY_PALETTE = [
    'rgba(155, 93, 229, 0.15)', // soft purple
    'rgba(0, 187, 249, 0.15)',  // soft blue
    'rgba(0, 245, 212, 0.15)',  // soft teal
    'rgba(254, 228, 64, 0.15)',  // soft yellow
];

/** Matching slightly-darker border-left accent colors (same hue, a bit more saturated) */
const POLICY_ACCENT_PALETTE = [
    'rgba(155, 93, 229, 0.60)',  // purple
    'rgba(0, 187, 249, 0.60)',   // blue
    'rgba(0, 245, 212, 0.60)',   // teal
    'rgba(251, 191, 36, 0.70)',  // yellow
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
