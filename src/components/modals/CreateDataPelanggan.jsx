import React from 'react'
import {
    Card,
    Input,
    Button,
    Dialog,
    Textarea,
    IconButton,
    Typography,
    DialogBody,
    DialogHeader,
    DialogFooter,
    CardBody,
    CardFooter,
    Select,
    Option
  } from "@material-tailwind/react";
  
import { IoMdClose } from "react-icons/io";



const CreateDataPembeli = ({open, handler}) => {
  
  return (
    <>
      <Dialog size="sm"  open={open} handler={handler} className="p-4 w-1/2">
        <DialogHeader className="flex justify-between relative m-0">
          <Typography variant="h4" color="blue-gray">
            Data Pembelian
          </Typography>
          <button onClick={handler}>
            <IoMdClose className="text-3xl" />
          </button>
        </DialogHeader>
        <DialogBody className="space-y-4 pb-6">
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-medium"
            >
              Nama
            </Typography>
            <Input
              color="gray"
              size="lg"
              placeholder="Masukan nama"
              name="name"
              className="placeholder:opacity-100 focus:!border-t-gray-900"
              containerProps={{
                className: "!min-w-full",
              }}
              labelProps={{
                className: "hidden",
              }}
            />
          </div>
          <div className="flex gap-4">
            <div className="w-full">
             
              {/* <Input
                color="gray"
                size="lg"
                placeholder="MM/YY"
                name="date"
                className="placeholder:opacity-100 focus:!border-t-gray-900"
                containerProps={{
                  className: "!min-w-full",
                }}
                labelProps={{
                  className: "hidden",
                }}
              /> */}
             <Select label="Select Version" class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer">
                <Option value="brazil"></Option>
              
            </Select>


            </div>
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                Jumlah Beli
              </Typography>
              <Input
                type='number'
                color="gray"
                size="lg"
                placeholder="123"
                name="CVV"
                className="placeholder:opacity-100 focus:!border-t-gray-900"
                containerProps={{
                  className: "!min-w-full",
                }}
                labelProps={{
                  className: "hidden",
                }}
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button className="ml-auto" >
            submit
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  )
}

export default CreateDataPembeli
