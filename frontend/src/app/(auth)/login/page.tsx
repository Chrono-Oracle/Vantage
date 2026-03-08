"use client";

import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

type LoginResponse = {
  message: string;
  data?: {
    token: string;
    role: "admin" | "user" | string;
  };
};

//Basic modern login page.tsx with form
export default function LoginPage() {
  const DEFAULT_DATA = {
    email: "",
    password: "",
  };

  const router = useRouter();
  const [loginData, setLoginData] = useState(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    setIsLoading(true);
    console.log("FORM DATA:", loginData);

    try {
      // Simulate API call
      const request = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!request.ok) {
        const errorBody = (await request.json()) as {
          message?: string;
          error?: string;
        };

        const msg =
          errorBody.message ||
          errorBody.error ||
          "Invalid email or password";

        toast.error(msg); // 🔥 toast for wrong credentials
        return;
      }

      const response = (await request.json()) as LoginResponse;

      if (!response.data?.token || !response.data.role) {
        toast.error("Invalid response from server");
        return;
      }

      const token = response.data.token;
      const role = response.data.role;

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify({ token, role }));
      }

      toast.success(response.message || "Login successful! 🎉");

      setLoginData(DEFAULT_DATA);

      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Submit error";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[url('/bg-grad.jpg')] bg-cover w-screen h-screen flex items-center justify-center">
      <div className="bg-[#262c32]/70 backdrop-blur-lg p-8 grid gap-y-4 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-400">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="grid gap-y-5">
          <div className="">
            <label htmlFor="email" className="block text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              title="Email"
              value={loginData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-black rounded-md text-white"
            />
          </div>
          {/* password */}
          <div className="relative">
            <label htmlFor="password" className="block text-gray-300 mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              title="Password"
              value={loginData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-black rounded-md text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-12 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <div className="mt-4 text-center grid">
              <p className="text-sm"><span className="text-gray-500">Don't have an account? </span><Link href="/register"  className="text-blue-500 font-semibold">Register</Link></p>
            </div>
        </form>
      </div>
    </div>
  );
}
