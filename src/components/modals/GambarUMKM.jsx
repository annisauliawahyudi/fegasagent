import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { IoMdClose } from "react-icons/io";
import { Dialog, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";

function GambarUMKM({ isOpen, onClose, customerId }) {
  const [gambar, setGambar] = useState(null); // Store the selected customer's image
  const [error, setError] = useState(null); // Store error state
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const fetchGambar = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}api/customer/${customerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const gambarPath = response.data.data.gambar;
        const fullGambarURL = gambarPath ? `${import.meta.env.VITE_API_URL}${gambarPath}` : null;

        setGambar(fullGambarURL);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && customerId) {
      fetchGambar();
    }
  }, [isOpen, customerId]);

  return (
    <>
      <Dialog
      open={isOpen}
      handler={onClose}
      size="xs"
      className="p-4 w-[90%] lg:w-[40%]"
    >
      {/* <DialogHeader>Foto UMKM</DialogHeader> */}
      <DialogBody className="space-y-4">
        <div className="flex justify-between">
        <Typography className="text-xl text-black font-semibold">
          Bukti UMKM
        </Typography>
        <Button onClick={onClose} className="mr-1">
          <IoMdClose/>
        </Button>
        </div>
      
        {loading && <p>Loading image...</p>}
        {error && <p className="text-red-500">Error fetching image: {error.message}</p>}
        {!loading && !error && (
          <div className="flex justify-center items-center">
            {gambar ? (
              <img
                src={gambar || "https://via.placeholder.com/150"}
                alt="Customer"
                className="rounded-lg border border-gray-300"
              />
            ) : (
              <p className="text-center text-gray-500">Gambar tidak tersedia</p>
            )}
          </div>
        )}
      </DialogBody>
      <DialogFooter>
        
      </DialogFooter>
    </Dialog>
    </>
  
  );
}

export default GambarUMKM;
