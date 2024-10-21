import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2"; 
import { Button, Modal } from "flowbite-react";

const DetailPelanggan = ({ isOpen, onClose, customerId }) => {
  const [customerDetails, setCustomerDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (isOpen && customerId) {
        setLoading(true);
        setError(null);

        try {
          const token = Cookies.get("token");
          const response = await axios.get(`${import.meta.env.VITE_API_URL}api/customer/${customerId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCustomerDetails(response.data.data);
        } catch (err) {
          setError("Failed to fetch customer details.");
          Swal.fire("Error", "Unable to load customer details", "error");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCustomerDetails();
  }, [isOpen, customerId]);

  if (!isOpen) return null; // Modal tidak akan dirender jika tidak terbuka

  return (
    <>
      <Modal show={isOpen} onClose={onClose}>
       
       <div className="">
        <Modal.Header><b>Detail Pelanggan</b></Modal.Header>
       </div>
          
          {/* <div className="ml-6">
            Detail Customer
          </div>
          <hr/> */}
        
        {loading ? (
          <p>Loading customer details...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : customerDetails ? (
          <Modal.Body>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative bg-gray-200 rounded-lg bg-opacity-50 p-1 shadow-xl">
                <label className="absolute -top-5  px-1 text-sm  bg-transparent z-10 font-bold">Nama:</label>
                <p className="text-sm leading-relaxed font-medium mt-2 lg:ml-4">{customerDetails.nama}</p>
                <div className="absolute top-0 left-0 w-full h-full border-2 border-transparent rounded-lg pointer-events-none"></div>
              </div>
              <div className="relative bg-gray-200 rounded-lg bg-opacity-50 p-1 shadow-xl">
                <label className="absolute -top-5  px-1 text-sm  bg-transparent z-10 font-bold">NIK:</label>
                <p className="text-sm leading-relaxed font-medium mt-2 lg:ml-4">{customerDetails.nik}</p>
                <div className="absolute top-0 left-0 w-full h-full border-2 border-transparent rounded-lg pointer-events-none"></div>
              </div>
              <div className="relative bg-gray-200 rounded-lg bg-opacity-50 p-1 shadow-xl mt-6">
                <label className="absolute -top-5  px-1 text-sm  bg-transparent z-10 font-bold">Rt/Rw:</label>
                <p className="text-sm leading-relaxed font-medium mt-2 lg:ml-4">{customerDetails.rt_rw}</p>
                <div className="absolute top-0 left-0 w-full h-full border-2 border-transparent rounded-lg pointer-events-none"></div>
              </div>
              <div className="relative bg-gray-200 rounded-lg bg-opacity-50 p-1 shadow-xl mt-6">
                <label className="absolute -top-5  px-1 text-sm  bg-transparent z-10 font-bold">Alamat:</label>
                <p className="text-sm leading-relaxed font-medium mt-2 lg:ml-4">{customerDetails.alamat}</p>
                <div className="absolute top-0 left-0 w-full h-full border-2 border-transparent rounded-lg pointer-events-none"></div>
              </div>
              <div className="relative bg-gray-200 rounded-lg bg-opacity-50 p-1 shadow-xl mt-6">
                <label className="absolute -top-5  px-1 text-sm  bg-transparent z-10 font-bold">Kel_desa:</label>
                <p className="text-sm leading-relaxed font-medium mt-2 lg:ml-4">{customerDetails.kel_desa}</p>
                <div className="absolute top-0 left-0 w-full h-full border-2 border-transparent rounded-lg pointer-events-none"></div>
              </div>
              <div className="relative bg-gray-200 rounded-lg bg-opacity-50 p-1 shadow-xl mt-6">
                <label className="absolute -top-5  px-1 text-sm  bg-transparent z-10 font-bold">Kec:</label>
                <p className="text-sm leading-relaxed font-medium mt-2 lg:ml-4">{customerDetails.kecamatan}</p>
                <div className="absolute top-0 left-0 w-full h-full border-2 border-transparent rounded-lg pointer-events-none"></div>
              </div>
              
            </div>
          </Modal.Body>
        ) : (
          <p>No customer details available.</p>
        )}
        {/* <Modal.Footer>
          <Button onClick={onClose}>Close</Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};

export default DetailPelanggan;
