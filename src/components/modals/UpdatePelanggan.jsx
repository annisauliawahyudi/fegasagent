import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const UpdatePelanggan = ({ isOpen, onClose, customer }) => {
  const [formValues, setFormValues] = useState({
    name: "",
    nik: "",
    alamat: "",
    buyerType: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [buyerTypes, setBuyerTypes] = useState([]);

  useEffect(() => {
    const dialogBackdrop = document.querySelector('[data-dialog-backdrop="sign-in-dialog"]');

    if (dialogBackdrop) {
      if (isOpen) {
        dialogBackdrop.classList.remove("opacity-0", "pointer-events-none");
        dialogBackdrop.classList.add("opacity-100");
      } else {
        dialogBackdrop.classList.remove("opacity-100");
        dialogBackdrop.classList.add("opacity-0", "pointer-events-none");
      }
    }

    if (isOpen && customer) {
      setFormValues({
        name: customer.nama || "",
        nik: customer.nik || "",
        alamat: customer.alamat || "",
        buyerType: customer.buyer_type?.id?.toString() || "",
      });
    } else if (!isOpen) {
      setFormValues({
        name: "",
        nik: "",
        alamat: "",
        buyerType: "",
      });
      setError(null);
    }
  }, [isOpen, customer]);

  useEffect(() => {
    const fetchBuyerTypes = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}api/buyerType`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBuyerTypes(response.data.data);
      } catch (error) {
        setError(error);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchBuyerTypes();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = Cookies.get("token");

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}api/customer/${customer?.id}`,
        {
          nama: formValues.name,
          nik: formValues.nik,
          alamat: formValues.alamat,
          buyer_type_id: formValues.buyerType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        onClose(); // Close the modal after the alert disappears

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data berhasil diubah",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload(); // Reload the page after closing the modal
        });
      } else {
        setError("Failed to update customer data");
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      setError("Error updating customer: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      data-dialog-backdrop="sign-in-dialog"
      data-dialog-backdrop-close="true"
      className="pointer-events-none fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 opacity-0 backdrop-blur-sm transition-opacity duration-300"
    >
      <div data-dialog="sign-in-dialog" className="relative mx-auto flex w-full max-w-[24rem] flex-col rounded-xl bg-white text-gray-700 shadow-md transition-transform duration-300 transform scale-95">
        <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-900" onClick={onClose}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <div className="flex flex-col gap-4 p-6">
          <h4 className="block text-2xl font-semibold leading-snug text-blue-gray-900">Ubah Data</h4>
          {error && <div className="text-red-500">{error}</div>}
          <div className="relative h-11 w-full min-w-[200px]">
            <input
              className="w-full h-full px-3 py-3 text-sm font-normal bg-transparent border rounded-md border-blue-gray-200 focus:border-gray-900 focus:outline-0"
              placeholder="Nama"
              name="name"
              value={formValues.name}
              onChange={handleChange}
            />
          </div>
          <div className="relative h-11 w-full min-w-[200px]">
            <input
              className="w-full h-full px-3 py-3 text-sm font-normal bg-transparent border rounded-md border-blue-gray-200 focus:border-gray-900 focus:outline-0"
              placeholder="NIK"
              name="nik"
              value={formValues.nik}
              onChange={handleChange}
            />
          </div>
          <div className="relative h-11 w-full min-w-[200px]">
            <input
              className="w-full h-full px-3 py-3 text-sm font-normal bg-transparent border rounded-md border-blue-gray-200 focus:border-gray-900 focus:outline-0"
              placeholder="alamat"
              name="alamat"
              value={formValues.alamat}
              onChange={handleChange}
            />
          </div>
          <div className="relative h-11 w-full min-w-[200px]">
            <select className="w-full h-full px-3 py-3 text-sm font-normal bg-transparent border rounded-md border-blue-gray-200 focus:border-gray-900 focus:outline-0" name="buyerType" onChange={handleChange} value={formValues.buyerType}>
              {buyerTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="p-6 pt-0">
          <button className="block w-full rounded-lg bg-gray-900 py-3 px-6 text-xs font-bold uppercase text-white shadow-md hover:shadow-lg transition-all" type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePelanggan;
