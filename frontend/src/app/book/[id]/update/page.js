"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const UpdateBookPage = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id') || (typeof window !== 'undefined' ? window.location.pathname.split('/').slice(-2, -1)[0] : null);
    const [book, setBook] = useState({
        title: '',
        author: '',
        genres: [],
    });
    const router = useRouter();

    useEffect(() => {
        // Fetch the book data when the component mounts
        if (id) {
            axios.get(`http://localhost:5000/book/${id}`)
                .then(response => {
                    setBook(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the book data!', error);
                });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'genres') {
            setBook({
                ...book,
                genres: value.split(',').map(genre => genre.trim()),
            });
        } else {
            setBook({
                ...book,
                [name]: value,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = Cookies.get('token');
        if (!token) {
            alert("You aren't logged in");
            router.push('/login');
            return;
        }
        // Update the book data
        axios.put(`http://localhost:5000/book/${id}/update`,
            {
                title: book.title,
                author: book.author,
                genres: book.genres
            },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then(response => {
                alert('Book updated successfully!');
                router.push(`/book/${id}`);
            })
            .catch(error => {
                console.error('There was an error updating the book!', error);
                alert('There was an error updating the book!');
            });
    };

    const deleteBook = () => {
        const token = Cookies.get('token');
        if (!token) {
            alert("You aren't logged in");
            router.push('/login');
            return;
        }
        // Delete the book
        axios.delete(`http://localhost:5000/book/${id}/delete`,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then(response => {
                alert('Book deleted successfully!');
                router.push(`/`);
            })
            .catch(error => {
                console.error('There was an error deleting the book!', error);
                alert('There was an error deleting the book!');
            });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex justify-center items-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl text-indigo-400 font-semibold mb-6 text-center">Update Book</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-300 font-medium">Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={book.title}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 font-medium">Author:</label>
                        <input
                            type="text"
                            name="author"
                            value={book.author}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 font-medium">Genres (comma separated):</label>
                        <input
                            type="text"
                            name="genres"
                            value={book.genres.join(', ')}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button type="submit" className="w-full py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-300">
                            Update Book
                        </button>
                    </div>
                </form>
                <button
                    onClick={deleteBook}
                    className="w-full mt-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                >
                    Delete Book
                </button>
            </div>
        </div>
    );
};

export default UpdateBookPage;
