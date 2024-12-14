import NextAuth, { AuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/prisma";

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            username: string
            fullname: string
            role: string
        } & DefaultSession["user"]
    }

    interface User {
        username: string
        fullname: string
        role: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        username: string
        fullname: string
        role: string
    }
}

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "username", type: "text" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials) {

                const user = await prisma.user.findUnique({
                    where: {
                        username: credentials?.username,
                    },
                });

                if (!user) {
                    throw new Error("ไม่พบผู้ใช้นี้ในระบบ");
                }

                const match = await bcrypt.compare(credentials!.password, user.password);
                if (!match) {
                    throw new Error("รหัสผ่านไม่ถูกต้อง");
                }

                return {
                    id: user.id,
                    username: user.username,
                    fullname: user.fullname,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.username = user.username;
                token.fullname = user.fullname;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                ...session.user,
                username: token.username,
                fullname: token.fullname,
                role: token.role,
            };
            return session;
        }
    },
    pages: {
        signOut: "/"
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };