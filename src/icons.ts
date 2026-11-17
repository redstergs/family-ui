/**
 * Small framework-independent set of Lucide-style SVG icons.
 * Geometry follows the Lucide icon conventions (24px viewBox, round stroke, 2px).
 * Icons are purely presentational; textual button labels remain the accessible names.
 * See https://lucide.dev/license (ISC).
 */
export const familyIconNames = [
  "utensils", "utensils-off", "door-open", "network", "dumbbell", "play",
  "house", "calendar-days", "book-open", "shopping-basket",
  "users", "settings", "layout-dashboard", "list", "refresh-cw", "thumbs-up", "thumbs-down", "message-circle", "check", "circle", "circle-dot", "clock", "lock", "circle-alert", "arrow-right", "chatgpt"
, "ellipsis", "chevron-left", "chevron-right", "x", "calendar-x", "calendar-arrow-right", "arrow-left-right", "replace", "coffee", "moon", "apple"
, "plus", "minus", "chevron-down", "chevron-up", "ellipsis-vertical"
] as const;
export type FamilyIconName = (typeof familyIconNames)[number];

const paths: Record<FamilyIconName, string> = {
 "plus": '<path d="M12 5v14M5 12h14"/>',
 "minus": '<path d="M5 12h14"/>',
 "chevron-down": '<path d="m6 9 6 6 6-6"/>',
 "chevron-up": '<path d="m6 15 6-6 6 6"/>',
 "ellipsis-vertical": '<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>',
  "ellipsis": '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  "chevron-left": '<path d="m15 18-6-6 6-6"/>',
  "chevron-right": '<path d="m9 18 6-6-6-6"/>',
  "x": '<path d="m6 6 12 12M18 6 6 18"/>',
  "calendar-x": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4m8-4v4M3 10h18m-12 3 6 6m0-6-6 6"/>',
  "calendar-arrow-right": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4m8-4v4M3 10h18m-13 6h8m-3-3 3 3-3 3"/>',
  "arrow-left-right": '<path d="M3 7h18m-4-4 4 4-4 4M21 17H3m4-4-4 4 4 4"/>',
  "replace": '<path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4"/>',
  "coffee": '<path d="M3 8h14v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4ZM17 9h2a3 3 0 0 1 0 6h-2M3 22h18M7 3v2m5-2v2"/>',
  "moon": '<path d="M21 13a9 9 0 1 1-10-10 8 8 0 0 0 10 10Z"/>',
  "apple": '<path d="M12 7c-6-5-12 2-8 10 2 4 5 5 8 3 3 2 6 1 8-3 4-8-2-15-8-10Zm0 0c0-3 2-5 5-5"/>',
  "check": '<path d="m5 12 4 4L19 6"/>',
  "circle": '<circle cx="12" cy="12" r="9"/>',
  "circle-dot": '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/>',
  "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  "lock": '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  "circle-alert": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5m0 4h.01"/>',
  "arrow-right": '<path d="M4 12h16m-7-7 7 7-7 7"/>',
  "chatgpt": '<path d="M12 3a5 5 0 0 1 8 4 5 5 0 0 1 1 8 5 5 0 0 1-6 6 5 5 0 0 1-8-1 5 5 0 0 1-4-8 5 5 0 0 1 3-8 5 5 0 0 1 6-1Z"/><path d="m8 9 4-2 5 3v5l-4 2-5-3Z"/>',
  "thumbs-up": '<path d="M7 10v11H3V10h4Zm0 0 5-8a3 3 0 0 1 2 4l-1 4h6a2 2 0 0 1 2 2l-2 7a2 2 0 0 1-2 2H7"/>',
  "thumbs-down": '<g transform="rotate(180 12 12)"><path d="M7 10v11H3V10h4Zm0 0 5-8a3 3 0 0 1 2 4l-1 4h6a2 2 0 0 1 2 2l-2 7a2 2 0 0 1-2 2H7"/></g>',
  "message-circle": '<path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l2.1-5.4A8.5 8.5 0 1 1 21 11.5Z"/>',
  "utensils": '<path d="M4 3v7a3 3 0 0 0 6 0V3M7 3v18M20 3v18M16 3c-2 3-2 8 0 10h4"/>',
  "utensils-off": '<path d="M4 3v7a3 3 0 0 0 6 0V3M7 3v18M20 3v18M16 3c-2 3-2 8 0 10h4"/><path d="m2 2 20 20"/>',
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
