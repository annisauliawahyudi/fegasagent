import React, { useState } from "react";
import Tesseract from "tesseract.js";
import { Button, Dialog, DialogBody, DialogFooter } from "@material-tailwind/react";
import DataKTP from "./DataKTP";

export default function UploadImage({ capturedImage, isOpen, handleClose }) {
  const [text, setText] = useState("");
  const [nik, setNik] = useState("");
  const [name, setName] = useState("");
  const [alamat, setAlamat] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false); 
  const [isKtpModalOpen, setIsKtpModalOpen] = useState(false); 
  const [ktpImage, setKtpImage] = useState(capturedImage); // Tambahkan state untuk menyimpan gambar KTP

  const extractData = (text) => {
    console.log(text);

    const nikPattern = /NIK\s*[:=]?\s*([\d\s]+)/i;
    const namePattern = /Nama\s*[:=]?\s*([A-Z\s]+)/i;
    const alamatPattern = /Alamat\s*[:=]?\s*([A-Z\s]+)/i;

    const nikMatch = text.match(nikPattern);
    const nameMatch = text.match(namePattern);
    const alamatMatch = text.match(alamatPattern);

    setNik(nikMatch ? nikMatch[1].replace(/\s/g, "") : "NIK not found");
    setName(nameMatch ? nameMatch[1].trim() : "Name not found");
    setAlamat(alamatMatch ? alamatMatch[1].trim() : "Alamat not found");
  };

  const handleScan = () => {
    if (capturedImage) {
      // Simpan gambar ke state sebelum menutup modal
      setKtpImage(capturedImage);

      // Tutup modal UploadImage
      handleClose();

      setLoading(true);
      Tesseract.recognize(capturedImage, "eng", {
        logger: (m) => console.log(m),
      }).then(({ data: { text } }) => {
        setText(text);
        extractData(text);
        setLoading(false);
        setScanned(true);
        setIsKtpModalOpen(true);
      });
    }
  };

  const closeKtpModal = () => {
    setIsKtpModalOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose} className="bg-white w-[95%] lg:w-1/2 max-h-[95%] overflow-y-auto">
        <DialogBody>
          <img src={capturedImage} alt="Uploaded" className="w-full h-auto" />
        </DialogBody>
        <DialogFooter className="mt-4">
          <div className="actions m-2 space-x-2">
            <Button onClick={handleClose} className="retake-btn">
              Back
            </Button>
            <Button onClick={handleScan} className="upload-btn" disabled={loading}>
              {loading ? "Scanning..." : "Cek Data"}
            </Button>
            {loading && <span className="uploading-text">Processing...</span>}
          </div>
        </DialogFooter>
      </Dialog>

      {scanned && (
        <DataKTP
          open={isKtpModalOpen}
          onClose={closeKtpModal}
          image={ktpImage} // Pastikan gambar diteruskan dari state
          nik={nik}
          name={name}
          alamat={alamat}
        />
      )}
    </>
  );
}
