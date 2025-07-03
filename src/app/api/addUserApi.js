import axios from "axios";

export default async function addUserApi(data, toast) {
  return  new Promise(async (resolve, reject) => {
  console.log(data, 'api data................');
  
  try {
    // Retrieve the token from localStorage (or wherever you store it)
    const token = localStorage.getItem('token');  // You can replace this with the appropriate method of fetching the token

    const response = await axios({
      method: "post", 
      url: 'http://'+process.env.NEXT_PUBLIC_API_URL+':5000/api/users/update', 
      headers: {
        "Content-Type": "application/json", // Make sure this header is set
        "Authorization": `Bearer ${token}`, // Add Authorization header
      },
      data: {
        email: data.email,       
        name: data.name,         
        department: data.department, 
        phone: data.phone,       
        cnic: data.cnic,        
        address: data.address,   
        dob: data.dob,          
        role: data.role,         
      },
    });

    if (response.status === 200 || response.status === 201) {
      resolve();
      toast.success("User details updated successfully!", {
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

    toast.error(`Update failed , Unauthorized: ${error.message}`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  }
  });
}
