import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // Make sure to import Cookies for token handling

const CustomerModal = ({ isOpen, onClose, customer }) => {
  const [formValues, setFormValues] = useState({
    name: '',
    nik: '',
    buyerType: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // To store any errors from API

  useEffect(() => {
    const dialogBackdrop = document.querySelector('[data-dialog-backdrop="sign-in-dialog"]');

    if (dialogBackdrop) {
      if (isOpen) {
        dialogBackdrop.classList.remove('opacity-0', 'pointer-events-none');
        dialogBackdrop.classList.add('opacity-100');
      } else {
        dialogBackdrop.classList.remove('opacity-100');
        dialogBackdrop.classList.add('opacity-0', 'pointer-events-none');
      }
    }

    // Update form values when the customer data changes and the modal is open
    if (isOpen && customer) {
      setFormValues({
        name: customer.nama || '',
        nik: customer.nik || '',
        buyerType: customer.buyer_type?.name || '',
        description: customer.description || ''
      });
    } else if (!isOpen) {
      // Reset fields when modal is closed
      setFormValues({
        name: '',
        nik: '',
        buyerType: '',
        description: ''
      });
      setError(null); // Reset error state
    }
  }, [isOpen, customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get token from cookies
      const token = Cookies.get('token');

      // Send request with Axios, include token in the header
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}api/customer/${customer?.id}`,
        {
          nama: formValues.name,
          nik: formValues.nik,
          buyer_type: formValues.buyerType,
          description: formValues.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        onClose(); // Close modal after successful update
      } else {
        setError('Failed to update customer data');
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      setError('Error updating customer: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null; // Do not render modal if it's not open

  return (
    <div data-dialog-backdrop="sign-in-dialog" data-dialog-backdrop-close="true"
      className="pointer-events-none fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 opacity-0 backdrop-blur-sm transition-opacity duration-300">
      <div data-dialog="sign-in-dialog"
        className="relative mx-auto flex w-full max-w-[24rem] flex-col rounded-xl bg-white text-gray-700 shadow-md transition-transform duration-300 transform scale-95">
        
        {/* Button Close */}
        <button 
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900"
          onClick={onClose}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        
        <div className="flex flex-col gap-4 p-6">
          <h4 className="block text-2xl font-semibold leading-snug text-blue-gray-900">Ubah Data</h4>
          {error && <div className="text-red-500">{error}</div>} {/* Display error message */}
          <div className="relative h-11 w-full min-w-[200px]">
            <input
              className="w-full h-full px-3 py-3 text-sm font-normal bg-transparent border rounded-md border-blue-gray-200 focus:border-gray-900 focus:outline-0"
              placeholder="Nama"
              name="name"
              value={formValues.name}
              onChange={handleChange}
            />
          </div>
          <div className="relative h-11 w-full min-w-[200px]">
            <input
              className="w-full h-full px-3 py-3 text-sm font-normal bg-transparent border rounded-md border-blue-gray-200 focus:border-gray-900 focus:outline-0"
              placeholder="NIK"
              name="nik"
              value={formValues.nik}
              onChange={handleChange}
            />
          </div>
          <div className="relative h-11 w-full min-w-[200px]">
            <input
              className="w-full h-full px-3 py-3 text-sm font-normal bg-transparent border rounded-md border-blue-gray-200 focus:border-gray-900 focus:outline-0"
              placeholder="Status"
              name="buyerType"
              value={formValues.buyerType}
              onChange={handleChange}
            />
          </div>
          <div className="relative h-11 w-full min-w-[200px]">
            <textarea
              className="w-full h-full px-3 py-3 text-sm font-normal bg-transparent border rounded-md border-blue-gray-200 focus:border-gray-900 focus:outline-0"
              placeholder="Deskripsi"
              name="description"
              value={formValues.description}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="p-6 pt-0">
          <button
            className="block w-full rounded-lg bg-gray-900 py-3 px-6 text-xs font-bold uppercase text-white shadow-md hover:shadow-lg transition-all"
            type="button"
            onClick={handleSubmit}
            disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;
