import axios from "axios";

export default async function forgotApi(data, toast, router, setTimeout) {
  try {
    const email = data?.email;
    const response = await axios.post('http://'+process.env.NEXT_PUBLIC_API_URL+':5000/api/auth/forgot-password', {
        email,
    });

    if (response.status === 200 || response.status === 201) {
        console.log('Email send successfully')
      toast.success("Reset password link sent to your email.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    //   setTimeout(() => {
    //     router.push("/update-password"); 
    //   }, 1000); 
    }
  } catch (error) {
    console.error(error.message);
    toast.error(`Failed to send reset link: ${error.response?.data?.message || error.message}`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  }
}
