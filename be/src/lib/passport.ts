import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "./prisma.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // callbackURL: "/api/auth/google/callback",
      callbackURL: process.env.NODE_ENV === "production"
        ? "https://convo-u-fe.vercel.app/api/auth/google/callback"
        : "http://localhost:3000/api/auth/callback/google",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(
            new Error("Google account doesn't have a valid email."),
            false
          );
        }

        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          const randomPassword = Math.random().toString(36).slice(-8);

          user = await prisma.user.create({
            data: {
              fullName: profile.displayName,
              email: email,
              password: randomPassword,
              profilePic: profile.photos?.[0]?.value,
            },
          });
        }

        return done(null, user);
      } catch (error: any) {
        return done(error, false);
      }
    }
  )
);
