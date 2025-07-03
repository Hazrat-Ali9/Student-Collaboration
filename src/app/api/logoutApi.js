import axios from "axios";
import { resetSocket } from "../utils/socket";

export default async function logoutApi(authCtx, router, toast, setTimeout) {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.post(
            'http://'+process.env.NEXT_PUBLIC_API_URL+':5000/api/auth/logout',
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 200) {

            await authCtx.logout();
            resetSocket();
            toast.success("Logged out successfully", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });

            setTimeout(() => {
                router.push("/login");
            }, 1000);
        }
    } catch (error) {
        await authCtx.logout();
        resetSocket();
        setTimeout(() => {
            router.push("/login");
        }, 1000);
        // toast.error(`Logout failed: ${error.message}`, {
        //     position: "top-right",
        //     autoClose: 3000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     draggable: true,
        //     theme: "light",
        // });
    }
}
