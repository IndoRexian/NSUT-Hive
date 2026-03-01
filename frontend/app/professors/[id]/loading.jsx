import Image from "next/image";
import NHLogo from "@/public/NH_NOBG.svg";
export default function Loading() {
    return (
        <div
            className="h-screen w-full justify-center items-center text-center
                flex"
        >
            <div>
                <Image
                    src={NHLogo}
                    alt="LOADING"
                    className="bg-cover justify-content-center items-center
                        text-center size-100 animate-caret-blink"
                ></Image>
            </div>
        </div>
    );
}
