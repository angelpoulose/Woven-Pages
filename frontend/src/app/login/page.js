// pages/auth.js
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
      formDataToSend.append('dob', formData.dateOfBirth);
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
        // After successful login or registration, redirect to another page (e.g., /dashboard)
        router.push('/'); // Replace '/dashboard' with the actual path of the page you want to navigate to
      }

    })
    .catch(error => {
      console.log(error);
      setError("An error occurred. Please try again.");
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h2 className="text-2xl mb-4">{isLogin ? "LOG IN" : "SIGN UP"}</h2>
      <p className="mb-6 text-sm">
        {isLogin ? "Not registered yet? " : "Already Registered? "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-500"
        >
          {isLogin ? "Sign up here." : "Log in here."}
        </button>
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col w-72">
        {!isLogin && (
          <input
            className="p-2 mb-4 rounded border border-white bg-black text-white"
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
        )}
        <input
          className="p-2 mb-4 rounded border border-white bg-black text-white"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          className="p-2 mb-4 rounded border border-white bg-black text-white"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        {!isLogin && (
          <div className="p-2 mb-4 rounded border border-white bg-black text-white">
            <DatePicker
              selected={formData.dateOfBirth}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              maxDate={new Date()} // Limit to current date or earlier
              placeholderText="Select Date of Birth"
              className="w-full p-2 bg-black text-white border border-white rounded"
            />
          </div>
        )}
        <button
          type="submit"
          className="p-2 bg-white text-black rounded hover:bg-gray-200 transition duration-300"
        >
          {isLogin ? "Log In" : "Sign Up"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
