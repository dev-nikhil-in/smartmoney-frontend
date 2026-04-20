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
import { useState } from "react";
import logo from "../../assets/logo.png";
import { showSuccess, showError } from "../../lib/toast";
import { GoogleLogin } from "@react-oauth/google";
import { TrendingUp, Shield, Zap } from "lucide-react";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Login() {
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

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
      const res = await googleLoginApi(credentialResponse.credential);
      await handleAuthSuccess(res.data.data.token);
      showSuccess("Welcome! Signed in with Google 🎉");
      navigate("/");
    } catch (err) {
      showError(err.response?.data?.message || "Google sign in failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left — Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 bg-white">
        <div className="max-w-md w-full mx-auto space-y-8">

           {/* Logo — bigger this time */}
              <img src={logo} alt="Nivtron SmartMoney" className="h-[220px] w-auto" />

          {/* Heading */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
            <p className="text-slate-500 mt-1">
              Sign in to manage your loans & finances
            </p>
          </div>

          {/* Form FIRST */}
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

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs text-slate-400 uppercase">
              <span className="bg-white px-2">or continue with Google</span>
            </div>
          </div>

          {/* Google Button BELOW */}
          <div className={googleLoading ? "opacity-50 pointer-events-none" : ""}>
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={() => showError("Google sign in failed.")}
              width="100%"
              text="signin_with"
              shape="rectangular"
              theme="outline"
              size="large"
            />
          </div>

          <p className="text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-slate-900 hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>

      {/* Right — Visual Panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex-col justify-between p-12 relative overflow-hidden">

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        {/* Top — Big Logo instead of text */}
        <div className="relative z-10">
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">
            Nivtron SmartMoney
          </p>
        </div>

        {/* Center — Stats Cards */}
        <div className="relative z-10 space-y-4">
          <h2 className="text-3xl font-bold text-white leading-tight">
            Make smarter<br />
            <span className="text-green-400">financial decisions</span><br />
            every day.
          </h2>

          <p className="text-slate-400 text-sm mt-3">
            Track loans, simulate EMIs, and get personalized repayment strategies.
          </p>

          {/* Fake Stats */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-xs text-slate-400">Interest Saved</p>
              <p className="text-2xl font-bold text-green-400 mt-1">₹2.4L</p>
              <p className="text-xs text-slate-500 mt-1">avg per user</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-xs text-slate-400">Loans Tracked</p>
              <p className="text-2xl font-bold text-white mt-1">12K+</p>
              <p className="text-xs text-slate-500 mt-1">across India</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-xs text-slate-400">Time Saved</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">8 mo</p>
              <p className="text-xs text-slate-500 mt-1">avg loan closure</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-xs text-slate-400">Happy Users</p>
              <p className="text-2xl font-bold text-white mt-1">5K+</p>
              <p className="text-xs text-slate-500 mt-1">and growing</p>
            </div>
          </div>
        </div>

        {/* Bottom — Features */}
        <div className="relative z-10 space-y-3">
          {[
            { icon: TrendingUp, text: "Smart repayment strategies (Avalanche & Snowball)" },
            { icon: Zap, text: "EMI simulator — see your savings instantly" },
            { icon: Shield, text: "Secure & private — your data stays yours" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-green-400" />
              </div>
              <p className="text-sm text-slate-300">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}