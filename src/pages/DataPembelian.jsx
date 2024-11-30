import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios"; // Make sure to import axios
import { SiMicrosoftexcel } from "react-icons/si";
import { FaPlus } from "react-icons/fa";
import SearchComponent from "../components/Search";
import { IoMdDownload } from "react-icons/io";
import CreateDataPembeli from "../components/modals/CreateDataPelanggan";
import Paginate from "../components/Pagination";
import CreateGs from "../components/modals/Creategs";
import { Menu, MenuHandler, MenuList, MenuItem, Button } from "@material-tailwind/react";


const DataPembelian = () => {
  const [dataPembelian, setDataPembelian] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dailyExcel, setDailyExcel] = useState(null);
  const [weeklyExcel, setWeeklyExcel] = useState(null);
  const [monthlyExcel, setMonthlyExcel] = useState(null);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = (filteredData || []).slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((filteredData || []).length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Fetch data pembelian from API
  useEffect(() => {
    const fetchDataPembelian = async () => {
      try {
        const token = Cookies.get("token");

        const response = await fetch(`${import.meta.env.VITE_API_URL}api/sale`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        if (response.ok && result.status === 200) {
          setDataPembelian(result.data);
          setFilteredData(result.data);
        } else {
          console.error("Error fetching data pembelian:", result.message);
        }
      } catch (error) {
        console.error("Error fetching data pembelian:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataPembelian();
  }, []);

  //  State untuk mengontrol modal
  const [isModalGasOpen, setIsModalGasOpen] = useState(false);
  const openModalGas = () => {
    setIsModalGasOpen(true);
  };
  const closeModalGas = () => {
    setIsModalGasOpen(false);
  };

  const fetchExcelFile = async (endpoint, updateState) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`${import.meta.env.VITE_API_URL}api/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        responseType: "blob", // Important for handling file download
      });

      if (response.data.size === 0) {
        // Check if the file is empty
        alert("Tidak ada data pembelian.");
        return;
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      updateState(url);
    } catch (error) {
      console.error(`Error fetching ${endpoint} Excel file:`, error);
      // Show alert for any error that prevents file download
      alert("Tidak ada data pembelian.");
    }
  };
  
  const handleDailyExcel = () => fetchExcelFile("dailyexcel", setDailyExcel);
  const handleWeeklyExcel = () => fetchExcelFile("weeklyexcel", setWeeklyExcel);
  const handleMonthlyExcel = () => fetchExcelFile("monthlyexcel", setMonthlyExcel);

  // Effect to download the file once it's set
  useEffect(() => {
    const downloadFile = (fileUrl, fileName) => {
      if (fileUrl) {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    };

    downloadFile(dailyExcel, "Daily_Data.xlsx");
    downloadFile(weeklyExcel, "Weekly_Data.xlsx");
    downloadFile(monthlyExcel, "Monthly_Data.xlsx");

    // Reset the state after downloading
    setDailyExcel(null);
    setWeeklyExcel(null);
    setMonthlyExcel(null);
  }, [dailyExcel, weeklyExcel, monthlyExcel]);
  
  // Filter data based on query
  useEffect(() => {
    if (dataPembelian && query) {
      const filtered = dataPembelian.filter((item) => item.customerModel?.nama.toLowerCase().includes(query.toLowerCase()));
      setFilteredData(filtered);
    } else {
      setFilteredData(dataPembelian);
    }
  }, [query, dataPembelian]);

  const handlePrintPDF = async (saleId) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}api/sale/pdf/${saleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );
  
      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `sale_${saleId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        alert("Gagal mengunduh PDF, status tidak sukses.");
      }
    } catch (error) {
      console.error("Error printing PDF:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      alert("Gagal mengunduh PDF.");
    }
  };
  
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!dataPembelian || dataPembelian.length === 0) {
    return <div>No data available.</div>;
  }

  

  return (
    <div className="p-5 h-screen">
      <div className="bg-white overflow-auto rounded-lg shadow">
        <div className="flex justify-between items-center py-2">
          <h1 className="text-xl font-bold ml-4">Data Pembeli</h1>
          <div className="flex gap-2 mr-4">
            <Menu placement="bottom-end">
              <MenuHandler>
                <Button className="px-3 py-3 bg-[#1a311d] text-white rounded-md">
                  <SiMicrosoftexcel className="text-xl" />
                </Button>
                
              </MenuHandler>
              <button onClick={openModalGas} className="text-blue-600">
                      <CreateGs isOpen={isModalGasOpen} onClose={closeModalGas} />
                    </button>
              <MenuList className="space-y-2">
                <MenuItem className="hover:bg-gray-200 p-2">
                  <button onClick={handleDailyExcel}>Daily Excel</button>
                </MenuItem>
                <MenuItem className="hover:bg-gray-200 p-2">
                  <button onClick={handleWeeklyExcel}>Weekly Excel</button>
                </MenuItem>
                <MenuItem className="hover:bg-gray-200 p-2">
                  <button onClick={handleMonthlyExcel}>Monthly Excel</button>
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>
      </div>

      {/* SearchComponent without searchData and clearSearch */}
      <SearchComponent query={query} setQuery={setQuery} />

      {/* Table for desktop */}
      <div className="hidden md:block overflow-auto rounded-lg shadow mt-4">
        <table className="w-full">
          <thead className="bg-[#004408] text-white">
            <tr>
              <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">
                No.
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">
                Nama
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">
                Status
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">
                Total Beli
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">
                Tanggal
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentItems.map((data, index) => (
              <tr key={data.id} className="bg-white">
                <td className="p-3 text-sm text-gray-700">
                  <p className="font-bold">{index + 1}</p>
                </td>
                <td className="p-3 text-sm text-gray-700">
                  <p>{data.customerModel?.nama}</p>
                </td>
                <td className="p-3 text-sm text-gray-700">
                  <span className={`p-1.5 text-xs font-medium  tracking-wider text-white rounded-lg 
                    ${data.customerModel?.buyer_type?.name === "UMKM"
                    ? "bg-[#00AA13]"
                    : data.customerModel?.buyer_type?.name === "Rumah Tangga"
                    ? "bg-[#FFBF00]"
                    : "bg-gray-200"}`}>
                    {data.customerModel?.buyer_type?.name || "N/A"}
                  </span>
                </td>
                <td className="p-3 text-sm text-gray-700">
                  {data.quantity || 0}
                </td>
                <td className="p-3 text-sm text-gray-700">
                  {data.createdAt
                    ? new Date(data.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="p-3 text-sm text-gray-700">
                  <Button
                    onClick={() => handlePrintPDF(data.id)}
                    color="black"
                    size="sm"
                    className="mr-2 text-white capitalize flex gap-1">
                    <IoMdDownload className="w-4 h-4"/>
                    Print Struk
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="overflow-auto md:block mt-5 pb-2 hidden">
        <Paginate currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
      </div>

      {/* Card view for mobile */}
      <div className="block md:hidden grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {filteredData.length === 0 ? (
          <div className="p-3 text-sm text-gray-500 text-center">No data available</div>
        ) : (
          filteredData.map((data, index) => (
            <div key={data.id} className="bg-white mb-2 p-4 rounded-lg shadow">
              <div className="text-sm">
                <div className="flex justify-between space-x-1">
                  <div className="flex space-x-1">
                    <button className="font-bold">{index + 1}.</button>
                    <p>{data.customerModel?.nama || "N/A"}</p>
                  </div>
                  <div>
                  <span className={`p-1.5 text-xs font-medium  tracking-wider text-white rounded-lg 
                    ${data.customerModel?.buyer_type?.name === "UMKM"
                    ? "bg-[#00AA13]"
                    : data.customerModel?.buyer_type?.name === "Rumah Tangga"
                    ? "bg-[#FFBF00]"
                    : "bg-gray-200"}`}>
                    {data.customerModel?.buyer_type?.name || "N/A"}
                  </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  Pembelian: {data.quantity || 0}
                </p>
                <p className="text-sm text-gray-700">
                  Tanggal:{" "}
                  {data.createdAt
                    ? new Date(data.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
                <div className="mt-1">
                <Button
                    onClick={() => handlePrintPDF(data.id)}
                    color="black"
                    size="sm"
                    className="mr-2 text-white capitalize flex gap-1">
                    <IoMdDownload className="w-4 h-4"/>
                    Print Struk
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DataPembelian;
