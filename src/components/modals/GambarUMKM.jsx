import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

function GambarUMKM({ isOpen, onClose, customerId }) {
  const [gambar, setGambar] = useState(null); // Store the selected customer's image
  const [error, setError] = useState(null); // Store error state
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const fetchGambar = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}api/customer/${customerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Debugging the response
        console.log("Response Data:", response.data);
        const gambarPath = response.data.data.gambar;

        // If gambar path exists, construct full URL
        const fullGambarURL = gambarPath ? `${import.meta.env.VITE_API_URL}${gambarPath}` : null;

        console.log("Full Gambar URL:", fullGambarURL);
        setGambar(fullGambarURL);
      } catch (error) {
        setError(error);
        console.error("Error fetching image:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && customerId) {
      fetchGambar();
    }
  }, [isOpen, customerId]);

  const closeModal = () => {
    onClose();
  };

  return (
    <div>
      {isOpen && (
        <div data-dialog-backdrop="image-modal" data-dialog-backdrop-close="true" className="pointer-events-none fixed inset-0 z-[999] grid h-screen w-screen place-items-center backdrop-blur-sm opacity-100 transition-opacity duration-300">
          <div className="relative m-4 w-3/4 md:w-2/4 lg:w-1/3 rounded-lg bg-white shadow-sm transform transition-all duration-500 ease-out translate-y-10">
            <div className="flex items-center justify-between p-4">
              <button
                className="rounded-md border border-transparent p-2.5 text-center text-sm black transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
                onClick={closeModal}
              >
                X
              </button>
            </div>
            <div className="relative border-b border-t border-b-blue-gray-100 border-t-blue-gray-100 p-0 font-sans text-base font-light leading-relaxed text-blue-gray-500 antialiased">
              {loading && <p>Loading image...</p>}
              {error && <p>Error fetching image: {error.message}</p>}
              {!loading && !error && (
                <div>
                  {gambar ? (
                    <img
                      src={gambar || "https://via.placeholder.com/150"}
                      alt="Customer"
                      className="w-full h-auto"
                      style={{ width: "100%", height: "auto" }} // Explicitly setting width and height for debugging
                    />
                  ) : (
                    <p className="text-center text-gray-500">Gambar tidak tersedia</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GambarUMKM;
