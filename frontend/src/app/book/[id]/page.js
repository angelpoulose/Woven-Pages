"use client";

import { useSearchParams,useRouter} from 'next/navigation';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { set } from 'date-fns';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

export default function Book() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id') || (typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : null);
    const [book, setBook] = useState(null);
    const [editionList, setEditionList] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [review, setReview] = useState(null);
    const [newReview, setNewReview] = useState(""); // State for the new review text
    const [rating, setRating] = useState(0); // State for the new review rating
    const [showReviewForm, setShowReviewForm] = useState(false); // Show review form state
    const [readStatus, setReadStatus] = useState(""); // State for the read status
    const [startDate, setStartDate] = useState(""); // State for the start date
    const [finishDate, setFinishDate] = useState(""); // State for the finish date
    const router = useRouter();

    // Fetch data for the specific book
    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:5000/book/${id}`)
                .then(response => {
                    setBook(response.data); // Contains author, average_rating, bookID, title, genres(list), author_name, image_url
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
            axios.get(`http://localhost:5000/book/${id}/view_user_review`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                setReview(response.data);
                console.log(response.data);
                if (response.data) {
                    setNewReview(response.data.user_Review);
                    setRating(response.data.rating);
                    setReadStatus(response.data.read_status);
                    setStartDate(response.data.start_read);
                    setFinishDate(response.data.finish_read);
                }
            }).catch(error => {
                if (error.response && error.response.status === 404) {
                    setReview(null);
                } else {
                    console.log(error);
                }
            });
        }
    }, [id]);

    // Handle the submission of a new review
    const handleReviewSubmit = (e) => {
        e.preventDefault();
        const formattedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : "";
        const formattedFinishDate = finishDate ? new Date(finishDate).toISOString().split('T')[0] : "";

        const token = Cookies.get('token');
        if (!token) {
            alert("You must be logged in to submit a review");
            return;
        }
        axios.post(`http://localhost:5000/book/${id}/make_review`, {
            rating: rating,
            read_status: readStatus,
            start_read: formattedStartDate,
            finish_read: formattedFinishDate,
            user_Review: newReview
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            // Refresh the whole page after a successful submission
            window.location.reload();

        })
        .catch(error => {
            console.log(error);
            alert("Failed to submit the review. Please try again.");
        });
    };

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
        <div className="min-h-screen bg-gray-900 text-white">
            <Head>
                <title>{book ? book.title : "Loading..."} - Book Details</title>
            </Head>
             {/* Navigation Bar */}
             <nav className="flex justify-between items-center p-6 bg-black bg-opacity-70 shadow-md">
                <div className="flex space-x-8 text-lg font-semibold">
                    <a href="/" className="text-white hover:text-indigo-400 transition duration-300">
                        HOME
                    </a>
                    <a href="/books" className="text-white hover:text-indigo-400 transition duration-300">
                        BOOKS
                    </a>
                </div>

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

                    <button
                        onClick={redirect} // Using dummy ID for now
                        className="text-white hover:text-indigo-400 transition duration-300"
                    >
                        <FontAwesomeIcon icon={faUserCircle} className="text-3xl" />
                    </button>
                </div>
            </nav>
            <main className="container mx-auto p-8">
                {book ? (
                    <>
                        <div className="flex flex-col lg:flex-row items-start lg:items-center lg:space-x-8">
                            {/* Book Image Section */}
                            <div className="w-full lg:w-1/4 mb-6 lg:mb-0">
    {book.image_url ? (
        <img
            src={book.image_url}
            alt={book.title}
            className="w-full h-auto max-h-[400px] object-cover rounded-lg shadow-md"
            style={{ aspectRatio: '2 / 3' }} // Ensures the image maintains a book-like 2:3 ratio
        />
    ) : (
        <div 
            className="w-full h-[400px] bg-gray-700 rounded-lg flex items-center justify-center text-gray-500"
            style={{ aspectRatio: '2 / 3' }} // Keeps the placeholder in book aspect ratio as well
        >
            No Image Available
        </div>
    )}
</div>


                            {/* Book Details Section */}
                            <div className="w-full lg:w-3/4">
                                <h1 className="text-4xl font-bold mb-4 text-indigo-400">{book.title}</h1>
                                <a href={`/author/${book.author}`} className="text-lg font-semibold text-indigo-300 hover:text-indigo-400">
                                    <strong>Author:</strong> {book.author_name}
                                </a>
                                <p className="mt-2 text-sm">
                                    <strong>Genre:</strong> {book.genres.join(', ')}
                                </p>
                                <p className="mt-2 text-sm">
                                    <strong>Average Rating:</strong> {book.average_rating}
                                </p>
                            </div>
                        </div>

                        {/* Editions Section */}
                        <div className="mt-8">
                            <h2 className="text-2xl font-bold text-indigo-400 mb-4">Editions</h2>
                            <table className="w-full bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                                <thead>
                                    <tr className="bg-gray-700">
                                        <th className="px-4 py-2">ISBN</th>
                                        <th className="px-4 py-2">Format</th>
                                        <th className="px-4 py-2">Language</th>
                                        <th className="px-4 py-2">Pages</th>
                                        <th className="px-4 py-2">Publication Date</th>
                                        <th className="px-4 py-2">Publisher</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {editionList.length > 0 ? (
                                        editionList.map((edition, index) => (
                                            <tr key={index} className="border-t border-gray-700">
                                                <td className="px-4 py-2">{edition.ISBN || '-'}</td>
                                                <td className="px-4 py-2">{edition.format || '-'}</td>
                                                <td className="px-4 py-2">{edition.language || '-'}</td>
                                                <td className="px-4 py-2">{edition.pages || '-'}</td>
                                                <td className="px-4 py-2">{edition.publication_date || '-'}</td>
                                                <td className="px-4 py-2">{edition.publisher || '-'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td className="px-4 py-2 text-center" colSpan="6">No editions available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* User Review Section */}
                        <div className="mt-8">
                            <>
                                <a
                                    href="#"
                                    onClick={() => setShowReviewForm(true)}
                                    className="text-indigo-400 hover:text-indigo-500"
                                >
                                    {review ? "Edit Review" : "Write a Review"}
                                </a>

                                {showReviewForm && (
                                    <form onSubmit={handleReviewSubmit} className="mt-4">
                                        <div className="mb-4">
                                            <label htmlFor="rating" className="block text-sm">Rating</label>
                                            <select
                                                id="rating"
                                                value={rating}
                                                onChange={(e) => setRating(e.target.value)}
                                                className="mt-2 w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white"
                                            >
                                                <option value={0}>Select Rating</option>
                                                <option value={1}>1</option>
                                                <option value={2}>2</option>
                                                <option value={3}>3</option>
                                                <option value={4}>4</option>
                                                <option value={5}>5</option>
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="review" className="block text-sm">Review</label>
                                            <textarea
                                                id="review"
                                                value={newReview}
                                                onChange={(e) => setNewReview(e.target.value)}
                                                className="mt-2 w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white"
                                                rows={4}
                                                placeholder="Write your review here..."
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="readStatus" className="block text-sm">Read Status</label>
                                            <select
                                                id="readStatus"
                                                value={readStatus}
                                                onChange={(e) => setReadStatus(e.target.value)}
                                                className="mt-2 w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white"
                                            >
                                                <option value="">Select Status</option>
                                                <option value="To Read">To Read</option>
                                                <option value="Reading">Reading</option>
                                                <option value="Read">Read</option>
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="startDate" className="block text-sm">Start Date</label>
                                            <input
                                                type="date"
                                                id="startDate"
                                                value={startDate ? new Date(startDate).toISOString().split('T')[0] : ""}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="mt-2 w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="finishDate" className="block text-sm">Finish Date</label>
                                            <input
                                                type="date"
                                                id="finishDate"
                                                value={finishDate ? new Date(finishDate).toISOString().split('T')[0] : ""}
                                                onChange={(e) => setFinishDate(e.target.value)}
                                                className="mt-2 w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
                                        >
                                            Submit Review
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const token = Cookies.get('token');
                                                if (!token) {
                                                    alert("You must be logged in to delete a review");
                                                    return;
                                                }
                                                axios.delete(`http://localhost:5000/book/${id}/delete_review`, {
                                                    headers: {
                                                        Authorization: `Bearer ${token}`
                                                    }
                                                })
                                                .then(response => {
                                                    // Refresh the whole page after a successful deletion
                                                    window.location.reload();
                                                })
                                                .catch(error => {
                                                    console.log(error);
                                                    alert("Failed to delete the review. Please try again.");
                                                });
                                            }}
                                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg mt-4"
                                        >
                                            Delete Review
                                        </button>
                                    </form>
                                )}
                            </>
                        </div>

                        {/* All Reviews Section */}
<div className="mt-8">
    <h2 className="text-2xl font-bold text-indigo-400 mb-4">Reviews</h2>
    <ul className="space-y-4">
        {reviews.length > 0 ? (
            reviews.map((review, index) => (
                <li key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
                    <a href={`/user/${review.reviewer}`} className="text-indigo-300 hover:text-indigo-400">{review.username}</a>
                    <p><strong>Rating:</strong> {review.rating ? review.rating : "Not Rated"}</p>
                    <p>{review.user_Review}</p>
                </li>
            ))
        ) : (
            <p>No reviews yet</p>
        )}
    </ul>
</div>

{/* Update Book Section */}
{book && (
    <div className="mt-8 text-center">
        <a
            href={`/book/${id}/update`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
        >
            Update Book
        </a>
    </div>
)}

                    </>
                ) : (
                    <p className="text-center">Loading...</p>
                )}
            </main>
        </div>
    );
}
