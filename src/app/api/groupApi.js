import axios from "axios";

export async function createGroup(name) {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    'http://'+process.env.NEXT_PUBLIC_API_URL+':5000/api/groups',
    { name },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function getGroups() {
  const token = localStorage.getItem("token");
  const response = await axios.get('http://'+process.env.NEXT_PUBLIC_API_URL+':5000/api/groups', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

// groupApi.js
export const deleteGroup = async (groupId,toast) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error('No token found');
      // You can redirect the user to the login page or show an error message
      return;
    }
  try {
    const response = await axios.delete(`http://${process.env.NEXT_PUBLIC_API_URL}:5000/api/groups/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data; // Return response data
  } catch (error) {
    console.error('Error deleting group:', error);
    toast.success(`Error: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    });
    // throw new Error('Failed to delete group');
  }
};

export const updateGroupName = async (groupId, newName, toast) => {
    const token = localStorage.getItem('token');

    if (!token) {
        toast.error("No authentication token found.");
        return null;
    }

    try {
        const response = await axios.put(
            `http://${process.env.NEXT_PUBLIC_API_URL}:5000/api/groups/${groupId}`,
            { name: newName },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        // toast.success(response.data.message || "Group updated successfully");
        return response.data.group;
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Failed to update group name";
        toast.error(message);
        console.error("Update group error:", error);
        return null;
    }
};

