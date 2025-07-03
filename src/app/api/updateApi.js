import axios from "axios";

export default async function updateApi(token, data, toast, router, setTimeout) {
  try {
    const { password, confirmPassword } = data;

    const response = await axios.post(
      `http://${process.env.NEXT_PUBLIC_API_URL}:5000/api/auth/reset-password/${token}`,
      {
        password,
        confirmPassword,
      }
    );

    if (response.status === 200 || response.status === 201) {
        console.log('password update successfully')
      toast.success("Password updated successfully!", {
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
    console.error("Reset failed:", error.message);
    toast.error(`Failed to update password: ${error.response?.data?.message || error.message}`, {
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
