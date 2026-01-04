"use client";
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { errorToast } from "./lib/toasts";
import { Oswald, Rubik_80s_Fade } from "next/font/google";
import Link from "next/link";
const Four04Font = Rubik_80s_Fade({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
});

const oswald = Oswald({ weight: "400", subsets: ["latin"], display: "swap" });

export default function GlobalError({ error, reset }) {
    useEffect(() => {
        // Log the error to Sentry
        Sentry.captureException(error);
    }, [error]);

    return (
        <>
            <div className="w-full h-screen items-center justify-center">
                <div className={Four04Font.className}>
                    <h1
                        className="text-center justify-center sm:text-[240px]
                            text-[120px]"
                    >
                        WHAT THE-
                    </h1>
                </div>
                <div className={oswald.className}>
                    <p className="text-center justify-center">
                        You encountered a rare error, Rest assured it has been
                        reported.
                    </p>
                    <p
                        className="flex flex-row gap-1 text-center
                            justify-center"
                    >
                        Come, Let&apos;s go back to
                        <Link href="/">
                            <p className="underline text-[#69d364]">Home.</p>
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
