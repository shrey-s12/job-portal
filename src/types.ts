import { z } from "zod";

export type ToolResponse = {
    success: boolean;
    data: any | null;
    error: { code: string; message: string; details?: any } | null;
};

export const makeSuccess = (data: any): ToolResponse => ({
    success: true,
    data,
    error: null,
});

export const makeError = (code: string, message: string, details?: any): ToolResponse => ({
    success: false,
    data: null,
    error: { code, message, details },
});

// Schemas 
export const createProfileSchema = z.object({
    name: z.string().min(1, "Name is required").describe("Full name of the user (e.g., Shrey Singhal)"),
    email: z.string().email("Invalid email address").describe("Email address of the user (e.g., shreynbd@gmail.com)"),
    phone: z.string().min(10, "Phone number must be at least 10 digits").describe("Contact phone number (e.g., 8057260114)"),
    skills: z.array(z.string()).describe("List of skills the user possesses (e.g., JavaScript, React)"),
    experience: z.array(z.object({
        company: z.string().min(1, "Company name is required"),
        role: z.string().min(1, "Role is required"),
        duration: z.string().min(1, "Duration is required"),
    })).describe("List of work experience (e.g., Software Developer at AppSquadz for 1 years)").optional(),
}).describe("Schema for creating a user profile");

export const CreateJobSchema = z.object({
    title: z.string().min(1, "Job title is required").describe("Title of the job (e.g., Software Backend Developer)"),
    company: z.string().min(1, "Company name is required").describe("Name of the company (e.g., AppSquadz)"),
    location: z.string().min(1, "Job location is required").describe("Location of the job (e.g., Remote or Noida Sector 90)"),
    experience: z.string().min(1, "Experience requirement is required").describe("Experience required for the job (e.g., 3+ years)").optional(),
    salary: z.number().min(0, "Salary must be a positive number").describe("Salary for the job (e.g., 100000)").optional(),
    description: z.string().min(10, "Job description must be at least 10 characters").describe("Description of the job (e.g., Responsible for developing backend services)"),
    skillsRequired: z.array(z.string()).describe("List of skills required for the job (e.g., Node.js, Express)"),
}).describe("Schema for creating a job posting");

// Infer TypeScript type from schema
export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type CreateJobInput = z.infer<typeof CreateJobSchema>;