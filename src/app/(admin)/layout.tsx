import type { Metadata } from "next";
import "@/styles/globals.css"
import { Noto_Sans_Thai } from 'next/font/google';
import Layout from "@/containers/(admin)/layout";
import { ToastContainer } from "react-toastify";
import { getServerSession } from "next-auth/next";
import { redirect, RedirectType } from "next/navigation";
import { authOptions } from "@/utils/authOptions";

export const metadata: Metadata = {
    title: "ส่วนของแอดมิน",
    description: "Generated by create next app",
};

const notoSansThai = Noto_Sans_Thai({
    subsets: ['thai']
});

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const session = await getServerSession(authOptions);

    if (!session) redirect("/", RedirectType.replace);

    // if (session.user.role !== "ADMIN") redirect("/", RedirectType.replace);

    return (
        <html lang="th">
            <body className={notoSansThai.className + " min-h-screen"}>
                <ToastContainer />
                <Layout>
                    {children}
                </Layout>
            </body>
        </html>
    );
}
