// src/lib/directory.ts
// Shared helpers for the hospital / ambulance directory pages.
// Entries are admin-managed as JSON in the settings key `directory_json`:
// [{ "name": "...", "type": "hospital" | "ambulance", "area": "...", "phone": "...", "address": "..." }]

export interface DirectoryEntry {
  name: string;
  type: "hospital" | "ambulance";
  area: string;
  phone: string;
  address: string;
}

export const DEFAULT_DIRECTORY: DirectoryEntry[] = [
  {
    name: "হবিগঞ্জ ২৫০ শয্যা জেলা সদর হাসপাতাল",
    type: "hospital",
    area: "হবিগঞ্জ সদর",
    phone: "",
    address: "সদর হাসপাতাল রোড, হবিগঞ্জ",
  },
  {
    name: "জাতীয় জরুরি সেবা (অ্যাম্বুলেন্স ও জরুরি সাহায্য)",
    type: "ambulance",
    area: "সারা বাংলাদেশ",
    phone: "999",
    address: "",
  },
];

export function parseDirectory(json: string): DirectoryEntry[] {
  if (!json) return DEFAULT_DIRECTORY;
  try {
    const parsed = JSON.parse(json) as DirectoryEntry[];
    if (Array.isArray(parsed)) {
      const valid = parsed.filter(
        (e) => e && e.name && (e.type === "hospital" || e.type === "ambulance")
      );
      if (valid.length > 0) return valid;
    }
  } catch {
    /* fall through */
  }
  return DEFAULT_DIRECTORY;
}

export function mapsLink(entry: DirectoryEntry): string {
  const q = encodeURIComponent(`${entry.name} ${entry.address || entry.area}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}
