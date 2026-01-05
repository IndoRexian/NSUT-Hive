import { getProfessorByPublicID } from "@/app/lib/api";
import React from "react";
import Image from "next/image";
import { Text } from "@heroui/react";
import { Avatar, Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import Reviews from "@/app/components/professors/Reviews";
import { getReviewsOfProf } from "@/app/lib/api";
import { Toaster } from "sonner";
import { cookies } from "next/headers";
//import { getUserReactions } from "@/app/lib/api";
async function getUserReactions(profid) {
    try {
        const cookieStore = await cookies(); // Get cookies from the incoming browser request
        API_URL = process.env.API_URL;
        const res = await fetch(`${API_URL}/review/reaction/getuser/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(), // <--- CRITICAL: Manually forward the cookie
            },
            body: JSON.stringify({ profid }),
            cache: "no-store", // Ensure fresh data on every request
        });

        if (!res.ok) return null;
        return res.json();
    } catch (e) {
        throw new Error("BACKEND DOWN");
    }
}
export default async function page({ params }) {
    const { id } = await params;
    const profData = await getProfessorByPublicID(id);
    const profReviews = await getReviewsOfProf(profData.professor_id);
    const userReactions = await getUserReactions(profData.professor_id);
    return (
        <div className="flex flex-wrap sm:flex-nowrap gap-0 sm:gap-2">
            <div className="flex basis-auto w-full sm:w-1/2 sm:h-[90vh]">
                <Card
                    className="mx-auto my-auto bg-[#1F1F1F]
                        animate-slideInFromLeft"
                >
                    <Image
                        className="ml-2 justify-content-center"
                        src={profData.img_link}
                        height={100}
                        width={300}
                        alt="Image of Professor"
                    ></Image>
                    <Card.Header className="text-center">
                        <Card.Title
                            className="text-xl hover:text-[#4bcc4c]
                                hover:scale-[1.08] transition-all duration-100
                                ease-in-out"
                        >
                            {profData.name}
                        </Card.Title>
                        <Card.Description
                            className="hover:text-[#afe7a6] transition-colors
                                duration-100 ease-in-out"
                        >
                            {profData.designation}
                        </Card.Description>
                    </Card.Header>
                </Card>
            </div>
            <div className="flex basis-auto w-full sm:w-1/2 sm:h-[90vh] animate">
                <Reviews
                    profReviews={profReviews}
                    profData={profData}
                    userReactions={userReactions}
                ></Reviews>
            </div>
        </div>
    );
}
