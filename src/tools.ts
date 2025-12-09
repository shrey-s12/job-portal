import { ToolDefinition, wrapToolResponse } from "./interfaces.js";
import { verifyAuthToken } from "./auth.js";
import { z } from "zod";

import {
    CreateProfileSchema,
    CreateJobSchema,
    DeleteProfileSchema,
    DeleteJobSchema,
    MatchJobsForProfileSchema,
    MatchProfilesForJobSchema,
    FilterProfilesSchema,
    FilterJobsSchema,
    ToolResponseSchema,
    makeError,
} from "./types.js";
import {
    findUserProfileById,
    findUserProfileByEmail,
    createProfile,
    createJob,
    deleteProfile,
    deleteJob,
    matchJobsForProfile,
    matchProfilesForJob,
    filterProfiles,
    filterJobs,
} from "./handlers.js";


/* -----------------------------------------------------
   🔐 SECURED TOOL – Get Profile Using Bearer Token
------------------------------------------------------ */
// export const getProfileSecureTool: ToolDefinition = {
//     name: "get_profile_secure",
//     title: "Get Candidate Profile (Secured)",
//     description: "Requires Bearer Token. Only returns the profile linked with the token userId.",
//     inputSchema: z.object({}), // no params needed
//     outputSchema: ToolResponseSchema,

//     handler: async (_params, context) => {
//         try {
//             // MCP HTTP transport => headers inside requestInfo
//             const reqInfo: any = (context as any)?.requestInfo ?? {};
//             const headers = (reqInfo.headers ?? {}) as Record<string, string | string[] | undefined>;

//             const authHeader =
//                 (headers["authorization"] as string | undefined) ??
//                 (headers["Authorization"] as string | undefined);

//             const userIdFromToken = verifyAuthToken(authHeader);

//             const userId = Number(userIdFromToken);
//             if (!Number.isFinite(userId)) {
//                 return wrapToolResponse(makeError("UNAUTHORIZED", "Invalid user ID from token"));
//             }

//             const results = await findUserProfileById(userId);

//             if (!results.success) {
//                 return wrapToolResponse(makeError("NO_PROFILE", "User profile not found"));
//             }

//             return wrapToolResponse(results);
//         } catch (error: any) {
//             return wrapToolResponse(
//                 makeError("UNAUTHORIZED", error?.message || "Unauthorized")
//             );
//         }
//     },
// };

export const getProfileSecureTool: ToolDefinition = {
    name: "get_profile_secure",
    title: "Get Candidate Profile (Secured)",
    description: "Returns user profile based on email inside Google JWT Token",
    inputSchema: z.object({}),
    outputSchema: ToolResponseSchema,

    handler: async (_params, context) => {
        try {
            const reqInfo: any = (context as any)?.requestInfo ?? {};
            const headers = reqInfo?.headers ?? {};

            const authHeader =
                headers["authorization"] ||
                headers["Authorization"];

            // Now this returns {userId,email,name,iAt,exp}
            const decoded: any = verifyAuthToken(authHeader);
            console.log("Decoded token:", decoded);

            if (!decoded?.email)
                return wrapToolResponse(makeError("UNAUTHORIZED", "Email missing in token"));
            
            console.log("Email from token:", decoded.email);

            const results = await findUserProfileByEmail(decoded.email);

            if (!results.success)
                return wrapToolResponse(makeError("NO_PROFILE", "No profile found for this email"));

            return wrapToolResponse(results);

        } catch (error: any) {
            return wrapToolResponse(makeError("UNAUTHORIZED", error.message));
        }
    }
};


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
 * Tool: Filter Candidate Profiles
 */
export const filterProfilesTool: ToolDefinition = {
    name: "filter_profiles",
    title: "Filter Candidate Profiles",
    description: "Filter candidate profiles by multiple criteria including name, email, phone, location, skills, company, or role. All filters are optional and support partial matching. Useful for searching and discovering candidates.",
    inputSchema: FilterProfilesSchema,
    outputSchema: ToolResponseSchema,
    handler: async (params, context) => {
        const results = await filterProfiles(params);
        return wrapToolResponse(results);
    }
};

/**
 * Tool: Filter Job Postings
 */
export const filterJobsTool: ToolDefinition = {
    name: "filter_jobs",
    title: "Filter Job Postings",
    description: "Filter job postings by multiple criteria including title, company, location, experience required, salary, description, or required skills. All filters are optional and support partial matching. Salary filter returns jobs with salary greater than or equal to the specified amount. Useful for searching and discovering jobs.",
    inputSchema: FilterJobsSchema,
    outputSchema: ToolResponseSchema,
    handler: async (params, context) => {
        const results = await filterJobs(params);
        return wrapToolResponse(results);
    }
};

/**
 * All tools available in the system
 */
export const allTools: ToolDefinition[] = [
    getProfileSecureTool,
    createProfileTool,
    createJobTool,
    deleteProfileTool,
    deleteJobTool,
    matchJobsForProfileTool,
    matchProfilesForJobTool,
    filterProfilesTool,
    filterJobsTool,
];
