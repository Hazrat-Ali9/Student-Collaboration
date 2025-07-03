import axios from "axios";

export default async function deleteUserApi(id, toast) {
    try {
        const token = localStorage.getItem('token');
        console.log(token,'token');
        console.log(id,'id..........')
        const response = await axios({
            method: "delete",
            url: 'http://'+process.env.NEXT_PUBLIC_API_URL+':5000/api/users/${id}',
            headers: {
                "Content-Type": "application/json", // Make sure this header is set
                "Authorization": `Bearer ${token}`, // Add Authorization header
            },

        });

        if (response.status === 200 || response.status === 201) {

            console.log(response, 'user deleted successfully.......')
            //   notify('User deleted successfully');
            toast.success("User deleted Successfully", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });

        }
    } catch (error) {
        console.log(error.message);

        // notify(error.message);
        toast.success(`Error: ${error.message}`, {
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
