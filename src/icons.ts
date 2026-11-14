/**
 * Small framework-independent set of Lucide-style SVG icons.
 * Geometry follows the Lucide icon conventions (24px viewBox, round stroke, 2px).
 * Icons are purely presentational; textual button labels remain the accessible names.
 * See https://lucide.dev/license (ISC).
 */
export const familyIconNames = [
  "utensils", "door-open", "network", "dumbbell", "play",
  "house", "calendar-days", "book-open", "shopping-basket",
  "users", "settings", "layout-dashboard", "list", "refresh-cw"
] as const;
export type FamilyIconName = (typeof familyIconNames)[number];

const paths: Record<FamilyIconName, string> = {
  "utensils": '<path d="M4 3v7a3 3 0 0 0 6 0V3M7 3v18M20 3v18M16 3c-2 3-2 8 0 10h4"/>',
  "door-open": '<path d="M13 4h6a2 2 0 0 1 2 2v14H9"/><path d="M3 21V5a2 2 0 0 1 2-2h8l-4 18Z"/><path d="M7 12h.01"/>',
  "network": '<rect x="9" y="2" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="16" y="16" width="6" height="6" rx="1"/><path d="M12 8v4m-7 4v-4h14v4"/>',
  "dumbbell": '<path d="m6.5 6.5 11 11m-15-12 3-3 3 3-3 3-3-3Zm13 13 3-3 3 3-3 3-3-3ZM3.5 8.5l5-5m7 17 5-5"/>',
  "play": '<path d="m8 5 11 7-11 7V5Z"/>',
  "house": '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z"/><path d="M9 21v-8h6v8"/>',
  "calendar-days": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01"/>',
  "book-open": '<path d="M12 7v14M3 18V4a1 1 0 0 1 1-1h4a4 4 0 0 1 4 4 4 4 0 0 1 4-4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4a4 4 0 0 0-4 2 4 4 0 0 0-4-2H4a1 1 0 0 1-1-1Z"/>',
  "shopping-basket": '<path d="m5 11 5-7m9 7-5-7M3 11h18l-2 10H5L3 11ZM9 15v3m6-3v3"/>',
  "users": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m18 0v-2a4 4 0 0 0-3-3.87M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8-7.87a4 4 0 0 1 0 7.75"/>',
  "settings": '<path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-2.1 1.2l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-2.1-1.2l-1.7.6-1.4-2.4 1.4-1.1a8 8 0 0 1 0-2.4l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 2.1-1.2l.3-1.8h2.8l.3 1.8a8 8 0 0 1 2.1 1.2l1.7-.6 1.4 2.4-1.4 1.1a8 8 0 0 1 0 2.4Z" transform="translate(-1.3 -1.8)"/>',
  "layout-dashboard": '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  "list": '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  "refresh-cw": '<path d="M20 11a8 8 0 0 0-14-5L4 8m0-5v5h5M4 13a8 8 0 0 0 14 5l2-2m0 5v-5h-5"/>',
};

export function familyIcon(name: FamilyIconName, className = ""): string {
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"'
    + ' fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'
    + ' class="' + className + '" width="24" height="24" aria-hidden="true" focusable="false">'
    + paths[name] + '</svg>';
}
