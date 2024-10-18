// pages/auth.js
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css"; // Import datepicker styles
import { useRouter } from "next/navigation"; // Import useRouter

export default function Auth() {
  const [bookList, setBookList] = useState([]);
  const [toReadBooks,setToRead] = useState([]); //To read has to be added

  const router = useRouter();

  useEffect(() => {
    axios.get('http://localhost:5000/book')
    .then(response => {
      setBookList(response.data); //author,average_rating,bookID,title,author_name
    })
    .catch(error => {
      console.log(error);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white font-sans">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-6 bg-black bg-opacity-70 shadow-md">
        <div className="flex space-x-8 text-lg font-semibold">
          <a href="/" className="text-white hover:text-indigo-400 transition duration-300">HOME</a>
          <a href="/books" className="text-white hover:text-indigo-400 transition duration-300">BOOKS</a>
          <a href="/authors" className="text-white hover:text-indigo-400 transition duration-300">AUTHORS</a>
        </div>
        <input
          type="text"
          placeholder="Search"
          className="bg-gray-800 border border-gray-600 p-2 text-white rounded-md w-64 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
        />
      </nav>

      {/* "To Read" Section */}
      <section className="p-6">
        <h2 className="text-4xl font-bold text-indigo-400 mb-4 tracking-wider">To Read</h2>
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {toReadBooks.length > 0 ? (
            toReadBooks.map((book, index) => (
              <div key={index} className="flex-shrink-0 w-44 text-center transition transform hover:scale-105">
                <img
                  src={book.image_url} // Assuming `image_url` is correct for toReadBooks
                  alt={book.title}
                  className="w-44 h-64 object-cover rounded-lg shadow-md"
                />
                <h3 className="mt-3 text-lg text-gray-300 font-medium">{book.title}</h3>
                <p className="text-sm text-gray-500">{book.author}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">Loading...</p>
          )}
        </div>
      </section>

      {/* "Recommendations" Section */}
      <section className="p-6">
        <h2 className="text-4xl font-bold text-indigo-400 mb-4 tracking-wider">Recommendations</h2>
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {bookList.length > 0 ? (
            bookList.map((book, index) => (
              <div key={index} className="flex-shrink-0 w-44 text-center transition transform hover:scale-105">
                <img
                  src={book.image_url}
                  alt={book.title}
                  className="w-44 h-64 object-cover rounded-lg shadow-md"
                />
                <h3 className="mt-3 text-lg text-gray-300 font-medium">{book.title}</h3>
                <p className="text-sm text-gray-500">{book.author_name}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">Loading...</p>
          )}
        </div>
      </section>

      {/* Button to Navigate to Login */}
      <div className="p-6 text-center">
        <button
          onClick={() => router.push('/login')}
          className="p-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 shadow-lg transition duration-300"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
