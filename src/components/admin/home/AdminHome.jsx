import React, { useEffect, useState } from 'react';
import { CONFIGS } from '../../../../config'; // Adjust the import path accordingly
import { BsFillPencilFill } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';

// Define the AdminHome component
function AdminHome() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editableRow, setEditableRow] = useState(null); // Track which row is being edited
  const [editContent, setEditContent] = useState({}); // Hold temporary values for editing
  const [newEntry, setNewEntry] = useState({ name: '', desc: '', cover_img: '', photos: [], titles: [] }); // Structure for new entry
  const [coverImageFile, setCoverImageFile] = useState(null); // State to hold the uploaded cover image
  const [photoFiles, setPhotoFiles] = useState([]); // State to hold selected files
  const [photoTitles, setPhotoTitles] = useState([]); // State to hold titles for each photo
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/gethome`);
      const result = await response.json();
      setData(result.message); // Adjust based on your API response structure
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use effect to fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Function to handle adding new entry with images and titles
  const handleAdd = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newEntry.name);
      formData.append('desc', newEntry.desc);
      if (coverImageFile) {
        formData.append('cover_img', coverImageFile); // Append cover image file
      }

      // Append each selected photo file to the FormData
      photoFiles.forEach((file, index) => {
        formData.append('photos', file); // Append each file
        formData.append('titles', photoTitles[index] || ''); // Append the corresponding title (use empty string if no title)
      });

      await fetch(`${CONFIGS.API_BASE_URL}/addhome`, {
        method: 'POST',
        body: formData,
      });
      fetchData(); // Refresh the data after adding
      resetForm(); // Reset form
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  // Handle change for cover image file
  const handleCoverImageChange = (event) => {
    setCoverImageFile(event.target.files[0]); // Get the first selected file
  };

  // Handle change for multiple photo files
  const handleFileChange = (event) => {
    setPhotoFiles(Array.from(event.target.files)); // Convert FileList to array
  };

  // Handle change for each photo's title
  const handleTitleChange = (index, value) => {
    const updatedTitles = [...photoTitles];
    updatedTitles[index] = value; // Update title at the corresponding index
    setPhotoTitles(updatedTitles);
  };

  // Function to reset the form
  const resetForm = () => {
    setNewEntry({ name: '', desc: '', cover_img: '', photos: [], titles: [] });
    setCoverImageFile(null); // Reset cover image
    setPhotoFiles([]); // Reset photo files
    setPhotoTitles([]); // Reset photo titles
    setIsModalOpen(false);
  };

  // Handle delete operation
  const handleDelete = async (id) => {
    try {
      await fetch(`${CONFIGS.API_BASE_URL}/removehome/${id}`, { method: 'DELETE' });
      fetchData(); // Refresh the data after deletion
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  // Enable editing for a specific row
  const enableEdit = (item) => {
    setEditableRow(item._id); // Set the editable row ID
    setEditContent({ ...item }); // Set the current content to edit
  };

  // Handle content change while editing
  const handleEditChange = (e, field) => {
    setEditContent((prev) => ({ ...prev, [field]: e.target.value })); // Update content for editing
  };

  // Update content for the specific row
  const handleUpdate = async (id) => {
    try {
      await fetch(`${CONFIGS.API_BASE_URL}/edithome/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editContent),
      });
      fetchData(); // Refresh the data after updating
      setEditableRow(null); // Close editing
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  // Cancel editing mode
  const cancelEdit = () => {
    setEditableRow(null); // Close editing mode
    setEditContent({}); // Clear edit content
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex justify-between flex-col items-center mb-4 p-16">
      <h1 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>
      <button
        onClick={() => setIsModalOpen(true)} // Open modal
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        Add New Entry
      </button>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border-b p-2 text-left">Name</th>
            <th className="border-b p-2 text-left">Description</th>
            <th className="border-b p-2 text-left">Cover Image</th>
            <th className="border-b p-2 text-left">Photos</th>
            <th className="border-b p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id} className="border-b">
              {editableRow === item._id ? (
                <>
                  <td className="p-2">
                    <input
                      type="text"
                      value={editContent.name}
                      onChange={(e) => handleEditChange(e, 'name')}
                      className="border p-1"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={editContent.desc}
                      onChange={(e) => handleEditChange(e, 'desc')}
                      className="border p-1"
                    />
                  </td>
                  <td className="p-2">
                    <img src={item.cover_img} alt={item.name} className="h-16 w-16 object-cover" />
                  </td>
                  <td className="p-2 flex space-x-2">
                    {item.photos.map((photo, index) => (
                      <img key={index} src={photo.url} alt={`Photo ${index}`} className="h-16 w-16 object-cover" />
                    ))}
                  </td>
                  <td className="p-2 flex space-x-2">
                    <button
                      onClick={() => handleUpdate(item._id)}
                      className="bg-green-500 text-white p-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-500 text-white p-1 rounded"
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.desc}</td>
                  <td className="p-2">
                    <img src={item.cover_img} alt={item.name} className="h-16 w-16 object-cover" />
                  </td>
                  <td className="p-2 flex space-x-2">
                    {item.photos.map((photo, index) => (
                      <img key={index} src={photo.url} alt={`Photo ${index}`} className="h-16 w-16 object-cover" />
                    ))}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => enableEdit(item)}
                      className="bg-blue-500 text-white p-2 rounded"
                    >
                      <BsFillPencilFill />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 text-white p-2 m-2 rounded"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for adding new entry */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add New Entry</h2>
            <label className="block mb-2">
              Name:
              <input
                type="text"
                value={newEntry.name}
                onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
                className="border p-2 w-full"
              />
            </label>
            <label className="block mb-2">
              Description:
              <textarea
                value={newEntry.desc}
                onChange={(e) => setNewEntry({ ...newEntry, desc: e.target.value })}
                className="border p-2 w-full"
              />
            </label>
            <label className="block mb-2">
              Cover Image:
              <input type="file" onChange={handleCoverImageChange} className="border p-2 w-full" />
            </label>
            <label className="block mb-2">
              Photos:
              <input type="file" onChange={handleFileChange} className="border p-2 w-full" multiple />
            </label>
            {photoFiles.map((file, index) => (
              <label key={index} className="block mb-2">
                Title for {file.name}:
                <input
                  type="text"
                  value={photoTitles[index] || ''}
                  onChange={(e) => handleTitleChange(index, e.target.value)}
                  className="border p-2 w-full"
                />
              </label>
            ))}
            <div className="flex justify-end space-x-2">
              <button
                onClick={resetForm}
                className="bg-gray-500 text-white p-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminHome;
