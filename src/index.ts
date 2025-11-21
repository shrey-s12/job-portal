import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
    createProfileSchema, CreateJobSchema,
    CreateProfileInput, CreateJobInput,
    makeSuccess, makeError
} from "./types";
import express from "express";


// Create server instance
const server = new McpServer({
    name: "job-portal-server",
    version: "1.0.0"
});

// Set up Express and HTTP transport
const app = express();
app.use(express.json());

app.post('/mcp', async (req, res) => {
    // Create a new transport for each request to prevent request ID collisions
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true
    });

    res.on('close', () => {
        transport.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Job Portal MCP Server is running on http://localhost:${PORT}/mcp`);
}).on('error', error => {
    console.error('Server error:', error);
    process.exit(1);
});