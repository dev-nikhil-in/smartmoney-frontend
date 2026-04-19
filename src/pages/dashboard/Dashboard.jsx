import { useEffect, useState } from "react";
import { getDashboardApi } from "../../api/dashboard";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <div className="space-y-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Total Outstanding
              </CardTitle>
              <Wallet className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-800">
                {formatCurrency(dashboard?.totalOutstanding ?? 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Monthly EMI
              </CardTitle>
              <CreditCard className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-800">
                {formatCurrency(dashboard?.monthlyEmi ?? 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Total Loans
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-800">
                {dashboard?.totalLoans ?? 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* High Interest Alert */}
        {dashboard?.highInterestAlert && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <CardTitle className="text-sm font-medium text-orange-700">
                High Interest Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 text-sm">
                <span className="font-semibold">
                  {dashboard.highInterestAlert.loanName}
                </span>{" "}
                has the highest interest rate of{" "}
                <span className="font-semibold text-orange-600">
                  {dashboard.highInterestAlert.interestRate}%
                </span>
                . Consider closing this first to save maximum interest.
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Outstanding:{" "}
                {formatCurrency(dashboard.highInterestAlert.outstandingAmount)}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loan Breakdown */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-slate-800">
              Loan Breakdown
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/loans")}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {dashboard?.loanBreakdown?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm">No loans added yet.</p>
                <Button
                  className="mt-3"
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
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                    onClick={() => navigate(`/loans/${loan.id}`)}
                  >
                    <div>
                      <p className="font-medium text-slate-800 text-sm">
                        {loan.loanName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {loan.interestRate}% interest · EMI{" "}
                        {formatCurrency(loan.emiAmount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-800 text-sm">
                        {formatCurrency(loan.outstandingAmount)}
                      </p>
                      <p className="text-xs text-slate-400">outstanding</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {error && (
          <p className="text-center text-sm text-red-500">{error}</p>
        )}

      </div>
    </AppLayout>
  );
}