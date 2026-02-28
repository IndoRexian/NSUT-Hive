"use client";

import { Button, Modal, Text, TextArea } from "@heroui/react";
import SvgComponent from "@/app/components/professors/SvgComponent";
import { useEffect, useState } from "react";
import { submitReview, updateReview } from "@/app/lib/api";
import { Icon } from "@iconify/react";
import { errorToast, infoToast } from "@/app/lib/toasts";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuthAction } from "@/app/hooks/useAuth";

function RatingStar({ index, value, onHover, onSelect }) {
    const handlePointer = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const half = x < rect.width / 2 ? 0.5 : 1;

        const newValue = index - 1 + half;

        onHover(newValue);
    };

    return (
        <div
            onPointerMove={handlePointer}
            onPointerDown={handlePointer}
            onPointerLeave={() => onHover(null)}
            onClick={(e) => onSelect(value)}
            className="cursor-pointer"
        >
            <SvgComponent
                percent={Math.min(
                    Math.max((value - (index - 1)) * 100, 0),
                    100,
                )}
                size={32}
            />
        </div>
    );
}

function StarFlex(displayValue, setHover, setRating, setDisabled, index) {
    const rows = [];
    const list = [1, 2, 3, 4, 5];
    list.map((i) => {
        const fill = Math.min(
            Math.max((displayValue[index] - (i - 1)) * 100, 0),
            100,
        );

        rows.push(
            <RatingStar
                key={i}
                index={i}
                value={displayValue[index]}
                onHover={(value) =>
                    setHover((r) => {
                        const next = [...r];
                        next[index] = value;
                        return next;
                    })
                }
                onSelect={(value) =>
                    setRating((r) => {
                        const next = [...r];
                        next[index] = value;
                        if (!next.includes(0)) {
                            setDisabled(false);
                        }

                        return next;
                    })
                }
            />,
        );
    });
    return rows;
}

/**
 * Create/Edit Review Modal
 */
export function ReviewModal({
    children,
    profData,
    editMode = false,
    ratingList = [],
    initialReviewtext = null,
}) {
    const router = useRouter();
    const [rating, setRating] = useState([0, 0, 0, 0]);
    const [hover, setHover] = useState([null, null, null, null]);
    const [reviewText, setReviewText] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editMode) {
            setRating(ratingList);
        }
    }, [editMode, ratingList]);

    useEffect(() => {
        setReviewText(initialReviewtext);
    }, [editMode, initialReviewtext]);

    const displayValue = [
        hover[0] ?? rating[0],
        hover[1] ?? rating[1],
        hover[2] ?? rating[2],
        hover[3] ?? rating[3],
    ];
    const { execute: executeSubmitReview, isPending: isPendingSubmitReview } =
        useAuthAction(submitReview);
    const { execute: executeUpdateReview, isPending: isPendingUpdateReview } =
        useAuthAction(updateReview);
    const onSubmit = async (renderProps) => {
        const finalReviewTest = reviewText ? reviewText.trim() : reviewText;
        try {
            if (!editMode) {
                await executeSubmitReview(
                    profData.professor_id,
                    rating,
                    finalReviewTest,
                );
            } else {
                await executeUpdateReview(
                    profData.professor_id,
                    rating,
                    finalReviewTest,
                );
            }
            infoToast("Review Added!");
            router.refresh();
        } catch (e) {
            errorToast(e.message);
        } finally {
            renderProps.close();
        }
    };

    return (
        <Modal>
            <Modal.Trigger>{children}</Modal.Trigger>
            {/* {children} */}
            <Modal.Backdrop className="bg-black/80">
                <Modal.Container className="pt-20" placement="center">
                    <Modal.Dialog className="bg-[#1A1A1A]">
                        {(renderProps) => (
                            <>
                                <Modal.CloseTrigger
                                    //onClick={console.log(rating, hover)}
                                    className="bg-[#1A1A1A]"
                                />
                                <Modal.Header>
                                    <Modal.Heading>
                                        Rate Your Professor
                                    </Modal.Heading>
                                </Modal.Header>
                                <Modal.Body className="pt-2 pb-2">
                                    <Text className="md:hidden">
                                        Not Optimised for Mobile Devices yet...
                                    </Text>
                                    <div className="stars mt-1">
                                        <div
                                            className="flex gap-1 items-center
                                                pb-0.5 font-telex"
                                        >
                                            <Text
                                                className="basis-1/3 text-right
                                                    w-full text-[#dadada]"
                                            >
                                                Teaching Effectiveness:{" "}
                                            </Text>
                                            <div
                                                className="flex flex-row
                                                    basis-1/3 items-center"
                                            >
                                                {StarFlex(
                                                    displayValue,
                                                    setHover,
                                                    setRating,
                                                    setDisabled,
                                                    0,
                                                ).map((element) => element)}
                                            </div>
                                        </div>
                                        <div
                                            className="flex gap-1 items-center
                                                pb-0.5 font-telex"
                                        >
                                            <Text
                                                className="basis-1/3 text-right
                                                    w-full text-[#dadada]"
                                            >
                                                Grading:{" "}
                                            </Text>
                                            <div
                                                className="flex flex-row
                                                    basis-1/3 items-center"
                                            >
                                                {StarFlex(
                                                    displayValue,
                                                    setHover,
                                                    setRating,
                                                    setDisabled,
                                                    1,
                                                ).map((element) => element)}
                                            </div>
                                        </div>
                                        <div
                                            className="flex gap-1 items-center
                                                pb-0.5 font-telex"
                                        >
                                            <Text
                                                className="basis-1/3 text-right
                                                    w-full text-[#dadada]"
                                            >
                                                Attendence Policy:{" "}
                                            </Text>
                                            <div
                                                className="flex flex-row
                                                    basis-1/3 items-center"
                                            >
                                                {StarFlex(
                                                    displayValue,
                                                    setHover,
                                                    setRating,
                                                    setDisabled,
                                                    2,
                                                ).map((element) => element)}
                                            </div>
                                        </div>
                                        <div
                                            className="flex gap-1 items-center
                                                pb-2 font-telex"
                                        >
                                            <Text
                                                className="basis-1/3 text-right
                                                    w-full text-[#dadada]"
                                            >
                                                Ease of Workload:{" "}
                                            </Text>
                                            <div
                                                className="flex flex-row
                                                    basis-1/3 items-center"
                                            >
                                                {StarFlex(
                                                    displayValue,
                                                    setHover,
                                                    setRating,
                                                    setDisabled,
                                                    3,
                                                ).map((element) => element)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="review-text p-1">
                                        <TextArea
                                            aria-label="Review Text"
                                            placeholder="Share Review(Optional)"
                                            value={reviewText}
                                            onChange={(e) => {
                                                setDisabled(false);
                                                setReviewText(e.target.value);
                                            }}
                                            className="bg-[#1a1a1a] border
                                                border-[#2A2A2A] text-[#dadada]
                                                font-telex"
                                            fullWidth={true}
                                        ></TextArea>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button
                                        type="submit"
                                        isDisabled={disabled}
                                        onPress={() => onSubmit(renderProps)}
                                    >
                                        {!isPendingSubmitReview ||
                                        !isPendingUpdateReview ? (
                                            "Submit"
                                        ) : (
                                            <Icon
                                                icon="line-md:loading-twotone-loop"
                                                className="size-5"
                                            ></Icon>
                                        )}
                                    </Button>
                                </Modal.Footer>
                            </>
                        )}
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
