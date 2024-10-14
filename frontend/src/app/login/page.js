// pages/auth.js
"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import datepicker styles

export default function Auth() {
  const [isLogin, setIsLogin] = useState(false); // State to toggle between login and signup
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dateOfBirth: null, // Use null for Date object
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, dateOfBirth: date });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
    // Reset form data if necessary
    if (isLogin) {
      // Handle login submission logic
    } else {
      // Handle signup submission logic
    }
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
    </div>
  );
}
