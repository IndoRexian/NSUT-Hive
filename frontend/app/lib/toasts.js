import { toast } from "sonner";
function infoToast(message) {
    toast.dismiss();
    toast.info(message);
}
function errorToast(message) {
    toast.dismiss();
    toast.error(message);
}

export { infoToast, errorToast };
