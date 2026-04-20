import { useState, useRef } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { CreditCard, TrendingUp, DollarSign } from "lucide-react";
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

const formatLabel = (amount) => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg px-3 py-2">
        <p className="text-xs text-slate-400">{payload[0].name}</p>
        <p className="text-sm font-bold text-white">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

// Slider + editable input combined
const SliderInput = ({ label, value, min, max, step, onChange, display, rawValue }) => {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef(null);
  const pct = ((value - min) / (max - min)) * 100;

  const startEdit = () => {
    setEditing(true);
    setInputVal(rawValue !== undefined ? rawValue : value);
    setTimeout(() => {
      inputRef.current?.select();
    }, 10);
  };

  const commitEdit = () => {
    setEditing(false);
    const parsed = parseFloat(inputVal);
    if (!isNaN(parsed)) {
      const clamped = Math.min(max, Math.max(min, parsed));
      onChange(clamped);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") setEditing(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm text-slate-400">{label}</label>

        {editing ? (
          <input
            ref={inputRef}
            type="number"
            value={inputVal}
            min={min}
            max={max}
            step={step}
            onChange={(e) => setInputVal(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            className="text-sm font-medium text-green-400 bg-white/10 border border-green-400/50 px-3 py-0.5 rounded-md min-w-[90px] text-center outline-none focus:border-green-400 focus:bg-white/15 transition-all"
            style={{ appearance: "textfield" }}
          />
        ) : (
          <button
            onClick={startEdit}
            title="Click to edit"
            className="text-sm font-medium text-green-400 bg-white/10 px-3 py-0.5 rounded-md min-w-[90px] text-center hover:bg-white/20 hover:border hover:border-green-400/40 transition-all cursor-text border border-transparent"
          >
            {display(value)}
          </button>
        )}
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #4ade80 0%, #4ade80 ${pct}%, rgba(255,255,255,0.15) ${pct}%, rgba(255,255,255,0.15) 100%)`,
          accentColor: "#4ade80",
        }}
      />

      <div className="flex justify-between text-[11px] text-slate-500">
        <span>{display(min)}</span>
        <span>{display(max)}</span>
      </div>
    </div>
  );
};

const calcEmi = (loanAmount, interestRate, tenureMonths) => {
  const rate = interestRate / 1200;
  const emi =
    (loanAmount * rate * Math.pow(1 + rate, tenureMonths)) /
    (Math.pow(1 + rate, tenureMonths) - 1);
  const totalPayment = emi * tenureMonths;
  return {
    emi: Math.round(emi),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalPayment - loanAmount),
  };
};

const calcSip = (monthlyInvestment, annualReturnRate, tenureYears) => {
  const rate = annualReturnRate / 1200;
  const n = tenureYears * 12;
  const futureValue =
    monthlyInvestment * ((Math.pow(1 + rate, n) - 1) / rate) * (1 + rate);
  const totalInvested = monthlyInvestment * n;
  return {
    futureValue: Math.round(futureValue),
    totalInvested: Math.round(totalInvested),
    wealthGained: Math.round(futureValue - totalInvested),
  };
};

const calcLumpsum = (investmentAmount, annualReturnRate, tenureYears) => {
  const futureValue =
    investmentAmount * Math.pow(1 + annualReturnRate / 100, tenureYears);
  return {
    futureValue: Math.round(futureValue),
    totalInvested: Math.round(investmentAmount),
    wealthGained: Math.round(futureValue - investmentAmount),
  };
};

