import { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign Up - Tool Library",
  description: "Create your Tool Library account.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Wrench className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Tool Library</span>
          </Link>
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground mt-2">
            Get started with your free account
          </p>
        </div>

        <RegisterForm />

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
