import React, { useEffect, useState } from 'react';
import Archive_minibar from './Archive_minibar';
import { toast } from 'react-toastify';
import { CONFIGS } from '../../../../config';
import { MdOutlineSettingsBackupRestore } from 'react-icons/md';

function ArchiveTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [testimonialsPerPage] = useState(15);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/getdeletedtestimonail`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);

        // Sort testimonials by _id to get the newest testimonials first
        const sortedTestimonials = data.message.sort((a, b) => b._id.localeCompare(a._id));
        setTestimonials(sortedTestimonials);
      } else {
        const errorData = await response.json();
        toast.error('Failed to fetch testimonials: ' + errorData.message);
      }
    } catch (error) {
      toast.error('Failed to fetch testimonials. Please try again.');
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchTestimonials(); // Load testimonials when the component mounts
  }, []);

  const indexOfLastTestimonial = currentPage * testimonialsPerPage;
  const indexOfFirstTestimonial = indexOfLastTestimonial - testimonialsPerPage;
  const currentTestimonials = testimonials.slice(indexOfFirstTestimonial, indexOfLastTestimonial);

  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleDelete = async (_id) => {
    const confirmDelete = window.confirm("Are you sure you want to change the status of this testimonial?");
  
    if (confirmDelete) {
      try {
        const response = await fetch(`${CONFIGS.API_BASE_URL}/updatetestimonail/${_id}`, {
          method: 'PUT', // or 'PATCH'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isdeleted: false, verify: false }), // Restore the testimonial
        });
  
        // Log the response status and data
        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('API Response:', result);
        
        if (response.ok) {
          await fetchTestimonials();
          toast.success("Testimonial status updated successfully.");
  
          // Update the status in the local state without refetching all data
          const updatedTestimonials = testimonials.map(testimonial =>
            testimonial._id === _id ? { ...testimonial, isdeleted: false } : testimonial
          );
          setTestimonials(updatedTestimonials);
          
          // Log the updated testimonials
          console.log('Updated Testimonials:', updatedTestimonials);
  
          // Optionally, reset current page if testimonials have been changed
          if (currentTestimonials.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1); // Move to previous page if only one testimonial remains
          }
        } else {
          toast.error(`Failed to update testimonial status: ${result.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error updating testimonial status:', error);
        toast.error("Failed to update the testimonial status.");
      }
    }
  };
  

  return (
    <>
      <Archive_minibar />
      <h1 className='text-center text-2xl font-bold mb-4'>Archived Testimonials</h1>
      <div className="overflow-x-auto  m-24">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Phone Number</th>
              <th className="py-2 px-4 text-left">Image</th>
              <th className="py-2 px-4 text-left">Message</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentTestimonials.map((testimonial) => (
              <tr key={testimonial._id} className="border-b">
                <td className="py-2 px-4">{testimonial.cust_name}</td>
                <td className="py-2 px-4">{testimonial.contact_number}</td>
                <td className="py-2 px-4">
                  <img src={testimonial.image} alt="" className="w-16 h-16 object-cover" />
                </td>
                <td className="py-2 px-4">{testimonial.message}</td>
                <td className="py-2 px-4">
                  {/* Restore icon with onClick handler */}
                  <MdOutlineSettingsBackupRestore 
                    style={{ cursor: 'pointer', color: 'red' }} 
                    size={24}
                    onClick={() => handleDelete(testimonial._id)} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination controls */}
      <div className="flex justify-center mt-4">
        <button
          className={`px-4 py-2 border rounded-l ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`px-4 py-2 border ${index + 1 === currentPage ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className={`px-4 py-2 border rounded-r ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
}

export default ArchiveTestimonials;
