// Generates unique random download codes in the format KRD-XXXX-XXXX
// Uses an alphanumeric alphabet excluding ambiguous characters (0/O, 1/I).
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomSegment(length) {
  let out = "";
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  for (let i = 0; i < length; i++) {
    out += ALPHABET[arr[i] % ALPHABET.length];
  }
  return out;
}

export function generateDownloadCode() {
  return `KRD-${randomSegment(4)}-${randomSegment(4)}`;
}

// Formats user input into KRD-XXXX-XXXX as they type: auto-uppercase, auto-dash.
export function formatCodeInput(raw) {
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const prefix = cleaned.startsWith("KRD") ? cleaned : "KRD" + cleaned;
  const body = prefix.replace(/^KRD/, "");
  const part1 = body.slice(0, 4);
  const part2 = body.slice(4, 8);
  let result = "KRD";
  if (part1) result += "-" + part1;
  if (part2) result += "-" + part2;
  return result;
}