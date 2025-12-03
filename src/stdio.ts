import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMcpServer } from "./server.js";

/**
 * Entry point for Job Portal MCP Server with StdioServerTransport
 * Used for direct MCP client connections (e.g., Claude Desktop, MCP Inspector)
 */

async function main() {
    // Create MCP server instance
    const server = createMcpServer();

    // Create stdio transport
    const transport = new StdioServerTransport();

    // Connect server to transport
    await server.connect(transport);

    console.error("Job Portal MCP Server (stdio) started successfully");
}

main().catch((error) => {
    console.error("Failed to start stdio server:", error);
    process.exit(1);
});
