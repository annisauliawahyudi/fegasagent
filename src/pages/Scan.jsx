import React, { useRef, useState } from "react";
import { FileInput, Label } from "flowbite-react";
import { Button } from "@material-tailwind/react";
import UploadImage from "../components/UploadImage";
import Webcam from "../components/Webcam";

const Scan = () => {
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null); // State for uploaded or captured image
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false); // Toggle webcam view

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // Store uploaded image
        setIsModalOpen(true); // Open modal
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setImage(null); // Clear the image if modal is closed
  };

  return (
    <div className="p-5 w-full h-screen space-y-2">
      {!showWebcam ? (
        <>
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

          <Button fullWidth onClick={() => setShowWebcam(true)}>
            Use Camera
          </Button>
        </>
      ) : (
        <Webcam
          setCapturedImage={(capturedImage) => {
            setImage(capturedImage); // Set captured image
            setShowWebcam(false); // Close webcam view
            setIsModalOpen(true); // Open modal with captured image
          }}
        />
      )}

      <UploadImage
        capturedImage={image}
        isOpen={isModalOpen}
        handleClose={handleCloseModal}
      />
    </div>
  );
};

export default Scan;
