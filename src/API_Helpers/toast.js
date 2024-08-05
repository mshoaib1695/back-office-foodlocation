import { toast } from "react-toastify"

export default function (res) {
    if (res.data.success) {
        if (res?.data?.message) {
            toast.success(res?.data?.message)
        }
    } else {
        if (res?.data?.message) {
            toast.error(res?.data?.message)
        }

    }
}