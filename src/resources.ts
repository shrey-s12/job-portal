import { ResourceDefinition, formatResourceList } from "./interfaces.js";
import { profiles, jobs } from "./database.js";

/**
 * Resource: List All Candidate Profiles
 */
export const listProfilesResource: ResourceDefinition = {
    name: "list_profiles",
    uri: "list://profiles",
    title: "List All Candidate Profiles",
    description: "Returns all candidate profiles from the platform. Used by candidates to view all their registered profiles or by the system to show available candidates.",
    handler: async (uri) => {
        return formatResourceList(uri, profiles);
    }
};

/**
 * Resource: List All Job Postings
 */
export const listJobsResource: ResourceDefinition = {
    name: "list_jobs",
    uri: "list://jobs",
    title: "List All Job Postings",
    description: "Returns all job postings from the platform. Used by job providers to view all their posted jobs or by the system to show available opportunities.",
    handler: async (uri) => {
        return formatResourceList(uri, jobs);
    }
};

/**
 * All resources available in the system
 */
export const allResources: ResourceDefinition[] = [
    listProfilesResource,
    listJobsResource,
];
