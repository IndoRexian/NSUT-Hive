"use client";
import { Button, Card } from "@heroui/react";
import SvgBG from "./components/home/SvgBG";
import SvgBGReverse from "./components/home/SvgBGReverse";
import { useRouter } from "next/navigation";
import { Anton } from "next/font/google";
import { UserDataContext } from "./context/context";
import { useState, useEffect, useContext } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
const rubikFont = Anton({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
});
export default function Home() {
    const userDataC = useContext(UserDataContext);
    const [reverse, setReverse] = useState(false);
    const router = useRouter();
    useEffect(() => {
        const intervalId = setInterval(() => {
            setReverse((r) => !r);
        }, 15000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div
            className="h-screen w-screen overflow-y-scroll snap-y scroll-smooth
                sm:snap-mandatory"
        >
            {/* ========================================= */}
            {/* SECTION 1: HERO (SVG + Text)              */}
            {/* ========================================= */}
            <div
                className="relative h-screen w-screen snap-start flex flex-col
                    items-center justify-center"
            >
                {/* A. The Background Layer (Absolute to Section 1) */}
                <div className="absolute inset-0 -z-10 pointer-events-none">
                    {reverse ? (
                        <SvgBGReverse className="w-full h-full object-cover" />
                    ) : (
                        <SvgBG className="w-full h-full object-cover" />
                    )}
                </div>

                {/* B. The Content Layer (Relative/Flex) */}
                <div className="z-10 text-center">
                    <div
                        className={`text-[150px] sm:text-[350px] animate-opacity
                            leading-none ${rubikFont.className}`}
                    >
                        NSUT Hive
                    </div>

                    <div className="text-xl sm:text-3xl font-chivo indent-30">
                        - One Stop location for all things NSUT
                    </div>

                    <div className="my-10">
                        <Button
                            variant="ghost"
                            className="focus:bg-[#1a1a1a] hover:bg-[#1a1a1a]
                                not-hover:bg-[#1a1a1a] z-0 focus:ring-0
                                animate-bounce"
                        >
                            <Link href="#info">
                                <Icon
                                    icon="mingcute:arrows-down-fill"
                                    className="text-white size-10"
                                >
                                    Go
                                </Icon>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* ========================================= */}
            {/* SECTION 2: INFO (Background 2)            */}
            {/* ========================================= */}
            <div
                id="info"
                className="relative sm:h-screen w-full snap-start snap-proximity
                    flex flex-col bg-[url(/background_home2.svg)] bg-cover
                    items-center"
            >
                <div
                    className="absolute inset-0 pointer-events-none bg-[#1a1a1a]
                        opacity-50"
                ></div>
                {/* Content for second page goes here */}
                <h1
                    className={`text-white text-[80px] animate-fadeIn mx-2
                        font-telex ${rubikFont.className} z-1`}
                >
                    What TF is this?
                </h1>
                <h1 className="font-exo2 text-end text-2xl z-1 mr-2">
                    This is a student run platform for sharing honest insights
                    about academics and{" "}
                    <span className="inline-block animate-pulse">
                        professors
                    </span>
                    .
                </h1>
                <div
                    className="flex flex-col sm:flex-row justify-center gap-5
                        my-25 sm:items-stretch px-4"
                >
                    <Card
                        variant="transparent"
                        className="ring-2 w-full max-w-sm sm:mr-0 sm:ml-0
                            hover:ring-[#69d364] hover:scale-[1.05]
                            transition-all duration-100 ease-in-out"
                    >
                        <Icon
                            icon="pepicons-pop:star-circle-filled"
                            className="text-yellow-300 animate-alternateRotate
                                size-12 justify-center w-full"
                        ></Icon>
                        <Card.Header className="font-exo2 w-full max-w-sm">
                            <Card.Title className="text-2xl text-center">
                                Rate Teachers based on their skills
                            </Card.Title>
                            <Card.Description
                                className="text-lg m-2 text-[#D2D2D2]"
                            >
                                Access professors based on four distinct
                                factors, designed to capture how students
                                actually experience a class — from teaching
                                quality to workload.
                            </Card.Description>
                        </Card.Header>
                    </Card>
                    <Card
                        variant="transparent"
                        className="ring-2 w-full max-w-sm sm:mr-0 sm:ml-0
                            hover:ring-[#69d364] hover:scale-[1.05]
                            transition-all duration-100 ease-in-out"
                    >
                        <Icon
                            icon="mingcute:comment-fill"
                            className="text-yellow-300 animate-bounce size-12
                                justify-center w-full"
                        ></Icon>
                        <Card.Header className="font-exo2">
                            <Card.Title className="text-2xl text-center">
                                Read Reviews from Other Students
                            </Card.Title>
                            <Card.Description
                                className="text-lg m-2 text-[#D2D2D2]"
                            >
                                Read, share, and react to reviews from other
                                students — with moderation in place to keep
                                things fair and useful.
                            </Card.Description>
                        </Card.Header>
                    </Card>
                    <Card
                        variant="transparent"
                        className="ring-2 w-full max-w-sm sm:mr-0 sm:ml-0
                            hover:ring-[#69d364] hover:scale-[1.05]
                            transition-all duration-100 ease-in-out"
                    >
                        <Icon
                            icon="hugeicons:anonymous"
                            className="text-yellow-300 animate-pulse size-12
                                justify-center w-full"
                        ></Icon>
                        <Card.Header className="font-exo2">
                            <Card.Title className="text-2xl text-center">
                                Be Completely anonymous
                            </Card.Title>
                            <Card.Description
                                className="text-lg m-2 text-[#D2D2D2]"
                            >
                                YES! We dont store any information of users
                                other than their emails, so none of their
                                actions can be backtracked. Even our usernames
                                are pre-defined.
                            </Card.Description>
                        </Card.Header>
                    </Card>
                </div>
                {userDataC.data ? (
                    <></>
                ) : (
                    <>
                        <h1
                            className={`text-center text-2xl
                                ${rubikFont.className} z-1 `}
                        >
                            So What are you waiting for?
                        </h1>
                        <div
                            className="flex w-full justify-center flex-row mt-2
                                my-10"
                        >
                            <Button
                                variant="ghost"
                                className="focus:bg-[#1a1a1a] hover:bg-[#1a1a1a]
                                    hover:ring-[#69d364] not-hover:bg-[#1a1a1a]
                                    active:ring-[#69d364] z-0
                                    focus:ring-[#69d364] ring ring-[#1a1a1a]
                                    font-exo2 text-white gap-0.5 text-lg
                                    transition-all duration-100 ease-in-out"
                                onPress={() => router.push("/login")}
                            >
                                Login Now
                                <Icon
                                    icon="lsicon:double-arrow-right-outline"
                                    className="text-white size-10"
                                ></Icon>
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
