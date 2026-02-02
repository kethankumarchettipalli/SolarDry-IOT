import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sun,
  Loader2,
  Mail,
  Lock,
  User,
  UserPlus,
  ArrowRight,
  Cpu,
  Bot,
  Settings2,
  Activity,
  Radio,
  CircleDot,
} from "lucide-react";

const Index: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, signup, loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsLoading(true);

    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Mobile: Show intro first, then login after tapping Get Started
  // Desktop: Show both side by side
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Mobile View */}
      <div className="lg:hidden">
        {!showLogin ? (
          <IntroSection onGetStarted={() => setShowLogin(true)} />
        ) : (
          <MobileLoginSection
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            name={name}
            setName={setName}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            isLoading={isLoading}
            error={error}
            handleLogin={handleLogin}
            handleSignup={handleSignup}
            handleGoogleSignIn={handleGoogleSignIn}
            onBack={() => setShowLogin(false)}
          />
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left side - Intro */}
        <div className="flex-1 gradient-primary relative overflow-hidden flex items-center justify-center p-8">
          <DesktopIntroContent />
        </div>

        {/* Right side - Auth */}
        <div className="flex-1 flex items-center justify-center p-8 bg-background">
          <AuthForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            name={name}
            setName={setName}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            isLoading={isLoading}
            error={error}
            handleLogin={handleLogin}
            handleSignup={handleSignup}
            handleGoogleSignIn={handleGoogleSignIn}
          />
        </div>
      </div>
    </div>
  );
};

// Animated Data Flow Line Component
const DataFlowLine: React.FC = () => (
  <div className="flex items-center gap-0.5 px-1 flex-shrink-0">
    <div className="w-1 h-1 rounded-full bg-primary-foreground/50 animate-pulse-slow" style={{ animationDelay: '0ms' }} />
    <div className="w-1 h-1 rounded-full bg-primary-foreground/50 animate-pulse-slow" style={{ animationDelay: '150ms' }} />
    <ArrowRight className="w-3 h-3 text-primary-foreground/50" />
  </div>
);

// System Flow Step Component
const FlowStep: React.FC<{ icon: React.ElementType; label: string; sublabel?: string }> = ({ icon: Icon, label, sublabel }) => (
  <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary-foreground/15 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center shadow-lg">
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
    </div>
    <div className="text-center">
      <span className="text-xs sm:text-sm font-semibold text-primary-foreground whitespace-nowrap">{label}</span>
      {sublabel && <p className="text-[10px] sm:text-xs text-primary-foreground/60">{sublabel}</p>}
    </div>
  </div>
);

// Mobile Intro Section
const IntroSection: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Gradient Background with Mesh Effect */}
      <div className="absolute inset-0 gradient-primary">
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(0 0% 100% / 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(0 0% 100% / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
        {/* Glowing orbs representing data points */}
        <div className="absolute top-20 right-8 w-24 h-24 rounded-full bg-primary-foreground/10 blur-2xl animate-glow-pulse" />
        <div className="absolute bottom-40 left-4 w-32 h-32 rounded-full bg-secondary/20 blur-3xl animate-float" />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-warning/20 blur-xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col px-4 py-6 safe-area-inset max-w-full overflow-hidden">
        {/* Logo Header */}
        <div className="flex items-center gap-3 animate-fade-in-up">
          <div className="w-11 h-11 rounded-xl bg-primary-foreground/20 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center">
            <Sun className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-primary-foreground tracking-tight">SolarDry IoT</h1>
            <p className="text-xs text-primary-foreground/70">Smart Agriculture</p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col justify-center py-6">
          {/* Main Headline */}
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground leading-[1.15] mb-4 animate-fade-in-up-delay">
            Precision Solar Drying<br />
            <span className="text-primary-foreground/95">Powered by IoT & AI</span>
          </h2>

          <p className="text-base text-primary-foreground/80 mb-8 max-w-sm leading-relaxed animate-fade-in-up-delay-2">
            An intelligent solar drying system using IoT sensors, AI-driven analytics, and automated control for optimal crop drying.
          </p>

          {/* System Flow: Sensors → AI → Automation */}
          <div className="animate-fade-in-up-delay-3 mb-8 w-full overflow-hidden">
            <div className="flex items-center justify-center gap-2 sm:gap-3 max-w-full px-2">
              <FlowStep icon={Radio} label="Sensors" />
              <DataFlowLine />
              <FlowStep icon={Cpu} label="AI" />
              <DataFlowLine />
              <FlowStep icon={Settings2} label="Control" />
            </div>
          </div>

          {/* Live Data Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6 animate-fade-in-up-delay-3">
            <Activity className="w-4 h-4 text-primary-foreground/70 animate-pulse" />
            <span className="text-sm text-primary-foreground/70">Real-time monitoring active</span>
            <CircleDot className="w-3 h-3 text-success animate-pulse" />
          </div>
        </div>

        {/* CTA Section */}
        <div className="pb-4 animate-fade-in-up-delay-3">
          <Button
            onClick={onGetStarted}
            size="lg"
            className="w-full h-14 text-base sm:text-lg font-semibold bg-primary-foreground text-primary hover:bg-primary-foreground/95 rounded-xl shadow-xl transition-all duration-200 hover:shadow-2xl whitespace-normal"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 ml-1 flex-shrink-0" />
          </Button>
          <p className="text-center text-xs sm:text-sm text-primary-foreground/50 mt-4 font-medium">
            Agricultural Engineering IoT Project
          </p>
        </div>
      </div>
    </div>
  );
};

