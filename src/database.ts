import { Profile, Job } from "./types.js";

// In-memory database
export const profiles: Profile[] = [];
export const jobs: Job[] = [];

// Helper for generating next ID
export function nextId(arr: { id?: number }[]): number {
    if (!arr || arr.length === 0) return 1;
    return Math.max(...arr.map(x => x.id ?? 0)) + 1;
}
