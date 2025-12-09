import {
    CreateProfileInput,
    CreateJobInput,
    DeleteProfileInput,
    DeleteJobInput,
    MatchJobsForProfileInput,
    MatchProfilesForJobInput,
    FilterProfilesInput,
    FilterJobsInput,
    ToolResponse,
    makeSuccess,
    makeError,
    Profile,
    Job,
} from "./types.js";
import { profiles, jobs, nextId } from "./database.js";
import { filterEntities } from "./interfaces.js";


/**
 * Find user profile by user ID
 */
export async function findUserProfileById(userId: number): Promise<ToolResponse> {
    const profile = profiles.find(p => p.id === userId);
    if (!profile) {
        return makeError("NO_PROFILE", `Profile for user ID ${userId} not found`);
    }
    return makeSuccess(profile);
}

/**
 * Create a new candidate profile
 */
export async function createProfile(profile: CreateProfileInput): Promise<ToolResponse> {
    try {
        const newProfile = { id: nextId(profiles), ...profile };
        profiles.push(newProfile);
        return makeSuccess(newProfile);
    } catch (error) {
        return makeError("DATABASE_ERROR", "Failed to create candidate profile", String(error));
    }
}

/**
 * Create a new job posting
 */
export async function createJob(job: CreateJobInput): Promise<ToolResponse> {
    try {
        const newJob = { id: nextId(jobs), ...job };
        jobs.push(newJob);
        return makeSuccess(newJob);
    } catch (error) {
        return makeError("DATABASE_ERROR", "Failed to create job posting", String(error));
    }
}

/**
 * Delete a candidate profile by ID
 */
export async function deleteProfile(params: DeleteProfileInput): Promise<ToolResponse> {
    const index = profiles.findIndex(p => p.id === params.id);
    if (index === -1) {
        return makeError("PROFILE_NOT_FOUND", `Profile with ID ${params.id} not found`);
    }

    const deletedProfile = profiles[index];
    profiles.splice(index, 1);
    return makeSuccess({
        message: "Profile deleted successfully",
        deletedProfile: { id: deletedProfile.id, name: deletedProfile.name }
    });
}

/**
 * Delete a job posting by ID
 */
export async function deleteJob(params: DeleteJobInput): Promise<ToolResponse> {
    const index = jobs.findIndex(j => j.id === params.id);
    if (index === -1) {
        return makeError("JOB_NOT_FOUND", `Job with ID ${params.id} not found`);
    }

    const deletedJob = jobs[index];
    jobs.splice(index, 1);
    return makeSuccess({
        message: "Job deleted successfully",
        deletedJob: { id: deletedJob.id, title: deletedJob.title, company: deletedJob.company }
    });
}

/**
 * Match jobs for a candidate profile
 * Simulates calling an external match API
 */
export async function matchJobsForProfile(params: MatchJobsForProfileInput): Promise<ToolResponse> {
    try {
        const profile = profiles.find(p => p.id === params.profileId);
        if (!profile) {
            return makeError("PROFILE_NOT_FOUND", `Profile with ID ${params.profileId} not found`);
        }

        // Simulate calling external match API
        // In production, this would be an actual API call to your matching service
        // For now, return random jobs as a simulation
        const matchedJobs = jobs.sort(() => 0.5 - Math.random()).slice(0, 3);

        return makeSuccess({
            profileId: params.profileId,
            matchedJobs: matchedJobs,
            totalMatches: matchedJobs.length
        });
    } catch (error) {
        return makeError("MATCH_API_ERROR", "Failed to match jobs for profile", String(error));
    }
}

/**
 * Match candidate profiles for a job posting
 * Simulates calling an external match API
 */
export async function matchProfilesForJob(params: MatchProfilesForJobInput): Promise<ToolResponse> {
    try {
        const job = jobs.find(j => j.id === params.jobId);
        if (!job) {
            return makeError("JOB_NOT_FOUND", `Job with ID ${params.jobId} not found`);
        }

        // Simulate calling external match API
        // In production, this would be an actual API call to your matching service
        // For now, return random profiles as a simulation
        const matchedProfiles = profiles.sort(() => 0.5 - Math.random()).slice(0, 3);

        return makeSuccess({
            jobId: params.jobId,
            matchedProfiles: matchedProfiles,
            totalMatches: matchedProfiles.length
        });
    } catch (error) {
        return makeError("MATCH_API_ERROR", "Failed to match profiles for job", String(error));
    }
}

/**
 * Filter candidate profiles by criteria
 */
export async function filterProfiles(params: FilterProfilesInput): Promise<ToolResponse> {
    try {
        const searchParams = new URLSearchParams();

        // Build search params from filter input
        if (params.name) searchParams.set("name", params.name);
        if (params.email) searchParams.set("email", params.email);
        if (params.phone) searchParams.set("phone", params.phone);
        if (params.location) searchParams.set("location", params.location);
        if (params.skills) searchParams.set("skills", params.skills);
        if (params.company) searchParams.set("company", params.company);
        if (params.role) searchParams.set("role", params.role);

        const filtered = filterEntities(profiles, searchParams);

        return makeSuccess({
            count: filtered.length,
            profiles: filtered
        });
    } catch (error) {
        return makeError("FILTER_ERROR", "Failed to filter profiles", String(error));
    }
}

/**
 * Filter job postings by criteria
 */
export async function filterJobs(params: FilterJobsInput): Promise<ToolResponse> {
    try {
        const searchParams = new URLSearchParams();

        // Build search params from filter input
        if (params.title) searchParams.set("title", params.title);
        if (params.company) searchParams.set("company", params.company);
        if (params.location) searchParams.set("location", params.location);
        if (params.experienceRequired) searchParams.set("experienceRequired", params.experienceRequired);
        if (params.salary !== undefined) searchParams.set("salary", params.salary.toString());
        if (params.description) searchParams.set("description", params.description);
        if (params.skillsRequired) searchParams.set("skillsRequired", params.skillsRequired);

        const filtered = filterEntities(jobs, searchParams);

        return makeSuccess({
            count: filtered.length,
            jobs: filtered
        });
    } catch (error) {
        return makeError("FILTER_ERROR", "Failed to filter jobs", String(error));
    }
}
