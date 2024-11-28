import { Button, Input, Dialog } from "@material-tailwind/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const DataKTP = ({
  image,
  nik: initialNik,
  name: initialName,
  kecamatan: initialKecamatan,
  open, // Prop untuk open state modal
  onClose, // Prop untuk close handler
}) => {
  const [nik, setNik] = useState(initialNik);
  const [name, setName] = useState(initialName);
  const [kecamatan, setKecamatan] = useState(initialKecamatan);
  const [buyerTypes, setBuyerTypes] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(""); // Control the selected status
  const [ktpImage, setKtpImage] = useState(null); // Track KTP image
  const [umkmImage, setUmkmImage] = useState(null); // Track UMKM image
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null); // Track error state
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    setNik(initialNik);
    setName(initialName);
    setKecamatan(initialKecamatan);
  }, [initialNik, initialName, initialKecamatan]);

  useEffect(() => {
    const fetchBuyerTypes = async () => {
      try {
        const token = Cookies.get("token");
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}api/buyerType`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBuyerTypes(response.data.data);
      } catch (error) {
        setError(error);
        console.error("Error fetching buyer types:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchBuyerTypes();
    }
  }, [open]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "ktpImage" && files.length > 0) {
      setKtpImage(files[0]);
    } else if (name === "umkmImage" && files.length > 0) {
      setUmkmImage(files[0]);
    }
  };

  const handleAddPelanggan = async () => {
    try {
      const token = Cookies.get("token");
      const formData = new FormData();
      formData.append("nik", nik);
      formData.append("nama", name);
      formData.append("alamat", kecamatan);
      formData.append("buyer_type_id", selectedStatus);
      if (ktpImage) formData.append("ktp_image", ktpImage); // Add KTP image if it exists
      if (umkmImage) formData.append("umkm_image", umkmImage); // Add UMKM image if it exists

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}api/customer`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        // Close modal after data is added successfully
        onClose();
        Swal.fire({
          icon: "success",
          title: "Your data has been saved",
          timer: 1500,
        }).then(() => {
          navigate("/scan"); // Redirect to the "Scan" page
        });
      } else {
        setError("Gagal menambahkan data pelanggan.");
      }
    } catch (error) {
      console.error("Error creating customer:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Error creating customer");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="w-[90%] max-h-[95%] overflow-y-auto"
    >
      <div className="p-5">
        <div className="">
          {image && (
            <img
              src={image}
              className="rounded-xl mx-auto md:mx-0"
              alt="Uploaded"
              style={{ maxWidth: "70%", height: "auto" }}
            />
          )}
        </div>
        <div className="space-y-2 mt-2">
          <form>
            <div className="flex flex-wrap justify-between gap-4">
              {/* Row 1 */}
              <div className="flex flex-col w-full sm:w-[48%]">
                <p className="text-black">NIK</p>
                <Input
                  value={nik}
                  size="lg"
                  placeholder="NIK"
                  onChange={(e) => setNik(e.target.value)}
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>
              <div className="flex flex-col w-full sm:w-[48%]">
                <p className="text-black">Nama</p>
                <Input
                  value={name}
                  size="lg"
                  placeholder="Nama"
                  onChange={(e) => setName(e.target.value)}
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>

              {/* Row 2 */}
              <div className="flex flex-col w-full sm:w-[48%]">
                <p className="text-black">Alamat</p>
                <Input
                  value={kecamatan}
                  size="lg"
                  placeholder="Alamat"
                  onChange={(e) => setKecamatan(e.target.value)}
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>
              <div className="flex flex-col w-full sm:w-[48%]">
                <p className="text-black">Status</p>
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    required
                    className="w-full !border-[1.5px] rounded-md !border-gray-300 bg-white text-gray-800 placeholder:opacity-100 focus:!border-t-gray-900"
                    name="status"
                  >
                    <option disabled value="">
                      UMKM/RumahTangga
                    </option>
                    {buyerTypes.map((type) => (
                      <option key={type.id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            {/* Conditional File Upload Fields */}
            {selectedStatus === "UMKM" && (
              <div className="flex flex-col w-full sm:w-[48%]">
                <p className="text-black">Upload UMKM Image</p>
                <input
                  color="gray"
                  size="lg"
                  type="file"
                  name="umkmImage"
                  onChange={handleFileChange} 
                  className="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                />
              </div>
            )}
            </div>
          </form>

          <div className="flex gap-1">
            <Button fullWidth className="mt-2" onClick={onClose}>
              Back
            </Button>
            <Button fullWidth className="mt-2" onClick={handleAddPelanggan}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default DataKTP;
