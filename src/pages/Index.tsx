import React, { useState, useEffect } from "react";
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
  Wifi,
  Zap,
  Brain,
} from "lucide-react";

const Index: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, signup, loginWithGoogle, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // The intro page uses a dark theme (slate-950 background), so we don't force light mode
  // The login form section uses bg-background which will adapt to the current theme
  // Only the login section (showLogin on mobile, or right panel on desktop) should be light

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsLoading(true);

    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
      setIsLoading(false);
    }
  };

  const handleGetStarted = () => {
    // Mobile-only: show login form in same view (no route change needed)
    // This avoids route issues since /login redirects to /
    setShowLogin(true);
  };

  return (
    <div className="min-h-[100dvh] bg-background overflow-hidden w-full">
      {/* Mobile View */}
      <div className="lg:hidden">
        {!showLogin ? (
          <IntroSection 
            onGetStarted={handleGetStarted} 
            isAuthenticated={!!user}
            isAuthLoading={authLoading}
            onNavigateToDashboard={() => navigate("/dashboard", { replace: true })}
          />
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
      <div className="hidden lg:flex min-h-[100dvh]">
        {/* Left side - Intro */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8">
          <AliveBackground />
          <DesktopIntroContent 
            isAuthenticated={!!user}
            isAuthLoading={authLoading}
            onNavigateToDashboard={() => navigate("/dashboard", { replace: true })}
            onGetStarted={handleGetStarted}
          />
        </div>

        {/* Right side - Auth (only show if not authenticated) */}
        {!user && (
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
        )}
      </div>
    </div>
  );
};

// Premium Alive Background Component
const AliveBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Deep dark base */}
    <div className="absolute inset-0 bg-slate-950" />
    
    {/* Glowing energy cores */}
    <div 
      className="absolute top-[15%] left-[20%] w-[500px] h-[500px] rounded-full opacity-40 animate-energy-breathe"
      style={{
        background: 'radial-gradient(circle, rgb(16 185 129 / 0.6) 0%, rgb(16 185 129 / 0.2) 40%, transparent 70%)',
        filter: 'blur(60px)',
      }}
    />
    <div 
      className="absolute top-[50%] right-[10%] w-[400px] h-[400px] rounded-full opacity-35 animate-energy-breathe"
      style={{
        background: 'radial-gradient(circle, rgb(6 182 212 / 0.6) 0%, rgb(6 182 212 / 0.2) 40%, transparent 70%)',
        filter: 'blur(50px)',
        animationDelay: '2s',
      }}
    />
    <div 
      className="absolute bottom-[10%] left-[30%] w-[450px] h-[450px] rounded-full opacity-30 animate-energy-breathe"
      style={{
        background: 'radial-gradient(circle, rgb(139 92 246 / 0.5) 0%, rgb(139 92 246 / 0.15) 40%, transparent 70%)',
        filter: 'blur(55px)',
        animationDelay: '4s',
      }}
    />
    
    {/* Subtle drift overlays */}
    <div 
      className="absolute top-[30%] right-[30%] w-[300px] h-[300px] rounded-full opacity-20 animate-energy-drift"
      style={{
        background: 'radial-gradient(circle, rgb(16 185 129 / 0.4) 0%, transparent 60%)',
        filter: 'blur(40px)',
      }}
    />
    <div 
      className="absolute bottom-[30%] left-[10%] w-[250px] h-[250px] rounded-full opacity-25 animate-energy-drift"
      style={{
        background: 'radial-gradient(circle, rgb(6 182 212 / 0.4) 0%, transparent 60%)',
        filter: 'blur(35px)',
        animationDelay: '3s',
      }}
    />

    {/* Data grid pattern overlay */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="data-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="1" fill="white" />
          <line x1="0" y1="30" x2="60" y2="30" stroke="white" strokeWidth="0.3" opacity="0.5" />
          <line x1="30" y1="0" x2="30" y2="60" stroke="white" strokeWidth="0.3" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#data-grid)" />
    </svg>

    {/* Network connection lines */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="network-lines" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <circle cx="60" cy="60" r="2" fill="white" />
          <circle cx="0" cy="0" r="1.5" fill="white" />
          <circle cx="120" cy="0" r="1.5" fill="white" />
          <circle cx="0" cy="120" r="1.5" fill="white" />
          <circle cx="120" cy="120" r="1.5" fill="white" />
          <line x1="0" y1="0" x2="60" y2="60" stroke="white" strokeWidth="0.4" />
          <line x1="120" y1="0" x2="60" y2="60" stroke="white" strokeWidth="0.4" />
          <line x1="0" y1="120" x2="60" y2="60" stroke="white" strokeWidth="0.4" />
          <line x1="120" y1="120" x2="60" y2="60" stroke="white" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#network-lines)" />
    </svg>
  </div>
);

// Premium System Loading Animation
const SystemLoader: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'connecting' | 'syncing' | 'ready'>('connecting');

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => onComplete?.(), 400);
          return 100;
        }
        return prev + 1.5;
      });
    }, 35);

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  useEffect(() => {
    if (progress < 35) setStage('connecting');
    else if (progress < 70) setStage('syncing');
    else setStage('ready');
  }, [progress]);

  return (
    <div className="flex flex-col items-center gap-8 animate-fade-in">
      {/* Central orb with orbiting elements */}
      <div className="relative w-28 h-28">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" style={{ animationDuration: '2s' }} />
        
        {/* Rotating orbital rings */}
        <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-spin" style={{ animationDuration: '8s' }} />
        <div className="absolute inset-2 rounded-full border border-emerald-400/25 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
        <div className="absolute inset-4 rounded-full border border-violet-400/20 animate-spin" style={{ animationDuration: '4s' }} />
        
        {/* Central core */}
        <div className="absolute inset-6 rounded-full bg-gradient-to-br from-emerald-500/40 to-cyan-500/40 backdrop-blur-sm flex items-center justify-center animate-pulse">
          {stage === 'connecting' && <Wifi className="w-6 h-6 text-white" />}
          {stage === 'syncing' && <Cpu className="w-6 h-6 text-white" />}
          {stage === 'ready' && <Zap className="w-6 h-6 text-white" />}
        </div>

        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s', animationDelay: '1s' }}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s', animationDelay: '2s' }}>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 rounded-full bg-violet-400 shadow-lg shadow-violet-400/50" />
        </div>
      </div>

      {/* Progress bar and status */}
      <div className="w-56 space-y-3">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-100 ease-out"
            style={{ 
              width: `${progress}%`,
              background: 'linear-gradient(90deg, rgb(16 185 129) 0%, rgb(6 182 212) 50%, rgb(139 92 246) 100%)'
            }}
          />
        </div>
        <p className="text-sm text-white/70 text-center font-medium tracking-wide">
          {stage === 'connecting' && 'Connecting to System...'}
          {stage === 'syncing' && 'Syncing Sensors...'}
          {stage === 'ready' && 'Preparing Dashboard...'}
        </p>
      </div>
    </div>
  );
};

