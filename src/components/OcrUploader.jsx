import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const OcrUploader = () => {
  const [image, setImage] = useState(null);
  const [nik, setNik] = useState('');
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleScan = () => {
    if (image) {
      setLoading(true);
      Tesseract.recognize(
        image,
        'eng',
        {
          logger: (m) => console.log(m),
        }
      ).then(({ data: { text } }) => {
        setText(text);
        extractData(text);
        setLoading(false);
      });
    }
  };

  const extractData = (text) => {
    console.log(text); 

 
    const nikPattern = /NIK\s*[:=]?\s*([\d\s]+)/i;
    const namePattern = /Nema 2\s*[:=]?\s*([A-Z\s]+)/i;

    const nikMatch = text.match(nikPattern);
    const nameMatch = text.match(namePattern);

    if (nikMatch) {
      setNik(nikMatch[1].replace(/\s/g, ''));
    } else {
      setNik('NIK not found');
    }

    if (nameMatch) {
      setName(nameMatch[1].trim());
    } else {
      setName('Name not found');
    }
  };

  return (
    <div>
      <h1>muhammad giblar zahran imanuel</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && (
        <div>
          <img src={image} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      )}
      <button onClick={handleScan}>
        {loading ? 'Scanning...' : 'Scan Image'}
      </button>
      {text && (
        <div>
          <h2>Scanned Text:</h2>
          <p>{text}</p>
        </div>
      )}
      {(nik || name) && (
        <div>
         
          <p><strong>NIK:</strong> {nik}</p>
          {/* <p><strong>NIK:</strong> {name}</p> */}
       
        </div>
      )}
    </div>
  );
};

export default OcrUploader;