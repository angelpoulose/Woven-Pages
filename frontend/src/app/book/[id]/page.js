"use client";

import { useSearchParams } from 'next/navigation';
import Head from 'next/head'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Book() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id') || (typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : null);
    const [book, setBook] = useState(null);
    const [editionList, setEditionList] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [review, setReview] = useState(null);

    // Fetch data for the specific book
    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:5000/book/${id}`)
                .then(response => {
                    setBook(response.data); //author, average_rating, bookID, title, genre(list),author_name
                    axios.get(`http://localhost:5000/book/${id}/editions`)
                        .then(response => {
                            setEditionList(response.data);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                    axios.get(`http://localhost:5000/book/${id}/view_reviews`)
                        .then(response => {
                            setReviews(response.data);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                })
                .catch(error => {
                    console.log(error);
                });
            const token = Cookies.get('token');
            axios.get(`http://localhost:5000/book/${id}/view_user_review`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then (response => {
                setReview(response.data);
            }).catch(error => {
                if (error.response && error.response.status === 404) {
                    setReview(null);
                } else {
                    console.log(error);
                }
            });
        }
    }, [id]);

    return (
        <div>
            {book ? (
                book.title ? (
                    <>
                        <Head>
                            <title>{book.title} - Book Details</title>
                        </Head>
                        <main>
                            <h1>{book.title}</h1>
                            <a href={`/author/${book.author}`}><strong>Author:</strong> {book.author_name}</a>
                            <p>
                                <strong>Genre:</strong>
                                {book.genres.map((genre, index) => (
                                    <span key={index}>{genre} </span>
                                ))}
                            </p>
                            <p><strong>Average Rating:</strong> {book.average_rating}</p>
                            <h2>Editions</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ISBN</th>
                                        <th>Format</th>
                                        <th>Language</th>
                                        <th>Pages</th>
                                        <th>Publication Date</th>
                                        <th>Publisher</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {editionList.map(edition => (
                                        <tr key={edition.ISBN}>
                                            <td>{edition.ISBN || '-'}</td>
                                            <td>{edition.format || '-'}</td>
                                            <td>{edition.language || '-'}</td>
                                            <td>{edition.pages || '-'}</td>
                                            <td>{edition.publication_date || '-'}</td>
                                            <td>{edition.publisher || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {review ? (
                                <>
                                    <h2>Your Review</h2>
                                    <p>Rating: {review.rating}</p>
                                    <p>{review.user_Review}</p>
                                    <a href={`/book/${id}/review`}>Edit Review</a>
                                </>
                            ) : (
                                <a href={`/book/${id}/review`}>Write a Review</a>
                            )}
                            <h2>Reviews</h2>
                            <ul>
                                {reviews.map(review => (
                                    <ul>
                                        <a href={`/user/${review.reviewer}`}>{review.username}</a>
                                        <p>Rating: {review.rating}</p>
                                        <p>{review.user_Review}</p>
                                    </ul>
                                ))}
                            </ul>
                        </main>
                    </>
                ) : (
                    <p>Book doesn't exist</p>
                )
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};