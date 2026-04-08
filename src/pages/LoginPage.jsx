import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowRight, Eye, EyeOff, Lock, Mail, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { loginUser, isAuthenticated } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    document.title = "SkyMart | Sign in";
  }, []);

  useEffect(() => {
    if (isAuthenticated) navigate("/home");
  }, [isAuthenticated, navigate]);

  const onSubmit = async (values) => {
    setSubmitError("");
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const result = loginUser(values);
    setIsSubmitting(false);

    if (!result.ok) {
      setSubmitError(result.message);
      return;
    }

    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex">
      <div className="hidden lg:flex flex-col w-1/2 bg-[#111] border-r border-white/8 p-12 relative overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-volt/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-volt/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-volt rounded-2xl flex items-center justify-center">
            <Zap size={18} className="text-ink fill-ink" />
          </div>
          <span className="font-heading font-bold text-2xl">
            Sky<span className="text-volt">Mart</span>
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center relative z-10">
          <p className="text-volt text-sm font-body font-medium mb-4 tracking-widest uppercase">
            Welcome back
          </p>
          <h1 className="font-heading font-bold text-5xl leading-tight mb-6">
            Shop the future.
            <br />
            <span className="text-volt">Today.</span>
          </h1>
          <p className="text-white/40 text-base font-body max-w-sm leading-relaxed">
            Thousands of products, lightning-fast delivery, and prices that make your
            wallet happy.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-12">
            {[
              { n: "20K+", l: "Products" },
              { n: "50K+", l: "Users" },
              { n: "4.9★", l: "Rating" },
            ].map((item) => (
              <div
                key={item.l}
                className="bg-white/4 border border-white/8 rounded-2xl p-4 text-center"
              >
                <p className="font-heading font-bold text-xl text-volt">{item.n}</p>
                <p className="text-white/40 text-xs font-body mt-1">{item.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-scale-in">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 bg-volt rounded-xl flex items-center justify-center">
              <Zap size={16} className="text-ink fill-ink" />
            </div>
            <span className="font-heading font-bold text-xl">
              Sky<span className="text-volt">Mart</span>
            </span>
          </div>

          <div className="auth-card">
            <h2 className="font-heading font-bold text-2xl mb-1">Sign in</h2>
            <p className="text-white/40 text-sm font-body mb-8">
              Enter your credentials to continue
            </p>

            {submitError ? (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6 font-body">
                {submitError}
              </div>
            ) : null}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                />
                <input
                  type="email"
                  className="field pl-10"
                  placeholder="Email address"
                  autoComplete="email"
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email ? <p className="text-red-400 text-xs">{errors.email.message}</p> : null}

              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  className="field pl-10 pr-10"
                  placeholder="Password"
                  autoComplete="current-password"
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
              {errors.password ? (
                <p className="text-red-400 text-xs">{errors.password.message}</p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-volt w-full flex items-center justify-center gap-2 py-3.5 mt-2 text-base font-heading font-bold"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">Signing in...</span>
                ) : (
                  <>
                    Sign in <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-white/30 text-sm font-body mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-volt hover:text-volt-light font-semibold transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
