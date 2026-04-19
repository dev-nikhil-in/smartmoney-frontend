import { useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showError } from "../../lib/toast";
import { CreditCard, TrendingUp, DollarSign } from "lucide-react";
import api from "../../lib/axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2">
        <p className="text-xs text-slate-500">{payload[0].name}</p>
        <p className="text-sm font-bold text-slate-800">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function Calculators() {
  const [activeTab, setActiveTab] = useState("emi");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [emiForm, setEmiForm] = useState({
    loanAmount: "",
    interestRate: "",
    tenureMonths: "",
  });
  const [sipForm, setSipForm] = useState({
    monthlyInvestment: "",
    annualReturnRate: "",
    tenureYears: "",
  });
  const [lumpsumForm, setLumpsumForm] = useState({
    investmentAmount: "",
    annualReturnRate: "",
    tenureYears: "",
  });

  const handleCalculate = async () => {
    try {
      setLoading(true);
      setResult(null);
      let res;
      if (activeTab === "emi") {
        res = await api.post("/calculators/emi", {
          loanAmount: Number(emiForm.loanAmount),
          interestRate: Number(emiForm.interestRate),
          tenureMonths: Number(emiForm.tenureMonths),
        });
      } else if (activeTab === "sip") {
        res = await api.post("/calculators/sip", {
          monthlyInvestment: Number(sipForm.monthlyInvestment),
          annualReturnRate: Number(sipForm.annualReturnRate),
          tenureYears: Number(sipForm.tenureYears),
        });
      } else {
        res = await api.post("/calculators/lumpsum", {
          investmentAmount: Number(lumpsumForm.investmentAmount),
          annualReturnRate: Number(lumpsumForm.annualReturnRate),
          tenureYears: Number(lumpsumForm.tenureYears),
        });
      }
      setResult(res.data.data);
    } catch {
      showError("Calculation failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: "emi", label: "EMI", icon: CreditCard },
    { key: "sip", label: "SIP", icon: TrendingUp },
    { key: "lumpsum", label: "Lumpsum", icon: DollarSign },
  ];

  // Chart data
  const getEmiChartData = () => [
    { name: "Principal", value: Number(emiForm.loanAmount), color: "#0f172a" },
    { name: "Total Interest", value: result?.totalInterest, color: "#ef4444" },
  ];

  const getSipBarData = () => {
    const years = Number(sipForm.tenureYears);
    const monthly = Number(sipForm.monthlyInvestment);
    const rate = Number(sipForm.annualReturnRate) / 1200;
    return Array.from({ length: years }, (_, i) => {
      const n = (i + 1) * 12;
      const invested = monthly * n;
      const fv = monthly * ((Math.pow(1 + rate, n) - 1) / rate) * (1 + rate);
      return {
        year: `Yr ${i + 1}`,
        Invested: Math.round(invested),
        "Future Value": Math.round(fv),
      };
    });
  };

  const getLumpsumBarData = () => {
    const years = Number(lumpsumForm.tenureYears);
    const amount = Number(lumpsumForm.investmentAmount);
    const rate = Number(lumpsumForm.annualReturnRate) / 100;
    return Array.from({ length: years }, (_, i) => ({
      year: `Yr ${i + 1}`,
      Invested: Math.round(amount),
      "Future Value": Math.round(amount * Math.pow(1 + rate, i + 1)),
    }));
  };

  return (
    <AppLayout title="Calculators" subtitle="Plan your finances with ease">
      <div className="max-w-3xl space-y-6">

        {/* Tabs */}
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setResult(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Form Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-800">
                {activeTab === "emi" && "EMI Calculator"}
                {activeTab === "sip" && "SIP Calculator"}
                {activeTab === "lumpsum" && "Lumpsum Calculator"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* EMI Form */}
              {activeTab === "emi" && (
                <>
                  <div className="space-y-1">
                    <Label>Loan Amount (₹)</Label>
                    <Input
                      type="number"
                      placeholder="1000000"
                      value={emiForm.loanAmount}
                      onChange={(e) => setEmiForm({ ...emiForm, loanAmount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Interest Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="8.5"
                      value={emiForm.interestRate}
                      onChange={(e) => setEmiForm({ ...emiForm, interestRate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Tenure (Months)</Label>
                    <Input
                      type="number"
                      placeholder="120"
                      value={emiForm.tenureMonths}
                      onChange={(e) => setEmiForm({ ...emiForm, tenureMonths: e.target.value })}
                    />
                  </div>
                </>
              )}

              {/* SIP Form */}
              {activeTab === "sip" && (
                <>
                  <div className="space-y-1">
                    <Label>Monthly Investment (₹)</Label>
                    <Input
                      type="number"
                      placeholder="5000"
                      value={sipForm.monthlyInvestment}
                      onChange={(e) => setSipForm({ ...sipForm, monthlyInvestment: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Annual Return Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="12"
                      value={sipForm.annualReturnRate}
                      onChange={(e) => setSipForm({ ...sipForm, annualReturnRate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Tenure (Years)</Label>
                    <Input
                      type="number"
                      placeholder="10"
                      value={sipForm.tenureYears}
                      onChange={(e) => setSipForm({ ...sipForm, tenureYears: e.target.value })}
                    />
                  </div>
                </>
              )}

              {/* Lumpsum Form */}
              {activeTab === "lumpsum" && (
                <>
                  <div className="space-y-1">
                    <Label>Investment Amount (₹)</Label>
                    <Input
                      type="number"
                      placeholder="100000"
                      value={lumpsumForm.investmentAmount}
                      onChange={(e) => setLumpsumForm({ ...lumpsumForm, investmentAmount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Annual Return Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="12"
                      value={lumpsumForm.annualReturnRate}
                      onChange={(e) => setLumpsumForm({ ...lumpsumForm, annualReturnRate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Tenure (Years)</Label>
                    <Input
                      type="number"
                      placeholder="10"
                      value={lumpsumForm.tenureYears}
                      onChange={(e) => setLumpsumForm({ ...lumpsumForm, tenureYears: e.target.value })}
                    />
                  </div>
                </>
              )}

              <Button onClick={handleCalculate} disabled={loading} className="w-full">
                {loading ? "Calculating..." : "Calculate"}
              </Button>

              {/* Result Summary */}
              {result && (
                <div className="mt-2 space-y-2">
                  {activeTab === "emi" && (
                    <>
                      <div className="flex justify-between p-3 rounded-lg bg-slate-900 text-white">
                        <span className="text-sm text-slate-300">Monthly EMI</span>
                        <span className="font-bold">{formatCurrency(result.emi)}</span>
                      </div>
                      <div className="flex justify-between p-3 rounded-lg bg-slate-50">
                        <span className="text-sm text-slate-500">Total Payment</span>
                        <span className="font-semibold text-slate-800">{formatCurrency(result.totalPayment)}</span>
                      </div>
                      <div className="flex justify-between p-3 rounded-lg bg-red-50">
                        <span className="text-sm text-red-500">Total Interest</span>
                        <span className="font-semibold text-red-600">{formatCurrency(result.totalInterest)}</span>
                      </div>
                    </>
                  )}
                  {(activeTab === "sip" || activeTab === "lumpsum") && (
                    <>
                      <div className="flex justify-between p-3 rounded-lg bg-slate-900 text-white">
                        <span className="text-sm text-slate-300">Future Value</span>
                        <span className="font-bold">{formatCurrency(result.futureValue)}</span>
                      </div>
                      <div className="flex justify-between p-3 rounded-lg bg-slate-50">
                        <span className="text-sm text-slate-500">Total Invested</span>
                        <span className="font-semibold text-slate-800">{formatCurrency(result.totalInvested)}</span>
                      </div>
                      <div className="flex justify-between p-3 rounded-lg bg-green-50">
                        <span className="text-sm text-green-500">Wealth Gained</span>
                        <span className="font-semibold text-green-600">{formatCurrency(result.wealthGained)}</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chart Card */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-800">
                  Visual Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>

                {/* EMI — Pie Chart */}
                {activeTab === "emi" && (
                  <div className="space-y-4">
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={getEmiChartData()}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {getEmiChartData().map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-slate-900" />
                        <span className="text-xs text-slate-500">Principal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        <span className="text-xs text-slate-500">Interest</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* SIP — Bar Chart */}
                {activeTab === "sip" && (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={getSipBarData()} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                      <Bar dataKey="Invested" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Future Value" fill="#0f172a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}

                {/* Lumpsum — Bar Chart */}
                {activeTab === "lumpsum" && (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={getLumpsumBarData()} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                      <Bar dataKey="Invested" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Future Value" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}

              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}