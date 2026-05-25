import { useState, useContext } from "react";

import { useNavigate, Link } from "react-router-dom";

import { useForm } from "react-hook-form";

import { toast } from "react-hot-toast";

import { Eye, EyeOff, Loader2 } from "lucide-react";

import LeftLogo from "../../assets/img/Left-logo.png";
import { POST } from "../../lib/request";
import { API } from "../../lib/endpoint";
import { AuthContext } from "../../context/AuthContext";

type FormData = {
  username: string;
  password: string;
};

function SignIn() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      // API CALL
      const res = await POST(API.AUTH.LOGIN, data);

      console.log("Login Response =>", res);

      // TOKEN & USER
      const token = res?.data?.token;

      const user = res?.data?.user;

      // VALIDATION
      if (!token || !user) {
        toast.error("Invalid login response");

        return;
      }

      // CONTEXT LOGIN
      login(token, user);

      toast.success("Login successful");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001f3f] to-[#003366] px-4 py-8 flex flex-col items-center">
      {/* ================= HEADER ================= */}

      <div className="w-full max-w-6xl flex items-center justify-between">
        {/* Left Logo */}

        <img
          src={LeftLogo}
          alt="Left Logo"
          className="w-20 sm:w-24 md:w-28 object-contain"
        />

        {/* Title */}

        <div className="text-center">
          <h1 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl">
            Indian Airforce
          </h1>

          <p className="text-gray-300 text-sm sm:text-base md:text-lg">
            Online Resistance Monitoring System
          </p>
        </div>

        {/* Right Logo */}

        <img
          src={LeftLogo}
          alt="Right Logo"
          className="w-20 sm:w-24 md:w-28 object-contain"
        />
      </div>

      {/* ================= LOGIN CARD ================= */}

      <div className="w-full max-w-md mt-10 bg-white rounded-xl shadow-2xl border-t-4 border-orange-500 p-6 sm:p-8">
        <h2 className="text-center text-2xl font-bold text-[#003366] mb-6">
          LOGIN
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* UID */}

          <div>
            <label className="block font-medium mb-2">Enter User ID</label>

            <input
              type="text"
              placeholder="Enter User ID"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#003366]"
              {...register("username", {
                required: "Username is required",
              })}
            />

            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}

          <div>
            <label className="block font-medium mb-2">Enter Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 outline-none focus:border-[#003366]"
                {...register("password", {
                  required: "Password is required",
                })}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#003366]"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* FORGOT PASSWORD */}

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-[#003366] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#003366] hover:bg-[#002244] transition text-white py-3 rounded-lg font-semibold flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                Logging in...
              </>
            ) : (
              "LOGIN"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
