import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { registerApi, loginApi } from "../../api/auth";
import { getProfileApi } from "../../api/user";
import useAuthStore from "../../store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import logo from "../../assets/logo.png";
import { showSuccess, showError } from "../../lib/toast";
import { CheckCircle2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const features = [
  "Track all your loans in one place",
  "Get smart repayment recommendations",
  "Simulate EMI savings instantly",
  "Free forever — no hidden charges",
];

export default function Register() {
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await registerApi(data);
      const loginRes = await loginApi({ email: data.email, password: data.password });
      setToken(loginRes.data.data.token);
      const profileRes = await getProfileApi();
      useAuthStore.getState().setUser(profileRes.data.data);
      showSuccess("Welcome to SmartMoney! 🎉");
      navigate("/");
    } catch (err) {
      showError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left — Visual Panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex-col justify-between p-12 relative overflow-hidden">

        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 opacity-10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

        {/* Top */}
        <div className="relative z-10">
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">
            Nivtron SmartMoney
          </p>
        </div>

        {/* Center */}
        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white leading-tight">
              Start your journey to
              <br />
              <span className="text-green-400">financial freedom</span>
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              Join thousands of Indians who are saving money and closing loans faster.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                <p className="text-sm text-slate-300">{f}</p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 mt-4">
            <p className="text-slate-300 text-sm italic">
              "SmartMoney helped me close my car loan 14 months early. Saved over ₹80,000 in interest!"
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="h-8 w-8 rounded-full bg-green-400 flex items-center justify-center text-slate-900 font-bold text-xs">
                RK
              </div>
              <div>
                <p className="text-xs text-white font-medium">Rahul K.</p>
                <p className="text-xs text-slate-400">Bangalore</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-xs text-slate-500">
            © 2026 Nivtron SmartMoney · Track. Plan. Grow.
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 bg-white">
        <div className="max-w-md w-full mx-auto space-y-8">

          {/* Logo */}
          <img src={logo} alt="SmartMoney" className="h-[220px] w-auto" />

          {/* Heading */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Create account</h1>
            <p className="text-slate-500 mt-1">
              Start tracking and saving in minutes
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

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
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-slate-900 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}