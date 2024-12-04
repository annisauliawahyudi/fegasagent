import { Button, Input, Dialog } from "@material-tailwind/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const DataKTP = ({
  image: initialImage,
  nik: initialNik,
  name: initialName,
  alamat: initialAlamat,
  open, // Prop untuk open state modal
  onClose, // Prop untuk close handler
}) => {
  const [image, setImage] = useState(initialImage);
  const [nik, setNik] = useState(initialNik);
  const [name, setName] = useState(initialName);
  const [alamat, setAlamat] = useState(initialAlamat);
  const [buyerTypes, setBuyerTypes] = useState([]);
  const [gambar, setGambar] = useState(null); // For the image file
  const [selectedStatus, setSelectedStatus] = useState(""); // Control the selected status
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null); // Track error state
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    setImage(initialImage);
    setNik(initialNik);
    setName(initialName);
    setAlamat(initialAlamat);
  }, [initialImage, initialNik, initialName, initialAlamat]);

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
    const { files } = e.target;
    if (files.length > 0) {
      setGambar(files[0]); // Simpan file ke state gambar
    }
  };

  const handleAddPelanggan = async () => {
    try {
      const token = Cookies.get("token");
      const formData = new FormData();
      if (image) {
        const response = await fetch(image); // Fetch blob dari URL gambar
        const blob = await response.blob(); // Konversi ke blob
        formData.append("fotoKtp", blob, "ktp-image.jpg"); // Tambahkan ke FormData
      }
      formData.append("nik", nik);
      formData.append("nama", name);
      formData.append("alamat", alamat);
      
      // Temukan ID buyer_type berdasarkan nama yang dipilih
      const buyerType = buyerTypes.find(type => type.name === selectedStatus);
      if (buyerType) {
        formData.append("buyer_type_id", buyerType.id); // Kirim ID, bukan nama
      } else {
        setError("Tipe pembeli tidak valid.");
        return;
      }
      
      if (gambar) formData.append("gambar", gambar); // Hanya tambahkan jika ada file gambar
  
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
        // Tutup modal terlebih dahulu
        onClose(); 
  
        // Tampilkan alert SweetAlert setelah modal tertutup
        Swal.fire({
          icon: "success",
          title: "Your data has been saved",
          timer: 1500,
          showConfirmButton: false,
          willClose: () => {
            navigate("/home/scan"); // Navigasi ke halaman utama
          },
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
              className="rounded-lg mx-auto md:mx-0"
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
                <p className="text-black">NIK <span className="text-red-600">*</span></p>
                <Input
                  required
                  value={nik}
                  size="lg"
                  placeholder="NIK"
                  onChange={(e) => {
                    const value = e.target.value;
                    // Validasi agar hanya menerima angka dan panjang maksimal 16
                    if (/^\d*$/.test(value) && value.length <= 16) {
                      setNik(value);
                    }
                  }}
                  onBlur={() => {
                    if (nik.length !== 16) {
                      alert("NIK harus terdiri dari 16 digit angka!");
                    }
                  }}
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>
              <div className="flex flex-col w-full sm:w-[48%]">
                <p className="text-black">Nama <span className="text-red-600">*</span></p>
                <Input
                  required
                  value={name}
                  size="lg"
                  onChange={(e) => setName(e.target.value)}
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>

              {/* Row 2 */}
              <div className="flex flex-col w-full sm:w-[48%]">
                <p className="text-black">Alamat <span className="text-red-600">*</span></p>
                <Input
                  required
                  value={alamat}
                  size="lg"
                  placeholder="Alamat"
                  onChange={(e) => setAlamat(e.target.value)}
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>
              <div className="flex flex-col w-full sm:w-[48%]">
                <p className="text-black">Status <span className="text-red-600">*</span></p>
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    required
                    className="w-full !border-[1.5px] rounded-md !border-gray-300 bg-white text-gray-800 placeholder:opacity-100 focus:!border-t-gray-900"
                    name="status"
                  >
                    <option disabled value="">
                      Pilih Status Pembeli
                    </option>
                    {buyerTypes.map((type) => (
                      <option key={type.id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Conditional File Upload Fields */}
            {selectedStatus === "UMKM" && (
              <div className="flex flex-col w-full sm:w-[48%] mt-2">
                <p className="text-black">Upload Gambar</p>
                <input
                  required
                  type="file"
                  name="gambar"
                  onChange={handleFileChange}
                  className="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                />
              </div>
            )}
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
