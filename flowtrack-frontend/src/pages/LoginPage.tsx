import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { login } from "../api/auth";
import { setCredentials } from "../store/authSlice";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setServerError("");
    try {
      const { data: authData } = await login(data.email, data.password);
      dispatch(setCredentials({ accessToken: authData.accessToken, user: authData.user }));
      navigate("/dashboard");
    } catch (err) {
      setServerError((err as Error).message);
    }
  };

  return (
    <div className="bg-primary-light">
      <div className="w-fit flex flex-col bg-background pt-2 pb-10 px-30 items-center justify-center min-h-screen mx-auto shadow-card text-center">
        <div className="flex gap-3 items-center my-8">
          <img src={logo} alt="FlowTrack" className="w-10" />
          <div className="text-primary text-2xl font-bold">FlowTrack</div>
        </div>

        <div>
          <div className="text-xl font-semibold">Welcome back</div>
          <div>Sign in to your account</div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col my-6 text-left"
        >
          <div>
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className="w-full border border-line rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <p className="text-error text-xs h-4">{errors.email?.message}</p>
          </div>

          <div>
            <label>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full border border-line rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-error text-xs h-4">{errors.password?.message}</p>
          </div>

          {serverError && (
            <p className="text-error text-sm h-4 mb-2">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary-hover text-white text-sm font-medium py-2 rounded-lg transition disabled:opacity-50 cursor-pointer mt-2"
          >
            {isSubmitting ? "Logging in…" : "Login"}
          </button>
        </form>

        <div>
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-medium">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
