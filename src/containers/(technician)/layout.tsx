import Drawer from "@/components/(technician)/drawer";
import Navbar from "@/components/(technician)/navbar";
import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import Footer from "@/components/(technician)/footer";

export default function Layout({ children } : { children?: any }) {
    return (
        <>
            <NextUIProvider>
                <div className="flex flex-row min-h-screen">
                    <Drawer />
                    <div className="flex flex-col w-full">
                        <Navbar />
                        <div className="flex-grow">
                            {children}
                        </div>
                        <Footer />
                    </div>
                </div>
            </NextUIProvider>
        </>
    )
}