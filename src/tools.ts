import { ToolDefinition, wrapToolResponse } from "./interfaces.js";
import {
    CreateProfileSchema,
    CreateJobSchema,
    DeleteProfileSchema,
    DeleteJobSchema,
    MatchJobsForProfileSchema,
    MatchProfilesForJobSchema,
    ToolResponseSchema,
    makeError,
} from "./types.js";
import {
    createProfile,
    createJob,
    deleteProfile,
    deleteJob,
    matchJobsForProfile,
    matchProfilesForJob,
} from "./handlers.js";

/**
 * Tool: Create Candidate Profile
 */
export const createProfileTool: ToolDefinition = {
    name: "create_profile",
    title: "Create Candidate Profile",
    description: "Create a new candidate profile with name, email, phone, skills, experience, and location preferences. Used by candidates to register themselves on the job matching platform.",
    inputSchema: CreateProfileSchema,
    outputSchema: ToolResponseSchema,
    handler: async (params, context) => {
        const results = await createProfile(params);
        if (!results.success) {
            return wrapToolResponse(makeError("CREATE_PROFILE_FAILED", "Failed to create candidate profile"));
        }
        return wrapToolResponse(results);
    }
};

/**
 * Tool: Create Job Posting
 */
export const createJobTool: ToolDefinition = {
    name: "create_job",
    title: "Create Job Posting",
    description: "Create a new job posting with title, company, location, description, required skills, and experience requirements. Used by job providers to post new job opportunities.",
    inputSchema: CreateJobSchema,
    outputSchema: ToolResponseSchema,
    handler: async (params, context) => {
        const results = await createJob(params);
        if (!results.success) {
            return wrapToolResponse(makeError("CREATE_JOB_FAILED", "Failed to create job posting"));
        }
        return wrapToolResponse(results);
    }
};

/**
 * Tool: Delete Candidate Profile
 */
export const deleteProfileTool: ToolDefinition = {
    name: "delete_profile",
    title: "Delete Candidate Profile",
    description: "Delete an existing candidate profile by ID. Used by candidates to remove their profile from the platform.",
    inputSchema: DeleteProfileSchema,
    outputSchema: ToolResponseSchema,
    handler: async (params, context) => {
        const results = await deleteProfile(params);
        return wrapToolResponse(results);
    }
};

/**
 * Tool: Delete Job Posting
 */
export const deleteJobTool: ToolDefinition = {
    name: "delete_job",
    title: "Delete Job Posting",
    description: "Delete an existing job posting by ID. Used by job providers to remove old or filled job postings.",
    inputSchema: DeleteJobSchema,
    outputSchema: ToolResponseSchema,
    handler: async (params, context) => {
        const results = await deleteJob(params);
        return wrapToolResponse(results);
    }
};

/**
 * Tool: Match Jobs for Candidate Profile
 */
export const matchJobsForProfileTool: ToolDefinition = {
    name: "match_jobs_for_profile",
    title: "Match Jobs for Candidate Profile",
    description: "Find matching job opportunities for a candidate profile. Accepts profile ID and returns relevant jobs from the match API. Used by candidates to discover suitable job openings.",
    inputSchema: MatchJobsForProfileSchema,
    outputSchema: ToolResponseSchema,
    handler: async (params, context) => {
        const results = await matchJobsForProfile(params);
        return wrapToolResponse(results);
    }
};

/**
 * Tool: Match Candidates for Job Posting
 */
export const matchProfilesForJobTool: ToolDefinition = {
    name: "match_profiles_for_job",
    title: "Match Candidates for Job Posting",
    description: "Find matching candidate profiles for a job posting. Accepts job ID and returns relevant candidates from the match API. Used by job providers to discover suitable candidates.",
    inputSchema: MatchProfilesForJobSchema,
    outputSchema: ToolResponseSchema,
    handler: async (params, context) => {
        const results = await matchProfilesForJob(params);
        return wrapToolResponse(results);
    }
};

/**
 * All tools available in the system
 */
export const allTools: ToolDefinition[] = [
    createProfileTool,
    createJobTool,
    deleteProfileTool,
    deleteJobTool,
    matchJobsForProfileTool,
    matchProfilesForJobTool,
];
