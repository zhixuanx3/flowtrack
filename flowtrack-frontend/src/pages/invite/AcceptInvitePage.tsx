import { useState } from "react";
import { Building2, Eye, EyeOff } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  acceptInvite,
  inviteQueryOptions,
  type AcceptInviteData,
} from "../../api/invite";
import { setCredentials } from "../../store/authSlice";
import {
  signupInviteSchema,
  loginInviteSchema,
  type SignupInviteFormData,
  type LoginInviteFormData,
} from "../../schemas/acceptInvite.schema";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { getErrorMessage } from "../../utils/errors";

function useAcceptInvite(token: string) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (data: AcceptInviteData) => acceptInvite(token, data),
    onSuccess: ({ data: result }) => {
      dispatch(
        setCredentials({
          accessToken: result.accessToken,
          user: result.user,
          org: result.org,
        }),
      );
      navigate("/dashboard");
    },
  });
}

function SignupInviteForm({ token, email }: { token: string; email: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInviteFormData>({
    resolver: zodResolver(signupInviteSchema),
  });
  const acceptMutation = useAcceptInvite(token);

  return (
    <form
      onSubmit={handleSubmit((data) => acceptMutation.mutate(data))}
      className="my-6 flex w-full flex-col gap-1 text-left"
    >
      <Input label="Email" type="email" value={email} disabled />

      <Input
        label="Full Name"
        type="text"
        placeholder="John Doe"
        error={errors.name?.message}
        {...register("name")}
      />

      <div>
        <label className="text-sm font-medium">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
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

      <Button
        type="submit"
        loading={acceptMutation.isPending}
        className="mt-2 w-full py-2"
      >
        Create Account & Join
      </Button>
    </form>
  );
}

function LoginInviteForm({ token, email }: { token: string; email: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInviteFormData>({
    resolver: zodResolver(loginInviteSchema),
  });
  const acceptMutation = useAcceptInvite(token);

  return (
    <form
      onSubmit={handleSubmit((data) => acceptMutation.mutate(data))}
      className="my-6 flex w-full flex-col gap-1 text-left"
    >
      <Input label="Email" type="email" value={email} disabled />

      <div>
        <label className="text-sm font-medium">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
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

      <Button
        type="submit"
        loading={acceptMutation.isPending}
        className="mt-2 w-full py-2"
      >
        Log In & Join
      </Button>
    </form>
  );
}

export default function AcceptInvitePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const {
    data: invite,
    isLoading,
    isError,
    error,
  } = useQuery({ ...inviteQueryOptions(token), enabled: !!token });

  return (
    <div className="bg-primary-light min-h-screen content-center px-5 sm:px-0">
      <div className="bg-background sm:shadow-card mx-auto flex w-full max-w-md flex-col items-center px-8 pt-2 pb-10 text-center sm:px-14">
        {!token || isError ? (
          <p className="text-error mt-8 text-sm">
            {!token ? "This invite link is invalid." : getErrorMessage(error)}
          </p>
        ) : isLoading ? (
          <p className="text-muted mt-8 text-sm">Loading invite...</p>
        ) : (
          invite && (
            <>
              <div className="flex flex-col items-center">
                <div className="bg-primary-light my-8 flex size-16 shrink-0 items-center justify-center rounded-xl">
                  {invite.organizationLogo ? (
                    <img
                      src={invite.organizationLogo}
                      alt={invite.organizationName}
                      className="size-16 rounded-xl object-cover"
                    />
                  ) : (
                    <Building2 className="text-primary size-8" />
                  )}
                </div>
                <div className="text-xl font-semibold">
                  Join {invite.organizationName}
                </div>
                <div className="text-sm">
                  You've been invited as{" "}
                  {invite.role.charAt(0) + invite.role.slice(1).toLowerCase()}
                </div>
              </div>

              {invite.userExists ? (
                <LoginInviteForm token={token} email={invite.email} />
              ) : (
                <SignupInviteForm token={token} email={invite.email} />
              )}
            </>
          )
        )}
      </div>
    </div>
  );
}
