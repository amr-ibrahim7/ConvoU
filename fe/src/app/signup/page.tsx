'use client';

import { useState, FormEvent } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { AxiosError } from "axios";


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";


interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  general?: string;
}


interface ApiErrorResponse {
  message: string;
}

export default function SignupPage() {
  const { signup, isSubmitting } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  };

  const handleEmailSignup = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.fullName || !formData.email || !formData.password) {
      setErrors({ general: "Please fill in all fields." });
      return;
    }
    if (formData.password.length < 6) {
      setErrors({ password: "Password must be at least 6 characters long." });
      return;
    }

    try {
      await signup(formData);
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = (error.response?.data as ApiErrorResponse)?.message || "An unexpected error occurred.";
        
        if (errorMessage.toLowerCase().includes('email')) {
          setErrors({ email: errorMessage });
        } else if (errorMessage.toLowerCase().includes('password')) {
          setErrors({ password: errorMessage });
        } else if (errorMessage.toLowerCase().includes('name')) {
          setErrors({ fullName: errorMessage });
        } else {
          setErrors({ general: errorMessage });
        }
      } else {
        setErrors({ general: "An unknown error occurred. Please try again." });
      }
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://plus.unsplash.com/premium_photo-1721910821693-458e4d9a8377?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470')"
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="w-full max-w-md relative z-10 my-24">
        <Card className="bg-card/80 backdrop-blur-lg border border-border/50 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <Link href="/" className="flex items-center justify-center mb-4">
              <h1 className="text-2xl font-light tracking-wider text-foreground">U.CONVO</h1>
            </Link>
            <CardTitle className="text-2xl font-semibold text-foreground">
              Create an Account
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Join us today and start your journey
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">

              {errors.general && (
                <p className="text-sm font-medium text-destructive text-center">{errors.general}</p>
              )}
              
              <form onSubmit={handleEmailSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      className={`pl-10 bg-background/50 border-border ${errors.fullName ? 'border-destructive' : ''}`}
                      
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.fullName && <p className="text-sm font-medium text-destructive mt-1">{errors.fullName}</p>}
                </div>


                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className={`pl-10 bg-background/50 border-border ${errors.email ? 'border-destructive' : ''}`}
                      required
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.email && <p className="text-sm font-medium text-destructive mt-1">{errors.email}</p>}
                </div>


                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password (min. 6 characters)"
                      className={`pl-10 pr-10 bg-background/50 border-border ${errors.password ? 'border-destructive' : ''}`}
                      
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm font-medium text-destructive mt-1">{errors.password}</p>}
                </div>
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><Separator /></div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
                </div>
              </div>

              <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignup} disabled={isSubmitting}>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                  Sign in
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}