import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { Input, Select, Button, Dialog, IconButton, Typography, DialogBody, DialogHeader, DialogFooter } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaPlus } from "react-icons/fa";

export function CreatePelanggan({ refreshTable }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [buyerTypes, setBuyerTypes] = useState([]);
  const [formValues, setFormValues] = useState({
    nik: "",
    nama: "",
    alamat: "",
    status: "", // Tambahkan status (buyer_type_id) ke dalam formValues
  });

  const handleOpen = () => setOpen(!open);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e) => {
    setFormValues((prev) => ({ ...prev, status: e.target.value })); // Update buyer_type_id ke dalam formValues
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
    // Check if all fields are filled
    for (const [key, value] of Object.entries(formValues)) {
      if (value.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Field ${key} harus diisi!`,
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
    const { nik, nama, alamat, status: buyer_type_id } = formValues;

    console.log({ nik, nama, alamat, buyer_type_id });

    const response = await axios.post(`${import.meta.env.VITE_API_URL}api/customer`, { 
      nik, 
      nama, 
      alamat, 
      buyer_type_id
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 201) {
      // Tutup modal setelah data berhasil ditambahkan
      setOpen(false);
      Swal.fire({
        icon: "success",
        title: "Your data has been saved",
        timer: 1500,
      }).then(() => {
        window.location.reload(); // Memanggil fungsi untuk menyegarkan tabel
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
      <Button onClick={handleOpen} variant="gradient" className="px-4 py-4 bg-[#00AA13] rounded-full">
        <FaPlus className="text-white" />
      </Button>
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
                  <select required className="w-full !border-[1.5px] !border-gray-300 bg-white text-gray-800 placeholder:opacity-100 focus:!border-t-gray-900" name="status" onChange={handleSelectChange} value={formValues.status}>
                    <option value="" disabled hidden>
                      UMKM/RumahTangga
                    </option>
                    {buyerTypes.map((type) => (
                      <option key={type.id} value={type.id.toString()}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
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
