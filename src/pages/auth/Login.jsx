import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Button,
} from "@material-tailwind/react";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({});
  const navigate = useNavigate();

  // Redirect ke home jika user sudah login (token ada di cookies)
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      navigate('/home');  // Redirect jika sudah login
    }
  }, [navigate]);

  const validate = () => {
    let tempErrors = {};
    if (!username.trim()) {
      tempErrors.username = "Name is required.";
    }
    if (!password.trim()) {
      tempErrors.password = "Password is required.";
    }
    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}api/login`, {
        username: username,
        password: password,
      });
      const { token } = response.data;

      // Simpan token di cookies
      Cookies.set('token', token, { expires: 7 });  // Token expire dalam 7 hari

      // Redirect ke halaman home
      navigate('/home');
    } catch (error) {
      setError({ apiError: error.response.data.message });
    }
  };
  return (
    <div className='flex justify-center items-center min-h-screen px-3 lg:px-0 bg-cover bg-center relative' style={{ backgroundImage: 'url("https://asumsi.co/wp-content/uploads/2024/05/medium_13-04-2018-07-58-14-8145.jpg")' }}>
    <Card className="w-[30rem] bg-opacity-85 lg:h-[70vh]">
      <CardHeader className='p-5 text-center bg-[#009911] rounded-lg mx-5'>
        <Typography variant="h4" color="white">
          Sign Up
        </Typography>
        <Typography color="white" className="mt-1 font-normal text-sm lg:text-base">
          Silahkan Masukan Username & Password.
        </Typography>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleLogin} className="flex flex-col gap-4 my-5">
          <Typography variant="h6" color="blue-gray" className="-mb-2.5">
            Username
          </Typography>
          <Input label="Username" size="lg" className={`${error.username ? 'border-red-600 focus:border-red-600' : '' }`} value={username} onChange={(e) => setUsername(e.target.value)} error={!!error.username}/>

          <Typography variant="h6" color="blue-gray" className="-mb-2.5">
            Password
          </Typography>
          <Input label="Password" size="lg" type="password" className={`${error.password ? 'border-red-600 focus:border-red-600' : '' }`} value={password} onChange={(e) => setPassword(e.target.value)} error={!!error.password}/>
          <Button fullWidth className='bg-[#009911] mt-5' type="submit">
          Sign In
          </Button>        
        </form>
        <Typography variant="small" className="mt-6 flex justify-center">
          Don&apos;t have an account?
          <Typography
            as="a"
            href="#signup"
            variant="small"
            color="blue-gray"
            className="ml-1 font-bold"
          >
            Sign up
          </Typography>
        </Typography>
      </CardBody>
    </Card>
    </div>
  )
}

export default Login