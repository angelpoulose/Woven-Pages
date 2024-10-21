"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function AddBook() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formDataToSend, setFormData] = useState({
    title: "",
    author: "",
    genre: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formDataToSend, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const token = Cookies.get('token');
    if (!token) {
      alert("You aren't logged in");
      router.push('/login');
      return;
    }
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
    ).then((response) => {
      setSuccess('Book added successfully');
      alert('Book added');
    }).catch((error) => {
      if (error.response && error.response.status === 403) {
        alert('Admin access required');
      } else {
        setError('Failed to add book');
        alert(error.message || 'An error occurred');
      }
    });
  };

  const addGenreField = () => {
    setFormData({ ...formDataToSend, genre: [...formDataToSend.genre, ""] });
  };

  const handleGenreChange = (index, value) => {
    const newGenres = [...formDataToSend.genre];
    newGenres[index] = value;
    setFormData({ ...formDataToSend, genre: newGenres });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 via-gray-900 to-black text-white flex justify-center items-center">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-400">Add a New Book</h2>
        {error && <p className="bg-red-500 text-white p-2 mb-4 rounded">{error}</p>}
        {success && <p className="bg-green-500 text-white p-2 mb-4 rounded">{success}</p>}
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

          {/* Genres */}
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
  );
}
