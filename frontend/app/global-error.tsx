"use client";

import * as Sentry from "@sentry/nextjs";

import { useEffect } from "react";

import { Oswald, Rubik_80s_Fade } from "next/font/google";
import Link from "next/link";
const Four04Font = Rubik_80s_Fade({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
});
import "./globals.css";
const oswald = Oswald({ weight: "400", subsets: ["latin"], display: "swap" });
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
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
                                You encountered a rare error, Rest assured it has been reported.
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
      </body>
    </html>
  );
}
