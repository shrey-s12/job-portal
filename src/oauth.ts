// src/oauth.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const BASE_URL = process.env.BASE_URL!;
const JWT_SECRET = process.env.JWT_SECRET!;

export function setupGoogleOAuth(app: any) {

    // Google Strategy
    passport.use(
        new GoogleStrategy(
            {
                clientID: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                callbackURL: `${BASE_URL}/auth/google/callback`,
            },
            async (accessToken, refreshToken, profile, done) => {
                const token = jwt.sign(
                    { userId: profile.id, name: profile.displayName, email: profile.emails?.[0].value },
                    JWT_SECRET,
                    { expiresIn: "7d" }
                );

                return done(null, { token, profile });
            }
        )
    );

    app.use(passport.initialize());

    // Redirect to Google
    app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

    // Google Redirect Callback
    app.get("/auth/google/callback",
        passport.authenticate("google", { session: false }),
        (req: any, res: any) => {
            return res.json({
                message: "Google Login Successful 🎉",
                token: req.user.token,   // <---- Use this token in Inspector
                profile: req.user.profile
            });
        }
    );
}
