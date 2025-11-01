// src/lib/passport.ts

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from './prisma.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          // التعديل هنا: نمرر 'false' بدلاً من 'null'
          return done(new Error("Google account doesn't have a valid email."), false);
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
        
        // هنا الكود صحيح (لا يوجد تعديل)
        return done(null, user);
        
      } catch (error: any) {
        // التعديل هنا أيضًا: نمرر 'false' بدلاً من 'null'
        return done(error, false);
      }
    }
  )
);