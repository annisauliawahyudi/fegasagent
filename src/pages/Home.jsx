import { Typography, Chip } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie"; // Import library js-cookie
import { MdAddBox } from "react-icons/md";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2"; // Import Line from react-chartjs-2
import ChartDataLabels from "chartjs-plugin-datalabels";
import { MdFileOpen } from "react-icons/md";
import HistoryKetersediaan from "../components/modals/HistoryKetersediaan";
import axios from "axios"; // Import axios for API requests
import ModalKetersidaan from "../components/modals/ModalKetersidaan";

// Register the plugin
ChartJS.register(ChartDataLabels);

const Home = () => {
  // State to store API data
  const [ketersediaanGas, setKetersediaanGas] = useState(null);
  const [penjualanBulanan, setPenjualanBulanan] = useState(null); 
  const [penjualanHarian, setPenjualanHarian] = useState(null); 
  const [barChartData, setBarChartData] = useState({
    labels: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
    datasets: [
      {
        label: "UMKM",
        data: Array(12).fill(0), // Initialize with empty data
        backgroundColor: "#00AA13",
        borderRadius: 3,
      },
      {
        label: "Rumah Tangga",
        data: Array(12).fill(0), // Initialize with empty data
        backgroundColor: "#FFBF00",
        borderRadius: 3,
      },
    ],
  });
  const [doughnutData, setDoughnutData] = useState({ 
    labels: ["UMKM", "Rumah Tangga"],
    datasets: [
      {
        label: "Pembelian Gas",
        data: [0, 0], // Initialize with zeros for UMKM and Rumah Tangga
        backgroundColor: ["#00AA13", "#FFBF00"],
        hoverOffset: 4,
      },
    ],
  });

  // Fetch gas stock availability
  useEffect(() => {
    const fetchKetersediaanGas = async () => {
      try {
        const token = Cookies.get("token");
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/current-gas`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        if (result.status === 200) {
          setKetersediaanGas(result.data.current_stock);
        } else {
          console.error("Error fetching gas stock:", result.message);
        }
      } catch (error) {
        console.error("Error fetching ketersediaan gas:", error);
      }
    };

    fetchKetersediaanGas();
  }, []);

  // Fetch monthly sales
  useEffect(() => {
    const fetchPenjualanBulanan = async () => {
      try {
        const token = Cookies.get("token");
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/monthlysales`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        if (result.status === 200) {
          setPenjualanBulanan(result.total_sold);
        } else {
          console.error("Error fetching monthly sales:", result.message);
        }
      } catch (error) {
        console.error("Error fetching monthly sales:", error);
      }
    };

    fetchPenjualanBulanan();
  }, []);

  // Fetch daily sales
  useEffect(() => {
    const fetchPenjualanHarian = async () => {
      try {
        const token = Cookies.get("token");
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/dailysales`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        if (result.status === 200) {
          setPenjualanHarian(result.total_quantity);
        } else {
          console.error("Error fetching daily sales:", result.message);
        }
      } catch (error) {
        console.error("Error fetching daily sales:", error);
      }
    };

    fetchPenjualanHarian();
  }, []);

  // Fetch bar chart data 
  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}api/buyertypesale`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        const result = response.data;
        if (result.status === 200) {
          // Initialize arrays for UMKM and Rumah Tangga with zeroes for each month
          const umkmData = Array(12).fill(0);
          const rumahTanggaData = Array(12).fill(0);
  
          // Get the current month (0 = January, 10 = October, etc.)
          const currentMonthIndex = new Date().getMonth();
  
          // Parse quantities and update the current month data
          const umkmQuantity = parseInt(result.data[0].total_quantity) || 0;
          const rumahTanggaQuantity = parseInt(result.data[1].total_quantity) || 0;
  
          // Set the values only for the current month
          umkmData[currentMonthIndex] = umkmQuantity;
          rumahTanggaData[currentMonthIndex] = rumahTanggaQuantity;
  
          // Update the bar chart data state with the new values
          setBarChartData((prevData) => ({
            ...prevData,
            datasets: [
              {
                ...prevData.datasets[0],
                data: umkmData,
              },
              {
                ...prevData.datasets[1],
                data: rumahTanggaData,
              },
            ],
          }));
        }
      } catch (error) {
        console.error("Error fetching buyer type sales data:", error);
      }
    };
  
    fetchBarChartData();
  }, []);

  // Fetch pie chart data
  useEffect(() => {
    const doughnutChartData = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}api/buyertypesale`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = response.data;
        if (result.status === 200) {
          // Assuming the API response contains data structured for UMKM and Rumah Tangga
          const umkmQuantity = parseInt(result.data[0].total_quantity) || 0; // First entry for UMKM
          const rumahTanggaQuantity = parseInt(result.data[1].total_quantity) || 0; // Second entry for Rumah Tangga

          // Calculate total
          const total = umkmQuantity + rumahTanggaQuantity;

          // Update doughnut chart data based on fetched quantities
          setDoughnutData({
            ...doughnutData,
            datasets: [{
              ...doughnutData.datasets[0],
              data: total > 0 ? [umkmQuantity, rumahTanggaQuantity] : [0, 0], // Avoid division by zero
            }],
          });
        }
      } catch (error) {
        console.error("Error fetching pie chart", error);
      }
    };

    doughnutChartData();
  }, []);
  
  //date
  const today = new Date();
  const formattedDate = today.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });


  const doughnutOptions = {
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        },
        color: "#fff",
        font: {
          weight: "bold",
          size: 16,
        },
      },
    },
  };

  const [isModalKetersediaanOpen, setIsModalKetersediaanOpen] = useState(false);
  const openModalKetersediaan = () => setIsModalKetersediaanOpen(true);
  const closeModalKetersediaan = () => setIsModalKetersediaanOpen(false);

  const [isModalHistoryOpen, setIsModalHistoryOpen] = useState(false);
  const openModalHistory = () => setIsModalHistoryOpen(true);
  const closeModalHistory = () => setIsModalHistoryOpen(false);

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between p-5">
        <div className="space-y-1">
          <h1 className="font-semibold text-xl sm:text-2xl">Penjualan Bulan Ini :</h1>
          <p className="text-xl sm:text-2xl font-semibold text-[#00AA13]">
            {penjualanBulanan !== null ? `+${penjualanBulanan}` : "0"}
          </p>
        </div>
        <div className="mt-3 sm:mt-0">
          <div className="bg-[#004408] px-5 py-2 rounded-lg text-white">
            <Typography className="font-semibold text-sm sm:text-base">{formattedDate}</Typography>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="px-5 space-y-4 pb-5">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="w-full sm:w-1/2">
            <div className="bg-white p-3 rounded-lg shadow-md">
              <div className="flex justify-between">
                <h1 className="text-xl sm:text-2xl font-semibold">Ketersediaan Gas :</h1>
                <button onClick={openModalHistory}>
                  <Chip value="history" />
                </button>
                <HistoryKetersediaan open={isModalHistoryOpen} handler={closeModalHistory} />
              </div>
              <p className="text-2xl sm:text-3xl font-medium">
                {ketersediaanGas !== null ? ` ${ketersediaanGas} tabung` : "0"}
              </p>
              <div className="flex text-3xl justify-end">
                <button onClick={openModalKetersediaan} className="text-[#00AA13]">
                  <MdAddBox />
                </button>
                <ModalKetersidaan open={isModalKetersediaanOpen} handler={closeModalKetersediaan} />
              </div>
            </div>
          </div>
          <div className="w-full sm:w-1/2">
            <div className="bg-white p-3 rounded-lg shadow-md h-full">
              <h1 className="text-xl sm:text-2xl font-semibold">Gas Terjual Harian :</h1>
              <p className="text-2xl sm:text-3xl font-medium">
                {penjualanHarian !== null ? `${penjualanHarian} tabung` : "0"}
              </p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="bg-white w-full sm:w-2/3 p-2 rounded-lg shadow-md">
            <h1 className="text-xl sm:text-2xl font-semibold p-2">Grafik Batang</h1>
            <div className="flex-1 h-[80%]">
              <Bar
                className="h-full"
                data={barChartData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      ticks: {
                        stepSize: 10,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-white w-full sm:w-1/3 p-4 rounded-lg shadow-md">
            <h1 className="text-xl sm:text-2xl font-semibold mb-4">Grafik Lingkaran</h1>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
