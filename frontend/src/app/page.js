// pages/auth.js
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css"; // Import datepicker styles

export default function Auth() {
  const [bookList, setBookList] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/book')
    .then(response => {
      setBookList(response.data); //author,average_rating,bookID,title
    })
    .catch(error => {
      console.log(error);
    });
  }, []);

  return (
    <div>
      {bookList.length>0?bookList.map((book, index) => {
        return (
          <a href={`/book/${book.bookID}`} key={index}>
            <h1>{book.title}</h1>
            <p>Author: {book.author}</p>
            <p>Rating: {book.average_rating}</p>
          </a>
        );
      }):<span>Loading</span>}
    </div>
  );
}
