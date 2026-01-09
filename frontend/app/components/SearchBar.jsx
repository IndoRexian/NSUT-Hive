"use client";
import {
    Input,
    TextField,
    FieldError,
    Select,
    ListBox,
    Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState, useMemo } from "react";
import Fuse from "fuse.js";

import ProfCard from "../components/ProfCard";

function cardMapping(profData, deptData) {
    //console.log(profData);
    return profData.map((profObject) => (
        <ProfCard
            key={profObject.professor_id}
            profData={profObject}
            deptData={deptData}
        ></ProfCard>
    ));
}

function handleSearch(profData, value) {
    if (value === "") {
        return profData.sort((a, b) => {
            const global1 = a.global_rating;
            const global2 = b.global_rating;
            if (global1 > global2) {
                return -1;
            }
            if (global1 < global2) {
                return 1;
            }
            return 0;
        });
    } else {
        const newData = new Fuse(profData, { keys: ["name"] });
        return newData.search(value).map((result) => result.item);
    }
}

function handleRegularSearch(profData, value) {
    if (value === "") {
        return profData.sort((a, b) => {
            const global1 = a.global_rating;
            const global2 = b.global_rating;
            if (global1 > global2) {
                return -1;
            }
            if (global1 < global2) {
                return 1;
            }
            return 0;
        });
    } else {
        const results = profData.filter((item) =>
            item.name.toLowerCase().includes(value.toLowerCase()),
        );
        return results;
    }
}
export default function Search({ profData, deptData }) {
    const [value, setValue] = useState("");
    const [search, setSearch] = useState("fuzzy");
    const filteredData = useMemo(() => {
        if (search === "fuzzy") {
            return handleSearch(profData, value);
        } else {
            return handleRegularSearch(profData, value);
        }
    }, [profData, value, search]);
    const found = filteredData.length != 0;

    return (
        <>
            <div className="ml-2 mb-3 mt-2 flex flex-row items-center">
                <TextField
                    isInvalid={!found}
                    className="sm:w-[33%] pr-2"
                    // className="w-screen"
                    onChange={(v) => {
                        setValue(v);
                    }}
                >
                    <Input
                        className="h-10 p-1 border-[#3F3F3F] border rounded
                            focus:outline-none focus:ring-2 focus:ring-[#99E910]
                            bg-[#1A1A1A] text-[#fafafa]"
                        placeholder="Search for Professors..."
                    ></Input>
                    <FieldError className="text-red-500 pl-1 text-xl mt-1"></FieldError>
                </TextField>
                <Select
                    placeholder="Search Type"
                    value={search}
                    onChange={(value) => setSearch(value)}
                >
                    {" "}
                    <Select.Trigger
                        className="h-10 border-[#3F3F3F] border rounded
                            focus:outline-none focus:ring-2 focus:ring-[#99E910]
                            bg-[#1A1A1A] text-[#fafafa]"
                    >
                        <Select.Value className="text-[#99E910]" />
                        <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover
                        className="border-[#3F3F3F] border rounded
                            focus:outline-none focus:ring-2 focus:ring-[#99E910]
                            bg-[#1A1A1A] text-[#fafafa]"
                    >
                        <ListBox>
                            <ListBox.Item
                                id="fuzzy"
                                className="hover:bg-[#2A2A2A] focus:bg-[#2A2A2A]
                                    hover:scale-[1.05] hover:text-[#99E910]"
                            >
                                <Tooltip delay={0} closeDelay={0}>
                                    <Tooltip.Trigger>
                                        Fuzzy Search
                                    </Tooltip.Trigger>
                                    <Tooltip.Content
                                        showArrow
                                        className="bg-[#2a2a2a] border
                                            border-[#69d374] items-center m-2"
                                    >
                                        <Tooltip.Arrow>
                                            <Icon
                                                icon="lsicon:triangle-down-filled"
                                                className="text-[#2a2a2a]"
                                            ></Icon>
                                        </Tooltip.Arrow>
                                        <p>
                                            Find Professors even if name is not
                                            precise.
                                        </p>
                                    </Tooltip.Content>
                                </Tooltip>
                                <ListBox.ItemIndicator
                                    className="text-white pl-1"
                                />
                            </ListBox.Item>

                            <ListBox.Item
                                id="regular"
                                className="hover:bg-[#2A2A2A] focus:bg-[#2A2A2A]
                                    hover:scale-[1.05] hover:text-[#99E910]"
                            >
                                <Tooltip delay={0} closeDelay={0}>
                                    <Tooltip.Trigger>
                                        Regular Search
                                    </Tooltip.Trigger>
                                    <Tooltip.Content
                                        showArrow
                                        className="bg-[#2a2a2a] border
                                            border-[#69d374] items-center m-2"
                                    >
                                        <Tooltip.Arrow>
                                            <Icon
                                                icon="lsicon:triangle-down-filled"
                                                className="text-[#2a2a2a]"
                                            ></Icon>
                                        </Tooltip.Arrow>
                                        <p>
                                            Normal Search where value should
                                            match the Professor&apos;s name.
                                        </p>
                                    </Tooltip.Content>
                                </Tooltip>
                                <ListBox.ItemIndicator
                                    className="text-white pl-2"
                                />
                            </ListBox.Item>
                        </ListBox>
                    </Select.Popover>
                </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3">
                {found ? cardMapping(filteredData, deptData) : null}
            </div>
        </>
    );
}
