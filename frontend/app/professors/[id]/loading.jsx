import Image from "next/image";
import NSHLogo from "@/public/NSH_NOBG.svg";
export default function Loading() {
    return (
        <div
            className="h-screen w-full justify-center items-center text-center
                flex"
        >
            <div>
                {/* <Icon
                    icon="line-md:loading-twotone-loop"
                    className="bg-cover justify-content-center items-center
                        text-center size-100 animate-caret-blink"
                    fill="true"
                ></Icon> */}
                <Image
                    src={NSHLogo}
                    alt="LOADING"
                    className="bg-cover justify-content-center items-center
                        text-center size-100 animate-caret-blink"
                ></Image>
            </div>
        </div>
    );
}
