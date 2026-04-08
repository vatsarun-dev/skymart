import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export function RegisterPage() {
  const navigate = useNavigate();
  const { registerUser, isAuthenticated } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", email: "", password: "", confirm: "" },
  });

  const password = watch("password");

  useEffect(() => {
    document.title = "SkyTrust | Register";
  }, []);

  useEffect(() => {
    if (isAuthenticated) navigate("/home");
  }, [isAuthenticated, navigate]);

  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    return 3;
  }, [password]);

  const onSubmit = async (values) => {
    setSubmitError("");
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 650));
    const result = registerUser(values);
    setIsSubmitting(false);

    if (!result.ok) {
      setSubmitError(result.message);
      return;
    }

    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-scale-in">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 bg-volt rounded-xl flex items-center justify-center">
            <Zap size={16} className="text-ink fill-ink" />
          </div>
          <span className="font-heading font-bold text-xl">
            Sky<span className="text-volt">Trust</span>
          </span>
        </div>

        <div className="auth-card">
          <h2 className="font-heading font-bold text-2xl mb-1">Create account</h2>
          <p className="text-white/40 text-sm font-body mb-8">
            Create an account to save your cart
          </p>

          {submitError ? (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
              {submitError}
            </div>
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <User
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
              />
              <input
                type="text"
                className="field pl-10"
                placeholder="Full name"
                {...register("name", { required: "Full name is required" })}
              />
            </div>
            {errors.name ? <p className="text-red-400 text-xs">{errors.name.message}</p> : null}

            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
              />
              <input
                type="email"
                className="field pl-10"
                placeholder="Email address"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
              />
            </div>
            {errors.email ? <p className="text-red-400 text-xs">{errors.email.message}</p> : null}

            <div>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  className="field pl-10 pr-10"
                  placeholder="Password (min 6 chars)"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {password ? (
                <div className="flex gap-1.5 mt-2 items-center">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        item <= passwordStrength
                          ? ["", "bg-red-500", "bg-amber-400", "bg-volt"][passwordStrength]
                          : "bg-white/10"
                      }`}
                    />
                  ))}
                  <span
                    className={`text-xs font-body ml-1 ${
                      passwordStrength === 3
                        ? "text-volt"
                        : passwordStrength === 2
                        ? "text-amber-400"
                        : "text-red-400"
                    }`}
                  >
                    {["", "Weak", "Medium", "Strong"][passwordStrength]}
                  </span>
                </div>
              ) : null}
            </div>
            {errors.password ? (
              <p className="text-red-400 text-xs">{errors.password.message}</p>
            ) : null}

            <div className="relative">
              <Lock
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
              />
              <input
                type={showPassword ? "text" : "password"}
                className="field pl-10"
                placeholder="Confirm password"
                {...register("confirm", {
                  required: "Confirm your password",
                  validate: (value, values) =>
                    value === values.password || "Passwords do not match",
                })}
              />
            </div>
            {errors.confirm ? (
              <p className="text-red-400 text-xs">{errors.confirm.message}</p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-volt w-full flex items-center justify-center gap-2 py-3.5 mt-2 text-base font-heading font-bold"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">Creating account...</span>
              ) : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-white/30 text-sm font-body mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-volt hover:text-volt-light font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
