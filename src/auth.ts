// src/auth.ts
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "JOB_PORTAL_OAUTH_SECRET";

export function verifyAuthToken(authHeader?: string) {
    if (!authHeader) {
        throw new Error("Unauthorized - Missing Authorization Header");
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        throw new Error("Unauthorized - Invalid Authorization Header format");
    }

    try {
        // const decoded = jwt.verify(token, SECRET) as { userId: string };
        // return decoded.userId;

        return jwt.verify(token, SECRET);
    } catch {
        throw new Error("Unauthorized - Invalid or expired token");
    }
}
