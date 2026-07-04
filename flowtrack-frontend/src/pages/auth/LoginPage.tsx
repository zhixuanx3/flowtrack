import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import logo from "../../assets/logo.svg";
import { login } from "../../api/auth";
import { setCredentials } from "../../store/authSlice";
import { loginSchema, type LoginFormData } from "../../schemas/auth.schema";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const { data: authData } = await login(data.email, data.password);
      dispatch(setCredentials({ accessToken: authData.accessToken, user: authData.user, org: authData.org }));
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? err.message);
    }
  };

  return (
    <div className="min-h-screen content-center bg-primary-light px-5 sm:px-0">
      <div className="mx-auto flex w-full max-w-md flex-col items-center bg-background px-8 pt-2 pb-10 text-center sm:px-14 sm:shadow-card">
        <div className="my-8 flex items-center gap-3">
          <img src={logo} alt="FlowTrack" className="w-10" />
          <div className="text-2xl font-bold text-primary">FlowTrack</div>
        </div>

        <div>
          <div className="text-xl font-semibold">Welcome back</div>
          <div>Sign in to your account</div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="my-6 flex w-full flex-col gap-1 text-left">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full rounded-lg border border-line px-4 py-2 pr-10 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-muted hover:text-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="h-4 text-xs text-error">{errors.password?.message}</p>
          </div>

          <Button type="submit" loading={isSubmitting} className="mt-2 w-full py-2">
            Login
          </Button>
        </form>

        <div>
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-primary">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
