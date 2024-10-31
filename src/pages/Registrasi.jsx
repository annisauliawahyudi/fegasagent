import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import Swal from "sweetalert2";

const Registrasi = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState({});

  const validate = () => {
    if (!username || !password) {
      setError({ apiError: "Username and password are required" });
      return false;
    }
    return true;
  };

  const handleRegistrasi = async (e) => {
    e.preventDefault(); // prevent default form submission behavior
    if (!validate()) return; // check validation before proceeding

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}api/admin`, {
        username: username,
        password: password,
        location: location
      });

      Swal.fire({
        icon: "success",
        title: "Registrasi berhasil!",
        text: "Anda akan diarahkan ke halaman utama.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        window.location.href = '/home';
      });

    } catch (error) {
      setError({ apiError: error.response ? error.response.data.message : "An error occurred" });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-5 lg:px-0">
      <Card color="white" className="p-6 sm:p-8 lg:p-12 w-full max-w-md sm:max-w-lg lg:w-auto rounded-xl shadow-lg bg-opacity-85">
        <Typography color="black" className="mt-1 font-semibold text-2xl lg:text-3xl text-center">
          Form Registrasi
        </Typography>
        <form className="mt-6 sm:mt-8 mb-2 w-full max-w-xs sm:w-80 lg:w-96" onSubmit={handleRegistrasi}>
          <div className="mb-1 flex flex-col gap-4 sm:gap-6">
            
            <Typography variant="h6" color="blue-gray" className="-mb-3 text-sm sm:text-base">
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
            {error.username && <Typography color="red" className="text-xs sm:text-sm -mt-4">{error.username}</Typography>}

            <Typography variant="h6" color="blue-gray" className="-mb-3 text-sm sm:text-base">
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
            {error.password && <Typography color="red" className="text-xs sm:text-sm -mt-4">{error.password}</Typography>}

            <Typography variant="h6" color="blue-gray" className="-mb-3 text-sm sm:text-base">
              Your location
            </Typography>
            <Input
              size="lg"
              placeholder="Bogor"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              error={!!error.location}
              className={`border border-gray-400 focus:border-gray-900 ${error.location ? 'border-red-500 focus:border-red-500' : ''}`}
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            {error.location && <Typography color="red" className="text-xs sm:text-sm -mt-4">{error.location}</Typography>}
            {error.apiError && <Typography color="red" className="text-xs sm:text-sm mt-2">{error.apiError}</Typography>}
          </div>
          <Button className="mt-6 bg-black text-sm sm:text-base" fullWidth type="submit">
            Registrasi
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Registrasi;
