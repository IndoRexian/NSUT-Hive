import { sendOTP, verifyOTP, verifyOTPFinal } from "@/app/lib/auth";
import { generateAvatar, generateUsername } from "@/app/lib/userdata";
import {
    Avatar,
    Button,
    FieldError,
    Form,
    Input,
    InputOTP,
    Label,
    REGEXP_ONLY_DIGITS,
    Text,
    TextField,
    Tooltip,
    Surface,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { errorToast } from "@/app/lib/toasts";

export function EmailForm({
    setButtonDisabled,
    buttonDisabled,
    loading,
    setLoading,
    setOtpTime,
    setEmail,
    setError,
}) {
    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = {};

        // Convert FormData to plain object
        formData.forEach((value, key) => {
            data[key] = value.toString();
        });
        try {
            const res = await sendOTP(data.email);
            if (res !== "Success") {
                setError(res);
            } else {
                setError("");
                setEmail(data.email);
                setOtpTime(true);
            }
        } catch (e) {
            errorToast(e.message);
        }

        setLoading(false);
    };
    return (
        <Form
            className="flex flex-col gap-4 px-4 items-center justify-center
                sm:min-h-screen min-h-[50vh] animate-slideInFromLeft"
            onSubmit={onSubmit}
        >
            <div className="justify-content-start">
                <Label className="text-xl">Email</Label>
                <TextField
                    isRequired
                    autoComplete="true"
                    name="email"
                    type="email"
                    validationBehavior="aria"
                    validate={(value) => {
                        if (!/[A-Za-z0-9.]+@nsut\.ac\.in/i.test(value)) {
                            setButtonDisabled(true);
                            return "invalid";
                        }

                        setButtonDisabled(false);
                    }}
                >
                    <Input
                        placeholder="john@nsut.ac.in"
                        className="bg-[#27272A] p-1 rounded-sm mr-1 mt-1
                            data-[invalid=true]:ring-2
                            data-[invalid=true]:ring-red-800 w-60 max-w-sm h-8
                            text-white focus:scale-[1.05] ease-in-out
                            duration-100 transition-all"
                    />
                    <FieldError>
                        <Text
                            className="text-[12px] text-red-400"
                            slot="errorMessage"
                        >
                            Invalid Email
                        </Text>
                    </FieldError>
                </TextField>

                <div className="flex gap-2 mt-2">
                    <Button
                        type="submit"
                        className="p-2 border-2 bg-[#99e190] text-black
                            rounded-sm hover:bg-[#82da76] font-bold
                            disabled:bg-[#27272A] disabled:text-red-400
                            disabled:border-[#27272A]
                            disabled:cursor-not-allowed"
                        isDisabled={buttonDisabled}
                    >
                        {!loading ? (
                            "Send OTP"
                        ) : (
                            <Icon
                                icon="line-md:loading-twotone-loop"
                                className="size-5"
                            ></Icon>
                        )}
                    </Button>
                </div>
            </div>
        </Form>
    );
}

export function OtpForm({
    setLoading,
    loading,
    email,
    setDataTime,
    setError,
    otp,
    setOTP,
    redirect,
}) {
    const router = useRouter();
    //const [otp, setOTP] = useState("");
    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Convert FormData to plain object
        try {
            const data = await verifyOTP(otp, email);
            if (data === "New User") {
                setDataTime(true);
            } else {
                if (redirect) {
                    router.push(redirect);
                } else {
                    router.push("/");
                }
            }
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <Form
            className="flex flex-col gap-4 px-4 items-center justify-center
                min-h-screen animate-slideInFromLeft"
            onSubmit={onSubmit}
        >
            <div className="justify-content-start">
                <Label>OTP Sent</Label>
                <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                    textAlign="center"
                    onChange={(value) => setOTP(value)}
                >
                    <div className="flex flex-row">
                        <InputOTP.Group>
                            <div className="flex flex-row mt-1">
                                <InputOTP.Slot
                                    index={0}
                                    className="size-12 rounded-lg text-lg
                                        text-center mr-1 p-2 bg-[#27272A]
                                        caret-green-500
                                        data-[active=true]:ring-2
                                        data-[active=true]:ring-[#afe7a6]
                                        data-[filled=true]:ring-[#69d364]
                                        text-white"
                                />
                                <InputOTP.Slot
                                    index={1}
                                    className="size-12 rounded-lg text-lg
                                        text-center mr-1 p-2 bg-[#27272A]
                                        data-[active=true]:ring-2
                                        data-[active=true]:ring-[#afe7a6]
                                        data-[filled=true]:ring-[#69d364]
                                        text-white"
                                />
                                <InputOTP.Slot
                                    index={2}
                                    className="size-12 rounded-lg text-lg
                                        text-center mr-1 p-2 bg-[#27272A]
                                        data-[active=true]:ring-2
                                        data-[active=true]:ring-[#afe7a6]
                                        data-[filled=true]:ring-[#69d364]
                                        text-white"
                                />
                                <InputOTP.Slot
                                    index={3}
                                    className="size-12 rounded-lg text-lg
                                        text-center mr-1 p-2 bg-[#27272A]
                                        data-[active=true]:ring-2
                                        data-[active=true]:ring-[#afe7a6]
                                        data-[filled=true]:ring-[#69d364]
                                        text-white"
                                />
                                <InputOTP.Slot
                                    index={4}
                                    className="size-12 rounded-lg text-lg
                                        text-center mr-1 p-2 bg-[#27272A]
                                        data-[active=true]:ring-2
                                        data-[active=true]:ring-[#afe7a6]
                                        data-[filled=true]:ring-[#69d364]
                                        text-white"
                                />
                                <InputOTP.Slot
                                    index={5}
                                    className="size-12 rounded-lg text-lg
                                        text-center p-2 bg-[#27272A]
                                        data-[active=true]:ring-2
                                        data-[active=true]:ring-[#afe7a6]
                                        data-[filled=true]:ring-[#69d364]
                                        text-white"
                                />
                            </div>
                        </InputOTP.Group>
                    </div>
                </InputOTP>
                <div className="flex gap-2 mt-2">
                    <Button
                        type="submit"
                        className="p-2 border-2 bg-[#99e190] text-black
                            rounded-sm hover:bg-[#82da76] font-bold
                            disabled:bg-[#27272A] disabled:text-red-400
                            disabled:border-[#27272A]
                            disabled:cursor-not-allowed"
                        isDisabled={otp.length !== 6}
                    >
                        {!loading ? (
                            "Login"
                        ) : (
                            <Icon
                                icon="line-md:loading-twotone-loop"
                                className="size-5"
                            ></Icon>
                        )}
                    </Button>
                </div>
            </div>
        </Form>
    );
}

export function DataForm({ setError, setLoading, otp, email, redirect }) {
    const router = useRouter();

    const [username, setUsername] = useState(generateUsername());
    const avatarData = generateAvatar(username, 256);
    const [avatar, setAvatar] = useState(avatarData.avatar);
    const [avatarStyle, setAvatarStyle] = useState(avatarData.style);
    const [isSelected, setIsSelected] = useState(true);

    function handleReload() {
        const newUsername = generateUsername();
        setUsername(newUsername);
        const avatarData = generateAvatar(newUsername, 256);
        setAvatar(avatarData.avatar);
        setAvatarStyle(avatarData.style);
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Convert FormData to plain object
        try {
            const data = await verifyOTPFinal(
                otp,
                email,
                username,
                isSelected,
                avatarStyle,
            );
            if (redirect) {
                router.push(redirect);
            } else {
                router.push("/");
            }
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };
    return (
        <Form
            className="flex flex-col gap-4 px-4 items-center justify-center
                min-h-screen animate-slideInFromLeft"
            onSubmit={onSubmit}
        >
            <Surface className="p-3 rounded-sm animate-glowElse bg-[#2A2A2A]">
                <div className="flex flex-row items-center justify-center mb-2">
                    <Avatar
                        className="size-32 hover:scale-[1.05]
                            hover:shadow-[0_0_2px_2px_#afe7a64f]
                            transition-transform duration-100"
                    >
                        <Avatar.Image
                            alt="User Avatar"
                            src={avatar}
                        ></Avatar.Image>
                    </Avatar>
                </div>
                <div className="justify-content-start">
                    <Label>Username</Label>
                    <div className="flex flex-row items-center">
                        <TextField
                            isDisabled
                            name="username"
                            type="text"
                            className="cursor-not-allowed border
                                border-[#1a1a1a]"
                        >
                            <Input
                                value={username}
                                placeholder="john@nsut.ac.in"
                                className="bg-[#27272A] p-1 rounded-sm mr-1 mt-1
                                    cursor-not-allowed text-white/40
                                    text-[20px]"
                            />

                            <FieldError>
                                <Text
                                    className="text-[12px] text-red-400"
                                    slot="errorMessage"
                                >
                                    Invalid Email
                                </Text>
                            </FieldError>
                        </TextField>
                        <div
                            className="flex items-center justify-center h-full
                                ml-1"
                        >
                            <Tooltip delay={0}>
                                <Button
                                    aria-label="Change Username"
                                    onClick={() => handleReload()}
                                >
                                    <Icon
                                        icon="mdi:refresh-auto"
                                        className="size-6 justify-center
                                            items-center hover:scale-125
                                            hover:text-[#82da76]
                                            hover:animate-pulse transition-all
                                            duration-75"
                                    ></Icon>
                                </Button>
                                <Tooltip.Content
                                    className="bg-[#27272A] p-1 rounded-xl
                                        text-accent-foreground border
                                        border-[#1a1a1a]"
                                    showArrow
                                >
                                    <Tooltip.Arrow className="" />
                                    <Text>Change Username</Text>
                                </Tooltip.Content>
                            </Tooltip>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <Checkbox
                            id="terms-2"
                            className="cursor-pointer text-[#99e190]"
                            onCheckedChange={setIsSelected}
                            defaultChecked
                        />
                        <Label htmlFor="terms-2" className="cursor-pointer">
                            Recieve Promotional Emails
                        </Label>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <Button
                            type="submit"
                            className="p-2 border-2 bg-[#99e190] text-black
                                rounded-sm hover:bg-[#82da76] font-bold
                                disabled:bg-[#27272A] disabled:text-red-400
                                disabled:border-[#27272A]
                                disabled:cursor-not-allowed"
                            // isDisabled={buttonDisabled}
                        >
                            Login
                            {/* {!loading ? (
                            "Send OTP"
                        ) : (
                            <Icon
                                icon="line-md:loading-twotone-loop"
                                className="size-5"
                            ></Icon>
                        )} */}
                        </Button>
                    </div>
                </div>
            </Surface>
        </Form>
    );
}
