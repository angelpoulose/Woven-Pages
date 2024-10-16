"use client";

import { useSearchParams } from 'next/navigation';
import Head from 'next/head'
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Book() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id') || (typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : null);
    const [book, setBook] = useState(null);

    // Fetch data for the specific book
    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:5000/book/${id}`)
                .then(response => {
                    setBook(response.data); //author, average_rating, bookID, title, genre(list)
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [id]);

    return (
        <div>
            {book? (
                <>
                    <Head>
                        <title>{book.title} - Book Details</title>
                    </Head>
                    <main>
                        <h1>{book.title}</h1>
                        <p><strong>Author:</strong> {book.author}</p>
                        <p>
                            <strong>Genre:</strong>
                            {book.genres.map((genre, index) => (
                                <span key={index}>{genre} </span>
                            ))}
                        </p>
                    </main>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};