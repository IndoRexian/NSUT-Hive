"use client";
import { Icon } from "@iconify/react";
import { useState } from "react";
import AlertPopup from "../components/auth/alert";
import { DataForm, EmailForm, OtpForm } from "../components/auth/Forms";
import { Text } from "@heroui/react";
import { useSearchParams } from "next/navigation";
export default function Basic() {
    const [otpTime, setOtpTime] = useState(false);
    const [dataTime, setDataTime] = useState(false);

    const [error, setError] = useState("");

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [otp, setOTP] = useState("");

    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect");

    function handleForms(otpTime, DataTime) {
        if (DataTime) {
            return (
                <DataForm
                    setError={setError}
                    setLoading={setLoading}
                    otp={otp}
                    email={email}
                    redirect={redirect}
                ></DataForm>
            );
        } else if (otpTime) {
            return (
                <OtpForm
                    setLoading={setLoading}
                    loading={loading}
                    email={email}
                    setError={setError}
                    setDataTime={setDataTime}
                    otp={otp}
                    setOTP={setOTP}
                    redirect={redirect}
                />
            );
        } else {
            return (
                <EmailForm
                    setButtonDisabled={setButtonDisabled}
                    buttonDisabled={buttonDisabled}
                    loading={loading}
                    setLoading={setLoading}
                    setOtpTime={setOtpTime}
                    setEmail={setEmail}
                    setError={setError}
                />
            );
        }
    }

    return (
        <div
            className="flex sm:flex-row flex-col mt-1 items-center
                justify-center overflow-hidden relative
                bg-[url('/background_login.svg')] bg-cover"
        >
            {/* <div
                className="absolute inset-0 bg-no-repeat bg-center
                    bg-[length:1100px]"
                style={{ backgroundImage: "url('/background_login.svg')" }}
            /> */}
            {/* <div className="absolute inset-0 bg-gradient-to-l from-black via-black/80 to-transparent" /> */}
            <AlertPopup error={error} />
            <div className="sm:w-1/2 relative z-10">
                {handleForms(otpTime, dataTime)}
            </div>
            {/* <Separator orientation="vertical" className="my-8 max-h-max" /> */}
            <div className="w-1/2 relative z-10 animate-slideInFromRight">
                <div
                    className="flex flex-col items-center sm:justify-center px-4
                        min-h-screen"
                    // style={{backgroundImage: `url(${loginBackground})`}}
                >
                    <Text className="text-3xl mb-2">
                        Login To Access these features
                    </Text>
                    <ul>
                        <li
                            className="flex gap-1 items-center
                                hover:text-[#69d364] hover:scale-[1.05]
                                transition-all ease-in-out"
                        >
                            <Icon icon="streamline:star-2-remix"></Icon>
                            Post Anonymous Professor Reviews
                        </li>
                        <li
                            className="flex gap-1 items-center
                                hover:text-[#69d364] hover:scale-[1.05]
                                transition-all ease-in-out"
                        >
                            <Icon icon="streamline:star-2-remix"></Icon>
                            Read Verified Student Reviews
                        </li>
                        <li
                            className="flex gap-1 items-center
                                hover:text-[#69d364] hover:scale-[1.05]
                                transition-all ease-in-out"
                        >
                            <Icon icon="streamline:star-2-remix"></Icon>
                            Upvote Helpful Reviews
                        </li>
                        <li
                            className="flex gap-1 items-center
                                hover:text-[#69d364] hover:scale-[1.05]
                                transition-all ease-in-out"
                        >
                            <Icon icon="streamline:star-2-remix"></Icon>
                            Access Verified Students Content
                        </li>
                        <li className="text-sm pt-3">
                            And Many more features coming soon...
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
