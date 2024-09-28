import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver'; // For downloading excel file
import * as XLSX from 'xlsx'; // Library to create excel files
import { useAuth } from '../../../store/Auth';
import { CONFIGS } from '../../../../config'; // Configuration for base API URL

function AdminInquiry() {
  const { AuthorizationToken } = useAuth(); // Get the authorization token
  const [inquiries, setInquiries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Items to display per page
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define your API URL for fetching inquiries
  const API_URL = `${CONFIGS.API_BASE_URL}/getinquiry`; // Replace with your actual endpoint

  // Fetch inquiry data
  const fetchInquiries = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AuthorizationToken}`, // Include Authorization if required
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API response:', data); // Log the API response

        // Check if data is an array before setting state
        if (Array.isArray(data.message)) {
          setInquiries(data.message); // Set state only if the data is an array
        } else {
          console.error('Unexpected response format:', data);
          setInquiries([]); // Set inquiries as an empty array in case of incorrect format
        }
      } else {
        setError('Failed to fetch inquiries');
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInquiries = Array.isArray(inquiries) ? inquiries.slice(indexOfFirstItem, indexOfLastItem) : []; // Ensure inquiries is an array
  const totalPages = Math.ceil(inquiries.length / itemsPerPage);

  // Handle Excel Download
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(inquiries);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inquiries');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'InquiryData.xlsx');
  };

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
    <div className="inquiry_container p-4 mt-10 m-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Inquiry List</h1>
        <button
          onClick={handleDownloadExcel}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Download Excel
        </button>
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Phone</th>
            <th className="px-4 py-2 text-left">Destination</th>
            <th className="px-4 py-2 text-left">Tentative Month</th>
            <th className="px-4 py-2 text-left">Note</th>
            <th className="px-4 py-2 text-left">Created At</th>
          </tr>
        </thead>
        <tbody>
          {currentInquiries.map((inquiry) => (
            <tr key={inquiry._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{inquiry.name}</td>
              <td className="px-4 py-2">{inquiry.email}</td>
              <td className="px-4 py-2">{inquiry.phone}</td>
              <td className="px-4 py-2">{inquiry.destination}</td>
              <td className="px-4 py-2">{inquiry.tentative_month}</td>
              <td className="px-4 py-2">{inquiry.note}</td>
              <td className="px-4 py-2">{new Date(inquiry.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
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

export default AdminInquiry;
