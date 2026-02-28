"use client";
import { generateAvatarFromStyle } from "@/app/lib/userdata";
import { ReviewModal } from "./ReviewModal";
import placeHolderPFP from "@/public/placeholder_pfp.svg";
import SvgComponent from "@/app/components/professors/SvgComponent";
import { useContext, useState } from "react";
import { Toaster } from "sonner";
import { UserDataContext } from "@/app/context/context";
import {
    Card,
    Surface,
    Separator,
    ScrollShadow,
    Modal,
    Avatar,
} from "@heroui/react";
import ReviewCard from "./reviewCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import React from "react";
import { useRouter, usePathname } from "next/navigation";

const getList = (globalRating, size = 64) => {
    const rows = [];
    let key = 0;

    if (globalRating == null) {
        for (let i = 0; i < 5; i++) {
            rows.push(<SvgComponent percent={0} size={size} key={key++} />);
        }
        return rows;
    }

    const rating = Math.min(Math.max(globalRating, 0), 5);
    const fullStars = Math.floor(rating);
    const fraction = rating - fullStars;

    // full stars
    for (let i = 0; i < fullStars; i++) {
        rows.push(<SvgComponent percent={100} size={size} key={key++} />);
    }

    // partial star ONLY if fractional part exists
    if (fraction > 0 && rows.length < 5) {
        rows.push(
            <SvgComponent
                percent={Math.round(fraction * 100)}
                size={size}
                key={key++}
            />,
        );
    }

    // empty stars until total = 5
    while (rows.length < 5) {
        rows.push(<SvgComponent percent={0} size={size} key={key++} />);
    }

    return rows;
};

