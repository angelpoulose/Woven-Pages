// pages/auth.js
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css"; // Import datepicker styles
import { useRouter } from "next/navigation"; // Import useRouter
import Cookies from "js-cookie";


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['100','200','300', '600',],
  subsets: ['latin'],
});

export default function Home() {
  const [bookList, setBookList] = useState([]);
  const [toReadBooks, setToRead] = useState([]); //To read has to be added
  const router = useRouter();
  const defaultImage = "https://d827xgdhgqbnd.cloudfront.net/wp-content/uploads/2016/04/09121712/book-cover-placeholder.png";

  useEffect(() => {
    axios
      .get("http://localhost:5000/book")
      .then((response) => {
        setBookList(response.data); //author,average_rating,bookID,title,author_name
      })
      .catch((error) => {
        console.log(error);
      });
      const token = Cookies.get("token");
      if (token){
        axios.get("http://localhost:5000/user_books", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((response) => {
          setToRead(response.data);
        }).catch((error) => {
          console.error(error.status);
        })
      }
  }, []);

  const redirect = () => {
    const token = Cookies.get("token");
    axios.get("http://localhost:5000/auth/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      router.push(`/user/${response.data.userID}`);
      window.location.reload();
    }).catch((error) => {
      console.error(error.status);
    });
  };



  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white ${poppins.className}`}>      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-6 bg-black bg-opacity-70 shadow-md">
        <div className="flex space-x-8 text-lg font-semibold">
          <a href="/" className="text-white hover:text-indigo-400 transition duration-300">
            HOME
          </a>
          <a href="/books" className="text-white hover:text-indigo-400 transition duration-300">
            BOOKS
          </a>
        </div>

        {/* Add Book Button, Go to Login Button, and Profile Icon */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push("/book/add")}
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition duration-300 shadow-lg"
          >
            Add Book
          </button>

          <button
            onClick={() => router.push("/login")}
            className="p-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 shadow-lg transition duration-300"
          >
            Go to Login
          </button>

          {/* User Profile Icon */}
          <button
            onClick={redirect} // Execute redirect function
          className="text-white hover:text-indigo-400 transition duration-300">
          <FontAwesomeIcon icon={faUserCircle} className="text-3xl" />
          </button>
        </div>
      </nav>

      {/* "To Read" Section */}
      {
        toReadBooks.length > 0 ? (
          <section className="p-6">
            <h2 className="text-4xl font-bold text-indigo-400 mb-4 tracking-wider">To Read</h2>
            {/* Change to Grid Layout */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {toReadBooks.map((book, index) => (
                book.read_status === "To Read" ? (
                  <a href={`/book/${book.bookID}`} key={index}>
                    <div className="text-center transition transform hover:scale-105">
                      <img
                        src={book.image_url ? book.image_url : defaultImage}
                        alt={book.title}
                        className="mx-auto w-30 h-100 object-cover rounded-lg shadow-md"  // Adjusted book size
                      />
                      <h3 className="mt-3 text-lg text-gray-300 font-medium">{book.title}</h3>
                      <p className="text-sm text-gray-500">{book.author_name}</p>
                    </div>
                  </a>
                ) : null
              ))}
            </div>
          </section>
        ) : null
      }

      {/* "Recommendations" Section */}
      <section className="p-6">
        <h2 className="text-4xl font-bold text-indigo-400 mb-4 tracking-wider">Recommendations</h2>
        {/* Change to Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bookList.length > 0 ? (
              bookList.map((book, index) => (
                <a href={`/book/${book.bookID}`} key={index}>
            <div className="text-center transition transform hover:scale-105">
              <img
                src={book.image_url ? book.image_url : defaultImage}
                alt={book.title}
                className="mx-auto w-30 h-100 object-cover rounded-lg shadow-md" // Centered and adjusted book size
                  />
                  <h3 className="mt-3 text-lg text-gray-300 font-medium">{book.title}</h3>
                  <p className="text-sm text-gray-500">{book.author_name}</p>
                </div>
              </a>
            ))
          ) : (
            <p className="text-gray-400">Loading...</p>
          )}
        </div>
      </section>
    </div>
  );
}
