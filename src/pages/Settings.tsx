import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { Settings as SettingsIcon, User, LogOut, Sun, Moon, Bell, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
          <SettingsIcon className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
        </div>
      </div>

      {/* User profile section */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <User className="w-4 h-4" />
          User Profile
        </h2>

        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground text-lg">
              {user?.displayName || "User"}
            </h3>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg min-w-0">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">Email</p>
              <p className="text-sm text-muted-foreground truncate" title={user?.email || ''}>
                {user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg min-w-0">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">User ID</p>
              <p className="text-sm text-muted-foreground font-mono truncate" title={user?.uid || ''}>
                {user?.uid}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences section */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Sun className="w-4 h-4" />
          Preferences
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Switch to dark theme</p>
              </div>
            </div>
            <Switch 
              checked={theme === "dark"} 
              onCheckedChange={toggleTheme}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive alerts on your device</p>
              </div>
            </div>
            <Switch disabled />
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          * Notification preferences will be available in a future update
        </p>
      </div>

      {/* Firebase Connection section */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Database className="w-4 h-4" />
          Data Connection
        </h2>

        <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse-slow" />
            <span className="font-medium text-success">Connected to Firebase</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Real-time sensor data is being synchronized from Firebase Realtime Database
          </p>
        </div>
      </div>

      <Separator />

      {/* Logout section */}
      <div className="bg-card rounded-xl border border-destructive/30 p-6">
        <h2 className="font-semibold text-foreground mb-4">Account Actions</h2>
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>

      {/* Footer info */}
      <div className="text-center text-sm text-muted-foreground pb-6">
        <p>SolarDry IoT Monitoring System v1.0</p>
        <p className="mt-1">Agricultural Engineering IoT Project</p>
      </div>
    </div>
  );
};

export default SettingsPage;
