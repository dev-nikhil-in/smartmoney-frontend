import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { loginApi, googleLoginApi } from "../../api/auth";
import { getProfileApi } from "../../api/user";
import useAuthStore from "../../store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useState } from "react";
import logo from "../../assets/logo.png";
import { showSuccess, showError } from "../../lib/toast";
import { GoogleLogin } from "@react-oauth/google";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Login() {
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const handleAuthSuccess = async (token) => {
    setToken(token);
    const profileRes = await getProfileApi();
    useAuthStore.getState().setUser(profileRes.data.data);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await loginApi(data);
      await handleAuthSuccess(res.data.data.token);
      showSuccess("Welcome back! 👋");
      navigate("/");
    } catch (err) {
      showError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSuccess = async (credentialResponse) => {
    try {
      setGoogleLoading(true);
      // credentialResponse.credential = ID token directly
      const res = await googleLoginApi(credentialResponse.credential);
      await handleAuthSuccess(res.data.data.token);
      showSuccess("Welcome! Signed in with Google 🎉");
      navigate("/");
    } catch (err) {
      showError(err.response?.data?.message || "Google sign in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-6">
      <img src={logo} alt="Nivtron SmartMoney" className="h-16 w-auto" />

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs text-slate-400 uppercase">
              <span className="bg-white px-2">or</span>
            </div>
          </div>

          {/* Google Login Button */}
          <div className={`w-full ${googleLoading ? "opacity-50 pointer-events-none" : ""}`}>
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={() => showError("Google sign in was cancelled or failed.")}
              width="432"
              text="signin_with"
              shape="rectangular"
              theme="outline"
              size="large"
            />
          </div>

          <p className="text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}