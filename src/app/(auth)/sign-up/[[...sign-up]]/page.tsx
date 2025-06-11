"use client";

import { useState, useCallback } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AlertCircle, Mail, Lock, User } from "lucide-react";
import { Spinner, LoadingDots } from "@/components/ui/spinner";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  // Form state
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Verification state
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  // UI state
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    setIsLoading(true);
    setErrors([]);

    try {
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
      });

      // Send the email verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err: any) {
      console.error("Error:", err);
      const errorMessages = err.errors?.map((error: any) => error.message) || [
        "An error occurred during sign up. Please try again.",
      ];
      setErrors(errorMessages);
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, signUp, emailAddress, password, firstName, lastName]);

  const handleVerifyEmail = useCallback(async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    setErrors([]);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/dashboard");
      } else {
        console.error("Sign up not complete:", completeSignUp);
        setErrors(["Verification failed. Please try again."]);
      }
    } catch (err: any) {
      console.error("Error:", err);
      const errorMessages = err.errors?.map((error: any) => error.message) || [
        "Invalid verification code. Please try again.",
      ];
      setErrors(errorMessages);
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, signUp, code, setActive, router]);

  const handleGoogleSignUp = useCallback(async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    setErrors([]);

    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: any) {
      console.error("Error:", err);
      const errorMessages = err.errors?.map((error: any) => error.message) || [
        "An error occurred with Google sign up. Please try again.",
      ];
      setErrors(errorMessages);
      setIsLoading(false);
    }
  }, [isLoaded, signUp]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Spinner size="lg" className="w-12 h-12 border-zinc-600 border-t-white" />
            <div className="absolute inset-0">
              <Spinner size="lg" className="w-12 h-12 border-transparent border-l-zinc-400 [animation-duration:1.5s]" />
            </div>
          </div>
          <div className="text-white font-medium">
            <LoadingDots />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">
            Create your account
          </CardTitle>
          <CardDescription className="text-center text-zinc-400">
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <span className="text-sm text-red-400">
                  {errors.join(", ")}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white">
                  First name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-10 h-11 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 focus:border-white focus:ring-1 focus:ring-white transition-colors"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white">
                  Last name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="pl-10 h-11 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 focus:border-white focus:ring-1 focus:ring-white transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="pl-10 h-11 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 focus:border-white focus:ring-1 focus:ring-white transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 focus:border-white focus:ring-1 focus:ring-white transition-colors"
                  required
                />
              </div>
            </div>

            {/* Clerk CAPTCHA element */}
            <div id="clerk-captcha"></div>

            <Button
              type="submit"
              className="w-full h-11 bg-white text-black font-semibold hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Spinner size="sm" className="border-black" />
                  <span>Creating account</span>
                  <LoadingDots className="ml-1" />
                </div>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-3 text-zinc-400 font-medium">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            type="button"
            className="w-full h-11 bg-transparent border-zinc-600 text-zinc-300 font-medium hover:bg-zinc-800 hover:text-white hover:border-zinc-500 active:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-zinc-400">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-white hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>

      {/* Verification Code Dialog */}
      <Dialog open={pendingVerification} onOpenChange={setPendingVerification}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-md">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-semibold text-white text-center">
              Verify your email
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-center text-sm leading-relaxed">
              We've sent a verification code to <span className="text-white font-medium">{emailAddress}</span>.
              Enter the 6-digit code below to complete your signup.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-6 py-4">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(value) => setCode(value)}
              className="gap-2 caret-transparent [&_input]:caret-transparent"
            >
              <InputOTPGroup className="gap-2">
                <InputOTPSlot
                  index={0}
                  className="w-12 h-12 bg-zinc-800 border-zinc-700 text-white text-lg font-semibold focus:border-white focus:ring-1 focus:ring-white caret-transparent"
                  inputMode="numeric"
                />
                <InputOTPSlot
                  index={1}
                  className="w-12 h-12 bg-zinc-800 border-zinc-700 text-white text-lg font-semibold focus:border-white focus:ring-1 focus:ring-white caret-transparent"
                  inputMode="numeric"
                />
                <InputOTPSlot
                  index={2}
                  className="w-12 h-12 bg-zinc-800 border-zinc-700 text-white text-lg font-semibold focus:border-white focus:ring-1 focus:ring-white caret-transparent"
                  inputMode="numeric"
                />
                <InputOTPSlot
                  index={3}
                  className="w-12 h-12 bg-zinc-800 border-zinc-700 text-white text-lg font-semibold focus:border-white focus:ring-1 focus:ring-white caret-transparent"
                  inputMode="numeric"
                />
                <InputOTPSlot
                  index={4}
                  className="w-12 h-12 bg-zinc-800 border-zinc-700 text-white text-lg font-semibold focus:border-white focus:ring-1 focus:ring-white caret-transparent"
                  inputMode="numeric"
                />
                <InputOTPSlot
                  index={5}
                  className="w-12 h-12 bg-zinc-800 border-zinc-700 text-white text-lg font-semibold focus:border-white focus:ring-1 focus:ring-white caret-transparent"
                  inputMode="numeric"
                />
              </InputOTPGroup>
            </InputOTP>

            {errors.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 w-full">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                  <span className="text-sm text-red-400">
                    {errors.join(", ")}
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              onClick={handleVerifyEmail}
              disabled={isLoading || code.length !== 6}
              className="w-full h-11 bg-white text-black font-semibold hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Spinner size="sm" className="border-black" />
                  <span>Verifying</span>
                  <LoadingDots className="ml-1" />
                </div>
              ) : (
                "Verify Email"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