// Glassmorphism Feature Card
interface FeatureCardProps {
  icon: React.ElementType;
  label: string;
  color: 'emerald' | 'cyan' | 'violet';
  delay: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, label, color, delay }) => {
  const colorClasses = {
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 shadow-emerald-500/20',
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 shadow-cyan-500/20',
    violet: 'from-violet-500/20 to-violet-500/5 border-violet-500/30 shadow-violet-500/20',
  };

  const iconColors = {
    emerald: 'text-emerald-400',
    cyan: 'text-cyan-400',
    violet: 'text-violet-400',
  };

  return (
    <div 
      className={`flex flex-col items-center gap-3 p-4 rounded-2xl bg-gradient-to-b ${colorClasses[color]} backdrop-blur-md border shadow-lg animate-fade-in-up`}
      style={{ animationDelay: delay, animationFillMode: 'both' }}
    >
      <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
        <Icon className={`w-6 h-6 ${iconColors[color]}`} />
      </div>
      <span className="text-sm font-semibold text-white/90">{label}</span>
    </div>
  );
};

// Mobile Intro Section
interface IntroSectionProps {
  onGetStarted: () => void;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  onNavigateToDashboard: () => void;
}

const IntroSection: React.FC<IntroSectionProps> = ({ 
  onGetStarted, 
  isAuthenticated, 
  isAuthLoading,
  onNavigateToDashboard 
}) => {
  return (
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden w-full">
      {/* Alive Background for Mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-slate-950" />
        
        {/* Energy cores - scaled for mobile */}
        <div 
          className="absolute top-[10%] left-[10%] w-[300px] h-[300px] rounded-full opacity-35 animate-energy-breathe"
          style={{
            background: 'radial-gradient(circle, rgb(16 185 129 / 0.5) 0%, rgb(16 185 129 / 0.15) 40%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div 
          className="absolute top-[40%] right-[5%] w-[250px] h-[250px] rounded-full opacity-30 animate-energy-breathe"
          style={{
            background: 'radial-gradient(circle, rgb(6 182 212 / 0.5) 0%, rgb(6 182 212 / 0.15) 40%, transparent 70%)',
            filter: 'blur(35px)',
            animationDelay: '2s',
          }}
        />
        <div 
          className="absolute bottom-[15%] left-[20%] w-[280px] h-[280px] rounded-full opacity-25 animate-energy-breathe"
          style={{
            background: 'radial-gradient(circle, rgb(139 92 246 / 0.4) 0%, rgb(139 92 246 / 0.1) 40%, transparent 70%)',
            filter: 'blur(45px)',
            animationDelay: '4s',
          }}
        />

        {/* Data grid overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mobile-grid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="1" fill="white" />
              <line x1="0" y1="25" x2="50" y2="25" stroke="white" strokeWidth="0.3" opacity="0.4" />
              <line x1="25" y1="0" x2="25" y2="50" stroke="white" strokeWidth="0.3" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mobile-grid)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col px-5 pt-14 pb-8 w-full max-w-full">
        {/* Logo Header - Extra top padding for Android status bar */}
        <div className="flex items-center gap-3 animate-fade-in-up">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
            <Sun className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-white tracking-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
              SolarDry IoT
            </h1>
            <p className="text-xs text-white/60">Smart Agriculture</p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col justify-center py-8">
          {/* Main Headline */}
          <h2 
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4 animate-fade-in-up"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)', animationDelay: '0.1s' }}
          >
            Precision Solar Drying
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400">
              Powered by IoT & AI
            </span>
          </h2>

          <p 
            className="text-base text-white/70 mb-10 leading-relaxed animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            Intelligent solar drying with real-time sensors, AI analytics, and automated control for optimal crop quality.
          </p>

          {/* Feature Cards - Glassmorphism with staggered animation */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            <FeatureCard icon={Radio} label="Sensors" color="emerald" delay="0.3s" />
            <FeatureCard icon={Brain} label="AI" color="cyan" delay="0.45s" />
            <FeatureCard icon={Settings2} label="Control" color="violet" delay="0.6s" />
          </div>
        </div>

        {/* CTA Section - State Aware with bottom padding for gesture nav */}
        <div className="pb-6 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          {isAuthLoading ? (
            <div className="flex items-center justify-center py-12">
              <SystemLoader />
            </div>
          ) : isAuthenticated ? (
            <SystemLoader onComplete={onNavigateToDashboard} />
          ) : (
            <>
              <Button
                onClick={onGetStarted}
                size="lg"
                className="w-full h-16 text-lg font-bold rounded-2xl shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, rgb(16 185 129) 0%, rgb(6 182 212) 50%, rgb(139 92 246) 100%)',
                  boxShadow: '0 0 40px rgba(16, 185, 129, 0.4), 0 0 80px rgba(6, 182, 212, 0.2)',
                }}
              >
                <span className="text-white">Get Started</span>
                <ArrowRight className="w-5 h-5 ml-2 text-white" />
              </Button>
              <p className="text-center text-sm text-white/40 mt-5 font-medium">
                Ready for Real-time Monitoring
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Desktop Intro Content
interface DesktopIntroContentProps {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  onNavigateToDashboard: () => void;
  onGetStarted: () => void;
}

const DesktopIntroContent: React.FC<DesktopIntroContentProps> = ({ 
  isAuthenticated, 
  isAuthLoading,
  onNavigateToDashboard,
  onGetStarted
}) => (
  <div className={`${isAuthenticated ? 'max-w-2xl text-center' : 'max-w-xl'} relative z-10`}>
    {/* Logo */}
    <div className={`flex items-center gap-4 mb-10 animate-fade-in-up ${isAuthenticated ? 'justify-center' : ''}`}>
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl">
        <Sun className="w-8 h-8 text-white" />
      </div>
      <div className={isAuthenticated ? 'text-left' : ''}>
        <h1 
          className="text-2xl font-bold text-white tracking-tight"
          style={{ textShadow: '0 2px 15px rgba(0,0,0,0.3)' }}
        >
          SolarDry IoT
        </h1>
        <p className="text-white/60 text-sm">Smart Agriculture</p>
      </div>
    </div>

    {/* Main Headline */}
    <h2 
      className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6 animate-fade-in-up"
      style={{ textShadow: '0 2px 25px rgba(0,0,0,0.4)', animationDelay: '0.1s' }}
    >
      Precision Solar Drying
      <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400">
        Powered by IoT & AI
      </span>
    </h2>

    <p 
      className={`text-lg text-white/70 mb-12 ${isAuthenticated ? 'max-w-lg mx-auto' : 'max-w-md'} leading-relaxed animate-fade-in-up`}
      style={{ animationDelay: '0.2s' }}
    >
      Intelligent solar drying with real-time sensors, AI analytics, and automated control for optimal crop quality.
    </p>

    {/* State-based content */}
    {isAuthLoading ? (
      <div className="flex items-center justify-center py-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <SystemLoader />
      </div>
    ) : isAuthenticated ? (
      <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <SystemLoader onComplete={onNavigateToDashboard} />
      </div>
    ) : (
      <>
        {/* Feature Cards */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <FeatureCard icon={Radio} label="IoT Sensors" color="emerald" delay="0.3s" />
          <FeatureCard icon={Brain} label="AI Analytics" color="cyan" delay="0.45s" />
          <FeatureCard icon={Settings2} label="Auto Control" color="violet" delay="0.6s" />
        </div>

        {/* Footer status */}
        <p 
          className="text-sm text-white/40 font-medium animate-fade-in-up"
          style={{ animationDelay: '0.7s' }}
        >
          Ready for Real-time Monitoring
        </p>
      </>
    )}
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
    <div className="min-h-[100dvh] flex flex-col bg-background animate-slide-up">
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

              <Button
                type="submit"
                className="w-full h-12 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-muted-foreground">or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full mt-4 h-12"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                Google
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signup">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Create Account</h2>
              <p className="text-sm text-muted-foreground">Start monitoring your drying system</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-foreground text-sm">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Your Name"
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
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm" className="text-foreground text-sm">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="signup-confirm"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-muted-foreground">or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full mt-4 h-12"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                Google
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
