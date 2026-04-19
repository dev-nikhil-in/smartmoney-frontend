import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AppLayout from "../../components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getProfileApi, changePasswordApi } from "../../api/user";
import { showSuccess, showError } from "../../lib/toast";
import { User, Mail, Shield, Calendar, KeyRound } from "lucide-react";
import useAuthStore from "../../store/authStore";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(passwordSchema) });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfileApi();
      setProfile(res.data.data);
      setUser(res.data.data);
    } catch {
      showError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = async (data) => {
    try {
      setPasswordLoading(true);
      await changePasswordApi({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      showSuccess("Password changed successfully!");
      reset();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getInitials = () => {
    if (profile?.name) {
      return profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "U";
  };

  if (loading) {
    return (
      <AppLayout title="Profile" subtitle="Manage your account">
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-400">Loading...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Profile" subtitle="Manage your account">
      <div className="max-w-2xl space-y-6">

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-800">
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Avatar + Name */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-slate-900 text-white text-xl font-bold flex items-center justify-center">
                {getInitials()}
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-800">
                  {profile?.name}
                </p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                  {profile?.role}
                </span>
              </div>
            </div>

            {/* Info Fields */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <User className="h-4 w-4 text-slate-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Full Name</p>
                  <p className="text-sm font-medium text-slate-800">
                    {profile?.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Email Address</p>
                  <p className="text-sm font-medium text-slate-800">
                    {profile?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <Shield className="h-4 w-4 text-slate-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Role</p>
                  <p className="text-sm font-medium text-slate-800">
                    {profile?.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Member Since</p>
                  <p className="text-sm font-medium text-slate-800">
                    {formatDate(profile?.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-slate-500" />
              <CardTitle className="text-base font-semibold text-slate-800">
                Change Password
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register("currentPassword")}
                />
                {errors.currentPassword && (
                  <p className="text-sm text-red-500">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register("newPassword")}
                />
                {errors.newPassword && (
                  <p className="text-sm text-red-500">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={passwordLoading}>
                {passwordLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}