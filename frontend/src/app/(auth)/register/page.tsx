"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
  const [showPassword, setShowPassword] = useState(false);

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
      const request = await fetch("http://localhost:5000/user/register", {
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
    <>
      <div className="bg-[url('/bg-grad.jpg')] bg-cover w-screen h-screen md:p-5 lg:py-14 lg:px-10 xl:px-50">
        <div className="bg-[#262c32]/70 backdrop-blur-lg rounded-2xl p-3 grid md:grid-cols-2 items-center justify-items-center w-full h-full shadow-2xl">
          {/* Left Side */}
          <div className="grid gap-y-10 p-8 rounded-lg w-full text-gray-400">
            <div className="lg:px-15 grid gap-y-5">
              <div>
                <Image className="block md:hidden" src="/VantageBg.png" alt="Background Image" width={50} height={50} />
                <h2 className="text-xl font-bold mb-4">JOIN VANTAGE</h2>
              </div>
              <form onSubmit={handleSubmit} className="grid gap-y-4">
                <div className="">
                  <input
                    type="text"
                    name="fullName"
                    title="Name"
                    placeholder="Name"
                    value={registerData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-black rounded-md"
                  />
                </div>
                <div className="">
                  <input
                    type="email"
                    name="email"
                    title="Email"
                    placeholder="Email"
                    value={registerData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-black rounded-md"
                  />
                </div>
                {/* Phone Number*/}
                <div className="">
                  <input
                    type="tel"
                    name="phone"
                    title="Phone Number"
                    placeholder="Phone Number"
                    value={registerData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-black rounded-md"
                  />
                </div>
                {/* Date */}

                <div className="">
                  <input
                    type={registerData.dob ? "date" : "text"} // Stay as date if a value exists
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = "text";
                    }}
                    name="dob"
                    value={registerData.dob}
                    onChange={handleChange}
                    placeholder="Date of Birth"
                    className="w-full px-3 py-2 bg-black rounded-md"
                  />
                </div>
                {/* password */}
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"} // Toggle type here
                    name="password"
                    title="Password"
                    placeholder="Password"
                    value={registerData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-black text-white rounded-md pr-10 border border-gray-700 focus:outline-none"
                  />

                  {/* The Icon Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  {isLoading ? "Registering..." : "Register"}
                </button>
              </form>
            </div>
            <div className="mt-4 text-center grid">
              <p className="text-sm"><span className="text-gray-500">Already have an account? </span><Link href="/login"  className="text-blue-500 font-semibold">Login</Link></p>
            </div>
          </div>

          {/* Right Side */}
          <div className="hidden md:block relative bg-[url('/BBallBg.jpg')] bg-cover bg-center w-full h-full rounded-2xl">
            <div className="w-full h-full grid items-end justify-center">
              <Image src="/VantageBg.png" alt="Background Image" width={100} height={100} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