export default function Calculators() {
  const [activeTab, setActiveTab] = useState("sip");

  const [emi, setEmi] = useState({ loanAmount: 1000000, interestRate: 8.5, tenureMonths: 120 });
  const [sip, setSip] = useState({ monthlyInvestment: 25000, annualReturnRate: 12, tenureYears: 10 });
  const [lumpsum, setLumpsum] = useState({ investmentAmount: 100000, annualReturnRate: 12, tenureYears: 10 });

  const emiResult = calcEmi(emi.loanAmount, emi.interestRate, emi.tenureMonths);
  const sipResult = calcSip(sip.monthlyInvestment, sip.annualReturnRate, sip.tenureYears);
  const lumpsumResult = calcLumpsum(lumpsum.investmentAmount, lumpsum.annualReturnRate, lumpsum.tenureYears);

  const tabs = [
    { key: "sip", label: "SIP", icon: TrendingUp },
    { key: "lumpsum", label: "Lumpsum", icon: DollarSign },
    { key: "emi", label: "EMI", icon: CreditCard },
  ];

  const activeResult =
    activeTab === "emi" ? emiResult : activeTab === "sip" ? sipResult : lumpsumResult;

  const getEmiPieData = () => [
    { name: "Principal", value: emi.loanAmount, color: "rgba(255,255,255,0.2)" },
    { name: "Total Interest", value: emiResult.totalInterest, color: "#f87171" },
  ];
  const getSipPieData = () => [
    { name: "Invested", value: sipResult.totalInvested, color: "rgba(255,255,255,0.2)" },
    { name: "Est. Returns", value: sipResult.wealthGained, color: "#4ade80" },
  ];
  const getLumpsumPieData = () => [
    { name: "Invested", value: lumpsumResult.totalInvested, color: "rgba(255,255,255,0.2)" },
    { name: "Est. Returns", value: lumpsumResult.wealthGained, color: "#60a5fa" },
  ];

  const activePieData =
    activeTab === "emi" ? getEmiPieData() : activeTab === "sip" ? getSipPieData() : getLumpsumPieData();

  const centerLabel =
    activeTab === "emi"
      ? { top: formatLabel(emiResult.emi), sub: "monthly EMI" }
      : { top: formatLabel(activeResult.futureValue), sub: "total value" };

  const returnColor =
    activeTab === "emi" ? "#f87171" : activeTab === "sip" ? "#4ade80" : "#60a5fa";
  const returnLabel = activeTab === "emi" ? "Interest" : "Est. Returns";

  const getSipBarData = () => {
    const { monthlyInvestment, annualReturnRate, tenureYears } = sip;
    const rate = annualReturnRate / 1200;
    return Array.from({ length: tenureYears }, (_, i) => {
      const n = (i + 1) * 12;
      const invested = monthlyInvestment * n;
      const fv = monthlyInvestment * ((Math.pow(1 + rate, n) - 1) / rate) * (1 + rate);
      return { year: `Yr ${i + 1}`, Invested: Math.round(invested), "Future Value": Math.round(fv) };
    });
  };

  const getLumpsumBarData = () => {
    const { investmentAmount, annualReturnRate, tenureYears } = lumpsum;
    const rate = annualReturnRate / 100;
    return Array.from({ length: tenureYears }, (_, i) => ({
      year: `Yr ${i + 1}`,
      Invested: Math.round(investmentAmount),
      "Future Value": Math.round(investmentAmount * Math.pow(1 + rate, i + 1)),
    }));
  };

  return (
    <AppLayout title="Calculators" subtitle="Plan your finances with ease">
      <div
        className="rounded-2xl p-6 lg:p-8 relative overflow-hidden"
        style={{
          minHeight: "calc(100vh - 100px)",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6 h-full">

          {/* Tabs */}
          <div className="flex gap-1 bg-white/10 p-1 rounded-xl w-fit">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === key
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Sliders Panel */}
            <div className="bg-white/[0.07] backdrop-blur border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {activeTab === "emi" && "EMI Calculator"}
                  {activeTab === "sip" && "SIP Calculator"}
                  {activeTab === "lumpsum" && "Lumpsum Calculator"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Drag sliders or click value to type</p>
              </div>

              <div className="flex flex-col gap-5 flex-1">
                {activeTab === "emi" && (
                  <>
                    <SliderInput label="Loan Amount" value={emi.loanAmount} min={50000} max={10000000} step={50000}
                      onChange={(v) => setEmi({ ...emi, loanAmount: v })}
                      display={formatLabel} rawValue={emi.loanAmount} />
                    <SliderInput label="Interest Rate (% p.a)" value={emi.interestRate} min={1} max={25} step={0.1}
                      onChange={(v) => setEmi({ ...emi, interestRate: v })}
                      display={(v) => `${Number(v).toFixed(1)}%`} rawValue={emi.interestRate} />
                    <SliderInput label="Tenure (Months)" value={emi.tenureMonths} min={6} max={360} step={6}
                      onChange={(v) => setEmi({ ...emi, tenureMonths: v })}
                      display={(v) => `${v} Mo`} rawValue={emi.tenureMonths} />
                  </>
                )}
                {activeTab === "sip" && (
                  <>
                    <SliderInput label="Monthly Investment" value={sip.monthlyInvestment} min={500} max={200000} step={500}
                      onChange={(v) => setSip({ ...sip, monthlyInvestment: v })}
                      display={formatLabel} rawValue={sip.monthlyInvestment} />
                    <SliderInput label="Expected Return Rate (% p.a)" value={sip.annualReturnRate} min={1} max={30} step={0.5}
                      onChange={(v) => setSip({ ...sip, annualReturnRate: v })}
                      display={(v) => `${Number(v).toFixed(1)}%`} rawValue={sip.annualReturnRate} />
                    <SliderInput label="Time Period (Years)" value={sip.tenureYears} min={1} max={40} step={1}
                      onChange={(v) => setSip({ ...sip, tenureYears: v })}
                      display={(v) => `${v} Yr`} rawValue={sip.tenureYears} />
                  </>
                )}
                {activeTab === "lumpsum" && (
                  <>
                    <SliderInput label="Investment Amount" value={lumpsum.investmentAmount} min={1000} max={10000000} step={1000}
                      onChange={(v) => setLumpsum({ ...lumpsum, investmentAmount: v })}
                      display={formatLabel} rawValue={lumpsum.investmentAmount} />
                    <SliderInput label="Expected Return Rate (% p.a)" value={lumpsum.annualReturnRate} min={1} max={30} step={0.5}
                      onChange={(v) => setLumpsum({ ...lumpsum, annualReturnRate: v })}
                      display={(v) => `${Number(v).toFixed(1)}%`} rawValue={lumpsum.annualReturnRate} />
                    <SliderInput label="Time Period (Years)" value={lumpsum.tenureYears} min={1} max={40} step={1}
                      onChange={(v) => setLumpsum({ ...lumpsum, tenureYears: v })}
                      display={(v) => `${v} Yr`} rawValue={lumpsum.tenureYears} />
                  </>
                )}
              </div>

              {/* Result summary */}
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/10">
                {activeTab === "emi" ? (
                  <>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                      <p className="text-[11px] text-slate-400 mb-1">Monthly EMI</p>
                      <p className="text-sm font-bold text-green-400">{formatLabel(emiResult.emi)}</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                      <p className="text-[11px] text-slate-400 mb-1">Total Pay</p>
                      <p className="text-sm font-bold text-white">{formatLabel(emiResult.totalPayment)}</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                      <p className="text-[11px] text-slate-400 mb-1">Interest</p>
                      <p className="text-sm font-bold text-red-400">{formatLabel(emiResult.totalInterest)}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                      <p className="text-[11px] text-slate-400 mb-1">Future Value</p>
                      <p className="text-sm font-bold text-green-400">{formatLabel(activeResult.futureValue)}</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                      <p className="text-[11px] text-slate-400 mb-1">Invested</p>
                      <p className="text-sm font-bold text-white">{formatLabel(activeResult.totalInvested)}</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                      <p className="text-[11px] text-slate-400 mb-1">Gains</p>
                      <p className="text-sm font-bold text-blue-400">{formatLabel(activeResult.wealthGained)}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Charts Panel */}
            <div className="bg-white/[0.07] backdrop-blur border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Visual Breakdown</h2>
                <p className="text-xs text-slate-400 mt-0.5">See where your money goes</p>
              </div>

              <div className="relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={activePieData} cx="50%" cy="50%" innerRadius={65} outerRadius={90}
                      paddingAngle={2} dataKey="value" strokeWidth={0}>
                      {activePieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center pointer-events-none">
                  <p className="text-xl font-bold text-white">{centerLabel.top}</p>
                  <p className="text-xs text-slate-400">{centerLabel.sub}</p>
                </div>
              </div>

              <div className="flex justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-white/30" />
                  <span className="text-xs text-slate-400">{activeTab === "emi" ? "Principal" : "Invested"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: returnColor }} />
                  <span className="text-xs text-slate-400">{returnLabel}</span>
                </div>
              </div>

              {activeTab === "sip" && (
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={getSipBarData()} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false}
                        tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: "11px", color: "#64748b" }} />
                      <Bar dataKey="Invested" fill="rgba(255,255,255,0.15)" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="Future Value" fill="#4ade80" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {activeTab === "lumpsum" && (
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={getLumpsumBarData()} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false}
                        tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: "11px", color: "#64748b" }} />
                      <Bar dataKey="Invested" fill="rgba(255,255,255,0.15)" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="Future Value" fill="#60a5fa" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {activeTab === "emi" && (
                <div className="flex flex-col gap-4 flex-1 justify-center">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400">Principal Amount</span>
                      <span className="text-white font-medium">{formatLabel(emi.loanAmount)}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white/40 rounded-full transition-all duration-300"
                        style={{ width: `${(emi.loanAmount / emiResult.totalPayment) * 100}%` }} />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {((emi.loanAmount / emiResult.totalPayment) * 100).toFixed(1)}% of total payment
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400">Total Interest</span>
                      <span className="text-red-400 font-medium">{formatLabel(emiResult.totalInterest)}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-red-400 rounded-full transition-all duration-300"
                        style={{ width: `${(emiResult.totalInterest / emiResult.totalPayment) * 100}%` }} />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {((emiResult.totalInterest / emiResult.totalPayment) * 100).toFixed(1)}% of total payment
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Total Amount Payable</span>
                      <span className="text-lg font-bold text-white">{formatLabel(emiResult.totalPayment)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}