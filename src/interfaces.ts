import { z } from "zod";
import { ToolResponseSchema } from "./types.js";

/**
 * Interface for defining MCP tools in a consistent manner
 */
export interface ToolDefinition<TInput = any> {
    name: string;
    title: string;
    description: string;
    inputSchema: z.ZodType<TInput>;
    outputSchema: typeof ToolResponseSchema;
    handler: (params: TInput, context?: any) => Promise<any>;
}

/**
 * Interface for defining MCP resources in a consistent manner
 */
export interface ResourceDefinition {
    name: string;
    uri: string;
    title: string;
    description: string;
    handler: (uri: URL) => Promise<any>;
}

/**
 * Helper function to wrap tool responses in the expected format
 */
export const wrapToolResponse = (results: any) => ({
    content: [
        { type: "text", text: JSON.stringify(results) }
    ],
    structuredContent: results
});

/**
 * Helper function to format resource list responses
 */
export const formatResourceList = (uri: URL, results: any[]) => ({
    contents: [
        {
            uri: String(uri),
            text: JSON.stringify({ items: results })
        }
    ],
    structuredContent: { items: results }
});
