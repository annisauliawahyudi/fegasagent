import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { Input, Select, Button, Dialog, IconButton, Typography, DialogBody, DialogHeader, DialogFooter } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaPlus } from "react-icons/fa";
import { Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";

export function CreatePelanggan({ refreshTable }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [buyerTypes, setBuyerTypes] = useState([]);
  const [formValues, setFormValues] = useState({
    nik: "",
    nama: "",
    alamat: "",
    gambar: "",
    status: "", // Tambahkan status (buyer_type_id) ke dalam formValues
  });

  const handleOpen = () => setOpen(!open);

 const handleInputChange = (e) => {
  const { name, value, files } = e.target;

  if (name === "gambar" && files.length > 0) {
    // Set file object for 'gambar' field
    setFormValues((prev) => ({ ...prev, gambar: files[0] }));
  } else {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }
};

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    console.log("Selected Status Value:", value); // Debugging
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchBuyerTypes = async () => {
      try {
        const token = Cookies.get("token");
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}api/buyerType`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBuyerTypes(response.data.data);
        console.log("Buyer Types:", response.data.data); // Debugging
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

  const validateForm = () => {
  for (const [key, value] of Object.entries(formValues)) {
    // Skip gambar validation if the selected buyer type is not UMKM
    if (key === "gambar" && formValues.status !== "35016fa1-8493-45dd-9239-3e29809e19ad") {
      continue;
    }
    // Check if value is a string before calling trim
    if (typeof value === "string" && value.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Field ${key} harus diisi!`,
        timer: 2000,
      });
      return false;
    }
    // Check if gambar is required and missing
    if (key === "gambar" && formValues.status === "35016fa1-8493-45dd-9239-3e29809e19ad" && !value) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Field gambar harus diisi untuk buyer type UMKM!",
        timer: 2000,
      });
      return false;
    }
  }
  return true;
};


  const handleAddPelanggan = async () => {
    if (!validateForm()) return;

    try {
      const token = Cookies.get("token");
      const { nik, nama, alamat, gambar, status: buyer_type_id } = formValues;

      // Use FormData to handle file uploads
      const formData = new FormData();
      formData.append("nik", nik);
      formData.append("nama", nama);
      formData.append("alamat", alamat);
      formData.append("buyer_type_id", buyer_type_id);

      // Append the image file only if buyer_type_id is 'UMKM'
      if (buyer_type_id === "35016fa1-8493-45dd-9239-3e29809e19ad" && gambar) {
        formData.append("gambar", gambar);
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}api/customer`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Set the correct content type for file uploads
        },
      });

      if (response.status === 201) {
        setOpen(false);
        Swal.fire({
          icon: "success",
          title: "Your data has been saved",
          timer: 1500,
        }).then(() => {
          window.location.reload();
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
    <>
      <div className="flex gap-2 mr-4 h-11">
        <Button className="px-3 py-3 bg-[#00AA13] text-white rounded-full">
          <FaPlus className="text-xl" onClick={handleOpen} />
        </Button>
      </div>

      <Dialog size="sm" open={open} handler={handleOpen} className="p-4 w-[90%] lg:w-[50%] lg:p-0">
        <DialogHeader className="relative m-0 block">
          <Typography variant="h4" color="blue-gray">
            Tambah Data Pelanggan
          </Typography>
          <Typography className="mt-1 font-normal text-gray-600">Pastikan data sesuai dengan KTP.</Typography>
          <IconButton size="sm" variant="text" className="!absolute right-3.5 top-3.5" onClick={handleOpen}>
            <FontAwesomeIcon icon="fa-solid fa-xmark" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="space-y-4 pb-6">
          <div className="lg:flex lg:gap-4">
            <div className="w-full mt-5">
              <Typography variant="small" color="blue-gray" className="lg:mb-2 text-left font-medium">
                NIK
              </Typography>
              <Input
                required
                color="gray"
                size="lg"
                placeholder="NIK Sesuai KTP"
                name="nik"
                value={formValues.nik}
                onChange={handleInputChange}
                className="placeholder:opacity-100 focus:!border-t-gray-900"
                containerProps={{ className: "!min-w-full" }}
                labelProps={{ className: "hidden" }}
              />
            </div>
            <div className="w-full mt-5">
              <Typography variant="small" color="blue-gray" className="lg:mb-2 text-left font-medium">
                Nama
              </Typography>
              <Input
                required
                color="gray"
                size="lg"
                placeholder="Nama Sesuai KTP"
                name="nama"
                value={formValues.nama}
                onChange={handleInputChange}
                className="placeholder:opacity-100 focus:!border-t-gray-900"
                containerProps={{ className: "!min-w-full" }}
                labelProps={{ className: "hidden" }}
              />
            </div>
          </div>

          {/* Other fields */}
          <div className="lg:flex lg:gap-4 ">
            <div className="w-full mt-5">
              <Typography variant="small" color="blue-gray" className="lg:mb-2 text-left font-medium">
                Alamat
              </Typography>
              <Input
                required
                color="gray"
                size="lg"
                placeholder="Alamat Sesuai KTP"
                name="alamat"
                value={formValues.alamat}
                onChange={handleInputChange}
                className="placeholder:opacity-100 focus:!border-t-gray-900"
                containerProps={{ className: "!min-w-full" }}
                labelProps={{ className: "hidden" }}
              />
            </div>

            <div className="w-full mt-5">
              <Typography variant="small" color="blue-gray" className="lg:mb-2 text-left font-medium">
                Status
              </Typography>
              {loading ? (
                <p>Loading buyer types...</p>
              ) : (
                <div className="relative">
                  <select
                    required
                    className="w-full h-full px-3 py-3 text-sm font-normal bg-transparent border rounded-md border-blue-gray-200 focus:border-gray-900 focus:outline-0"
                    name="status"
                    onChange={handleSelectChange}
                    value={formValues.status}
                  >
                    <option value="" disabled hidden>
                      UMKM/RumahTangga
                    </option>
                    {buyerTypes.length > 0 ? (
                      buyerTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>Loading options...</option>
                    )}
                  </select>
                </div>
              )}
            </div>

            {/* Conditional Image Input for UMKM */}
            {formValues.status === "35016fa1-8493-45dd-9239-3e29809e19ad" && (
              <div className="w-full mt-5">
                <Typography variant="small" color="blue-gray" className="lg:mb-2 text-left font-medium">
                  Gambar
                </Typography>
                <input
                  color="gray"
                  size="lg"
                  type="file"
                  name="gambar"
                  onChange={handleInputChange} // No 'value' attribute here
                  className="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                />
              </div>
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button className="ml-auto" onClick={handleAddPelanggan}>
            Tambah Data
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default CreatePelanggan;
