import axios from 'axios';

// API function to send the magic link email
export default async function sendMagicLinkApi(email, toast,setEmail,setAnimateSend) {
  try {
    const response = await axios.post('http://'+process.env.NEXT_PUBLIC_API_URL+':5000/api/send-magic-link', {
      to: email,  
    });

    if (response.status === 200) {
        setAnimateSend(true);
      toast.success("Send Link successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      console.log('Magic link sent successfully');
      setEmail('')
      
    }
  } catch (error) {
    toast.error("Error sending magic link", {
      position: "top-right",
    });
    // console.error("Magic link error:", error?.response?.data || error.message);
  }
}
