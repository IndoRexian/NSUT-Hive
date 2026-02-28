import { Exo_2, Chivo, Telex } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import { getUserData } from "./lib/api";
import Navbar from "./components/Navbar";
import UserProvider from "./components/UserProvider";
import { Toaster } from "sonner";
import { isAuthenticated } from "./lib/auth";
import * as Sentry from "@sentry/nextjs";

const exo2 = Exo_2({
    weight: "400",
    variable: "--font-exo2",
    subsets: ["latin"],
});

const chivo = Chivo({
    weight: "400",
    variable: "--font-chivo",
    subsets: ["latin"],
});
const telex = Telex({
    weight: "400",
    variable: "--font-telex",
    subsets: ["latin"],
});

export const metadata = {
    title: "NSUT Hive — One Stop location for all things NSUT",
    description: `NSUT Hive is a student-run platform for sharing honest, 
        anonymous insights about professors and academics at NSUT — 
        helping students make better-informed decisions.`,
    openGraph: {
        images: "https://" + process.env.CDN_LINK + "/NH_NOBG_1024.png",
    },
};

export default async function RootLayout({ children }) {
    Sentry.metrics.count("test_metric", 1);
    const data = (await isAuthenticated()) ? await getUserData() : null;
    //console.log(data);
    return (
        <html lang="en" suppressHydrationWarning>
            <GoogleTagManager gtmId="GTM-W9HGMFDN" />
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
            </head>
            <body
                className={`${exo2.variable} ${chivo.variable} ${telex.variable}
                    antialiased scroll-smooth`}
            >
                <UserProvider value={{ data }}>
                    <Navbar />
                    {children}
                </UserProvider>
                <Toaster richColors closeButton position="top-left" />
            </body>
        </html>
    );
}
