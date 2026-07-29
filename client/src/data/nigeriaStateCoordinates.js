// Approximate state-capital coordinates for every Nigerian state + FCT, used
// to place a marker on the impact map from a project's free-text `location`
// field (e.g. "Gombe State") without needing a geocoding API or per-project
// lat/lng data entry in the CMS.
const STATE_COORDINATES = {
  abia: [5.4527, 7.5248],
  adamawa: [9.3265, 12.3984],
  "akwa ibom": [5.0377, 7.9128],
  anambra: [6.2209, 6.937],
  bauchi: [10.3158, 9.8442],
  bayelsa: [4.9247, 6.2642],
  benue: [7.7322, 8.5391],
  borno: [11.8333, 13.15],
  "cross river": [4.9517, 8.322],
  delta: [6.2, 6.7333],
  ebonyi: [6.3248, 8.1137],
  edo: [6.335, 5.6037],
  ekiti: [7.6211, 5.2213],
  enugu: [6.4413, 7.4988],
  fct: [9.0765, 7.3986],
  abuja: [9.0765, 7.3986],
  gombe: [10.2897, 11.167],
  imo: [5.4833, 7.0333],
  jigawa: [12.228, 9.5616],
  kaduna: [10.5222, 7.4383],
  kano: [12.0022, 8.592],
  katsina: [12.9908, 7.6018],
  kebbi: [12.4531, 4.1975],
  kogi: [7.7337, 6.6906],
  kwara: [8.4966, 4.5426],
  lagos: [6.5244, 3.3792],
  nasarawa: [8.5378, 8.3206],
  niger: [9.6139, 6.5569],
  ogun: [7.1608, 3.3486],
  ondo: [7.25, 5.2],
  osun: [7.7667, 4.5667],
  oyo: [7.3775, 3.947],
  plateau: [9.8965, 8.8583],
  rivers: [4.8156, 7.0498],
  sokoto: [13.0059, 5.2476],
  taraba: [8.8833, 11.3667],
  yobe: [11.7467, 11.966],
  zamfara: [12.1704, 6.2642],
  "northeast nigeria": [10.5, 11.5],
  "north east nigeria": [10.5, 11.5],
  nigeria: [9.082, 8.6753],
};

/** Geographic center of Nigeria - used as the map's default view. */
export const NIGERIA_CENTER = [9.082, 8.6753];

/** Resolves a free-text location string (e.g. "Gombe State") to [lat, lng], or null if unrecognized. */
export function locationToCoordinates(location) {
  if (!location) return null;
  const normalized = String(location).toLowerCase().trim();

  if (STATE_COORDINATES[normalized]) return STATE_COORDINATES[normalized];

  const match = Object.keys(STATE_COORDINATES)
    .sort((a, b) => b.length - a.length)
    .find((key) => new RegExp(`\\b${key.replace(/\s+/g, "\\s+")}\\b`, "i").test(normalized));

  return match ? STATE_COORDINATES[match] : null;
}
