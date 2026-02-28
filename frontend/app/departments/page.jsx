import { Icon } from "@iconify/react";
import React from "react";
export const metadata = {
    title: "NSUT Hive — View All Departments",
    description: `Explore academic departments at NSUT and view student-submitted insights and professor reviews organized by department.`,
    openGraph: {
        title: "NSUT Hive — View All Departments",
        description: `Explore academic departments at NSUT and view student-submitted insights and professor reviews organized by department.`,
        images: [
            {
                url: "https://" + process.env.CDN_LINK + "/NH_NOBG_1024.png",
                height: 512,
                width: 512,
                alt: "Logo of NSUT Hive",
            },
        ],
        type: "website",
    },
};
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
