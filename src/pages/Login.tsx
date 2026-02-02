import React, { useState } from "react";
// Remove useNavigate for the Google flow - we rely on the browser redirect
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sun, Loader2, Mail, Lock, Leaf, UserPlus, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Login/Signup loading state
  const [isLoading, setIsLoading] = useState(false);
  // Google specific loading state (to prevent button flickering)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const [error, setError] = useState("");
  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setIsLoading(true);

    try {
      await signup(email, password, name.trim());
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
      setIsLoading(false);
    }
  };

  // ✅ FIXED GOOGLE SIGN IN
  const handleGoogleSignIn = async () => {
    setError("");
    setIsGoogleLoading(true); // Start loading

    try {
      // 1. Trigger the redirect
      await loginWithGoogle();
      
      // 2. DO NOT NAVIGATE MANUALLY!
      // The browser is about to leave this page to go to Google.
      // If we navigate here, we cancel the Google redirect.
      // When the user returns, the AuthProvider + PublicRoute will handle the navigation.
      
    } catch (err) {
      // We only turn off loading if there was an error preventing the redirect
      console.error(err);
      setError(err instanceof Error ? err.message : "Google sign-in failed");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:flex-1 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full border-2 border-primary-foreground/30" />
          <div className="absolute bottom-40 right-20 w-48 h-48 rounded-full border-2 border-primary-foreground/20" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full border-2 border-primary-foreground/25" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 text-primary-foreground">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 backdrop-blur flex items-center justify-center">
              <Sun className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">SolarDry IoT</h1>
              <p className="text-primary-foreground/80">Monitoring System</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold leading-tight mb-6">
            Automated Solar Dryer<br />
            <span className="text-primary-foreground/90">for Agricultural Products</span>
          </h2>

          <p className="text-lg text-primary-foreground/80 max-w-md mb-8">
            Monitor temperature, humidity, and drying progress in real-time with our IoT-based sensor feedback system.
          </p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5" />
              <span className="text-sm">Eco-Friendly</span>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5" />
              <span className="text-sm">Solar Powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <Sun className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-foreground">SolarDry IoT</h1>
              <p className="text-xs text-muted-foreground">Monitoring System</p>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-8 shadow-card">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20 mb-4">
                  {error}
                </div>
              )}

              <TabsContent value="login">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h2>
                  <p className="text-muted-foreground">Sign in to access your dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-foreground">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-foreground">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isLoading || isGoogleLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Create Account</h2>
                  <p className="text-muted-foreground">Sign up to start monitoring</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-foreground">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-foreground">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-foreground">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                        minLength={6}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password" className="text-foreground">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isLoading || isGoogleLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5 mr-2" />
                        Create Account
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12"
                onClick={handleGoogleSignIn}
                disabled={isLoading || isGoogleLoading}
              >
                {isGoogleLoading ? (
                   <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
                )}
                Continue with Google
              </Button>
            </Tabs>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Agricultural Engineering IoT Project
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;