// Desktop Intro Content
const DesktopIntroContent: React.FC = () => (
  <div className="max-w-xl relative">
    {/* Background Effects */}
    <div 
      className="absolute inset-0 -m-20 opacity-20"
      style={{
        backgroundImage: `
          linear-gradient(to right, hsl(0 0% 100% / 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, hsl(0 0% 100% / 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}
    />
    <div className="absolute -top-10 right-0 w-40 h-40 rounded-full bg-primary-foreground/10 blur-3xl animate-glow-pulse" />
    <div className="absolute bottom-0 -left-10 w-48 h-48 rounded-full bg-secondary/15 blur-3xl animate-float" />

    {/* Logo */}
    <div className="flex items-center gap-4 mb-8 animate-fade-in-up relative">
      <div className="w-14 h-14 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center">
        <Sun className="w-7 h-7 text-primary-foreground" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-primary-foreground tracking-tight">SolarDry IoT</h1>
        <p className="text-primary-foreground/70 text-sm">Smart Agriculture</p>
      </div>
    </div>

    {/* Main Headline */}
    <h2 className="text-4xl xl:text-5xl font-bold text-primary-foreground leading-[1.1] mb-5 animate-fade-in-up-delay relative">
      Precision Solar Drying<br />
      <span className="text-primary-foreground/95">Powered by IoT & AI</span>
    </h2>

    <p className="text-lg text-primary-foreground/80 mb-10 max-w-md leading-relaxed animate-fade-in-up-delay-2 relative">
      An intelligent solar drying system using IoT sensors, AI-driven analytics, and automated control for optimal crop drying.
    </p>

    {/* System Flow: Sensors → AI → Automation */}
    <div className="animate-fade-in-up-delay-3 mb-8 relative">
      <div className="flex items-center gap-3">
        <FlowStep icon={Radio} label="Sensors" sublabel="IoT Data" />
        <DataFlowLine />
        <FlowStep icon={Cpu} label="AI Insights" sublabel="Processing" />
        <DataFlowLine />
        <FlowStep icon={Bot} label="Automated Control" sublabel="Actions" />
      </div>
    </div>

    {/* Live Status */}
    <div className="flex items-center gap-3 animate-fade-in-up-delay-3 relative">
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
        <Activity className="w-4 h-4 text-primary-foreground/80 animate-pulse" />
        <span className="text-sm text-primary-foreground/80 font-medium">System Online</span>
        <CircleDot className="w-3 h-3 text-success animate-pulse" />
      </div>
    </div>
  </div>
);

// Mobile Login Section
interface MobileLoginSectionProps {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  isLoading: boolean;
  error: string;
  handleLogin: (e: React.FormEvent) => Promise<void>;
  handleSignup: (e: React.FormEvent) => Promise<void>;
  handleGoogleSignIn: () => Promise<void>;
  onBack: () => void;
}

const MobileLoginSection: React.FC<MobileLoginSectionProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  confirmPassword,
  setConfirmPassword,
  isLoading,
  error,
  handleLogin,
  handleSignup,
  handleGoogleSignIn,
  onBack,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-background animate-slide-up">
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-3 border-b border-border">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Sun className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">SolarDry IoT</span>
        </div>
      </div>

      {/* Auth Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <AuthForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          name={name}
          setName={setName}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          isLoading={isLoading}
          error={error}
          handleLogin={handleLogin}
          handleSignup={handleSignup}
          handleGoogleSignIn={handleGoogleSignIn}
        />
      </div>
    </div>
  );
};

// Auth Form Component (shared between mobile and desktop)
interface AuthFormProps {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  isLoading: boolean;
  error: string;
  handleLogin: (e: React.FormEvent) => Promise<void>;
  handleSignup: (e: React.FormEvent) => Promise<void>;
  handleGoogleSignIn: () => Promise<void>;
}

const AuthForm: React.FC<AuthFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  confirmPassword,
  setConfirmPassword,
  isLoading,
  error,
  handleLogin,
  handleSignup,
  handleGoogleSignIn,
}) => {
  return (
    <div className="w-full max-w-md animate-fade-in-scale">
      <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-card">
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
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Welcome Back</h2>
              <p className="text-sm text-muted-foreground">Sign in to access your dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-foreground text-sm">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-foreground text-sm">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isLoading}>
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
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Create Account</h2>
              <p className="text-sm text-muted-foreground">Sign up to start monitoring</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-foreground text-sm">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-foreground text-sm">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-foreground text-sm">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12"
                    required
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password" className="text-foreground text-sm">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-12"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isLoading}>
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
            disabled={isLoading}
          >
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
            Continue with Google
          </Button>
        </Tabs>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Agricultural Engineering IoT Project
      </p>
    </div>
  );
};

export default Index;
