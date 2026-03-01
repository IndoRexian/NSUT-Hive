"use client";

import { UserDataContext } from "../context/context";

export default function UserProvider({ value, children }) {
    return (
        <UserDataContext.Provider value={value}>
            {children}
        </UserDataContext.Provider>
    );
}
