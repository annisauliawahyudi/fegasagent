import React, { useRef, useState } from "react";
import { FileInput, Label } from "flowbite-react";
import { Button } from "@material-tailwind/react";
// import ModalKtpImg from "../components/ModalKtpImg";
import UploadImage from "../components/UploadImage";

const Scan = () => {
  const fileInputRef = useRef(null); // Ref for file input
  const [image, setImage] = useState(null); // State to store the uploaded image
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal

  // Function to handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // Set uploaded image to state
        setIsModalOpen(true); // Open modal
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setImage(null); // Clear image after modal is closed, optional
  };

  return (
    <div className="p-5 w-full h-screen space-y-2">
      <Label
        htmlFor="dropzone-file"
        className="flex h-[90%] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div className="flex flex-col items-center justify-center pb-6 pt-5">
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            SVG, PNG, JPG or GIF (MAX. 800x400px)
          </p>
        </div>
        <FileInput
          id="dropzone-file"
          className="hidden"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </Label>

      {/* Pass the image and modal state to UploadImage component */}
      <UploadImage isOpen={isModalOpen} handleClose={closeModal} capturedImage={image} />
      
      <Button fullWidth>Use Camera</Button>
    </div>
  );
};

export default Scan;
