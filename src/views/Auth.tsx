"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Auth = () => {
  const router = useRouter();
  const { login, signup, socialLogin, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ 
    first_name: "", 
    last_name: "", 
    email: "", 
    phone: "", 
    password: "", 
    conf_password: "" 
  });
  
  // State for field-specific errors
  const [signupErrors, setSignupErrors] = useState<Record<string, string[]>>({});
  const [loginErrors, setLoginErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginErrors({}); // Clear previous errors
    try {
      await login(loginData.email, loginData.password);
      router.push("/");
    } catch (error: any) {
      console.error(error);
      // Extract field errors from the error object
      if (error.fieldErrors) {
        setLoginErrors(error.fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setSignupErrors({});
    
    // Validate password match
    if (signupData.password !== signupData.conf_password) {
      setSignupErrors({ conf_password: ["Passwords do not match!"] });
      return;
    }
    
    setLoading(true);
    try {
      await signup(signupData);
      router.push("/");
    } catch (error: any) {
      console.error(error);
      // Extract field errors from the error object
      if (error.fieldErrors) {
        setSignupErrors(error.fieldErrors);
      }
      // Error is already shown via toast in the signup function
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setLoading(true);
    try {
      await socialLogin(provider);
      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome to HomeTex</CardTitle>
            <CardDescription>Login or create an account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginData.email}
                      onChange={(e) => {
                        setLoginData({ ...loginData, email: e.target.value });
                        // Clear error when user starts typing
                        if (loginErrors.email) {
                          setLoginErrors({ ...loginErrors, email: [] });
                        }
                      }}
                      required
                      className={loginErrors.email?.length ? "border-red-500" : ""}
                    />
                    {loginErrors.email?.map((error, index) => (
                      <p key={index} className="text-sm text-red-500">{error}</p>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => {
                        setLoginData({ ...loginData, password: e.target.value });
                        // Clear error when user starts typing
                        if (loginErrors.password) {
                          setLoginErrors({ ...loginErrors, password: [] });
                        }
                      }}
                      required
                      className={loginErrors.password?.length ? "border-red-500" : ""}
                    />
                    {loginErrors.password?.map((error, index) => (
                      <p key={index} className="text-sm text-red-500">{error}</p>
                    ))}
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-first-name">First Name</Label>
                      <Input
                        id="signup-first-name"
                        type="text"
                        placeholder="John"
                        value={signupData.first_name}
                        onChange={(e) => {
                          setSignupData({ ...signupData, first_name: e.target.value });
                          // Clear error when user starts typing
                          if (signupErrors.first_name) {
                            setSignupErrors({ ...signupErrors, first_name: [] });
                          }
                        }}
                        required
                        className={signupErrors.first_name?.length ? "border-red-500" : ""}
                      />
                      {signupErrors.first_name?.map((error, index) => (
                        <p key={index} className="text-sm text-red-500">{error}</p>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-last-name">Last Name</Label>
                      <Input
                        id="signup-last-name"
                        type="text"
                        placeholder="Doe"
                        value={signupData.last_name}
                        onChange={(e) => {
                          setSignupData({ ...signupData, last_name: e.target.value });
                          // Clear error when user starts typing
                          if (signupErrors.last_name) {
                            setSignupErrors({ ...signupErrors, last_name: [] });
                          }
                        }}
                        required
                        className={signupErrors.last_name?.length ? "border-red-500" : ""}
                      />
                      {signupErrors.last_name?.map((error, index) => (
                        <p key={index} className="text-sm text-red-500">{error}</p>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signupData.email}
                      onChange={(e) => {
                        setSignupData({ ...signupData, email: e.target.value });
                        // Clear error when user starts typing
                        if (signupErrors.email) {
                          setSignupErrors({ ...signupErrors, email: [] });
                        }
                      }}
                      required
                      className={signupErrors.email?.length ? "border-red-500" : ""}
                    />
                    {signupErrors.email?.map((error, index) => (
                      <p key={index} className="text-sm text-red-500">{error}</p>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="01712345678"
                      value={signupData.phone}
                      onChange={(e) => {
                        setSignupData({ ...signupData, phone: e.target.value });
                        // Clear error when user starts typing
                        if (signupErrors.phone) {
                          setSignupErrors({ ...signupErrors, phone: [] });
                        }
                      }}
                      required
                      className={signupErrors.phone?.length ? "border-red-500" : ""}
                    />
                    {signupErrors.phone?.map((error, index) => (
                      <p key={index} className="text-sm text-red-500">{error}</p>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupData.password}
                      onChange={(e) => {
                        setSignupData({ ...signupData, password: e.target.value });
                        // Clear error when user starts typing
                        if (signupErrors.password) {
                          setSignupErrors({ ...signupErrors, password: [] });
                        }
                      }}
                      required
                      minLength={6}
                      className={signupErrors.password?.length ? "border-red-500" : ""}
                    />
                    {signupErrors.password?.map((error, index) => (
                      <p key={index} className="text-sm text-red-500">{error}</p>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-conf-password">Confirm Password</Label>
                    <Input
                      id="signup-conf-password"
                      type="password"
                      value={signupData.conf_password}
                      onChange={(e) => {
                        setSignupData({ ...signupData, conf_password: e.target.value });
                        // Clear error when user starts typing
                        if (signupErrors.conf_password) {
                          setSignupErrors({ ...signupErrors, conf_password: [] });
                        }
                      }}
                      required
                      minLength={6}
                      className={signupErrors.conf_password?.length ? "border-red-500" : ""}
                    />
                    {signupErrors.conf_password?.map((error, index) => (
                      <p key={index} className="text-sm text-red-500">{error}</p>
                    ))}
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin("google")}
                disabled={loading}
              >
                Continue with Google
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
