import { useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { showError } from "../../lib/toast";
import { TrendingDown, Zap, Trophy, Clock, PiggyBank } from "lucide-react";
import api from "../../lib/axios";

export default function Strategy() {
  const [strategy, setStrategy] = useState(null);
  const [activeStrategy, setActiveStrategy] = useState(null);
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const fetchStrategy = async (type) => {
    try {
      setLoading(true);
      setActiveStrategy(type);
      const res = await api.get(`/loans/strategy/${type}`);
      setStrategy(res.data.data);
    } catch {
      showError("Failed to load strategy. Add some loans first!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      title="Repayment Strategy"
      subtitle="Find the best way to close your loans"
    >
      <div className="max-w-3xl space-y-6">

        {/* Strategy Selector */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => fetchStrategy("avalanche")}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              activeStrategy === "avalanche"
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white hover:border-slate-400"
            }`}
          >
            <TrendingDown
              className={`h-5 w-5 mb-2 ${
                activeStrategy === "avalanche" ? "text-white" : "text-slate-500"
              }`}
            />
            <p className="font-semibold text-sm">Avalanche Method</p>
            <p
              className={`text-xs mt-1 ${
                activeStrategy === "avalanche"
                  ? "text-slate-300"
                  : "text-slate-400"
              }`}
            >
              Pay highest interest first — saves maximum money
            </p>
          </button>

          <button
            onClick={() => fetchStrategy("snowball")}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              activeStrategy === "snowball"
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white hover:border-slate-400"
            }`}
          >
            <Zap
              className={`h-5 w-5 mb-2 ${
                activeStrategy === "snowball" ? "text-white" : "text-slate-500"
              }`}
            />
            <p className="font-semibold text-sm">Snowball Method</p>
            <p
              className={`text-xs mt-1 ${
                activeStrategy === "snowball"
                  ? "text-slate-300"
                  : "text-slate-400"
              }`}
            >
              Pay smallest loan first — builds momentum & motivation
            </p>
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center h-40">
            <p className="text-slate-400">Calculating strategy...</p>
          </div>
        )}

        {/* Results */}
        {!loading && strategy && (
          <div className="space-y-4">

            {/* Summary */}
            <Card className="border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 font-medium">
                  {strategy.recommendation}
                </p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 rounded-lg bg-green-50">
                    <div className="flex items-center gap-1 mb-1">
                      <PiggyBank className="h-3.5 w-3.5 text-green-600" />
                      <p className="text-xs text-green-600 font-medium">
                        Interest Saved
                      </p>
                    </div>
                    <p className="text-lg font-bold text-green-700">
                      {formatCurrency(strategy.interestSaved)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="h-3.5 w-3.5 text-blue-600" />
                      <p className="text-xs text-blue-600 font-medium">
                        Months Earlier
                      </p>
                    </div>
                    <p className="text-lg font-bold text-blue-700">
                      {strategy.monthsEarlier} months
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prioritized Loans */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-slate-800">
                  Payment Priority Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {strategy.prioritizedLoans?.map((loan) => (
                  <div
                    key={loan.loanId}
                    className="flex items-start gap-4 p-3 rounded-lg bg-slate-50"
                  >
                    {/* Priority Badge */}
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        loan.priority === 1
                          ? "bg-slate-900 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {loan.priority}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-800">
                          {loan.loanName}
                        </p>
                        <p className="text-sm font-semibold text-slate-800">
                          {formatCurrency(loan.outstandingAmount)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-xs text-slate-400">{loan.reason}</p>
                        <p className="text-xs text-slate-400">
                          {loan.interestRate}% · EMI{" "}
                          {formatCurrency(loan.emiAmount)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty state */}
        {!loading && !strategy && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
              <TrendingDown className="h-10 w-10 text-slate-300" />
              <p className="text-slate-500 font-medium">
                Select a strategy to get started
              </p>
              <p className="text-slate-400 text-sm text-center">
                Choose Avalanche or Snowball method above to see your personalized repayment plan
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}