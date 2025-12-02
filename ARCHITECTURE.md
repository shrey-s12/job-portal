# Job Portal MCP Server - Architecture

This document describes the modular architecture of the Job Portal MCP Server.

## Project Structure

```
src/
├── index.ts          # Entry point - Express HTTP server
├── stdio.ts          # Entry point - Stdio transport for MCP clients
├── server.ts         # MCP server creation and configuration
├── interfaces.ts     # Interfaces for tools and resources
├── types.ts          # Zod schemas and TypeScript types
├── database.ts       # In-memory database and utilities
├── handlers.ts       # Business logic for all operations
├── tools.ts          # MCP tool definitions
└── resources.ts      # MCP resource definitions
```

## Module Responsibilities

### `index.ts` - HTTP Server Entry Point
- Sets up the Express HTTP server
- Configures the `/mcp` endpoint
- Handles HTTP transport for MCP protocol
- **Use case**: Web-based MCP clients, REST API access
- **Does not contain**: Business logic, tool definitions, or MCP setup

### `stdio.ts` - Stdio Transport Entry Point
- Uses StdioServerTransport for direct MCP client connections
- Communicates via stdin/stdout
- **Use case**: Claude Desktop, MCP Inspector, CLI tools
- **Does not contain**: Business logic, tool definitions, or MCP setup

### `server.ts` - MCP Server Configuration
- Creates and configures the MCP server instance
- Registers all tools and resources
- Provides `createMcpServer()` function
- **Separation**: Decouples MCP server setup from HTTP transport

### `interfaces.ts` - Tool & Resource Interfaces
- Defines `ToolDefinition` interface for consistent tool creation
- Defines `ResourceDefinition` interface for consistent resource creation
- Provides helper functions:
  - `wrapToolResponse()` - Wraps tool responses in MCP format
  - `formatResourceList()` - Formats resource list responses
- **Purpose**: Ensures consistency when adding new tools/resources

### `types.ts` - Schemas and Types
- Zod schemas for validation:
  - `CreateProfileSchema`, `CreateJobSchema`
  - `DeleteProfileSchema`, `DeleteJobSchema`
  - `MatchJobsForProfileSchema`, `MatchProfilesForJobSchema`
- TypeScript types inferred from schemas
- Response types: `ToolResponse`, `ErrorObjectSchema`
- Helper functions: `makeSuccess()`, `makeError()`

### `database.ts` - Data Storage
- In-memory arrays for profiles and jobs
- Helper function `nextId()` for generating unique IDs
- **Single source of truth** for data storage
- Easy to replace with real database later

### `handlers.ts` - Business Logic
- Pure business logic functions (no MCP dependencies)
- Operations:
  - `createProfile()`, `createJob()`
  - `deleteProfile()`, `deleteJob()`
  - `matchJobsForProfile()`, `matchProfilesForJob()`
- Returns `ToolResponse` objects
- **Testable**: Can be unit tested without MCP server

### `tools.ts` - MCP Tool Definitions
- Defines all MCP tools using `ToolDefinition` interface
- Each tool:
  - Has metadata (name, title, description)
  - Links to input/output schemas
  - Has a handler that calls business logic from `handlers.ts`
- Exports `allTools` array for registration

### `resources.ts` - MCP Resource Definitions
- Defines all MCP resources using `ResourceDefinition` interface
- Resources:
  - `list_profiles` - Returns all candidate profiles
  - `list_jobs` - Returns all job postings
- Exports `allResources` array for registration

## Adding New Tools

To add a new tool, follow these steps:

1. **Define types** in `types.ts`:
   ```typescript
   export const NewOperationSchema = z.object({
       param: z.string().describe("Description")
   });
   export type NewOperationInput = z.infer<typeof NewOperationSchema>;
   ```

2. **Add business logic** in `handlers.ts`:
   ```typescript
   export async function handleNewOperation(params: NewOperationInput): Promise<ToolResponse> {
       // Implementation
   }
   ```

3. **Create tool definition** in `tools.ts`:
   ```typescript
   export const newOperationTool: ToolDefinition = {
       name: "new_operation",
       title: "New Operation",
       description: "Description of what this does",
       inputSchema: NewOperationSchema,
       outputSchema: ToolResponseSchema,
       handler: async (params, context) => {
           const results = await handleNewOperation(params);
           return wrapToolResponse(results);
       }
   };
   ```

4. **Register the tool** in `tools.ts`:
   ```typescript
   export const allTools: ToolDefinition[] = [
       // ... existing tools
       newOperationTool,
   ];
   ```

That's it! The tool will automatically be registered when the server starts.

## Adding New Resources

1. **Create resource definition** in `resources.ts`:
   ```typescript
   export const newResource: ResourceDefinition = {
       name: "resource_name",
       uri: "list://resource",
       title: "Resource Title",
       description: "Description",
       handler: async (uri) => {
           return formatResourceList(uri, data);
       }
   };
   ```

2. **Register the resource** in `resources.ts`:
   ```typescript
   export const allResources: ResourceDefinition[] = [
       // ... existing resources
       newResource,
   ];
   ```

## Benefits of This Architecture

1. **Separation of Concerns**: Each file has a single, well-defined responsibility
2. **Testability**: Business logic is isolated and can be tested independently
3. **Maintainability**: Easy to find and modify specific functionality
4. **Scalability**: Adding new tools/resources follows a clear pattern
5. **Consistency**: Interfaces ensure all tools/resources follow same structure
6. **Flexibility**: Easy to swap HTTP server or add other transports

## Running the Server

### Development Mode (with hot reload)

**HTTP Transport:**
```bash
npm run dev
# Server starts on http://localhost:3000/mcp
```

**Stdio Transport:**
```bash
npm run dev:stdio
# Connects via stdin/stdout for MCP clients
```

### Production Mode

**Build the project:**
```bash
npm run build
# Compiles TypeScript to JavaScript in dist/ folder
```

**HTTP Transport:**
```bash
npm start
# Builds and starts HTTP server on http://localhost:3000/mcp
```

**Stdio Transport:**
```bash
npm run start:stdio
# Builds and starts stdio transport for direct MCP connections
```

**Using the binary:**
```bash
# After npm install -g or npm link
job-portal-stdio
```

## Transport Options

### HTTP Transport (`index.ts`)
- **Protocol**: HTTP POST requests
- **Endpoint**: `http://localhost:3000/mcp`
- **Use cases**: 
  - Web applications
  - REST API clients
  - Testing with curl/Postman
- **Advantages**: 
  - Easy to test
  - Works with standard HTTP tools
  - Can handle multiple concurrent connections

### Stdio Transport (`stdio.ts`)
- **Protocol**: Standard input/output streams
- **Use cases**:
  - Claude Desktop integration
  - MCP Inspector
  - Command-line tools
  - Direct MCP client connections
- **Advantages**:
  - Lower latency
  - Native MCP protocol
  - Standard for MCP server implementations

## Claude Desktop Configuration

To use this server with Claude Desktop, add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "job-portal": {
      "command": "node",
      "args": ["/path/to/mcp-job-portal/dist/stdio.js"]
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "job-portal": {
      "command": "job-portal-stdio"
    }
  }
}
```
