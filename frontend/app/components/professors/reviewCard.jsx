"use client";
import React, { useEffect } from "react";
import { Card, Avatar, Surface, Text, Separator, Modal } from "@heroui/react";
import { Button as HeroButton } from "@heroui/react";
import { ReviewModal } from "./ReviewModal";
import { Icon } from "@iconify/react";
import { generateAvatarFromStyle } from "@/app/lib/userdata";
import { useState } from "react";
import { addReaction, deleteReaction, deleteReview } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { useAuthAction } from "@/app/hooks/useAuth";
import { infoToast } from "@/app/lib/toasts";
export default function ReviewCard({
    children,
    selfmode = false,
    keyS,
    reviewData,
    ratingList = undefined,
    profData = undefined,
    userReactions,
}) {
    const router = useRouter();

    let classname;
    if (selfmode) {
        classname =
            "w-full bg-[#1a1a1a] p-2 sm:flex-row mb-1 border shadow hover:scale-[1.005] active:scale-[1.005] hover:shadow-[#99e190] active:shadow-[#99e190] transition-all 100ms ease-in-out";
    } else {
        classname =
            "w-full bg-[#1a1a1a] p-2 sm:flex-row mb-2 border shadow hover:scale-[1.005] active:scale-[1.005] hover:shadow-[#8b8b8b] active:shadow-[#8b8b8b] transition-all 100ms ease-in-out";
    }

    const [likes, setLikes] = useState(reviewData.likes);
    const [dislikes, setDislikes] = useState(reviewData.dislikes);
    const [userLiked, setUserLiked] = useState(false);
    const [userDisliked, setUserDisliked] = useState(false);
    const userReaction = userReactions?.find(
        (reaction) => reaction.review_id === reviewData.review_id,
    );

    useEffect(() => {
        const nigger = async () => {
            if (userReaction?.state == 1) {
                //userLiked = true;

                setUserLiked(true);
            } else if (userReaction?.state == 0) {
                //userDisliked = true;

                setUserDisliked(true);
            }
        };
        nigger();
    }, [userReaction?.state]);
    if (userReaction?.state === 1) {
    } else if (userReaction?.state === 0) {
    }
    const { execute: executeAdd, isPending: isPendingAdd } =
        useAuthAction(addReaction);
    const { execute: executeDelete, isPending: isPendingDelete } =
        useAuthAction(deleteReaction);
    const { execute: executeDeleteReview, isPending: isPendingDeleteReview } =
        useAuthAction(deleteReview);

    const handleUserState = async (state) => {
        const review_id = reviewData.review_id;

        if (state === 1) {
            if (userDisliked === true) {
                await executeDelete(review_id, (state = 0)); //remove old reaction
                await executeAdd(review_id, (state = 1));
                //await addReaction(review_id, (state = 1), pathName); //add new reaction
                setUserLiked(true);
                setUserDisliked(false);
                //userLiked = true;
                //userDisliked = false;
                setLikes(likes + 1);
                setDislikes(dislikes - 1);
            } else if (userLiked === true) {
                await executeDelete(review_id, (state = 1)); //remove old reaction as user pressed it again
                setUserLiked(false);
                //userLiked = false;
                setLikes(likes - 1);
            } else {
                //await addReaction(review_id, (state = 1), pathName); //add new reaction
                await executeAdd(review_id, (state = 1));
                setUserLiked(true);
                setLikes(likes + 1);
            }
        } else if (state === 0) {
            if (userLiked === true) {
                await executeDelete(review_id, (state = 1));
                //await addReaction(review_id, (state = 0), pathName);
                await executeAdd(review_id, (state = 0));
                setUserDisliked(true);
                setUserLiked(false);
                //userDisliked = true;
                //userLiked = false;
                setDislikes(dislikes + 1);
                setLikes(likes - 1);
            } else if (userDisliked === true) {
                await executeDelete(review_id, (state = 0));
                setUserDisliked(false);
                //userDisliked = false;
                setDislikes(dislikes - 1);
            } else {
                //await addReaction(review_id, (state = 0), pathName);
                await executeAdd(review_id, (state = 0));
                setUserDisliked(true);
                setDislikes(dislikes + 1);
            }
        }
    };

    const handleDeleteReview = async (renderProps) => {
        await executeDeleteReview(profData.professor_id);
        renderProps.close();
        router.refresh();
        infoToast("Review Successfully deleted!");
    };

    return (
        <div>
            <Card className={classname} key={keyS}>
                <div
                    className="relative w-full shrink-0 overflow-hidden
                        rounded-2xl sm:w-fit"
                >
                    <Avatar>
                        <Avatar.Image
                            src={
                                generateAvatarFromStyle(
                                    reviewData.username,
                                    256,
                                    reviewData.avatar_style,
                                ).avatar
                            }
                        ></Avatar.Image>
                    </Avatar>
                </div>
                <div className="flex flex-1 flex-col gap-3 justify-center">
                    <Modal>
                        <Modal.Trigger aria-label="User profile">
                            <Card.Header className="gap-1">
                                <Card.Header>
                                    {selfmode
                                        ? reviewData.review_text
                                            ? `${reviewData.review_text
                                                  .substring(0, 100)
                                                  .trim()}...`
                                            : "No Review Text"
                                        : reviewData.review_text
                                              .substring(0, 100)
                                              .trim()}
                                </Card.Header>
                                <Card.Description>
                                    {selfmode
                                        ? `${reviewData.username}(You)`
                                        : reviewData.username}
                                </Card.Description>
                            </Card.Header>
                        </Modal.Trigger>
                        {children}
                    </Modal>

                    <Card.Footer className="w-full">
                        <Surface
                            className="flex flex-row gap-1 bg-[#1a1a1a]
                                items-center justify-center"
                        >
                            <div className="flex flex-row gap-0.5 z-10">
                                <HeroButton
                                    variant="ghost"
                                    className="hover:bg-[#2a2a2a] border
                                        hover:border-[#69d364] z-10"
                                    isDisabled={selfmode}
                                    onClick={(e) => {
                                        handleUserState(1);
                                    }}
                                >
                                    {isPendingAdd || isPendingDelete ? (
                                        <Icon
                                            icon="codex:loader"
                                            className="text-green-500 size-6"
                                        ></Icon>
                                    ) : userLiked ? (
                                        <Icon
                                            icon="mynaui:like-solid"
                                            className="text-green-500 size-6"
                                        ></Icon>
                                    ) : (
                                        <Icon
                                            icon="mynaui:like"
                                            className="text-green-500 size-6"
                                        ></Icon>
                                    )}
                                    <Text className="text-[#fafafa]">
                                        {likes}
                                    </Text>
                                </HeroButton>
                            </div>
                            <Separator
                                orientation="vertical"
                                className="h-8"
                                isOnSurface={true}
                            ></Separator>
                            <div className="flex flex-row gap-0.5">
                                <HeroButton
                                    variant="ghost"
                                    className="hover:bg-[#2a2a2a] border
                                        hover:border-red-600"
                                    isDisabled={selfmode}
                                    aria-label="dislike"
                                    onClick={(e) => handleUserState(0)}
                                >
                                    {isPendingAdd || isPendingDelete ? (
                                        <Icon
                                            icon="codex:loader"
                                            className="text-red-600 size-6"
                                        ></Icon>
                                    ) : userDisliked ? (
                                        <Icon
                                            icon="mynaui:dislike-solid"
                                            className="text-red-600 size-6"
                                        ></Icon>
                                    ) : (
                                        <Icon
                                            icon="mynaui:dislike"
                                            className="text-red-600 size-6"
                                        ></Icon>
                                    )}

                                    <Text className="text-[#fafafa]">
                                        {dislikes}
                                    </Text>
                                </HeroButton>
                            </div>
                        </Surface>
                        {/* To Show the Edit Button in your own Comment */}
                        {selfmode ? (
                            <div className="w-full flex justify-end gap-1">
                                <Modal>
                                    <Modal.Trigger>
                                        <HeroButton
                                            className="bg-red-500
                                                hover:bg-red-400 font-telex"
                                        >
                                            Delete
                                        </HeroButton>
                                    </Modal.Trigger>
                                    <Modal.Backdrop className="bg-black/80">
                                        <Modal.Container
                                            className="pt-20"
                                            placement="center"
                                        >
                                            <Modal.Dialog className="bg-[#1A1A1A]">
                                                {(renderProps) => (
                                                    <>
                                                        <Modal.Header>
                                                            <Modal.Heading>
                                                                Are you sure?
                                                            </Modal.Heading>
                                                            <Modal.Footer>
                                                                <HeroButton
                                                                    className="bg-red-500
                                                                        hover:bg-red-400
                                                                        font-telex"
                                                                    onPress={() =>
                                                                        handleDeleteReview(
                                                                            renderProps,
                                                                        )
                                                                    }
                                                                >
                                                                    {isPendingDeleteReview ? (
                                                                        <Icon
                                                                            icon="codex:loader"
                                                                            className="text-green-500
                                                                                size-6"
                                                                        ></Icon>
                                                                    ) : (
                                                                        <Icon icon="material-symbols:delete"></Icon>
                                                                    )}
                                                                    Yes, Delete!
                                                                </HeroButton>
                                                                <HeroButton
                                                                    className="bg-[#69d364]
                                                                        hover:opacity-75
                                                                        text-black
                                                                        font-telex"
                                                                    slot="close"
                                                                >
                                                                    Cancel!
                                                                </HeroButton>
                                                            </Modal.Footer>
                                                        </Modal.Header>
                                                    </>
                                                )}
                                            </Modal.Dialog>
                                        </Modal.Container>
                                    </Modal.Backdrop>
                                </Modal>
                                <ReviewModal
                                    profData={profData}
                                    editMode={true}
                                    ratingList={ratingList}
                                    initialReviewtext={reviewData.review_text}
                                >
                                    <HeroButton
                                        className="bg-[#69d364] hover:opacity-75
                                            text-black font-telex"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Edit
                                    </HeroButton>
                                </ReviewModal>
                            </div>
                        ) : undefined}
                    </Card.Footer>
                </div>
            </Card>
        </div>
    );
}
