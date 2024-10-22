"use client"; // This ensures the component runs on the client side

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

export default function AddBook() {
  const router = useRouter(); // Initialize the router
  const [error, setError] = useState(""); // Handle error message
  const [success, setSuccess] = useState(""); // Handle success message
  const [formDataToSend, setFormData] = useState({
    title: "",
    author: "",
    genre: [],
  });

  // Update form data on change
  const handleChange = (e) => {
    setFormData({ ...formDataToSend, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Reset error message
    setSuccess(''); // Reset success message
    const token = Cookies.get('token'); // Get token from cookies

    // If not logged in, redirect to login
    if (!token) {
      alert("You aren't logged in");
      router.push('/login');
      return;
    }

    // Submit data to backend
    axios.post('http://localhost:5000/add_book', 
      {
        title: formDataToSend.title,
        author: formDataToSend.author,
        genre: formDataToSend.genre,
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      setSuccess('Book added successfully');
      alert('Book added successfully');
    })
    .catch((error) => {
      if (error.response && error.response.status === 403) {
        alert('Admin access required');
      } else {
        setError('Failed to add book');
        alert(error.message || 'An error occurred');
      }
    });
  };

  // Add new genre field
  const addGenreField = () => {
    setFormData({ ...formDataToSend, genre: [...formDataToSend.genre, ""] });
  };

  // Update genre on change
  const handleGenreChange = (index, value) => {
    const newGenres = [...formDataToSend.genre];
    newGenres[index] = value;
    setFormData({ ...formDataToSend, genre: newGenres });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-6 bg-black bg-opacity-70 shadow-md">
        <div className="flex space-x-8 text-lg font-semibold">
          <a href="/" className="text-white hover:text-indigo-400 transition duration-300">
            HOME
          </a>
          <a href="/books" className="text-white hover:text-indigo-400 transition duration-300">
            BOOKS
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push("/book/add")} // Using the router here to navigate
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition duration-300 shadow-lg"
          >
            Add Book
          </button>

          <button
            onClick={() => router.push("/login")} // Using the router to navigate to login
            className="p-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 shadow-lg transition duration-300"
          >
            Go to Login
          </button>

          <button
            onClick={() => router.push(`/user/2`)} // Using the router to navigate to a user profile (dummy user ID)
            className="text-white hover:text-indigo-400 transition duration-300"
          >
            <FontAwesomeIcon icon={faUserCircle} className="text-3xl" />
          </button>
        </div>
      </nav>

      {/* Book Form */}
      <div className="min-h-screen bg-gradient-to-b from-gray-800 via-gray-900 to-black text-white flex justify-center items-center">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-400">Add a New Book</h2>
          
          {/* Error and Success Messages */}
          {error && <p className="bg-red-500 text-white p-2 mb-4 rounded">{error}</p>}
          {success && <p className="bg-green-500 text-white p-2 mb-4 rounded">{success}</p>}
          
          {/* Form for adding a new book */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                required
                onChange={handleChange}
                className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white focus:outline-none focus:ring focus:border-indigo-500"
              />
            </div>

            {/* Author Field */}
            <div>
              <label htmlFor="author" className="block text-sm font-medium mb-1">Author ID:</label>
              <input
                type="number"
                id="author"
                name="author"
                required
                onChange={handleChange}
                className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white focus:outline-none focus:ring focus:border-indigo-500"
              />
            </div>

            {/* Genres Field */}
            <div>
              <label className="block text-sm font-medium mb-1">Genres:</label>
              {formDataToSend.genre.map((genre, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={genre}
                    onChange={(e) => handleGenreChange(index, e.target.value)}
                    required
                    className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white focus:outline-none focus:ring focus:border-indigo-500"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addGenreField}
                className="text-indigo-500 hover:text-indigo-300 text-sm"
              >
                + Add another genre
              </button>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold p-3 rounded transition duration-300"
              >
                Add Book
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
