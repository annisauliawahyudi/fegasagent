import { FaSearch } from 'react-icons/fa';
import { IoMdCloseCircle } from 'react-icons/io';

const SearchComponent = ({ query, setQuery, searchData, clearSearch }) => {
  return (
    <form onSubmit={searchData} className="relative mx-auto text-gray-600 mt-3">
      <input 
        className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        name="search" 
        placeholder="Search"
      />
     
        <button 
        type="submit" 
        className="absolute left-56 top-0 mt-3 mr-3 text-gray-600"
      >
        <FaSearch />
      </button>
      {query && (
        <button 
          type="button" 
          onClick={clearSearch} 
          className="absolute left-48 top-0 mt-3 text-gray-600"
        >
          <IoMdCloseCircle />
        </button>
      )}
    </form>
  );
}

export default SearchComponent;
 