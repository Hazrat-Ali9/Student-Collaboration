import axios from 'axios';

export default async function signUpApi(data, router, toast, setTimeout) {
  try {
    const response = await axios({
      method: 'post',
      url: 'http://' + process.env.NEXT_PUBLIC_API_URL + ':5000/api/auth/signup',
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmpassword
      }
    });

    if (response.status === 200 || response.status === 201) {
      toast.success('Signup successful!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light'
      });

      setTimeout(() => {
        router.push('/login');
      }, 1000);
    }
  } catch (error) {
    debugger;
    console.log(error.message);

    toast.error(`Signup failed: ${error.response.data.message || 'An unexpected error occurred'}`, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'light'
    });
  }
}
