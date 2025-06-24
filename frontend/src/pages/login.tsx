import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthTopBar from "@/components/auth_top_bar";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { loginUser, ApiException } from "@/lib/api";
import { Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const emailRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [retryCount, setRetryCount] = useState<number>(0);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  // Auto-focus email input on mount
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    // Only validate after user has attempted to submit
    if (hasSubmitted && value) {
      validateEmail(value);
    }
  };

  const handleRetry = async () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      await handleLogin();
    } else {
      toast({
        title: "Too many retry attempts",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      });
    }
  };
  const handleLogin = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    
    setHasSubmitted(true); // Mark that user has attempted to submit
    
    // Validate inputs
    const isEmailValid = validateEmail(email);
    if (!isEmailValid || !password) {
      if (!password) {
        toast({
          title: "Password required",
          description: "Please enter your password.",
          variant: "destructive",
        });
      }
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser(email, password);
      
      // Success toast
      toast({
        title: "Welcome back!",
        description: "You have been logged in successfully.",
        action: <CheckCircle className="h-4 w-4 text-green-600" />,
      });

      localStorage.setItem("token", data.access_token);
      
      // Small delay to show success message
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
      
    } catch (error) {
      if (error instanceof ApiException) {
        let title = "Login Failed";
        let description = error.message;
        let action = undefined;

        if (error.type === 'network' || error.type === 'timeout') {
          title = "Connection Error";
          action = (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetry}
              disabled={retryCount >= 3}
            >
              Retry ({3 - retryCount} left)
            </Button>
          );
        }

        toast({
          title,
          description,
          variant: "destructive",
          action,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthTopBar />
      <Card className="w-full max-w-xl mx-auto mt-24 shadow-lg rounded-2xl px-4 py-8">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">
            Login to Your Account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleLogin}
            className="space-y-6 px-6 sm:px-8 md:px-10"
          >
            {/* Email Input */}
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />                <Input
                  ref={emailRef}
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  className={`h-12 text-base pl-10 ${hasSubmitted && emailError ? 'border-red-500 focus:border-red-500' : ''}`}
                />
              </div>
              {hasSubmitted && emailError && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {emailError}
                </div>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 text-base pl-10"
              />
            </div>            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="text-white" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
