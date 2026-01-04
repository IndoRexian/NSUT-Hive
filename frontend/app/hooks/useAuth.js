// hooks/useAuthAction.js
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
// Optional: import toast library if you use one
import { toast } from "sonner";

export function useAuthAction(action) {
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const execute = async (...args) => {
        return new Promise((resolve, reject) => {
            startTransition(async () => {
                try {
                    // 1. Run the Server Action
                    const result = await action(...args);
                    // 2. Check for Auth Error globally
                    if (result?.error === "unauthenticated") {
                        toast.error("Please Login to Continue");
                        router.push(
                            `/login?redirect=${encodeURIComponent(pathname)}`,
                        );
                        resolve(null); // Return null so the component knows it failed
                        return;
                    }

                    // 3. Pass successful result back to component
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
        });
    };

    return { execute, isPending };
}
