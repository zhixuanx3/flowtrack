import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import logo from "../../assets/logo.svg";
import { register } from "../../api/auth";
import {
  AccountType,
  registerSchema,
  type RegisterFormData,
} from "../../schemas/auth.schema";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { accountType: AccountType.INDIVIDUAL },
  });

  const isOrg = watch("accountType") === AccountType.ORGANIZATION;

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) =>
      register(
        data.email,
        data.password,
        data.name,
        data.accountType,
        data.orgName,
      ),
    onSuccess: () => navigate("/"),
  });

  const onSubmit = (data: RegisterFormData) => registerMutation.mutate(data);

  return (
    <div className="bg-primary-light min-h-screen content-center px-4 sm:px-0">
      <div className="bg-background sm:shadow-card mx-auto flex w-full max-w-md flex-col items-center px-8 pt-2 pb-10 text-center sm:px-14">
        <div className="my-8 flex items-center gap-3">
          <img src={logo} alt="FlowTrack" className="w-10" />
          <div className="text-primary text-2xl font-bold">FlowTrack</div>
        </div>

        <div>
          <div className="text-xl font-semibold">Create your account</div>
          <div>Get started with your free account</div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="my-6 flex w-full flex-col gap-1 text-left"
        >
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
                className="border-line focus:ring-primary w-full rounded-lg border px-4 py-2 pr-10 text-sm focus:ring-1 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-muted hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-error h-4 text-xs">{errors.password?.message}</p>
          </div>

          {isOrg && (
            <Input
              label="Organization Name"
              type="text"
              placeholder="FlowTrack Pte Ltd"
              error={errors.orgName?.message}
              {...registerField("orgName")}
            />
          )}

          <div className="my-2">
            <label className="text-foreground flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isOrg}
                onChange={(e) =>
                  setValue(
                    "accountType",
                    e.target.checked
                      ? AccountType.ORGANIZATION
                      : AccountType.INDIVIDUAL,
                  )
                }
                className="checkbox-primary"
              />
              I'm registering on behalf of an organization
            </label>
            {isOrg && (
              <p className="text-muted mt-1 ml-6 text-xs">
                You'll be the owner of this organization.
              </p>
            )}
          </div>

          <Button
            type="submit"
            loading={registerMutation.isPending}
            className="mt-2 w-full py-2"
          >
            Register
          </Button>
        </form>

        <div>
          Already have an account?{" "}
          <Link to="/" className="text-primary font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
