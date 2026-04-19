import { useState, useEffect } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showError } from "../../lib/toast";
import { getAllLoansApi, simulateLoanApi } from "../../api/loans";
import { Zap, Clock, PiggyBank, CalendarCheck } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function Simulator() {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState("");
  const [extraPayment, setExtraPayment] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await getAllLoansApi();
      setLoans(res.data.data);
    } catch {
      showError("Failed to load loans");
    }
  };

  const handleSimulate = async () => {
    if (!selectedLoan) { showError("Please select a loan"); return; }
    if (!extraPayment || Number(extraPayment) <= 0) { showError("Please enter a valid extra payment amount"); return; }
    try {
      setLoading(true);
      const res = await simulateLoanApi(selectedLoan, {
        extraMonthlyPayment: Number(extraPayment),
      });
      setResult(res.data.data);
    } catch {
      showError("Simulation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Generate area chart data — monthly outstanding comparison
  const getChartData = () => {
    if (!result || !selectedLoan) return [];
    const loan = loans.find((l) => String(l.id) === String(selectedLoan));
    if (!loan) return [];

    const r = loan.interestRate / 1200;
    const emi = loan.emiAmount;
    const extraEmi = emi + Number(extraPayment);
    let bal1 = loan.outstandingAmount;
    let bal2 = loan.outstandingAmount;
    const data = [];

    for (let i = 1; i <= result.monthsSaved + (result.monthsSaved > 0 ? 0 : 1) + 12; i++) {
      if (bal1 > 0) bal1 = Math.max(0, bal1 * (1 + r) - emi);
      if (bal2 > 0) bal2 = Math.max(0, bal2 * (1 + r) - extraEmi);
      if (bal1 <= 0 && bal2 <= 0) break;
      if (i % 3 === 0) {
        data.push({
          month: `M${i}`,
          "Normal EMI": Math.round(bal1),
          "With Extra Payment": Math.round(bal2),
        });
      }
    }
    return data;
  };

  return (
    <AppLayout
      title="EMI Simulator"
      subtitle="See how extra payments can save you time and money"
    >
      <div className="max-w-3xl space-y-6">

        {/* Input Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <Zap className="h-4 w-4 text-slate-500" />
              Simulate Extra Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Select Loan</Label>
              <select
                value={selectedLoan}
                onChange={(e) => { setSelectedLoan(e.target.value); setResult(null); }}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <option value="">Choose a loan...</option>
                {loans.map((loan) => (
                  <option key={loan.id} value={loan.id}>
                    {loan.loanName} — {formatCurrency(loan.outstandingAmount)} outstanding
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="extraPayment">Extra Monthly Payment (₹)</Label>
              <Input
                id="extraPayment"
                type="number"
                placeholder="e.g. 5000"
                value={extraPayment}
                onChange={(e) => { setExtraPayment(e.target.value); setResult(null); }}
              />
            </div>

            <Button onClick={handleSimulate} disabled={loading} className="w-full">
              {loading ? "Simulating..." : "Simulate"}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-4">

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card className="bg-green-50 border-green-100">
                <CardContent className="p-4">
                  <div className="flex items-center gap-1 mb-1">
                    <PiggyBank className="h-3.5 w-3.5 text-green-600" />
                    <p className="text-xs text-green-600 font-medium">Interest Saved</p>
                  </div>
                  <p className="text-lg font-bold text-green-700">
                    {formatCurrency(result.interestSaved)}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-100">
                <CardContent className="p-4">
                  <div className="flex items-center gap-1 mb-1">
                    <Clock className="h-3.5 w-3.5 text-blue-600" />
                    <p className="text-xs text-blue-600 font-medium">Months Saved</p>
                  </div>
                  <p className="text-lg font-bold text-blue-700">
                    {result.monthsSaved} months
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-50 border-slate-100">
                <CardContent className="p-4">
                  <div className="flex items-center gap-1 mb-1">
                    <CalendarCheck className="h-3.5 w-3.5 text-slate-500" />
                    <p className="text-xs text-slate-500 font-medium">Original Closure</p>
                  </div>
                  <p className="text-sm font-bold text-slate-700">
                    {formatDate(result.originalClosureDate)}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-900">
                <CardContent className="p-4">
                  <div className="flex items-center gap-1 mb-1">
                    <CalendarCheck className="h-3.5 w-3.5 text-slate-300" />
                    <p className="text-xs text-slate-300 font-medium">New Closure</p>
                  </div>
                  <p className="text-sm font-bold text-white">
                    {formatDate(result.newClosureDate)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* New EMI */}
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">New Monthly Payment</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {formatCurrency(result.newMonthlyPayment)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Extra per month</p>
                  <p className="text-lg font-semibold text-orange-500">
                    +{formatCurrency(Number(extraPayment))}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Area Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-slate-800">
                  Outstanding Balance Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart
                    data={getChartData()}
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorExtra" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                    />
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Area
                      type="monotone"
                      dataKey="Normal EMI"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      fill="url(#colorNormal)"
                    />
                    <Area
                      type="monotone"
                      dataKey="With Extra Payment"
                      stroke="#22c55e"
                      strokeWidth={2}
                      fill="url(#colorExtra)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

          </div>
        )}
      </div>
    </AppLayout>
  );
}