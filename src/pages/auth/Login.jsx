import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';

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
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center relative px-10 lg:px-0" style={{ backgroundImage: 'url("https://asumsi.co/wp-content/uploads/2024/05/medium_13-04-2018-07-58-14-8145.jpg")' }}>
      <Card color="white" className='p-8 lg:p-12 bg-opacity-85 w-screen lg:w-auto rounded-xl'>
        <img src="/logo.svg" alt="Logo" className='w-12' />
        <Typography color="black" className="mt-1 font-normal">
          Selamat datang di website GasAgent!
        </Typography>
        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleLogin}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Your Name
            </Typography>
            <Input
              size="lg"
              placeholder="John Doe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!error.username}
              className={`border border-gray-400 focus:border-gray-900 ${error.username ? 'border-red-500 focus:border-red-500' : ''}`}
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            {error.username && <Typography color="red" className="text-sm -mt-5">{error.username}</Typography>}
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!error.password}
              className={`border border-gray-400 focus:border-gray-900 ${error.password ? 'border-red-500 focus:border-red-500' : ''}`}
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            {error.password && <Typography color="red" className="text-sm -mt-5">{error.password}</Typography>}
            {error.apiError && <Typography color="red" className="text-sm mt-3">{error.apiError}</Typography>}
          </div>
          <Button className="mt-6 bg-[#00aa13]" fullWidth type="submit">
            Sign Up
          </Button>
          <Typography className='text-center mt-10 text-sm' color='black'>
              Copyright ©2024
          </Typography>
        </form>
      </Card>
    </div>
  );
};

export default Login;
