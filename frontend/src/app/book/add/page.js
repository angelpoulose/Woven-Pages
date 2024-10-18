"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie'
import Router from 'next/router';

export default function addBook() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formDataToSend,setFormData] = useState({
    'title':"",
    'author':"",
    'genre':[]
  });
  const handleChange = (e) => {
    setFormData({ ...formDataToSend, [e.target.name]: e.target.value });
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
      const token = Cookies.get('token');
      if (!token) {
        Router.push('/login');
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
        alert('Book added')
      }).catch((error) => {
        setError('Failed to add book');
        alert(error)
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
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" required onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="author">Author:</label>
          <input type="text" id="author" name="author" required onChange={handleChange} />
        </div>
        <div>
          <label>Genres:</label>
          {formDataToSend.genre.map((genre, index) => (
            <div key={index}>
              <input
                type="text"
                value={genre}
                onChange={(e) => handleGenreChange(index, e.target.value)}
                required
              />
            </div>
          ))}
          <button type="button" onClick={addGenreField}>Add another genre</button>
        </div>
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
}
