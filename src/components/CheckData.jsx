import { useState } from "react";
import Tesseract from "tesseract.js";
import { Button, Card } from "@material-tailwind/react";
import DataKTP from "./DataKTP";

export default function UploadImage({ capturedImage, onUpload, setCapturedImage }) {
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
  const [scanned, setScanned] = useState(false); // State baru untuk tracking apakah sudah di-scan

  // Function to handle Tesseract OCR process
  const extractData = (text) => {
    console.log(text);

    // NIK and name extraction patterns
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
      });
    }
  };

  // menggunakan trained data untuk Bahasa Indonesia.
  Tesseract.recognize(capturedImage, "ind", {
    logger: (m) => console.log(m),
  })
  
  const uploadImage = async () => {
    setUploading(true);
    await onUpload(capturedImage); // Upload captured image
    setUploading(false);
  };

  return (
    <div className="flex justify-center items-center">
      {/* Hanya tampilkan Card jika belum di-scan */}
      {!scanned && (
        <Card className={`shadow-none ${!capturedImage ? "no-capture" : ""} preview`}>
          <img src={capturedImage} className="w-full h-full object-cover rounded-tr-xl rounded-tl-xl" />
          <div className="actions m-2 space-x-2">
            <Button onClick={handleScan} className="upload-btn" disabled={loading}>
              {loading ? "Scanning..." : "Cek Data"}
            </Button>
            <Button onClick={() => setCapturedImage(null)} className="retake-btn">
              Back
            </Button>
            {loading && <span className="uploading-text">Processing...</span>}
          </div>
        </Card>
      )}

      {/* Display scanned data in DataKTP setelah di-scan */}
      {scanned && (
        <DataKTP
          image={capturedImage}
          nik={nik}
          name={name}
          tempatTglLahir={tempatTglLahir}  // Tambahkan tempat & tanggal lahir
          jenisKelamin={jenisKelamin}      // Tambahkan jenis kelamin
          golDarah={golDarah}              // Tambahkan golongan darah
          alamat={alamat}                  // Tambahkan alamat
          rtrw={rtrw}                      // Tambahkan RT/RW
          kelDesa={kelDesa}                // Tambahkan kelurahan/desa
          kecamatan={kecamatan}            // Tambahkan kecamatan
          agama={agama}                    // Tambahkan agama
          statusPerkawinan={statusPerkawinan}  // Tambahkan status perkawinan
          pekerjaan={pekerjaan}            // Tambahkan pekerjaan
          kewarganegaraan={kewarganegaraan}  // Tambahkan kewarganegaraan
          berlakuHingga={berlakuHingga}    // Tambahkan tanggal berlaku hingga
          text={text}                      // Tambahkan seluruh teks yang di-scan
        />
      )}

    </div>
  );
}
