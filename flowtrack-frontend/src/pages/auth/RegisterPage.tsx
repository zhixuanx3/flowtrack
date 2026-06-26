import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import logo from "../../assets/logo.svg";
import { register } from "../../api/auth";
import { AccountType, registerSchema, type RegisterFormData } from "../../schemas/auth.schema";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { accountType: AccountType.INDIVIDUAL },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data.email, data.password, data.name, data.accountType);
      navigate("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? err.message);
    }
  };

  return (
    <div className="min-h-screen content-center bg-primary-light px-4 sm:px-0">
      <div className="mx-auto flex w-full max-w-md flex-col items-center bg-background px-8 pt-2 pb-10 text-center sm:px-14 sm:shadow-card">
        <div className="my-8 flex items-center gap-3">
          <img src={logo} alt="FlowTrack" className="w-10" />
          <div className="text-2xl font-bold text-primary">FlowTrack</div>
        </div>

        <div>
          <div className="text-xl font-semibold">Create your account</div>
          <div>Get started with your free account</div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="my-6 flex w-full flex-col gap-1 text-left">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            error={errors.name?.message}
            {...registerField("name")}
          />

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...registerField("email")}
          />

          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...registerField("password")}
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

          <label className="my-2 flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              {...registerField("accountType", {
                setValueAs: (checked) => checked ? AccountType.ORGANIZATION : AccountType.INDIVIDUAL,
              })}
              className="checkbox-primary"
            />
            I'm registering on behalf of an organisation
          </label>

          <Button type="submit" loading={isSubmitting} className="mt-2 w-full py-2">
            Register
          </Button>
        </form>

        <div>
          Already have an account?{" "}
          <Link to="/" className="font-medium text-primary">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
