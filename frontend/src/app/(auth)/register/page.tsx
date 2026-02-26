"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

//Basic modern register page.tsx with form
export default function RegisterPage() {
  const DEFAULT_DATA = {
    fullName: "",
    email: "",
    password: "",
    // confirm_password: "",
    dob: "",
    phone: "",
  };

  const router = useRouter();
  const [registerData, setRegisterData] = useState(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    setIsLoading(true);
    console.log(registerData);

    try {
      // Simulate API call
      const request = await fetch("http://localhost:5000/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(registerData),
      });

      if (request.ok) {
        const response = await request.json();
        alert(response.message);
      }

      setRegisterData(DEFAULT_DATA);
      router.push("/login");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Submit error";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              name="fullName"
              title="Name"
              value={registerData.fullName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              title="Email"
              value={registerData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          {/* Phone Number*/}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              title="Phone Number"
              value={registerData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          {/* Date */}

          <div className="mb-4">
            <label htmlFor="date_of_birth" className="block text-gray-700 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              title="DOB"
              value={registerData.dob}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          {/* password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              title="Password"
              value={registerData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          {/* confirm password */}
          {/* <div className="mb-4">
            <label
              htmlFor="confirm_password"
              className="block text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm_password"
              title="Pass"
              value={registerData.confirm_password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
            />
          </div> */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
