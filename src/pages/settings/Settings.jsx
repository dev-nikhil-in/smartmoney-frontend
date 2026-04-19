import { useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { showSuccess } from "../../lib/toast";
import {
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  Trash2,
  ChevronRight,
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    emiReminders: true,
    highInterestAlerts: true,
  });

  const [theme, setTheme] = useState("light");
  const [currency, setCurrency] = useState("INR");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleToggle = (key) => {
    setNotifications((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      showSuccess("Notification preference updated");
      return updated;
    });
  };

  const handleTheme = (value) => {
    setTheme(value);
    showSuccess(`Theme set to ${value}`);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirm) {
      logout();
      navigate("/login");
    } else {
      setDeleteConfirm(true);
    }
  };

  return (
    <AppLayout title="Settings" subtitle="Manage your preferences">
      <div className="max-w-2xl space-y-6">

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-slate-500" />
              <CardTitle className="text-base font-semibold text-slate-800">
                Notifications
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                key: "emailAlerts",
                label: "Email Alerts",
                description: "Receive important updates via email",
              },
              {
                key: "emiReminders",
                label: "EMI Reminders",
                description: "Get notified before EMI due dates",
              },
              {
                key: "highInterestAlerts",
                label: "High Interest Alerts",
                description: "Alert when a loan has high interest rate",
              },
            ].map(({ key, label, description }) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{label}</p>
                  <p className="text-xs text-slate-400">{description}</p>
                </div>
                <button
                  onClick={() => handleToggle(key)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    notifications[key] ? "bg-slate-900" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      notifications[key] ? "translate-x-4" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-slate-500" />
              <CardTitle className="text-base font-semibold text-slate-800">
                Appearance
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleTheme("light")}
                className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-colors ${
                  theme === "light"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Sun className="h-4 w-4" />
                Light
              </button>
              <button
                onClick={() => handleTheme("dark")}
                className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-colors ${
                  theme === "dark"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Moon className="h-4 w-4" />
                Dark
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Currency & Region */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-slate-500" />
              <CardTitle className="text-base font-semibold text-slate-800">
                Currency & Region
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {["INR", "USD", "EUR"].map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCurrency(c);
                    showSuccess(`Currency set to ${c}`);
                  }}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    currency === c
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {c === "INR" ? "₹ INR" : c === "USD" ? "$ USD" : "€ EUR"}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-slate-500" />
              <CardTitle className="text-base font-semibold text-slate-800">
                Security
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <button
              onClick={() => navigate("/profile")}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="text-left">
                <p className="text-sm font-medium text-slate-800">
                  Change Password
                </p>
                <p className="text-xs text-slate-400">
                  Update your account password
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="text-left">
                <p className="text-sm font-medium text-slate-800">
                  Sign Out All Devices
                </p>
                <p className="text-xs text-slate-400">
                  Log out from all active sessions
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-100">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-red-500" />
              <CardTitle className="text-base font-semibold text-red-600">
                Danger Zone
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-3 rounded-lg bg-red-50 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Delete Account
                </p>
                <p className="text-xs text-slate-400">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteAccount}
              >
                {deleteConfirm ? "Confirm Delete" : "Delete"}
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}