"use client"

import { useRouter } from "next/navigation";
import { toast } from 'sonner'
import { CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { loginAction, signUpAction } from "@/actions/users";


type Props = {
    type: "login" | "signUp";
  };

const AuthForm = ({ type }: Props) => {
    const isLoginForm = type === "login";
   
    const router = useRouter();
    
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
          const email = formData.get("email") as string;
          const password = formData.get("password") as string;
      
          let errorMessage;
          if (isLoginForm) {
            errorMessage = (await loginAction(email, password)).errorMessage;
          } else {
            errorMessage = (await signUpAction(email, password)).errorMessage;
          }
      
          if (!errorMessage) {
            router.replace(`/?toastType=${type}`);
            toast.success(isLoginForm ? "Welcome back!" : "Account created!", {
              description: isLoginForm 
                ? "You've successfully logged in." 
                : "Your account has been created successfully.",
              duration: 5000,
              position: "top-center",
              style: {
                background: "hsl(var(--background))",
                color: "hsl(var(--foreground))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "calc(var(--radius) - 2px)",
                boxShadow: "var(--shadow-md)",
              },
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              )
            });
          } else {
            toast.error("Authentication failed", {
              description: errorMessage,
              duration: 7000,
              position: "top-center",
              style: {
                background: "hsl(var(--destructive))",
                color: "hsl(var(--destructive-foreground))",
                border: "1px solid hsl(var(--destructive))",
                borderRadius: "calc(var(--radius) - 2px)",
                boxShadow: "var(--shadow-md)",
              },
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              ),
              action: {
                label: "Retry",
                onClick: () => handleSubmit(formData),
              },
            });
          }
        });
      };
    
  return (
    <form action={handleSubmit}>
      <CardContent className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="Enter your email"
            type="email"
            required
            disabled={isPending}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder="Enter your password"
            type="password"
            required
            disabled={isPending}
          />
        </div>
      </CardContent>
      <CardFooter className="mt-4 flex flex-col gap-6">
        <Button className="w-full">
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : isLoginForm ? (
            "Login"
          ) : (
            "Sign Up"
          )}
        </Button>
        <p className="text-xs">
          {isLoginForm
            ? "Don't have an account yet?"
            : "Already have an account?"}{" "}
          <Link
            href={isLoginForm ? "/sign-up" : "/login"}
            className={`text-blue-500 underline ${isPending ? "pointer-events-none opacity-50" : ""}`}
          >
            {isLoginForm ? "Sign Up" : "Login"}
          </Link>
        </p>
      </CardFooter>
    </form>
  )
}

export default AuthForm