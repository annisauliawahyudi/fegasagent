import React, { useState } from "react";
import Tesseract from "tesseract.js";
import { Button, Dialog, DialogBody, DialogFooter } from "@material-tailwind/react";
import DataKTP from "./DataKTP";

export default function UploadImage({ capturedImage, isOpen, handleClose }) {
  const [uploading, setUploading] = useState(false);
  const [text, setText] = useState("");
  const [nik, setNik] = useState("");
  const [name, setName] = useState("");
  const [tempatTglLahir, setTempatTglLahir] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('');
  const [golDarah, setGolDarah] = useState('');
  const [alamat, setAlamat] = useState('');
  const [rtrw, setRtRw] = useState('');
  const [kelDesa, setKelDesa] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [agama, setAgama] = useState('');
  const [statusPerkawinan, setStatusPerkawinan] = useState('');
  const [pekerjaan, setPekerjaan] = useState('');
  const [kewarganegaraan, setKewarganegaraan] = useState('');
  const [berlakuHingga, setBerlakuHingga] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false); // State untuk tracking apakah sudah di-scan
  const [isKtpModalOpen, setIsKtpModalOpen] = useState(false); // State baru untuk mengontrol modal KTP

  // Function to handle Tesseract OCR process
  const extractData = (text) => {
    console.log(text);

    // Ekstraksi data KTP menggunakan pola regex
    const nikPattern = /NIK\s*[:=]?\s*([\d\s]+)/i;
    const namePattern = /Nama\s*[:=]?\s*([A-Z\s]+)/i;
    const ttlPattern = /Tempat\/Tgl Lahir\s*[:=]?\s*([A-Z\s]+),\s*(\d{2}-\d{2}-\d{4})/i;
    const jkPattern = /Jenis Kelamin\s*[:=]?\s*([A-Z\s]+)\s*Gol. Darah\s*[:=]?\s*([A-Z]+)/i;
    const alamatPattern = /Alamat\s*[:=]?\s*([A-Z0-9\s\-\/]+)/i;
    const rtrwPattern = /RT\/RW\s*[:=]?\s*(\d{3})\/(\d{3})/i;
    const kelDesaPattern = /Kel\/Desa\s*[:=]?\s*([A-Z\s]+)/i;
    const kecamatanPattern = /Kecamatan\s*[:=]?\s*([A-Z\s]+)/i;
    const agamaPattern = /Agama\s*[:=]?\s*([A-Z]+)/i;
    const statusPerkawinanPattern = /Status Perkawinan\s*[:=]?\s*([A-Z\s]+)/i;
    const pekerjaanPattern = /Pekerjaan\s*[:=]?\s*([A-Z\s]+)/i;
    const kewarganegaraanPattern = /Kewarganegaraan\s*[:=]?\s*([A-Z]+)/i;
    const berlakuHinggaPattern = /Berlaku Hingga\s*[:=]?\s*(\d{2}-\d{2}-\d{4})/i;

    const nikMatch = text.match(nikPattern);
    const nameMatch = text.match(namePattern);
    const ttlMatch = text.match(ttlPattern);
    const jkMatch = text.match(jkPattern);
    const alamatMatch = text.match(alamatPattern);
    const rtrwMatch = text.match(rtrwPattern);
    const kelDesaMatch = text.match(kelDesaPattern);
    const kecamatanMatch = text.match(kecamatanPattern);
    const agamaMatch = text.match(agamaPattern);
    const statusPerkawinanMatch = text.match(statusPerkawinanPattern);
    const pekerjaanMatch = text.match(pekerjaanPattern);
    const kewarganegaraanMatch = text.match(kewarganegaraanPattern);
    const berlakuHinggaMatch = text.match(berlakuHinggaPattern);

    // Set state dengan data yang ditemukan
    setNik(nikMatch ? nikMatch[1].replace(/\s/g, "") : "NIK not found");
    setName(nameMatch ? nameMatch[1].trim() : "Name not found");
    setTempatTglLahir(ttlMatch ? `${ttlMatch[1].trim()}, ${ttlMatch[2]}` : "Tempat/Tanggal Lahir not found");
    setJenisKelamin(jkMatch ? jkMatch[1].trim() : "Jenis Kelamin not found");
    setGolDarah(jkMatch ? jkMatch[2].trim() : "Golongan Darah not found");
    setAlamat(alamatMatch ? alamatMatch[1].trim() : "Alamat not found");
    setRtRw(rtrwMatch ? `${rtrwMatch[1]}/${rtrwMatch[2]}` : "RT/RW not found");
    setKelDesa(kelDesaMatch ? kelDesaMatch[1].trim() : "Kel/Desa not found");
    setKecamatan(kecamatanMatch ? kecamatanMatch[1].trim() : "Kecamatan not found");
    setAgama(agamaMatch ? agamaMatch[1].trim() : "Agama not found");
    setStatusPerkawinan(statusPerkawinanMatch ? statusPerkawinanMatch[1].trim() : "Status Perkawinan not found");
    setPekerjaan(pekerjaanMatch ? pekerjaanMatch[1].trim() : "Pekerjaan not found");
    setKewarganegaraan(kewarganegaraanMatch ? kewarganegaraanMatch[1].trim() : "kewarganegaraan not found");
    setBerlakuHingga(berlakuHinggaMatch ? berlakuHinggaMatch[0] : "Berlaku Hingga not found");
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
          tempatTglLahir={tempatTglLahir}
          jenisKelamin={jenisKelamin}
          golDarah={golDarah}
          alamat={alamat}
          rtrw={rtrw}
          kelDesa={kelDesa}
          kecamatan={kecamatan}
          agama={agama}
          statusPerkawinan={statusPerkawinan}
          pekerjaan={pekerjaan}
          kewarganegaraan={kewarganegaraan}
          berlakuHingga={berlakuHingga}
          text={text}
        />
      )}
    </>
  );
}