function singleComment(data, key, profData, userReactions) {
    //console.log(data);
    if (data.review_text) {
        const cat1System = getList(data.cat_1, 32);
        const cat2System = getList(data.cat_2, 32);
        const cat3System = getList(data.cat_3, 32);
        const cat4System = getList(data.cat_4, 32);
        return (
            <div key={key}>
                <ReviewCard
                    keyS={key}
                    reviewData={data}
                    profData={profData}
                    userReactions={userReactions}
                >
                    <Modal.Backdrop>
                        <Modal.Container className="pt-20" placement="center">
                            <Modal.Dialog className="bg-[#1A1A1A]">
                                <Modal.CloseTrigger
                                    //onClick={console.log(rating, hover)}
                                    className="bg-[#1A1A1A]"
                                />
                                <Modal.Header>
                                    <Modal.Heading>
                                        <div
                                            className="flex flex-row gap-2
                                                items-center"
                                        >
                                            <Avatar size="sm">
                                                <Avatar.Image
                                                    src={
                                                        generateAvatarFromStyle(
                                                            data.username,
                                                            256,
                                                            data.avatar_style,
                                                        ).avatar
                                                    }
                                                ></Avatar.Image>
                                            </Avatar>
                                            Review by {data.username}
                                        </div>
                                    </Modal.Heading>
                                </Modal.Header>
                                <ScrollShadow
                                    className="pt-4 pb-4"
                                    size={50}
                                    key={key}
                                >
                                    <Modal.Body>
                                        <div>
                                            <div
                                                className="stars pb-2 flex
                                                    flex-col gap-0.5 w-full
                                                    items-center justify-center"
                                            >
                                                <div
                                                    className="flex flex-row
                                                        w-full justify-center
                                                        mb-1 items-center
                                                        font-telex"
                                                >
                                                    <h1
                                                        className="text-right
                                                            basis-1/3
                                                            text-[#dadada]"
                                                    >
                                                        Teaching
                                                        Effectiveness:{" "}
                                                    </h1>
                                                    <div
                                                        className="flex flex-row
                                                            basis-1/3
                                                            items-center
                                                            font-telex"
                                                    >
                                                        {cat1System.map(
                                                            (element) =>
                                                                element,
                                                        )}
                                                    </div>
                                                </div>
                                                <div
                                                    className="flex flex-row
                                                        w-full justify-center
                                                        mb-1 items-center
                                                        font-telex"
                                                >
                                                    <h1
                                                        className="text-right
                                                            basis-1/3
                                                            text-[#dadada]"
                                                    >
                                                        Grading:{" "}
                                                    </h1>
                                                    <div
                                                        className="flex flex-row
                                                            basis-1/3
                                                            items-center
                                                            font-telex"
                                                    >
                                                        {cat2System.map(
                                                            (element) =>
                                                                element,
                                                        )}
                                                    </div>
                                                </div>
                                                <div
                                                    className="flex flex-row
                                                        w-full justify-center
                                                        mb-1 items-center
                                                        font-telex"
                                                >
                                                    <h1
                                                        className="text-right
                                                            basis-1/3
                                                            text-[#dadada]"
                                                    >
                                                        Attendence Policy:{" "}
                                                    </h1>
                                                    <div
                                                        className="flex flex-row
                                                            basis-1/3
                                                            items-center"
                                                    >
                                                        {cat3System.map(
                                                            (element) =>
                                                                element,
                                                        )}
                                                    </div>
                                                </div>
                                                <div
                                                    className="flex flex-row
                                                        w-full justify-center
                                                        items-center font-telex"
                                                >
                                                    <h1
                                                        className="text-right
                                                            basis-1/3
                                                            text-[#dadada]"
                                                    >
                                                        Ease of Workload:{" "}
                                                    </h1>
                                                    <div
                                                        className="flex flex-row
                                                            basis-1/3
                                                            items-center"
                                                    >
                                                        {cat4System.map(
                                                            (element) =>
                                                                element,
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <Separator
                                            className="bg-linear-to-r
                                                from-transparent via-default-500
                                                to-transparent"
                                        ></Separator>
                                        <div
                                            className="pt-2 text-[#dadada]
                                                font-chivo"
                                        >
                                            <p>{data.review_text}</p>
                                        </div>
                                    </Modal.Body>
                                </ScrollShadow>
                            </Modal.Dialog>
                        </Modal.Container>
                    </Modal.Backdrop>
                </ReviewCard>
            </div>
        );
    }
}

function checkUserComment(userData, data) {
    let ifExists = false;
    let selfReview;
    let otherReviews;

    if (userData.data && data) {
        const dataCopy = data.slice();
        for (let i = 0; i < data.length; i++) {
            if (data[i].user_id === userData.data.user_id) {
                ifExists = true;

                selfReview = data[i];
                dataCopy.splice(i, 1);
                otherReviews = dataCopy;
                break;
            }
        }
        if (!ifExists) {
            otherReviews = data;
        }
    } else {
        otherReviews = data;
    }
    //console.log(ifExists, selfReview, otherReviews);
    return [ifExists, selfReview, otherReviews];
}

function selfComment(
    userData,
    ifExists,
    userReview,
    profData,
    userReactions,
    router,
    pathname,
) {
    //console.log(userReview);
    //console.log(userData);
    if (userData.data) {
        if (ifExists) {
            //Edit Review Modal
            const ratingList = [
                userReview.cat_1,
                userReview.cat_2,
                userReview.cat_3,
                userReview.cat_4,
            ];
            const cat1System = getList(userReview.cat_1, 32);
            const cat2System = getList(userReview.cat_2, 32);
            const cat3System = getList(userReview.cat_3, 32);
            const cat4System = getList(userReview.cat_4, 32);
            return (
                <div key={9999}>
                    {/* To Just Show your own Reviews */}
                    <ReviewCard
                        selfmode={true}
                        keyS={9999}
                        reviewData={userReview}
                        ratingList={ratingList}
                        profData={profData}
                        userReactions={userReactions}
                    >
                        <Modal.Backdrop>
                            <Modal.Container
                                className="pt-20"
                                placement="center"
                            >
                                <Modal.Dialog className="bg-[#1A1A1A]">
                                    <Modal.CloseTrigger className="bg-[#1A1A1A]" />
                                    <Modal.Header>
                                        <Modal.Heading>
                                            <div
                                                className="flex flex-row gap-2
                                                    items-center"
                                            >
                                                <Avatar size="sm">
                                                    <Avatar.Image
                                                        src={
                                                            generateAvatarFromStyle(
                                                                userReview.username,
                                                                256,
                                                                userReview.avatar_style,
                                                            ).avatar
                                                        }
                                                    ></Avatar.Image>
                                                </Avatar>
                                                Review by You
                                            </div>
                                        </Modal.Heading>
                                    </Modal.Header>
                                    <ScrollShadow
                                        className="pt-4 pb-4"
                                        size={50}
                                        key={9999}
                                    >
                                        <Modal.Body>
                                            <div className="stars pb-2">
                                                <div
                                                    className="flex flex-col
                                                        gap-0.5 w-full
                                                        items-center
                                                        justify-center"
                                                >
                                                    <div
                                                        className="flex flex-row
                                                            w-full
                                                            justify-center mb-1
                                                            items-center
                                                            font-telex"
                                                    >
                                                        <h1
                                                            className="text-right
                                                                basis-1/3
                                                                text-[#dadada]"
                                                        >
                                                            Teaching
                                                            Effectiveness:{" "}
                                                        </h1>
                                                        <div
                                                            className="flex
                                                                flex-row
                                                                basis-1/3
                                                                items-center"
                                                        >
                                                            {cat1System.map(
                                                                (element) =>
                                                                    element,
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="flex flex-row
                                                            w-full
                                                            justify-center mb-1
                                                            items-center
                                                            font-telex"
                                                    >
                                                        <h1
                                                            className="text-right
                                                                basis-1/3
                                                                text-[#dadada]"
                                                        >
                                                            Grading:{" "}
                                                        </h1>
                                                        <div
                                                            className="flex
                                                                flex-row
                                                                basis-1/3
                                                                items-center"
                                                        >
                                                            {cat2System.map(
                                                                (element) =>
                                                                    element,
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="flex flex-row
                                                            w-full
                                                            justify-center mb-1
                                                            items-center
                                                            font-telex"
                                                    >
                                                        <h1
                                                            className="text-right
                                                                basis-1/3
                                                                text-[#dadada]"
                                                        >
                                                            Attendence
                                                            Policy:{" "}
                                                        </h1>
                                                        <div
                                                            className="flex
                                                                flex-row
                                                                basis-1/3
                                                                items-center"
                                                        >
                                                            {cat3System.map(
                                                                (element) =>
                                                                    element,
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="flex flex-row
                                                            w-full
                                                            justify-center
                                                            items-center
                                                            font-telex"
                                                    >
                                                        <h1
                                                            className="text-right
                                                                basis-1/3
                                                                text-[#dadada]"
                                                        >
                                                            Ease of
                                                            Workload:{" "}
                                                        </h1>
                                                        <div
                                                            className="flex
                                                                flex-row
                                                                basis-1/3
                                                                items-center"
                                                        >
                                                            {cat4System.map(
                                                                (element) =>
                                                                    element,
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <Separator
                                                className="bg-linear-to-r
                                                    from-transparent
                                                    via-default-500
                                                    to-transparent"
                                            ></Separator>
                                            <div className="pt-2 text-[#fafafa]">
                                                <p>{userReview.review_text}</p>
                                            </div>
                                        </Modal.Body>
                                    </ScrollShadow>
                                </Modal.Dialog>
                            </Modal.Container>
                        </Modal.Backdrop>
                    </ReviewCard>

                    <Separator
                        className="my-4 bg-linear-to-r from-transparent
                            via-default-500 to-transparent"
                        isOnSurface={true}
                    ></Separator>
                </div>
            );
        } else {
            return (
                //The Create Review Modal
                <div>
                    <ReviewModal profData={profData}>
                        <Card
                            className="w-full bg-[#1a1a1a] p-2 sm:flex-row mb-1"
                            key={9999}
                        >
                            <div
                                className="relative w-full shrink-0
                                    overflow-hidden rounded-2xl sm:w-fit"
                            >
                                <Image
                                    src={
                                        ifExists
                                            ? generateAvatarFromStyle(
                                                  userReview.username,
                                                  256,
                                                  userReview.avatar_style,
                                              ).avatar
                                            : placeHolderPFP
                                    }
                                    alt="User Profile Pic"
                                    className="w-12 h-12"
                                    width={12}
                                    height={12}
                                ></Image>
                            </div>
                            <div
                                className="flex flex-1 flex-col gap-3
                                    justify-center"
                            >
                                <Card.Header className="gap-1">
                                    <Card.Header>
                                        {ifExists
                                            ? `${userReview.review_text.substring(0, 100)} (Open to Read more)`
                                            : "Want to write a Review?"}
                                    </Card.Header>
                                    <Card.Description>
                                        {ifExists
                                            ? userReview.username
                                            : "Click here."}
                                    </Card.Description>
                                </Card.Header>
                            </div>
                        </Card>
                    </ReviewModal>
                    <Separator
                        className="my-4 bg-linear-to-r from-transparent
                            via-default-500 to-transparent"
                        isOnSurface={true}
                    ></Separator>
                </div>
            );
        }
    } else {
        //Returns when User is not logged in
        return (
            <div>
                {/* <Link href="/login"> */}
                <Card
                    className="w-full bg-[#1a1a1a] p-2 sm:flex-row mb-1
                        hover:scale-[1.005] active:scale-[1.005] shadow
                        hover:shadow-[#69d364] active:hover:shadow-[#69d364]
                        transition-all 100ms ease-in-out cursor-pointer"
                    key={9999}
                    onClick={() =>
                        router.push(
                            `/login?redirect=${encodeURIComponent(pathname)}`,
                        )
                    }
                >
                    <div
                        className="relative w-full shrink-0 overflow-hidden
                            rounded-lg sm:w-fit"
                    >
                        <Image
                            src={placeHolderPFP}
                            alt="User Profile Pic"
                            className="w-12 h-12"
                            width={12}
                            height={12}
                        ></Image>
                    </div>
                    <div className="flex flex-1 flex-col gap-3 justify-center">
                        <Card.Header className="gap-1">
                            <Card.Header>Want to write a Review?</Card.Header>
                            <Card.Description>Click here.</Card.Description>
                        </Card.Header>
                    </div>
                </Card>
                {/* </Link> */}
                <Separator
                    className="my-4 bg-linear-to-r from-transparent
                        via-default-500 to-transparent"
                    isOnSurface={true}
                ></Separator>
            </div>
        );
    }
}

export default function ReviewComments({
    profReviews,
    profData,
    userReactions,
}) {
    const userData = useContext(UserDataContext);
    const [ifExists, selfReview, otherReviews] = checkUserComment(
        userData,
        profReviews,
    );
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div className="mt-2 mb-2">
            <div>
                <Toaster richColors closeButton position="top-left" />
            </div>
            <Surface className="bg-[#2A2A2A] p-1 rounded-xl mr-2 ml-2 mb-2">
                <h1
                    className="text-[#fafafa] text-xl p-1 flex flex-row
                        items-baseline"
                >
                    Reviews<p className="text-sm">({profReviews.length})</p>
                </h1>
                <ScrollArea className="max-h-115">
                    <ScrollShadow className="max-h-115 p-4">
                        {selfComment(
                            userData,
                            ifExists,
                            selfReview,
                            profData,
                            userReactions,
                            router,
                            pathname,
                        )}
                        {otherReviews
                            ? otherReviews.map((data, index) =>
                                  singleComment(
                                      data,
                                      index,
                                      profData,
                                      userReactions,
                                  ),
                              )
                            : "No Reviews"}
                    </ScrollShadow>
                </ScrollArea>
            </Surface>
        </div>
    );
}
