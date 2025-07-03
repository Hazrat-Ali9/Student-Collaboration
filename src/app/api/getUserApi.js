import axios from "axios";

// API to fetch users data
export default async function getUsersApi({ setUsers }) {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}'); // Get userId from localStorage

    if(!user.id){
      return alert('Session not found')
    }


    const response = await axios.get('http://'+process.env.NEXT_PUBLIC_API_URL+':5000/api/users?userId='+user.id); // Use GET method

    if (response.status === 200) {
      setUsers(response.data.users); // Update the state with fetched users
    }
  } catch (error) {
    console.error("Error fetching users:", error.message); // Error handling
  }
}
