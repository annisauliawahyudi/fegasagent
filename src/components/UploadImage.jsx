import React, { useState } from "react";
import Tesseract from "tesseract.js";
import { Button, Dialog, DialogBody, DialogFooter } from "@material-tailwind/react";
import DataKTP from "./DataKTP";

export default function UploadImage({ capturedImage, isOpen, handleClose }) {
  const [uploading, setUploading] = useState(false);
  const [text, setText] = useState("");
  const [nik, setNik] = useState("");
  const [name, setName] = useState("");
  const [kecamatan, setKecamatan] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false); // State untuk tracking apakah sudah di-scan
  const [isKtpModalOpen, setIsKtpModalOpen] = useState(false); // State baru untuk mengontrol modal KTP

  // Function to handle Tesseract OCR process
  const extractData = (text) => {
    console.log(text);

    // Ekstraksi data KTP menggunakan pola regex
    const nikPattern = /NIK\s*[:=]?\s*([\d\s]+)/i;
    const namePattern = /Nama\s*[:=]?\s*([A-Z\s]+)/i;
    const kecamatanPattern = /Kecamatan\s*[:=]?\s*([A-Z\s]+)/i;

    const nikMatch = text.match(nikPattern);
    const nameMatch = text.match(namePattern);
    const kecamatanMatch = text.match(kecamatanPattern);

    // Set state dengan data yang ditemukan
    setNik(nikMatch ? nikMatch[1].replace(/\s/g, "") : "NIK not found");
    setName(nameMatch ? nameMatch[1].trim() : "Name not found");
    setKecamatan(kecamatanMatch ? kecamatanMatch[1].trim() : "Kecamatan not found")
  };

  const handleScan = () => {
    if (capturedImage) {
      setLoading(true);
      Tesseract.recognize(capturedImage, "eng", {
        logger: (m) => console.log(m),
      }).then(({ data: { text } }) => {
        setText(text);
        extractData(text);
        setLoading(false);
        setScanned(true); // Update state setelah scan selesai
        setIsKtpModalOpen(true); // Tampilkan modal KTP setelah scan selesai
      });
    }
  };

  const closeKtpModal = () => {
    setIsKtpModalOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose} className="bg-white w-[95%] lg:w-1/2">
        <DialogBody>
          <img src={capturedImage} alt="Uploaded" className="w-full h-auto" />
        </DialogBody>
        <DialogFooter className="mt-4">
          <div className="actions m-2 space-x-2">
            <Button onClick={handleScan} className="upload-btn" disabled={loading}>
              {loading ? "Scanning..." : "Cek Data"}
            </Button>
            <Button onClick={handleClose} className="retake-btn">
              Back
            </Button>
            {loading && <span className="uploading-text">Processing...</span>}
          </div>
        </DialogFooter>
      </Dialog>

      {/* Modal untuk menampilkan data KTP setelah di-scan */}
      {scanned && (
        <DataKTP
          open={isKtpModalOpen} // Open state untuk modal DataKTP
          onClose={closeKtpModal} // Close handler untuk modal DataKTP
          image={capturedImage}
          nik={nik}
          name={name}
          kecamatan={kecamatan}
        />
      )}
    </>
  );
}
