import React, { useState } from "react";
import Webcam from "../components/WebCam";
import UploadImage from "../components/UploadImage";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import OcrUploader from "../components/OcrUploader";

const Scan = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  return (
    <div className="flex justify-center items-center mx-5 h-screen w-auto">
      <Card>
        {!capturedImage && <Webcam setCapturedImage={setCapturedImage} />}
        {/* {capturedImage && <img src={capturedImage} />} */}
        {capturedImage && !uploadedImage && (
          <UploadImage
            onUpload={setUploadedImage}
            capturedImage={capturedImage}
            setCapturedImage={setCapturedImage}
          />
        )}
      </Card>
    </div>
    // <OcrUploader/>
  );
};

export default Scan;
