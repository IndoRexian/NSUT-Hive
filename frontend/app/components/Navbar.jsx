"use client";

import Link from "next/link";
import Image from "next/image";
import NSH_NOBG_256 from "../../public/NSH_NOBG_256.png";
import { UserDataContext } from "../context/context";
import { useContext, useState } from "react";
import { Avatar, Button, Dropdown, Separator } from "@heroui/react";
import { generateAvatarFromStyle } from "../lib/userdata";
import { Icon } from "@iconify/react";

function userDataNav(data) {
    return (
        <div className="flex flex-row items-center justify-center mb-2 ml-2">
            <Dropdown className="w-10">
                <Dropdown.Trigger className="w-10">
                    <Avatar
                        className="size-10 hover:scale-[1.05]
                            hover:shadow-[0_0_2px_2px_#afe7a64f]
                            transition-transform duration-100"
                    >
                        <Avatar.Image
                            alt="User Avatar"
                            src={
                                generateAvatarFromStyle(
                                    data.username,
                                    256,
                                    data.avatar_style,
                                ).avatar
                            }
                        ></Avatar.Image>
                    </Avatar>
                </Dropdown.Trigger>
                <Dropdown.Popover className="min-w-auto rounded-lg">
                    <Dropdown.Menu className="bg-[#1A1A1A] border-[#3F3F3F]
                        border p-1">
                        <Dropdown.Item
                            className="rounded-lg in-hover:bg-[#1A1A1A]
                                hover:ring hover:ring-red-500 m-0
                                hover:text-red-500 text-white"
                            href="/logout"
                        >
                            Logout
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown.Popover>
            </Dropdown>
        </div>
    );
}

function normalLogin() {
    return (
        <Link
            href="/login"
            className="text-shadow-white text-sm font-semibold border sm:px-4
                mr-1 sm:py-2 px-2 rounded-lg sm:hover:text-[#99e190]
                hover:border-[#99e190] sm:border-[#99e190] active:text-[#99e190]
                hover:scale-[1.075] duration-100 ease-in-out"
        >
            Login
        </Link>
    );
}

export default function Navbar() {
    const userDataC = useContext(UserDataContext);
    const [showDropdown, setShowDropdown] = useState(false);
    return (
        <div className="navbar border-[#3a3a3a] border-b">
            <div className="container mx-auto">
                <div className="flex items-center justify-between py-4">
                    <div className="logo ml-1">
                        <Link href="/">
                            <Image
                                className="w-12 h-12 hover:scale-[1.05]
                                    active:scale-[1.05] transition-all
                                    ease-in-out 100ms"
                                src={NSH_NOBG_256}
                                alt="NSH Logo"
                            ></Image>
                        </Link>
                    </div>

                    <div className="hidden sm:flex sm:items-center z-1">
                        <Link
                            href="/professors"
                            className="text-shadow-white text-sm font-semibold
                                hover:text-[#99e190] mr-4 hover:scale-[1.05]
                                transition-all ease-in-out 100ms"
                        >
                            Professors
                        </Link>
                        <Link
                            href="/departments"
                            className="text-shadow-white text-sm font-semibold
                                hover:text-[#99e190] mr-4 hover:scale-[1.05]
                                transition-all ease-in-out 100ms"
                        >
                            Departments
                        </Link>
                    </div>

                    <div className="hidden sm:flex sm:items-center">
                        {userDataC.data
                            ? userDataNav(userDataC.data)
                            : normalLogin()}
                    </div>

                    <div className="sm:hidden cursor-pointer">
                        <Button
                            variant="ghost"
                            onPress={() => setShowDropdown(!showDropdown)}
                        >
                            <Icon
                                icon="tabler:menu-deep"
                                className="size-10 text-white"
                            ></Icon>
                        </Button>
                    </div>
                </div>
                {showDropdown ? (
                    <div
                        className="block sm:hidden border-t-2 py-2
                            animate-slideInFromLeft"
                    >
                        <div className="flex flex-col">
                            <Link
                                href="/professors"
                                className="text-shadow-white text-md
                                    font-semibold hover:text-[#99e190] mb-1
                                    px-2"
                            >
                                Professors
                            </Link>
                            <Separator
                                className="my-3 bg-linear-to-r from-transparent
                                    to-transparent via-muted"
                            ></Separator>
                            <Link
                                href="/departments"
                                className="text-shadow-white text-md
                                    font-semibold hover:text-[#99e190] mb-1
                                    px-2"
                            >
                                Departments
                            </Link>
                            <Separator
                                className="my-3 bg-linear-to-r from-transparent
                                    via-muted to-transparent"
                            ></Separator>
                            <div
                                className="flex justify-between items-center
                                    border-t-2"
                            >
                                {userDataC.data
                                    ? userDataNav(userDataC.data)
                                    : normalLogin()}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
