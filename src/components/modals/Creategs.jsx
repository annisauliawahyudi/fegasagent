import React, { useState, useEffect } from "react";
import { Button, Dialog, Card, CardBody, CardFooter, Typography, Input } from "@material-tailwind/react";
import Cookies from "js-cookie";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa";
import { useCopyToClipboard } from "usehooks-ts";
import { CheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";

const CreateGs = ( ) => {
  const [customers, setCustomers] = useState([]);
  const [formValues, setFormValues] = useState({
    customer_id: "",
    quantity: "",
  });
  const [quantity, setQuantity] = useState("");
  const [maxQuantity, setMaxQuantity] = useState(0);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null); // New state to track selected customer
  const [copied, setCopied] = useState(false);
  const [nik, setNik] = useState("");
  const [value, copy] = useCopyToClipboard();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}api/customer/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(response.data.data)) {
          setCustomers(response.data.data);
        } else {
          setCustomers([]);
        }
      } catch (error) {
        setCustomers([]);
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  // Open modal and set customer_id when a customer is selected
  const handleOpen = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);

    if (customer) {
      setFormValues({
        customer_id: customerId,
        quantity: "",
      });
      setSelectedCustomer(customer); // Update selected customer
      setNik(customer.nik);
      setMaxQuantity(customer.buyer_type.name === "UMKM" ? 4 : 2);
      setOpen(true);
    } else {
      console.error("Customer not found.");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFormValues({ customer_id: "", quantity: "" });
    setNik(""); // Reset NIK
    setSelectedCustomer(null); // Reset selected customer
  };

  const handleAddGas = async (e) => {
    e.preventDefault();
    const quantityAdd = parseInt(quantity, 10);

    // Validate quantity
    if (quantityAdd > maxQuantity) {
      setError(`Jumlah maksimal pembelian adalah ${maxQuantity} gas.`);
      return;
    }
    if (quantityAdd <= 0) {
      setError("Jumlah pembelian harus lebih dari 0.");
      return;
    }

    try {
      const token = Cookies.get("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}api/sale`,
        {
          customer_id: formValues.customer_id,
          quantity: quantityAdd,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Close modal and show success notification
      setOpen(false);
      Swal.fire({
        icon: "success",
        title: "Pembelian berhasil",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        // Optional: You could refetch data or reload the page
        window.location.reload();
      });
    } catch (error) {
      setError(error.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  return (
    <div>
      {/* Button to open modal */}
      <div className="flex items-center gap-2">
        <Button onClick={() => handleOpen(customers[0]?.id)} variant="gradient" className="px-3 py-3 bg-[#00AA13] text-white rounded-full">
          <FaPlus className="text-white" />
        </Button>
      </div>

      {/* Modal */}
      <Dialog size="xs" open={open} handler={() => setOpen(false)} className="bg-transparent shadow-none">
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <div className="flex justify-between">
              <Typography variant="h4" color="blue-gray">
                Pembelian Gas
              </Typography>
              <button onClick={handleClose}>
                <IoMdClose className="text-3xl" />
              </button>
            </div>

            {/* Customer selection */}
            {/* Customer selection */}
            <select onChange={(e) => handleOpen(e.target.value)} value={formValues.customer_id} className="w-full p-2 border-2 border-black rounded focus:outline-none focus:ring-2 focus:ring-black-400">
              <option value="" className="text-gray-600">
                Select Customer
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id} className="text-green-800 bg-white">
                  {customer.nama} {/* Display name and NIK */}
                </option>
              ))}
            </select>

            {/* Display customer NIK after selection */}
            {selectedCustomer && (
              <>
                <Button
                  onMouseLeave={() => setCopied(false)}
                  onClick={() => {
                    copy(nik);
                    setCopied(true);
                  }}
                  className="flex items-center gap-x-3 px-4 py-2.5 lowercase bg-gray-200"
                >
                  <Typography className="border-r text-black border-black pr-40 font-normal" variant="small">
                    {nik || "Loading..."} {/* Display the customer's NIK */}
                  </Typography>
                  {copied ? <CheckIcon className="h-4 w-4 text-black" /> : <DocumentDuplicateIcon className="h-4 w-4 text-black" />}
                </Button>
              </>
            )}

            <Typography className="mb-0 font-normal" variant="paragraph" color="gray">
              Masukkan Jumlah Gas
            </Typography>
            <Input size="lg" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />

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

export default CreateGs;
