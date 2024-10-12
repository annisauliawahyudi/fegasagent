import { Button } from "@material-tailwind/react";
import { FaUpload } from "react-icons/fa";
import React, { useRef, useState } from "react";
import ReactWebcam from "react-webcam";
import { HiCamera } from "react-icons/hi2";

const aspectRatios = {
  landscape: {
    width: 1920,
    height: 1080,
  },
  portrait: {
    height: 1080,
    width: 1920,
  },
};

export default function Webcam({ setCapturedImage, type = "landscape" }) {
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null); // Ref for file input
  const [capturedImage, setCapturedImageState] = useState(null);

  // Function to handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        resizeImage(reader.result, aspectRatios[type].width, aspectRatios[type].height);
      };
      reader.readAsDataURL(file);
    }
  };

  // Resize image to match the webcam capture dimensions
  const resizeImage = (imageSrc, targetWidth, targetHeight) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      const resizedImage = canvas.toDataURL("image/jpeg");
      setCapturedImage(resizedImage); // Set the resized image
      setCapturedImageState(resizedImage); // Update the state
    };
  };

  return (
    <div className="webcam">
      <ReactWebcam
        mirrored
        screenshotFormat="image/jpeg"
        screenshotQuality={1}
        videoConstraints={{
          facingMode: "user",
          ...aspectRatios[type],
        }}
        ref={webcamRef}
        className="rounded-tr-xl rounded-tl-xl"
      />
      <div className="flex m-2 justify-center space-x-2">
        {/* Button to capture image from webcam */}
        <Button
          className=""
          onClick={() => {
            const imageSrc = webcamRef.current.getScreenshot();
            setCapturedImage(imageSrc);
            setCapturedImageState(imageSrc);
          }}
        >
          <HiCamera className="text-xl" />
        </Button>

   
        <Button
          className=""
          onClick={() => fileInputRef.current.click()} // Trigger file input click
        >
          <FaUpload className="text-xl" />
        </Button>

        <input
          type="file"
          ref={fileInputRef} // Reference to file input
          onChange={handleFileChange}
          className="hidden"
          accept="image/*" // Accept only image files
        />
      </div>
    </div>
  );
}
