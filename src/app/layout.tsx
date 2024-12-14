import NextAuthProvider from "@/providers/NextAuthProvider";
import 'react-toastify/dist/ReactToastify.css';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    return (
        <NextAuthProvider session={session}>
            {children}
        </NextAuthProvider>
    );
}