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
                    setBook(response.data); //author, average_rating, bookID, title, genre(list),author_name
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
                        <a href = {`/author/${book.author}`}><strong>Author:</strong> {book.author_name}</a>
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