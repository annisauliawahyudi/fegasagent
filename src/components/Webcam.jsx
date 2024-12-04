import { Button } from "@material-tailwind/react";
import React, { useRef } from "react";
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
        className="rounded-lg"
      />
      <div className="flex m-2 justify-center space-x-2">
        <Button
          onClick={() => {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
              setCapturedImage(imageSrc); // Send captured image to parent
            }
          }}
        >
          <HiCamera className="text-xl" />
        </Button>
      </div>
    </div>
  );
}

