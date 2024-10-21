"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import {useRouter} from 'next/navigation'

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
        if (id){
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
                'title': book.title,
                'author': book.author,
                'genres': book.genres
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
                router.push(`/book/${id}`)
            })
            .catch(error => {
                console.error('There was an error updating the book!', error);
                alert('There was an error updating the book!');
            }
        );
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
                router.push(`/`)
            })
            .catch(error => {
                console.error('There was an error deleting the book!', error);
                alert('There was an error deleting the book!');
            }
        );
    }

    return (
        <div>
            <h1>Update Book</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={book.title}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Author:</label>
                    <input
                        type="text"
                        name="author"
                        value={book.author}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Genres:</label>
                    <input
                        type="text"
                        name="genres"
                        value={book.genres.join(', ')}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Update Book</button>
            </form>
            <button onClick={deleteBook}>Delete Book</button>
        </div>
    );
};

export default UpdateBookPage;