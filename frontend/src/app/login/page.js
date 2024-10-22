"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import cookies from "js-cookie";
import { useRouter } from "next/navigation"; // Import useRouter
import "react-datepicker/dist/react-datepicker.css"; // Import datepicker styles


export default function Auth() {
  const [isLogin, setIsLogin] = useState(false); // State to toggle between login and signup
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dateOfBirth: null, // Use null for Date object
  });
  const [error, setError] = useState(""); // State to handle errors
  const router = useRouter(); // Initialize useRouter for navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, dateOfBirth: date });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    const formDataToSend = new FormData();
    formDataToSend.append('username', formData.email);
    formDataToSend.append('password', formData.password);
    if (!isLogin) {
      formDataToSend.append('name', formData.name);
      formDataToSend.append('dob', formData.dateOfBirth ? formData.dateOfBirth.toISOString().split('T')[0] : '');
    }

    const url = isLogin ? 'http://localhost:5000/auth/login' : 'http://localhost:5000/auth/register';

    axios.post(url, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      if ((isLogin && response.status !== 200) || (!isLogin && response.status !== 201)) {
        setError(response.data.msg || (isLogin ? "Login failed" : "Registration failed"));
        return;
      }
      if (!isLogin) {
        alert("Registration successful");
        setIsLogin(true);
      } else {
        cookies.set('token', response.data.token, { path: '/' });
        alert("Login successful");
        router.push('/'); // Redirect after successful login or registration
      }

    })
    .catch(error => {
      console.log(error);
      setError("An error occurred. Please try again.");
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 via-gray-900 to-black flex items-center justify-center text-white">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-400">
          {isLogin ? "LOG IN" : "SIGN UP"}
        </h2>

        <p className="mb-6 text-center text-sm text-gray-400">
          {isLogin ? "Not registered yet?" : "Already Registered?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-500 hover:text-indigo-300 transition duration-300"
          >
            {isLogin ? "Sign up here." : "Log in here."}
          </button>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-500"
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-500"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-500"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {!isLogin && (
            <div className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600">
              <DatePicker
                selected={formData.dateOfBirth}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                maxDate={new Date()} // Limit to current date or earlier
                placeholderText="Select Date of Birth"
                className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded"
                required
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold p-3 rounded-lg transition duration-300 shadow-lg"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}
