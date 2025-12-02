import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ToolDefinition, ResourceDefinition } from "./interfaces.js";
import { allTools } from "./tools.js";
import { allResources } from "./resources.js";

/**
 * Create and configure the MCP server
 */
export function createMcpServer(): McpServer {
    const server = new McpServer({
        name: "job-portal-server",
        version: "1.0.0"
    });

    // Register all tools
    registerTools(server, allTools);

    // Register all resources
    registerResources(server, allResources);

    return server;
}

/**
 * Register tools with the MCP server
 */
function registerTools(server: McpServer, tools: ToolDefinition[]): void {
    for (const tool of tools) {
        server.registerTool(
            tool.name,
            {
                title: tool.title,
                description: tool.description,
                inputSchema: tool.inputSchema,
                outputSchema: tool.outputSchema
            },
            tool.handler
        );
    }
}

/**
 * Register resources with the MCP server
 */
function registerResources(server: McpServer, resources: ResourceDefinition[]): void {
    for (const resource of resources) {
        server.registerResource(
            resource.name,
            resource.uri,
            {
                title: resource.title,
                description: resource.description
            },
            resource.handler
        );
    }
}
