import { Typography } from '@material-tailwind/react'
import React from 'react'
import { MdAddBox } from "react-icons/md";
import { Chart as ChartJS } from "chart.js/auto" ;
import { Bar, Doughnut, Line } from "react-chartjs-2" ;

const Home = () => {
  return (
    <>

    {/* header */}
    <div className="flex justify-between p-5">
      <div className="space-y-1">
          <h1 className='font-semibold text-2xl' >Penjualan Hari Ini :</h1>
          <p className='text-2xl font-medium text-[#00AA13]'>+75</p>
      </div>
      <div className="">
        <div className="bg-[#004408] px-5 py-2 rounded-lg text-white font-medium">
          <Typography>
          Senin, 01 Januari 2024
          </Typography>
        </div>
      </div>
    </div>
    
    {/* card */}
    <div className="p-5 h-full space-y-2">
      <div className="flex space-x-2 h-[50%]">
        <div className="w-1/4 space-y-2">
          <div className="bg-white p-3 rounded-lg shadow-md">
            <h1 className='text-2xl font-semibold'>Ketersediaan Gas</h1>
            <p className='text-2xl font-medium'>: 120 </p>
            <div className="flex text-[#00AA13] text-4xl justify-end">
              <MdAddBox/>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-md">
          <h1 className='text-2xl font-semibold'>Jumlah Gas Terjual</h1>
          <p className='text-2xl font-medium'>: 55</p>
          </div>
        </div>
        <div className="w-1/6">
            <div className="bg-white">
            Grafik penjualan 
            </div>
        </div>
      </div>
      <div className="flex h-[50%] space-x-2">
      <div className="bg-white w-full p-2 h-full rounded-lg shadow-md">
        <h1 className='text-2xl font-semibold p-2'>Grafik Batang</h1>
        <div className="flex-1 h-full">
          <Bar
            data={{
              labels: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
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
              maintainAspectRatio: true, // Set to false to allow the chart to expand
              scales: {
                y: {
                  ticks: {
                    stepSize: 10, // Menambahkan agar sumbu Y berkelipatan 10
                  },
                },
              },
            }}
          />
        </div>
      </div>


        <div className="bg-white w-[40%] h-full rounded-lg">
          <h1 className='text-2xl font-semibold'>Grafik Lingkaran</h1>
          {/* Tempat untuk grafik lingkaran */}
        </div>
      </div>
    </div>
    </>
  )
}

export default Home