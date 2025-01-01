"use client"

import { useDrawer } from "@/stores/drawer-store";
import { Navbar as NavbarMain, NavbarContent, NavbarItem, Button, Link, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@nextui-org/react";
import { FaBars } from "react-icons/fa6";
import SignIn from "@/components/specific/signin";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {

    const toggle = useDrawer((state) => state.toggle);
    const { status, data } = useSession();
    
    const router = useRouter()

    return (
        <NavbarMain className="bg-[#198754]" maxWidth="full">
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem className="flex justify-center">
                    <button onClick={toggle}>
                        <FaBars className="text-2xl text-white" />
                    </button>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                {
                    status === "authenticated" ?
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar
                                as="button"
                                className="transition-transform"
                                color="warning"
                                name={data.user.fullname}
                                size="md"
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            <DropdownItem key="profile" className="h-14 gap-2">
                                <p className="font-semibold">เข้าสู่ระบบด้วยบัญชี</p>
                                <p className="font-semibold">{data.user.username}</p>
                            </DropdownItem>
                            <DropdownItem href="/technician" key="dashboard">แดชบอร์ด</DropdownItem>
                            <DropdownItem key="settings">การตั้งค่า</DropdownItem>
                            <DropdownItem key="logout" color="danger" onPress={async () => {signOut({ redirect: false });router.replace('/')}}>
                                ออกจากระบบ
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    :
                    <NavbarItem>
                        <SignIn />
                    </NavbarItem>
                }
            </NavbarContent>
        </NavbarMain>
    );
}