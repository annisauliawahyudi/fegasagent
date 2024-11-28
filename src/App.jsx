import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import DataPembelian from "./pages/DataPembelian";
import DataPelanggan from "./pages/DataPelanggan";
import Scan from "./pages/Scan";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import PageNotFound from "./pages/PageNotFound";  // Import PageNotFound

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman login */}
        <Route path="/" element={<Login />} />
        
        {/* Rute-rute yang dilindungi menggunakan ProtectedRoute */}
        <Route path="/home" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="Scan" element={<Scan />} />
          <Route path="DataPembelian" element={<DataPembelian />} />
          <Route path="DataPelanggan" element={<DataPelanggan />} />
        </Route>

        {/* Halaman Not Found */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
