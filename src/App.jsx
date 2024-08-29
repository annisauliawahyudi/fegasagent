import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import Scan from "./pages/Scan";
import DataPembelian from "./pages/DataPembelian";
import DataPelanggan from "./pages/DataPelanggan";
import Keuangan from "./pages/Keuangan";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/home" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="Scan" element={<Scan />} />
          <Route path="DataPembelian" element={<DataPembelian />} />
          <Route path="DataPelanggan" element={<DataPelanggan />} />
          <Route path="Keuangan" element={<Keuangan />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
