import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { logIn, logInWithGoogle } from "../services/authService";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setError("");
    try {
      await logIn(data.email, data.password);
      navigate("/dashboard");
    } catch (err) {
      setError(getFriendlyError(err.code));
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await logInWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError(getFriendlyError(err.code));
    }
  };

  return (
    <div className="min-h-dvh overflow-y-auto flex justify-center bg-slate-50 px-4 py-6">
      <div className="w-full max-w-[380px] h-fit bg-white border border-slate-200 rounded-2xl shadow-sm px-6 py-5">
        {/* Top icon badge */}
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-blue-50 flex items-center justify-center mb-2">
            <span className="text-blue-700 text-base font-bold">B</span>
          </div>
          <h1 className="text-lg font-medium text-slate-900">Welcome back</h1>
          <p className="text-xs text-slate-500 mt-0.5">Log in to your BizFlow account</p>
        </div>

        {error && (
          <div className="mb-3 bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="space-y-2.5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="email"
                placeholder="name@company.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email",
                  },
                })}
                className="w-full h-8 pl-8 pr-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="password"
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                })}
                className="w-full h-8 pl-8 pr-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {errors.password && (
              <p className="text-[11px] text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="text-right">
            <span className="text-xs text-blue-600 cursor-pointer">Forgot password?</span>
          </div>

          {/* Primary button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-8 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white
             text-sm font-medium rounded-lg transition"
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-2.5 my-2.5">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-[11px] text-slate-400">or</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Secondary button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full h-8 flex items-center justify-center gap-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
        >
          <FcGoogle size={15} />
          Continue with Google
        </button>

        {/* Footer link */}
        <p className="text-center text-xs text-slate-500 mt-3">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-medium hover:underline">Sign up</Link>
        </p>

      </div>
    </div>
  );
}

// converts Firebase error codes into readable messages
function getFriendlyError(code) {
  switch (code) {
    case "auth/invalid-email":
      return "That email address looks invalid.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default Login;