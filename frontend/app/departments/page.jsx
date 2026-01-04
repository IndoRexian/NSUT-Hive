import { Icon } from "@iconify/react";
import React from "react";

export default function Departments() {
    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <Icon
                icon="line-md:construction"
                className="size-100 m-1 text-[#69d364]"
            ></Icon>
            <h1 className="text-4xl m-1 animate-bounce">
                Construction In Progress!
            </h1>
        </div>
    );
}
