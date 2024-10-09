import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver'; // For downloading excel file
import * as XLSX from 'xlsx'; // Library to create excel files
import { useAuth } from '../../../store/Auth'; // Import Auth context
import { CONFIGS } from '../../../../config'; // Configuration for base API URL

function AdminContact() {
  const { AuthorizationToken } = useAuth(); // Get the authorization token
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15); // Items to display per page
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define your API URL
  const API_URL = `${CONFIGS.API_BASE_URL}/getcontact`;

  // Fetch contact data
  const fetchContacts = async () => {
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
        setContacts(data.message);
        setIsLoading(false);
      } else {
        setError('Failed to fetch contacts');
        setIsLoading(false);
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
      console.error('Error fetching contacts:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContacts = contacts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(contacts.length / itemsPerPage);

  // Handle Excel Download
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(contacts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'ContactData.xlsx');
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
    <div className="inquiry_container mt-4 m-12">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Contact List</h1>
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
            {/* <th className="px-4 py-2 text-left">ID</th> */}
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Phone</th>
            <th className="px-4 py-2 text-left">Note</th>
            <th className="px-4 py-2 text-left">Created At</th>
          </tr>
        </thead>
        <tbody>
          {currentContacts.map((contact) => (
            <tr key={contact._id} className="border-b hover:bg-gray-50">
              {/* <td className="px-4 py-2">{contact._id}</td> */}
              <td className="px-4 py-2">{contact.name}</td>
              <td className="px-4 py-2">{contact.email}</td>
              <td className="px-4 py-2">{contact.phone}</td>
              <td className="px-4 py-2">{contact.note}</td>
              <td className="px-4 py-2">{new Date(contact.createdAt).toLocaleDateString()}</td>
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

export default AdminContact;
