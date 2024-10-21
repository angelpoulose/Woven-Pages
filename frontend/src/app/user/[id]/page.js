"use client";

import { useSearchParams } from 'next/navigation';
import Head from 'next/head'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Book() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id') || (typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : null);
    const [reviewList,setReviewList] = useState([])
    const [user,setUser] = useState(null)

    // Fetch data for the specific book
    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:5000/user/${id}/review`)
            .then(response =>{
                setReviewList(response.data);
            })
            .catch(error => {
                console.error(error);
            })
            axios.get(`http://localhost:5000/user/${id}/info`)
            .then(response =>{
                setUser(response.data);
                console.log(response.data);
            })
            .catch(error =>{
                console.error(error);
            })
        }
    }, [id]);

    return (
        <div>
            {user? (
                <div>
                    <h2>User info:</h2>
                    {user.name_? <p><strong>User: </strong>{user.name_}</p>:<span></span>}
                    {user.isAdmin ? <p>Admin User</p> : <p>Regular User</p>}
                </div>
            ):(
                <p>Loading User info...</p>
            )}
            {reviewList ? (
                // Replace true with condition to check if user exists
                (true ? (
                    <div>
                        <h2>Reviews</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Book</th>
                                    <th>Rating</th>
                                    <th>Read Status</th>
                                    <th>Read start date</th>
                                    <th>Read end date</th>
                                    <th>Review</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviewList.map(review => (
                                    <tr key={review.reviewID}>
                                        <td><a href={`/book/${review.book}`}>{review.title || '-'}</a></td>
                                        <td>{review.rating || '-'}</td>
                                        <td>{review.read_status || '-'}</td>
                                        <td>{review.start_read ? new Date(review.start_read).toLocaleDateString() : '-'}</td>
                                        <td>{review.finish_read ? new Date(review.finish_read).toLocaleDateString() : '-'}</td>
                                        <td>{review.user_Review || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>The user doesn't exist</p>
                ))
            ) : (
                <p>Loading reviews...</p>
            )}
        </div>
    );
};