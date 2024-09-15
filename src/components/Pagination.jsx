import React from 'react';

const Paginate = ({ currentPage, totalPages, paginate }) => {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          style={{
           
            backgroundColor: currentPage === i ? '#007bff' : '#f4f4f4',
            color: currentPage === i ? '#fff' : '#000',
           
          }}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className='flex space-x-1 justify-end '>
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
        }} className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700">
        Previous
      </button>
      
      {/* {renderPageNumbers()} */}

      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
        }} className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700">
        Next
      </button>
    </div>
  );
};

export default Paginate;
