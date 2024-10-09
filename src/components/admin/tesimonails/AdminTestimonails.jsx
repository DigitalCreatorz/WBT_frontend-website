import React, { useState, useEffect } from 'react';
import { CONFIGS } from '../../../../config'; // Ensure CONFIGS is correctly imported
import { toast } from 'react-toastify';

function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/gettestimonail`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials.');
      }
      const data = await response.json();
      console.log(data);
      
      setTestimonials(data.message);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    

    fetchTestimonials();
  }, []);

  // Handle update button click (to verify/unverify)
  const handleToggleVerify = async (id, currentVerifyStatus) => {
    const confirmToggle = window.confirm(`Are you sure you want to ${currentVerifyStatus ? 'unverify' : 'verify'} this testimonial?`);
    
    if (confirmToggle) {
      try {
        const response = await fetch(`${CONFIGS.API_BASE_URL}/updatetestimonail/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ verify: !currentVerifyStatus }), // Toggle the verify status
        });
  
        if (response.ok) {
          const updatedTestimonial = await response.json(); // Fetch the updated testimonial
  
          // Update the state with the new data
          setTestimonials((prevTestimonials) =>
            prevTestimonials.map((testimonial) =>
              testimonial._id === id ? updatedTestimonial : testimonial
            )
          );
          await fetchTestimonials();

          toast.success(`Testimonial ${currentVerifyStatus ? 'unverified' : 'verified'} successfully`);
          console.log(`Testimonial ${currentVerifyStatus ? 'unverified' : 'verified'} successfully:`, updatedTestimonial);
        } else {
          const errorData = await response.json();
          console.error('Failed to update testimonial:', errorData.message);
          toast.error(`Failed to update testimonial: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error updating testimonial:', error);
        toast.error("Error updating testimonial. Please try again.");
      }
    }
  };

  // Handle soft delete (updating the status field)
  const handleSoftDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this testimonial?");

    if (confirmDelete) {
      try {
        const response = await fetch(`${CONFIGS.API_BASE_URL}/updatetestimonail/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isdeleted: true }),
        });

        if (response.ok) {
          const updatedTestimonials = await response.json(); // Get the updated testimonials
          // Update the local state to reflect the soft deletion
          setTestimonials((prevTestimonials) =>
            prevTestimonials.map((testimonial) =>
              testimonial._id === id ? { ...testimonial, isdeleted: true } : testimonial
            )
          );
          await fetchTestimonials();
          console.log('Testimonial soft deleted successfully:', updatedTestimonials);
          toast.success("Testimonial deleted successfully.");
        } else {
          const errorData = await response.json();
          console.error('Failed to update testimonial status:', errorData.message);
          toast.error(`Failed to delete testimonial: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.log(error);
        
        console.error('Error updating testimonial status:', error);
        toast.error("Error updating testimonial status. Please try again.");
      }
    }
  };

  return (
    <div className="p-6  bg-gray-100 min-h-screen">
      <h1 className="text-2xl mt-10 font-bold mb-4 text-center">Testimonials Management</h1>

      {/* Display a loading message while fetching data */}
      {loading ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">Loading testimonials...</p>
        </div>
      ) : (
        // Display the table once the data has been fetched
        <div className="overflow-x-auto">
          <table className="min-w-full  bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead>
              <tr>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-900 border-b">Author</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-900 border-b">Message</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-900 border-b">Content</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-900 border-b">Image</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-900 border-b">Status</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-900 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((testimonial) => (
                <tr key={testimonial._id} className="border-b">
                  <td className="py-3 px-6 text-sm text-gray-700">{testimonial.cust_name}</td>
                  <td className="py-3 px-6 text-sm text-gray-700">{testimonial.message}</td>
                  <td className="py-3 px-6 text-sm text-gray-700">{testimonial.contact_number}</td>
                  <td className="py-2 px-4">
                    <img src={testimonial.image} alt="" className="w-16 h-16 object-cover" />
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-700">
                    {testimonial.verify ? 'Verified' : 'Not Verified'}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-700 space-x-2">
                    {/* Verify/Unverify Button */}
                    <button
                      className={`py-1 px-3 rounded ${testimonial.verify ? 'bg-yellow-300 hover:bg-yellow-400' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                      onClick={() => handleToggleVerify(testimonial._id, testimonial.verify)}
                    >
                      {testimonial.verify ? 'Unverify' : 'Verify'}
                    </button>

                    {/* Soft Delete Button */}
                    {!testimonial.isdeleted && (
                      <button
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                        onClick={() => handleSoftDelete(testimonial._id)}
                      >
                        Soft Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminTestimonials;
