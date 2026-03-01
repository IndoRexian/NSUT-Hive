import React from "react";
import { Rubik_80s_Fade, Oswald } from "next/font/google";
import Link from "next/link";
const Four04Font = Rubik_80s_Fade({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
});
const oswald = Oswald({ weight: "400", subsets: ["latin"], display: "swap" });
export default function NotFound() {
    return (
        <div>
            <div className="w-full h-screen items-center justify-center">
                <div className={Four04Font.className}>
                    <h1
                        className="text-center justify-center sm:text-[240px]
                            text-[120px] hover:text-[#69d364] hover:animate-spin
                            active:animate-spin active:text-[#69d364]"
                    >
                        404 ;(
                    </h1>
                </div>
                <div className={oswald.className}>
                    <p
                        className="text-center justify-center text-xl
                            animate-bounce flex flex-row gap-1"
                    >
                        It&apos;s Okay dude! Let&apos;s go back to
                        <Link href="/">
                            <p className="underline text-[#69d364]">Home.</p>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
