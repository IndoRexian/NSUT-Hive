import Image from "next/image";
import { Card, Text } from "@heroui/react";
import { getList } from "./professors/Reviews";
import placeHolderPFP from "../../public/placeholder_pfp.svg";
import Link from "next/link";

export default function ProfCard({ profData, deptData }) {
    //console.log(profData);
    const starsSystem = getList(profData.global_rating, 32);
    return (
        <Link href={`/professors/${profData.public_id}`}>
            <Card
                className="w-auto bg-[#1F1F1F] border border-[#2A2A2A]
                    items-stretch md:flex-row rounded-sm m-2 p-1 cursor-pointer
                    transition-transform duration-300 hover:scale-[1.025]
                    hover:shadow-[0_0_10px_2px_#AFE7A6] animate-slideInFromLeft"
            >
                <div className="flex flex-row">
                    <div
                        className="relative h-35 w-35 shrink-0 overflow-hidden
                            sm:h-40 sm:w-30 rounded-sm m-1 justify-items-center"
                    >
                        <Image
                            src={
                                profData.img_link
                                    ? profData.img_link
                                    : placeHolderPFP
                            }
                            width={250}
                            height={300}
                            alt={
                                profData.img_link
                                    ? "Image of Professor"
                                    : "Image by Clker-Free-Vector-Images from Pixabay"
                            }
                            className="m-2 pointer-events-none absolute inset-0
                                h-full w-full scale-125 mx-auto"
                        ></Image>
                    </div>
                    <div className="flex flex-1 flex-col gap-3 m-1">
                        <Card.Header className="gap-1">
                            <Card.Title
                                className="profName pt-1 text-center
                                    text-[#4bcc4c] font-bold text-xl"
                            >
                                {profData.name}
                            </Card.Title>
                            <Text
                                className="basis-full text-right pb-3
                                    text-[#D2D2D2]"
                            >
                                - {profData.designation}
                            </Text>
                            <Card.Description>
                                <div className="department flex flex-row">
                                    <Text
                                        className="basis-auto font-bold
                                            font-telex"
                                    >
                                        Department:{" "}
                                    </Text>
                                    <Text
                                        className="basis-full ml-1 text-left
                                            text-[#69d364] font-telex"
                                    >
                                        {
                                            deptData[
                                                Number(profData.department - 1)
                                            ].name
                                        }
                                    </Text>
                                </div>
                            </Card.Description>
                        </Card.Header>
                        <Card.Footer className="mt-auto w-max">
                            <div
                                className="flex flex-row justify-center
                                    items-center"
                            >
                                {starsSystem.map((element) => element)}
                                <h1 className="text-white">
                                    ({profData.global_rating.toFixed(1)})
                                </h1>
                            </div>
                        </Card.Footer>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
