import { Typography } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie"; // Import library js-cookie
import { MdAddBox } from "react-icons/md";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2"; // Import Line from react-chartjs-2
import ChartDataLabels from "chartjs-plugin-datalabels";
import ModalKetersidaan from "../components/ModalKetersidaan";

// Register the plugin
ChartJS.register(ChartDataLabels);

const Home = () => {

  // State untuk menyimpan ketersediaan gas dari API
  const [ketersediaanGas, setKetersediaanGas] = useState(null);
  const [penjualanBulanan, setPenjualanBulanan] = useState(null); // State untuk simpan penjualan bulanan

  // Fetch data dari API /current-gas
  useEffect(() => {
      const fetchKetersediaanGas = async () => {
      try {
        // Ambil token dari cookies
        const token = Cookies.get("token"); // Asumsikan token disimpan di cookie dengan nama 'token'

        // Lakukan permintaan ke API dengan menyertakan token di headers
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}api/current-gas`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Sertakan token di header Authorization
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();
        if (result.status === 200) {
          setKetersediaanGas(result.data.current_stock); // Simpan current_stock dari respons API
        } else {
          console.error("Error fetching gas stock:", result.message);
        }
      } catch (error) {
        console.error("Error fetching ketersediaan gas:", error);
      }
    };

    fetchKetersediaanGas();
  }, []); // Array kosong berarti fetch hanya dilakukan saat komponen pertama kali di-mount

  // Fetch data dari API /monthlysales
  useEffect(() => {
    const fetchMonthlySales = async () => {
      try {
        // Ambil token dari cookies
        const token = Cookies.get("token");
  
        // Lakukan permintaan ke API monthlysales
        const responseMonthlySales = await fetch(
          `${import.meta.env.VITE_API_URL}api/monthlysales`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        const resultMonthlySales = await responseMonthlySales.json();
        if (resultMonthlySales.status === 200) {
          setKetersediaanGas(resultMonthlySales.data.current_stock);
        } else {
          console.error("Error fetching penjualan bulan ini:", resultMonthlySales.message);
        }
  
        // Lakukan permintaan ke API sale untuk mendapatkan data penjualan bulanan
        const responseSales = await fetch(
          `${import.meta.env.VITE_API_URL}api/sale`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        const resultSales = await responseSales.json();
        if (resultSales.status === 200 && resultSales.total_sold !== null) {
          setPenjualanBulanan(resultSales.total_sold); // Simpan total_sold dari respons API
        } else {
          setPenjualanBulanan(0); // Jika tidak ada penjualan, set nilai ke 0
        }
      } catch (error) {
        console.error("Error fetching penjualan bulan ini:", error);
        setPenjualanBulanan(0); // Tangani kesalahan dengan set penjualan ke 0
      }
    };
  
    fetchMonthlySales();
  }, []);// Array kosong berarti fetch hanya dilakukan saat komponen pertama kali di-mount

  const today = new Date();
  // Format tanggal dalam bahasa Indonesia
  const formattedDate = today.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Data untuk Doughnut Chart
  const doughnutData = {
    labels: ["UMKM", "Rumah Tangga"],
    datasets: [
      {
        label: "Pembelian Gas",
        data: [120, 80],
        backgroundColor: ["#00AA13", "#FFBF00"],
        hoverOffset: 4,
      },
    ],
  };

  // Opsi untuk menampilkan persentase pada Doughnut Chart
  const doughnutOptions = {
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce(
            (acc, val) => acc + val,
            0
          );
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

  // State untuk mengontrol modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fungsi untuk membuka modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Data untuk chart line (penjualan bulanan)
  const lineChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ],
    datasets: [
      {
        label: "UMKM",
        data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120], // Data penjualan bulanan UMKM
        fill: false,
        borderColor: "#00AA13",
        tension: 0.1,
      },
      {
        label: "Rumah Tangga",
        data: [5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115], // Data penjualan bulanan rumah tangga
        fill: false,
        borderColor: "#FFBF00",
        tension: 0.1,
      },
    ],
  };

  return (
    <>
      {/* header */}
      <div className="flex justify-between p-5">
        <div className="space-y-1">
          <h1 className="font-semibold text-2xl">Penjualan Bulan Ini :</h1>
          <p className="text-2xl font-medium text-[#00AA13]">
          {penjualanBulanan !== null ? `+${penjualanBulanan}` : "Loading..."}
          </p>
        </div>
        <div className="">
          <div className="bg-[#004408] px-5 py-2 rounded-lg text-white font-medium">
            <Typography>{formattedDate}</Typography>
          </div>
        </div>
      </div>

      {/* card */}
      <div className="px-5 h-full space-y-2 pb-5">
        <div className="flex space-x-2 h-[50%]">
          <div className="w-1/2">
            <div className="bg-white p-3 rounded-lg shadow-md">
              <h1 className="text-2xl font-semibold">Ketersediaan Gas :</h1>
              <p className="text-3xl font-semibold">
                {/* Tampilkan ketersediaan gas atau loading saat data belum diambil */}
                {ketersediaanGas !== null
                  ? ` ${ketersediaanGas} tabung`
                  : "Loading..."}
              </p>
              <div className="flex text-[#00AA13] text-4xl justify-end">
                <button onClick={openModal}>
                  <MdAddBox />
                </button>
                <ModalKetersidaan open={isModalOpen} handler={closeModal} />
              </div>
            </div>
          </div>
          <div className="w-1/2">
          <div className="bg-white p-3 rounded-lg shadow-md h-full">
              <h1 className="text-2xl font-semibold">Gas Terjual Harian :</h1>
              <p className="text-3xl font-semibold">55 tabung</p>
            </div>
          </div>
        </div>
        <div className="flex h-[50%] space-x-2">
          <div className="bg-white w-full p-2 h-full rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold p-2">Grafik Batang</h1>
            <div className="flex-1 h-full">
              <Bar
                data={{
                  labels: [
                    "01",
                    "02",
                    "03",
                    "04",
                    "05",
                    "06",
                    "07",
                    "08",
                    "09",
                    "10",
                    "11",
                    "12",
                  ],
                  datasets: [
                    {
                      label: "UMKM",
                      data: [10, 20, 30, 40, 50, 60, 70, 80],
                      backgroundColor: "#00AA13",
                      borderRadius: 3,
                    },
                    {
                      label: "Rumah Tangga",
                      data: [10, 20, 30, 40, 50, 60, 70, 80],
                      backgroundColor: "#FFBF00",
                      borderRadius: 3,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: true,
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

          {/* Grafik Lingkaran */}
          <div className="bg-white w-[40%] h-full rounded-lg p-4 shadow-md">
            <h1 className="text-2xl font-semibold mb-4">Grafik Lingkaran</h1>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
