// Explicitly type the JSON as a string-to-number map
import rawData from './school_to_id.json';

const schoolToId: Record<string, number> = rawData;

/**
 * Get the numeric ID of a school by its name.
 *
 * @param schoolName - The exact name of the school (case-sensitive).
 * @returns The corresponding school ID number, or null if not found.
 */
export function getSchoolIdByName(schoolName: string): number | null {
  return schoolToId[schoolName] ?? null;
}

/**
 * Optionally get the school name by ID (reverse mapping)
 */
export function getSchoolNameById(schoolId: number): string | null {
  const entry = Object.entries(schoolToId).find(([, id]) => id === schoolId);
  return entry ? entry[0] : null;
}
