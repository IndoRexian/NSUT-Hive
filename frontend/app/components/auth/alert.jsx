//import { Toaster } from "@/components/ui/sonner";
import { toast, Toaster } from "sonner";
import { useEffect } from "react";

export default function AlertPopup({ error }) {
    useEffect(() => {
        if (error) {
            toast.dismiss();
            toast.error(error);
        }
    }, [error]);
    return (
        <div>
            <Toaster richColors closeButton position="top-left" />
        </div>
    );
}
