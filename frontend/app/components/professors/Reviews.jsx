import React from "react";
import { Tooltip } from "@heroui/react";
import SvgComponent from "@/app/components/professors/SvgComponent";
import { Text } from "@heroui/react";
import { ReviewModal } from "./ReviewModal";
import ReviewComments from "./ReviewComments";
import { Icon } from "@iconify/react";

export const getList = (globalRating, size = 64) => {
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

export default function Reviews({ profReviews, profData, userReactions }) {
    //.log(profReviews);
    const globalRating = profReviews.global_rating;
    //console.log(globalRating);
    const starsSystem = getList(globalRating);
    const cat1System = getList(
        profReviews.categories ? profReviews.categories.CAT_1 : undefined,
        32,
    );
    const cat2System = getList(
        profReviews.categories ? profReviews.categories.CAT_2 : undefined,
        32,
    );
    const cat3System = getList(
        profReviews.categories ? profReviews.categories.CAT_3 : undefined,
        32,
    );
    const cat4System = getList(
        profReviews.categories ? profReviews.categories.CAT_4 : undefined,
        32,
    );
    return (
        <div className="w-full animate-opacity">
            {/* <h1 className="text-center">Reviews</h1> */}
            <div className="mb-2">
                <div
                    className="flex flex-row items-center w-full justify-center
                        mb-1"
                >
                    {starsSystem.map((element) => element)}
                </div>
                <h1
                    className="text-center text-4xl flex flex-row justify-center
                        items-baseline"
                >
                    Rating{" "}
                    <Tooltip delay={0} closeDelay={0}>
                        <Tooltip.Trigger>
                            <p className="text-sm">
                                ({profReviews.data.length})
                            </p>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                            showArrow
                            className="bg-[#2a2a2a] border border-[#69d374]
                                items-center"
                        >
                            <Tooltip.Arrow>
                                <Icon
                                    icon="lsicon:triangle-down-filled"
                                    className="text-[#2a2a2a]"
                                ></Icon>
                            </Tooltip.Arrow>
                            <p>Total Reviews</p>
                        </Tooltip.Content>
                    </Tooltip>
                    <p>: </p>
                    <p className="pl-2">
                        {profReviews.global_rating
                            ? profReviews.global_rating
                            : "0.0"}
                    </p>
                </h1>
            </div>
            <div className="flex flex-col w-full">
                <div
                    className="flex flex-row w-full justify-center mb-1
                        items-center"
                >
                    <h1 className="text-right text-xl sm:text-2xl basis-1/3">
                        Teaching Effectiveness:{" "}
                        {/* {profReviews.categories.CAT_1
                            ? profReviews.categories.CAT_1
                            : "0.0"} */}
                    </h1>
                    <div className="flex flex-row basis-1/3 items-center">
                        {cat1System.map((element) => element)}
                    </div>
                </div>
                <div
                    className="flex flex-row w-full justify-center mb-1
                        items-center"
                >
                    <h1 className="text-right text-xl sm:text-2xl basis-1/3">
                        Grading:{" "}
                        {/* {profReviews.categories.CAT_2
                            ? profReviews.categories.CAT_2
                            : "0.0"} */}
                    </h1>
                    <div className="flex flex-row basis-1/3 items-center">
                        {cat2System.map((element) => element)}
                    </div>
                </div>
                <div
                    className="flex flex-row w-full justify-center mb-1
                        items-center"
                >
                    <h1 className="text-right text-xl sm:text-2xl basis-1/3">
                        Attendence Policy:{" "}
                        {/* {profReviews.categories.CAT_3
                            ? profReviews.categories.CAT_3
                            : "0.0"} */}
                    </h1>
                    <div className="flex flex-row basis-1/3 items-center">
                        {cat3System.map((element) => element)}
                    </div>
                </div>
                <div
                    className="flex flex-row w-full justify-center items-center"
                >
                    <h1 className="text-right text-xl sm:text-2xl basis-1/3">
                        Ease of Workload:{" "}
                        {/* {profReviews.categories.CAT_4
                            ? profReviews.categories.CAT_4
                            : "0.0"} */}
                    </h1>
                    <div className="flex flex-row basis-1/3 items-center">
                        {cat4System.map((element) => element)}
                    </div>
                </div>
            </div>
            <ReviewModal profData={profData} />
            <ReviewComments
                profReviews={profReviews.data}
                profData={profData}
                userReactions={userReactions}
            ></ReviewComments>
        </div>
    );
}
