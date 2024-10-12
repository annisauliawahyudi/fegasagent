import React from 'react';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

const ModalDataKtp = ({ isOpen, handleClose, image }) => {

  return (
    <div className="">

    <Dialog open={isOpen} handler={handleClose} className="bg-white w-[95%] lg:w-1/2">
      <DialogBody>
        Data masuk
      </DialogBody>
      <DialogFooter className="mt-4">
        <Button onClick={handleClose} className="mr-1">
          Cancel
        </Button>
        <Button onClick={handleClose}>
          Cek Data
        </Button>
      </DialogFooter>
    </Dialog>
    </div>

  );
}

export default ModalDataKtp;
