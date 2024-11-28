import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Paginate from "../components/Pagination";
import { FaPlus } from 'react-icons/fa';
import { FiTrash2 } from "react-icons/fi";
import { LuPencil } from "react-icons/lu";
import { SiMicrosoftexcel } from "react-icons/si";
import SearchComponent from "../components/Search";
import Swal from "sweetalert2";
import UpdatePelanggan from "../components/modals/UpdatePelanggan";
import DetailPelanggan from "../components/modals/DetailPelanggan";
import CreatePelanggan from "../components/modals/CreatePelanggan";
// import CreateGas from "../components/modals/CreateGas";
// import CreateGs from "../components/modals/Creategs";
import * as XLSX from "xlsx";

const DataPembelian = () => {
  const [category, setCategory] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");

  const itemsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    nik: "",
    buyerType: "",
  });
  const [loadingM, setLoadingM] = useState(false);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const [isModalCOpen, setIsModalCOpen] = useState(false);

  // const openModalC = ()=> {
  //   setIsModalCOpen(true);
  // }
  const closeModalC = () => {
    setIsModalCOpen(false);
  };

  const exportToExcel = () => {
    const dataToExport = filteredData.map((item, index) => ({
      No: index + 1,
      Nama: item.nama,
      NIK: item.nik,
      Status: item.buyer_type.name,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Pelanggan");

    XLSX.writeFile(workbook, "Data_Pelanggan.xlsx");
  };

  const handleDetail = (customerId, e) => {
    e.preventDefault(); // Mencegah perilaku default dari tag <a>
    setSelectedCustomerId(customerId);
    setIsDetailModalOpen(true); // Modal akan terbuka hanya ketika ini dipanggil
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false); // Modal hanya tertutup ketika ini dipanggil
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer?.nama || "",
      nik: customer?.nik || "",
      buyerType: customer?.buyer_type?.name || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingM(true);

    try {
      const token = Cookies.get("token");
      const response = await axios.put(`${import.meta.env.VITE_API_URL}api/customer/${selectedCustomer?.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Jika request berhasil
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Data berhasil diubah",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        // Update data lokal tanpa perlu fetch ulang
        const updatedData = category.map((item) => (item.id === selectedCustomer.id ? { ...item, ...formData } : item));
        setCategory(updatedData);
        setFilteredData(updatedData);

        setIsModalOpen(false); // Tutup modal setelah berhasil
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      Swal.fire("Error", "Gagal mengubah data pelanggan", "error");
    } finally {
      setLoadingM(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormData({
      name: "",
      nik: "",
      buyerType: "",
    });
  };

  // Fungsi debounce untuk menunda pencarian
  const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  useEffect(() => {
    if (query === "") {
      setFilteredData(category);
      return;
    }

    const search = debounce(() => {
      const filteredResults = category.filter((item) => item.nama.toLowerCase().includes(query.toLowerCase()) || item.nik.toLowerCase().includes(query.toLowerCase()) || item.buyer_type.name.toLowerCase().includes(query.toLowerCase()));
      setFilteredData(filteredResults);
      setCurrentPage(1);
    }, 500); // Delay 500ms

    search();
  }, [query, category]);

  const clearSearch = () => {
    setQuery("");
    setFilteredData(category);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}api/customer`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategory(response.data.data || []);
        setFilteredData(response.data.data || []);
      } catch (error) {
        setError(error);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const searchData = (e) => {
    e.preventDefault();
    const filteredResults = category.filter((item) => item.nama.toLowerCase().includes(query.toLowerCase()) || item.nik.toLowerCase().includes(query.toLowerCase()) || item.buyer_type.name.toLowerCase().includes(query.toLowerCase()));
    setFilteredData(filteredResults);
    setCurrentPage(1);
  };

  // const clearSearch = () => {
  //   setQuery('');
  //   setFilteredData(category);
  //   setCurrentPage(1);
  // };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = Cookies.get("token");
          await axios.delete(`${import.meta.env.VITE_API_URL}api/customer/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCategory(category.filter((item) => item.id !== id));
          setFilteredData(filteredData.filter((item) => item.id !== id));
          Swal.fire("Deleted!", "Your data has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting data:", error);
          Swal.fire("Error!", "There was an error deleting the data.", "error");
        }
      }
    });
  };
  // State untuk mengontrol modal
  // const [isModalGasOpen, setIsModalGasOpen] = useState(false);
  // const openModalGas = () => {
  //   setIsModalGasOpen(true);
  // };
  // const closeModalGas = () => {
  //   setIsModalGasOpen(false);
  // };
  return (
    <div className="p-5 h-screen">
      <div className="bg-white overflow-auto rounded-lg shadow">
        <div className="flex justify-between items-center py-2">
          <h1 className="text-xl font-bold ml-4">Data Pelanggan</h1>
          <div className="flex gap-2 mr-4">
            <button onClick={exportToExcel} className="px-3 py-3 bg-[#1a311d] text-white rounded-md">
              <SiMicrosoftexcel />
            </button>
            {/* <button onClick={openModalC} className='px-3 py-3 bg-[#00AA13] text-gray rounded-full'>
              <FaPlus className='text-white' />
             
            </button> */}
            <CreatePelanggan className="bg-[#00AA13]" open={isModalCOpen} handler={closeModalC} />
          </div>
        </div>
      </div>

      <SearchComponent query={query} setQuery={setQuery} searchData={searchData} clearSearch={clearSearch} />

      <div className="overflow-auto rounded-lg shadow md:block mt-4 hidden">
        <table className="w-full">
          <thead className="bg-[#004408] text-white">
            <tr>
              <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">No.</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">Nama</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">NIK</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">Alamat</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">Status</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-5 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" className="py-5 text-center text-red-500">
                  Error fetching data: {error.message}
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-5 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              currentItems.map((item, index) => (
                <tr className="bg-white" key={item.id}>
                  <td className="p-3 text-sm text-gray-700">
                    <button className="font-bold hover:underline">{index + 1 + (currentPage - 1) * itemsPerPage}</button>
                    {/* onClick={(e) => handleDetail(item.id, e)} */}
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    <button className="hover:underline">
                      {/* onClick={(e) => handleDetail(item.id, e)} */}
                      {item.nama}
                    </button>
                  </td>
                  <td className="p-3 text-sm text-gray-700">{item.nik}</td>
                  <td className="p-3 text-sm text-gray-700">{item.alamat}</td>
                  <td className="p-3 text-sm text-gray-700">
                    <span className={`p-1.5 text-xs font-medium  tracking-wider text-white rounded-lg 
                    ${item.buyer_type.name === "UMKM"
                    ? "bg-[#00AA13]"
                    : item.buyer_type.name === "Rumah Tangga"
                    ? "bg-[#FFBF00]"
                    : "bg-gray-200"}`}>
                    {item.buyer_type.name || "N/A"}
                    </span>
                  </td>
                  <td className="p-3 text-sm flex gap-2">
                    <button onClick={openModalGas} className="text-blue-600">
                      <CreateGas isOpen={isModalGasOpen} onClose={closeModalGas} customer={selectedCustomer}/>
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600">
                      <FiTrash2 />
                    </button>
                    <button onClick={() => handleEdit(item)} className="text-yellow-600">
                      <LuPencil />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="overflow-auto md:block mt-5 pb-2 hidden">
        <Paginate
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden mt-4">
        {loading ? (
          <div className="p-3 text-sm text-gray-700 text-center">Loading data...</div>
        ) : error ? (
          <div className="p-3 text-sm text-red-500 text-center">Error fetching data: {error.message}</div>
        ) : filteredData.length === 0 ? (
          <div className="p-3 text-sm text-gray-500 text-center">No data available</div>
        ) : (
          filteredData.map((item, index) => (
            <div key={item.id} className="bg-white space-y-3 p-4 rounded-lg shadow">
              <div className="flex items-center space-x-2 text-sm">
                <td className="text-sm text-gray-700">
                  <button onClick={(e) => handleDetail(item.id, e)} className="font-bold hover:underline">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </button>
                </td>
                <div className="text-gray-500">{item.nik}</div>
                <div>
                  <span className={`p-1.5 text-xs font-medium  tracking-wider text-white rounded-lg 
                    ${item.buyer_type.name === "UMKM"
                    ? "bg-[#00AA13]"
                    : item.buyer_type.name === "Rumah Tangga"
                    ? "bg-[#FFBF00]"
                    : "bg-gray-200"}`}>
                    {item.buyer_type.name || "N/A"}
                    </span>
                </div>
              </div>
              <div className="ml-5 text-sm text-gray-700">{item.alamat}</div>
              <div className="p-3 flex gap-2">
                <div className="text-lg font-medium text-black">
                  <button className="hover:underline">
                    {/* onClick={(e) => handleDetail(item.id, e)} */}
                    {item.nama}
                  </button>
                </div>
                {/* <button onClick={openModalGas} className="text-blue-600">
                      <CreateGs isOpen={isModalGasOpen} onClose={closeModalGas} />
                    </button> */}
                <button onClick={() => handleDelete(item.id)} className="text-red-600">
                  <FiTrash2 />
                </button>
                <button onClick={() => handleEdit(item)} className="text-yellow-600">
                  <LuPencil />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* // Modal Detail */}
      <DetailPelanggan isOpen={isDetailModalOpen} onClose={handleDetailModalClose} customerId={selectedCustomerId} />

      <UpdatePelanggan isOpen={isModalOpen} onClose={handleModalClose} customer={selectedCustomer} formData={formData} setFormData={setFormData} loading={loadingM} handleSubmit={handleSubmit} />
    </div>
  );
};

export default DataPembelian;
