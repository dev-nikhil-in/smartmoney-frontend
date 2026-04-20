import { useEffect, useState } from "react";
import { getDashboardApi } from "../../api/dashboard";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  TrendingDown,
  Wallet,
  CreditCard,
  AlertTriangle,
  Plus,
} from "lucide-react";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await getDashboardApi();
      setDashboard(res.data.data);
    } catch {
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  if (loading) {
    return (
      <AppLayout title="Dashboard" subtitle="Your financial summary at a glance">
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-400">Loading...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Dashboard" subtitle="Your financial summary at a glance">

      {/* Dark full-fill container — same theme as login right panel */}
      <div
        className="rounded-2xl p-6 lg:p-8 relative overflow-hidden"
        style={{
          minHeight: "calc(100vh - 100px)",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        }}
      >
        {/* BG glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 space-y-6">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-5 hover:bg-white/[0.13] transition-colors">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-slate-400">Total Outstanding</p>
                <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Wallet className="h-4 w-4 text-green-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(dashboard?.totalOutstanding ?? 0)}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-5 hover:bg-white/[0.13] transition-colors">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-slate-400">Monthly EMI</p>
                <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-blue-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(dashboard?.monthlyEmi ?? 0)}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-5 hover:bg-white/[0.13] transition-colors">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-slate-400">Total Loans</p>
                <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <TrendingDown className="h-4 w-4 text-slate-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">
                {dashboard?.totalLoans ?? 0}
              </p>
            </div>
          </div>

          {/* High Interest Alert */}
          {dashboard?.highInterestAlert && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-orange-400" />
                </div>
                <p className="text-sm font-medium text-orange-400">High Interest Alert</p>
              </div>
              <p className="text-slate-300 text-sm">
                <span className="font-semibold text-white">
                  {dashboard.highInterestAlert.loanName}
                </span>{" "}
                has the highest interest rate of{" "}
                <span className="font-semibold text-orange-400">
                  {dashboard.highInterestAlert.interestRate}%
                </span>
                . Consider closing this first to save maximum interest.
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Outstanding:{" "}
                {formatCurrency(dashboard.highInterestAlert.outstandingAmount)}
              </p>
            </div>
          )}

          {/* Loan Breakdown */}
          <div className="bg-white/[0.07] backdrop-blur border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-white">Loan Breakdown</h2>
                <p className="text-xs text-slate-400 mt-0.5">All your active loans at a glance</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/loans")}
                className="border-white/20 text-slate-300 hover:bg-white/10 hover:text-white bg-transparent"
              >
                View All
              </Button>
            </div>

            {dashboard?.loanBreakdown?.length === 0 ? (
              <div className="text-center py-12">
                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-slate-400 text-sm">No loans added yet.</p>
                <Button
                  className="mt-4 bg-white text-slate-900 hover:bg-slate-100"
                  size="sm"
                  onClick={() => navigate("/loans/add")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add your first loan
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboard?.loanBreakdown?.map((loan) => (
                  <div
                    key={loan.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/[0.15] cursor-pointer transition-colors border border-white/5"
                    onClick={() => navigate(`/loans/${loan.id}`)}
                  >
                    <div>
                      <p className="font-medium text-white text-sm">
                        {loan.loanName}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {loan.interestRate}% interest · EMI{" "}
                        {formatCurrency(loan.emiAmount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-400 text-sm">
                        {formatCurrency(loan.outstandingAmount)}
                      </p>
                      <p className="text-xs text-slate-500">outstanding</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="text-center text-sm text-red-400">{error}</p>
          )}

        </div>
      </div>
    </AppLayout>
  );
}