import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthTopBar from "@/components/auth_top_bar";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { signupUser, ApiException } from "@/lib/api";
import { User, Mail, Lock, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";



export default function Signup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const nameRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);  const [loading, setLoading] = useState<boolean>(false);
  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [retryCount, setRetryCount] = useState<number>(0);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  // Auto-focus name input on mount
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  // Name validation
  const validateName = (name: string): boolean => {
    if (!name.trim()) {
      setNameError("Name is required");
      return false;
    }
    if (name.trim().length < 2) {
      setNameError("Name must be at least 2 characters");
      return false;
    }
    setNameError("");
    return true;
  };

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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    // Only validate after user has attempted to submit
    if (hasSubmitted && value) {
      validateName(value);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    // Only validate after user has attempted to submit
    if (hasSubmitted && value) {
      validateEmail(value);
    }
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };

  const handleRetry = async () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      await handleSignup();
    } else {
      toast({
        title: "Too many retry attempts",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      });
    }
  };
  const handleSignup = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    
    setHasSubmitted(true); // Mark that user has attempted to submit
    
    // Validate all inputs
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);    
    if (!isNameValid || !isEmailValid || !password) {
      if (!password) {
        toast({
          title: "Password required",
          description: "Please enter a password.",
          variant: "destructive",
        });
      }
      return;
    }

    setLoading(true);

    try {
      const data = await signupUser(name.trim(), email, password);
      
      // Success toast
      toast({
        title: "Account created successfully!",
        description: "Welcome to our platform. You're now logged in.",
        action: <CheckCircle className="h-4 w-4 text-green-600" />,
      });

      localStorage.setItem("token", data.access_token);
      
      // Small delay to show success message
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
      
    } catch (error) {
      if (error instanceof ApiException) {
        let title = "Signup Failed";
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
      <Card className="max-w-xl mx-auto mt-24 shadow-lg rounded-2xl px-4 py-8">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">
            Create an Account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSignup}
            className="space-y-5 px-3 sm:px-4 md:px-5"
          >
            {/* Name Input */}
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />                <Input
                  ref={nameRef}
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={handleNameChange}
                  required
                  className={`h-12 text-base pl-10 ${hasSubmitted && nameError ? 'border-red-500 focus:border-red-500' : ''}`}
                />
              </div>
              {hasSubmitted && nameError && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {nameError}
                </div>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />                <Input
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
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  className="h-12 text-base pl-10 pr-10"
                />                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div><Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="text-white" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Login here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
