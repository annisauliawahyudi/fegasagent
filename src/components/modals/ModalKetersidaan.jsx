import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
} from "@material-tailwind/react";
import Cookies from "js-cookie"; // Import library js-cookie
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ModalKetersidaan = ({ open, handler }) => {
  const [current_stock, setCurrentStock] = useState(""); // State for current stock
  const [error, setError] = useState(""); // State for error messages

  // Fetch current stock when the modal opens

  const handleAddGas = async (e) => {
    e.preventDefault();
    // Pastikan stock yang diinputkan adalah angka
    const stockToAdd = parseInt(current_stock, 10);

    try {
      const token = Cookies.get("token"); // Get token from cookies

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}api/add-gas`,
        {
          current_stock: stockToAdd, // Pastikan nilai yang dikirim sudah dalam bentuk angka
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Sertakan token dalam header
            "Content-Type": "application/json",
          },
        }
      );

      // Jika berhasil, tutup modal dan alihkan halaman

      handler(); // Tutup modal
      Swal.fire({
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        window.location.reload(); // Refresh halaman setelah modal ditutup
      });
    } catch (error) {
      setError(
        error.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi."
      ); // Tangani error
      console.log(error);
    }
  };

  return (
    <div>
      <Dialog
        size="xs"
        open={open}
        handler={handler}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <div className="flex justify-between">
              <Typography variant="h4" color="blue-gray">
                Ketersediaan Gas
              </Typography>
              <button onClick={handler}>
                <IoMdClose className="text-3xl" />
              </button>
            </div>

            <Typography
              className="mb-0 font-normal"
              variant="paragraph"
              color="gray"
            >
              Masukan Jumlah Gas
            </Typography>
            <Input
              label=""
              size="lg"
              type="number"
              value={current_stock}
              onChange={(e) => setCurrentStock(e.target.value)}
            />

            {/* Show error message if exists */}
            {error && (
              <Typography className="text-red-500 mt-2" variant="small">
                {error}
              </Typography>
            )}
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="" onClick={handleAddGas} fullWidth>
              Submit
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </div>
  );
};

export default ModalKetersidaan;
