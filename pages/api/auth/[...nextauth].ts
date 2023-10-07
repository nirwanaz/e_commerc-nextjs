import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

import User from "@/backend/models/user";
import bcrypt from "bcryptjs";
import dbConnect from "@/backend/db.config";
import { NextApiRequest, NextApiResponse } from "next";
import { NextAuthOptions } from "next-auth";
import { User as UserType } from "@/interfaces";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";

const nextAuthConfig: NextAuthOptions = {
    session: {
        strategy: "jwt"
    },
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                dbConnect();

                const { email, password } = credentials as {
                    email: string,
                    password: string
                };

                const user = await User.findOne({ email }).select("+password");

                if (!user) {
                    throw new Error("Invalid Email or Password");
                }

                const isPasswordMatched = await bcrypt.compare(
                    password,
                    user.password
                )

                if (!isPasswordMatched) {
                    throw new Error("Invalid Email or Password");
                }

                return user;
            },
        }),
    ],
    callbacks: {
        jwt: async ({ token, user }: any) => {
            
            user && (token.user = user);

            // Check if the URL contains "?update"
            if (token.user && token.user._id) {
                const updatedUser = await User.findById(token.user._id);

                if (updatedUser) {
                    token.user = updatedUser;
                }
            }

            return token;
        },
        session: async({ session, token }: any) => {
            session.user = token.user;

            // delete password from session
            delete session.user?.password

            return session
        }
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    return await NextAuth(req, res, nextAuthConfig);
}