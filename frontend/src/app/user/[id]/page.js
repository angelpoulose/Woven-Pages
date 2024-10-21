"use client";

import { useSearchParams } from 'next/navigation';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function User() { 
    const searchParams = useSearchParams();
    const id = searchParams.get('id') || (typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : null);
    const [reviewList, setReviewList] = useState([]);
    const [user, setUser] = useState(null);
   
    
    // Fetch data for the specific user
    useEffect(() => {
        if (id) {
            // Fetch reviews
            axios.get(`http://localhost:5000/user/${id}/review`)
                .then(response => {
                    setReviewList(response.data);
                })
                .catch(error => {
                    console.error(error);
                });

            // Fetch user info
            axios.get(`http://localhost:5000/user/${id}/info`)
                .then(response => {
                    setUser(response.data);
                })
                .catch(error => {
                    console.error(error);
            })
        }
    }, [id]);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <Head>
                <title>{user ? `${user.name_}'s Profile` : "Loading..."}</title>
            </Head>
            <div className="container mx-auto">
                {user ? (
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold mb-4">User Info:</h2>
                        {user.name_ && <p className="text-lg"><strong>User: </strong>{user.name_}</p>}
                        <p className="text-lg">{user.isAdmin ? "Role: Admin User" : "Role: Regular User"}</p>
                    </div>
                ) : (
                    <p className="text-lg">Loading User info...</p>
                )}
                
                {reviewList.length > 0 ? (
                    <div>
                        <h2 className="text-3xl font-bold mb-4">Reviews</h2>
                        <table className="w-full bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                            <thead>
                                <tr className="bg-gray-700">
                                    <th className="px-4 py-2">Book</th>
                                    <th className="px-4 py-2">Rating</th>
                                    <th className="px-4 py-2">Read Status</th>
                                    <th className="px-4 py-2">Read Start Date</th>
                                    <th className="px-4 py-2">Read End Date</th>
                                    <th className="px-4 py-2">Review</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviewList.map(review => (
                                    <tr key={review.reviewID} className="border-t border-gray-700">
                                        <td className="px-4 py-2">
                                            <a href={`/book/${review.book}`} className="text-indigo-400 hover:text-indigo-300">{review.title || '-'}</a>
                                        </td>
                                        <td className="px-4 py-2">{review.rating || '-'}</td>
                                        <td className="px-4 py-2">{review.read_status || '-'}</td>
                                        <td className="px-4 py-2">{review.start_read ? new Date(review.start_read).toLocaleDateString() : '-'}</td>
                                        <td className="px-4 py-2">{review.finish_read ? new Date(review.finish_read).toLocaleDateString() : '-'}</td>
                                        <td className="px-4 py-2">{review.user_Review || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-lg">No reviews available.</p>
                )}
            </div>
        </div>
    );
}
