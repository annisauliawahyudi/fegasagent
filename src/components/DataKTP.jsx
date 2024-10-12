import { Button, Dialog } from "@material-tailwind/react";
import React from "react";

const DataKTP = ({
  image,
  nik,
  name,
  tempatTglLahir,
  jenisKelamin,
  golDarah,
  alamat,
  rtrw,
  kelDesa,
  kecamatan,
  agama,
  statusPerkawinan,
  pekerjaan,
  kewarganegaraan,
  berlakuHingga,
  text,
  open,  // Prop untuk open state modal
  onClose,  // Prop untuk close handler
}) => {
  return (
    <Dialog open={open} onClose={onClose} className="w-[90%]">
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4 md:mb-0">
            {image && (
              <img
                src={image}
                className="rounded-xl mx-auto md:mx-0"
                alt="Uploaded"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            )}
          </div>
          <div>
            <p>
              <strong>NIK:</strong> {nik}
            </p>
            <p>
              <strong>Nama:</strong> {name}
            </p>
            <p>
              <strong>Tempat/Tgl Lahir:</strong> {tempatTglLahir}
            </p>
            <p>
              <strong>Jenis Kelamin:</strong> {jenisKelamin}
            </p>
            <p>
              <strong>Golongan Darah:</strong> {golDarah}
            </p>
            <p>
              <strong>Alamat:</strong> {alamat}
            </p>
            <p>
              <strong>RT/RW:</strong> {rtrw}
            </p>
            <p>
              <strong>Kel/Desa:</strong> {kelDesa}
            </p>
            <p>
              <strong>Kecamatan:</strong> {kecamatan}
            </p>
            <p>
              <strong>Agama:</strong> {agama}
            </p>
            <p>
              <strong>Status Perkawinan:</strong> {statusPerkawinan}
            </p>
            <p>
              <strong>Pekerjaan:</strong> {pekerjaan}
            </p>
            <p>
              <strong>Kewarganegaraan:</strong> {kewarganegaraan}
            </p>
            <p>
              <strong>Berlaku Hingga:</strong> {berlakuHingga}
            </p>
            <Button fullWidth className="mt-2" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default DataKTP;
