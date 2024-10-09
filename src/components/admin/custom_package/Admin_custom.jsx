import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx'; // Updated import statement
import { CONFIGS } from '../../../../config'; // Ensure this path is correct

function Admin_custom() {
  const [customPackages, setCustomPackages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomPackages = async () => {
      try {
        const response = await fetch(`${CONFIGS.API_BASE_URL}/getcustom`);
        const data = await response.json();
        console.log("Data:", data);

        if (response.ok) {
          setCustomPackages(data.message);
          setIsLoading(false); // Set loading to false once data is fetched
        } else {
          setError('Error fetching custom packages:', data.message);
          setIsLoading(false); // Set loading to false on error
        }
      } catch (error) {
        setError('Error fetching custom packages:', error);
        setIsLoading(false); // Set loading to false on error
      }
    };

    fetchCustomPackages();
  }, []);

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(customPackages);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'CustomPackages');

    // Export to .xlsx file
    XLSX.writeFile(workbook, 'CustomPackages.xlsx');
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPackages = customPackages.slice(indexOfFirstItem, indexOfLastItem); // Corrected variable name
  const totalPages = Math.ceil(customPackages.length / itemsPerPage); // Corrected variable name

  // Handle Pagination
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-5 mt-16">
      <div className="flex justify-between items-center flex-col">
        <h2 className="text-2xl font-bold mb-4">Admin - Custom Packages</h2>
        <button
          onClick={downloadExcel}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
        >
          Download as Excel
        </button>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Name*</th>
                <th className="border border-gray-300 p-2">Contact Number*</th>
                <th className="border border-gray-300 p-2">Destination*</th>
                <th className="border border-gray-300 p-2">No. of Nights*</th>
                <th className="border border-gray-300 p-2">Attraction*</th>
                <th className="border border-gray-300 p-2">Hotel Rating*</th>
                <th className="border border-gray-300 p-2">Include Flight</th>
                <th className="border border-gray-300 p-2">Include Visa</th>
                <th className="border border-gray-300 p-2">Include Extra Service</th>
              </tr>
            </thead>
            <tbody>
              {currentPackages.map((packageData) => (
                <tr key={packageData._id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-2">{packageData.name}</td>
                  <td className="border border-gray-300 p-2">{packageData.number}</td>
                  <td className="border border-gray-300 p-2">{packageData.destination}</td>
                  <td className="border border-gray-300 p-2">{packageData.noofnight}</td>
                  
                  {/* Convert `attraction` array to comma-separated string */}
                  <td className="border border-gray-300 p-2">
                    {Array.isArray(packageData.attraction)
                      ? packageData.attraction.join(', ')
                      : packageData.attraction}
                  </td>
                  
                  <td className="border border-gray-300 p-2">{packageData.hotel_rating}</td>
                  <td className="border border-gray-300 p-2">{packageData.include_flight ? 'Yes' : 'No'}</td>
                  <td className="border border-gray-300 p-2">{packageData.include_visa ? 'Yes' : 'No'}</td>
                  <td className="border border-gray-300 p-2">{packageData.include_extrasevice?`${packageData.include_extrasevice}`:"-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center items-center mt-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-3 py-1 mx-1 bg-gray-300 rounded ${currentPage === 1 ? 'cursor-not-allowed' : 'hover:bg-gray-400'}`}
        >
          Previous
        </button>
        <span className="px-3 py-1 mx-1">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 mx-1 bg-gray-300 rounded ${currentPage === totalPages ? 'cursor-not-allowed' : 'hover:bg-gray-400'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Admin_custom;
