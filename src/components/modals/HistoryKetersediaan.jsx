import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  Card,
  CardBody,
  Typography,
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody
} from "@material-tailwind/react";
import Cookies from 'js-cookie';
import { IoMdClose } from "react-icons/io";
import { MdOutlineOfflinePin } from "react-icons/md";
import axios from "axios";


const HistoryKetersediaan = ({ open, handler }) => {
  const [dataHistoryKetersediaan, setDataHistoryKetersediaan] = useState(null);

  useEffect(() => {
    const fetchDataHistoryKetersediaan = async () => {
      try {
        const token = Cookies.get("token");
  
        const response = await axios.get(`${import.meta.env.VITE_API_URL}api/gas`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        // Axios automatically parses the response as JSON, so no need for response.json()
        const result = response.data;
        if (response.status === 200 && result.status === 200) {
          const sortedData = result.data.sort(
            (a, b) => new Date(b.restock_date) - new Date(a.restock_date)
          );
          setDataHistoryKetersediaan(sortedData);
        } else {
          console.error("Error fetching history:", result.message);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };
  
    fetchDataHistoryKetersediaan();
  }, []); // Include dependencies array

  return (
    <>
      <Dialog
  size="xs"
  open={open}
  handler={handler}
  className="bg-transparent shadow-none p-2 lg:p-0"
>
  <Card className="mx-auto w-full max-w-[40rem]">
    <CardBody className="h-[60vh] overflow-y-auto">
      <div className="flex justify-between mb-5">
        <Typography variant="h4" color="blue-gray">
          History Ketersediaan
        </Typography>
        <button onClick={handler}>
          <IoMdClose className="text-3xl" />
        </button>
      </div>
      <Timeline>
        {dataHistoryKetersediaan &&
          dataHistoryKetersediaan.map((item) => (
            <TimelineItem key={item.stock_id}>
              <TimelineConnector />
              <TimelineHeader>
                <TimelineIcon className="p-2">
                  <MdOutlineOfflinePin className="h-4 w-4" />
                </TimelineIcon>
                <Typography color="blue-gray" className="font-semibold">
                  {`Restocked by ${item.AdminModel.username}`}
                </Typography>
              </TimelineHeader>
              <TimelineBody className="-mt-2 pb-8">
                <Typography color="gray" className="font-normal text-gray-600">
                  {`Stock: +${item.stock_quantity} - Date: ${new Date(item.restock_date).toLocaleString()}`}
                </Typography>
              </TimelineBody>
            </TimelineItem>
          ))}
      </Timeline>
    </CardBody>
  </Card>
</Dialog>

    </>
  );
};

export default HistoryKetersediaan;
