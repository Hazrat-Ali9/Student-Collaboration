import axios from "axios";

export default async function getMessagesApi(userId) {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
            `http://${process.env.NEXT_PUBLIC_API_URL}:5000/api/messages/${userId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 200) {
          console.log(response,'data...................')
          return response;
      

            // await authCtx.logout();
            // toast.success("Logged out successfully", {
            //     position: "top-right",
            //     autoClose: 3000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     theme: "light",
            // });

            // setTimeout(() => {
            //     router.push("/login");
            // }, 1000);
        }
    } catch (error) {
        // toast.error(`Logout failed: ${error.message}`, {
        //     position: "top-right",
        //     autoClose: 3000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     draggable: true,
        //     theme: "light",
        // });
        console.log('erorrrrrr')
        return null;
    }
}
