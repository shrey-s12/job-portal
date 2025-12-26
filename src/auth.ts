import 'dotenv/config';
import { type Application } from "express";
import { clerkClient, clerkMiddleware } from '@clerk/express'
import cors from 'cors'
import { authServerMetadataHandlerClerk, mcpAuthClerk, protectedResourceHandlerClerk } from "@clerk/mcp-tools/express";

const PROTECTED_RESOURCE_URL = '/.well-known/oauth-protected-resource/mcp';
const protectedResourceHandler = protectedResourceHandlerClerk({ scopes_supported: ['email', 'profile'] });

const AUTH_SERVER_METADATA_URL = '/.well-known/oauth-authorization-server';
const authServerMetadataHandler = authServerMetadataHandlerClerk;

const WELL_KNOWN_PAIRS = [
    { url: PROTECTED_RESOURCE_URL, handler: protectedResourceHandler },
    { url: AUTH_SERVER_METADATA_URL, handler: authServerMetadataHandler },
];  

export function registerWellKnownHandlers(app: Application) {
    for (const pair of WELL_KNOWN_PAIRS) {
        app.get(pair.url, pair.handler);
    }
}

export function useAuthMiddleware(app: Application) {
    app.use(cors({ exposedHeaders: ['WWW-Authenticate'] }));
    app.use(clerkMiddleware());  
}

export const mcpAuthMiddleware = mcpAuthClerk;

export async function userDataFromContext({ authInfo }: { authInfo?: any }) {
    const userId = authInfo!.extra!.userId! as string;
    const userData = await clerkClient.users.getUser(userId);
    return userData;
}
