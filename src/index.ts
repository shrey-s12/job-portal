import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';
import { createMcpServer } from "./server.js";
import { setupGoogleOAuth } from './oauth.js';

/**
 * Main entry point for the Job Portal MCP Server
 * Sets up Express HTTP server and connects it to the MCP server
 */

// Create MCP server instance
const server = createMcpServer();

// Set up Express and HTTP transport
const app = express();
app.use(express.json());

setupGoogleOAuth(app);

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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Job Portal MCP Server is running on http://localhost:${PORT}/mcp`);
    console.log(`Google OAuth endpoint: http://localhost:${PORT}/auth/google`);
}).on('error', error => {
    console.error('Server error:', error);
    process.exit(1);
});