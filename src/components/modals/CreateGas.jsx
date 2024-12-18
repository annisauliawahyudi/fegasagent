import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { Input, Button, Dialog, IconButton, Typography, DialogBody, DialogHeader, DialogFooter } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaPlus } from "react-icons/fa";
import { useCopyToClipboard } from "usehooks-ts";
import { CheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";

export function CreateGas({ refreshTable, customerId, nik }) { // Terima NIK sebagai prop
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [formValues, setFormValues] = useState({
    quantity: "",
  });
  const [copied, setCopied] = useState(false);
  const [value, copy] = useCopyToClipboard();

  const handleOpen = () => setOpen(!open);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddGas = async () => {
    try {
      const token = Cookies.get("token");
      const { quantity } = formValues;

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}api/sale`,
        {
          customer_id: customerId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setOpen(false);
        Swal.fire({
          icon: "success",
          title: `Data berhasil disimpan untuk customer ID ${customerId}`,
          showConfirmButton: true,
          confirmButtonText: "Close",
        }).then(() => {
          refreshTable();
        });
      } else {
        setError("Gagal menambahkan banyaknya gas.");
      }
    } catch (error) {
      console.error("Error creating sale:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Error creating sale");
    }
  };

  return (
    <>
      <Button onClick={handleOpen} variant="gradient" className="px-1 py-1 bg-[#344b52] rounded-full">
        <FaPlus className="text-white" />
      </Button>
      <Dialog size="sm" open={open} handler={handleOpen} className="p-4 w-[60%] lg:w-[30%] lg:p-0">
        <DialogHeader className="relative m-0 block">
          <Typography variant="h4" color="blue-gray">
            Pembelian Gas
          </Typography>
          <Typography className="mt-1 font-normal text-gray-600">Tambah data pembelian</Typography>
          <IconButton size="sm" variant="text" className="!absolute right-3.5 top-3.5" onClick={handleOpen}>
            <FontAwesomeIcon icon="fa-solid fa-xmark" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="space-y-4 mx-2">
          {/* Tombol untuk menampilkan dan menyalin NIK */}
          <Button
            onMouseLeave={() => setCopied(false)}
            onClick={() => {
              copy(nik); // Copy NIK dari prop
              setCopied(true);
            }}
            className="flex items-center gap-x-3 px-4 py-2.5 lowercase bg-gray-200"
          >
            <Typography className="border-r text-black border-black pr-3 font-normal placeholder:opacity-100 focus:!border-t-gray-900" variant="small">
              {nik} {/* Tampilkan NIK */}
            </Typography>
            {copied ? <CheckIcon className="h-4 w-4 text-black" /> : <DocumentDuplicateIcon className="h-4 w-4 text-black" />}
          </Button>
          
          {/* Field untuk Banyak Gas */}
          <div className="lg:flex lg:gap-4">
            <div className="w-[93%] ">
              <Typography variant="small" color="blue-gray" className="lg:mb-2 text-left font-medium">
                Banyak Gas
              </Typography>
              <Input
                required
                color="gray"
                size="lg"
                placeholder="Masukkan jumlah gas"
                name="quantity"
                type="number"
                value={formValues.quantity}
                onChange={handleInputChange}
                className="placeholder:opacity-100 focus:!border-t-gray-900"
                containerProps={{ className: "!min-w-full" }}
                labelProps={{ className: "hidden" }}
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button className="ml-auto" onClick={handleAddGas}>
            Tambah Gas
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default CreateGas;
