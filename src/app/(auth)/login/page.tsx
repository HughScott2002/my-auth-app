"use client";
// src/app/(auth)/login/page.tsx
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Mail, LockKeyhole } from "lucide-react";
import CustomInput from "@/components/ui/custom-input";
import AuthFooter from "@/components/ui/auth-footer";
// import { useEffect } from "react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoading } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log("Submitting login form:", data);
      await login(data);
    } catch (error) {
      console.error("Login error:", error);
      form.setError("root", {
        type: "manual",
        message: "Login failed. Please check your credentials.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2 text-gray-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-[90%] sm:w-[70%] md:w-1/2 lg:w-[90%] xl:w-96 space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <header className="space-y-4 text-center">
          <h1 className="text-3xl font-semibold -tracking-wide text-gray-900">
            Log In To Your Account
          </h1>
        </header>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <CustomInput
                control={form.control}
                name="email"
                placeholder="Email"
                type="email"
                icon={<Mail className="h-5 w-5" />}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <CustomInput
                control={form.control}
                name="password"
                placeholder="Password"
                type="password"
                icon={<LockKeyhole className="h-5 w-5" />}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {form.formState.errors.root && (
              <p className="text-sm text-red-600 text-center">
                {form.formState.errors.root.message}
              </p>
            )}

            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl py-4 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="animate-spin inline-block mr-2 h-5 w-5" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        <AuthFooter type="login" />
      </div>
    </div>
  );
}
