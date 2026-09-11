import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form"
import { signUp, logInWithGoogle } from "../services/authService"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react";

function Signup() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const password = watch("password")

  const onSubmit = async (data) => {
    setError("");
    try {
      await signUp(data.fullName, data.email, data.password);
      navigate("/dashboard");
    } catch (err) {
      setError(getFriendlyError(err.code));
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    try {
      await logInWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError(getFriendlyError(err.code));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-6">
      <div className="w-full max-w-[360px] bg-white border border-slate-200 rounded-2xl shadow-sm px-5 py-4">

        {/* Top icon badge */}
        <div className="flex flex-col items-center text-center mb-3">
          <div className="w-8 h-8 rounded-[10px] bg-blue-50 flex items-center justify-center mb-1.5">
            <span className="text-blue-700 text-sm font-bold">B</span>
          </div>
          <h1 className="text-base font-medium text-slate-900">Create your account</h1>
          <p className="text-[11px] text-slate-500 mt-0.5">Get started with BizFlow</p>
        </div>

        {error && (
          <div className="mb-2.5 bg-red-50 text-red-600 text-[11px] px-3 py-1.5 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
              Full name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                {...register("fullName", { required: "Full name is required" })}
                type="text"
                placeholder="John Doe"
                className="w-full h-8 pl-8 pr-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2
                 focus:ring-blue-500"

              />
            </div>
            <div>
              {errors.fullName && (
                <p className="text-[10px] text-red-500 mt-0.5">{errors.fullName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email",
                  }
                })}
                type="email"
                placeholder="name@company.com"
                className="w-full h-8 pl-8 pr-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {errors.email && (
              <p className="text-[10px] text-red-500 mt-0.5">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                {
                ...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6, message: "Must be at least 6 characters"
                  }
                })
                }
                type="password"
                placeholder="At least 6 characters"
                className="w-full h-8 pl-8 pr-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {errors.password && (
              <p className="text-[10px] text-red-500 mt-0.5">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
              Confirm password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match",
                })}
                type="password"
                placeholder="••••••••"
                className="w-full h-8 pl-8 pr-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-[10px] text-red-500 mt-0.5">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Primary button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-8 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition"          >
            {isSubmitting ? "Creating account..." : "Sign up"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-2.5 my-2">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-[10px] text-slate-400">or</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Secondary button */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full h-8 flex items-center justify-center gap-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition">
          <FcGoogle size={14} />
          Continue with Google
        </button>

        {/* Footer link */}
        <p className="text-center text-[11px] text-slate-500 mt-2.5">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">Log in</Link>
        </p>

      </div >
    </div >
  );
}

// converts Firebase error codes into readable messages
function getFriendlyError(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "That email address looks invalid.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default Signup;