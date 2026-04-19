import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllLoansApi, deleteLoanApi } from "../../api/loans";
import { showSuccess, showError } from "../../lib/toast";
import {
  Plus,
  Pencil,
  Trash2,
  CreditCard,
  TrendingDown,
  Calendar,
} from "lucide-react";

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await getAllLoansApi();
      setLoans(res.data.data);
    } catch {
      showError("Failed to load loans");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (deletingId === id) {
      try {
        await deleteLoanApi(id);
        setLoans((prev) => prev.filter((l) => l.id !== id));
        showSuccess("Loan deleted successfully");
        setDeletingId(null);
      } catch {
        showError("Failed to delete loan");
        setDeletingId(null);
      }
    } else {
      setDeletingId(id);
      setTimeout(() => setDeletingId(null), 3000);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (loading) {
    return (
      <AppLayout title="My Loans" subtitle="Manage all your loans">
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-400">Loading loans...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="My Loans" subtitle="Manage all your loans">
      <div className="space-y-4">

        {/* Top bar */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {loans.length} {loans.length === 1 ? "loan" : "loans"} found
          </p>
          <Button size="sm" onClick={() => navigate("/loans/add")}>
            <Plus className="h-4 w-4 mr-1" />
            Add Loan
          </Button>
        </div>

        {/* Empty state */}
        {loans.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
              <CreditCard className="h-10 w-10 text-slate-300" />
              <p className="text-slate-500 font-medium">No loans added yet</p>
              <p className="text-slate-400 text-sm">
                Add your first loan to start tracking
              </p>
              <Button
                size="sm"
                className="mt-2"
                onClick={() => navigate("/loans/add")}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Loan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {loans.map((loan) => (
              <Card
                key={loan.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/loans/${loan.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">

                    {/* Left */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {loan.loanName}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <TrendingDown className="h-3 w-3" />
                            {loan.interestRate}% interest
                          </span>
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Calendar className="h-3 w-3" />
                            {loan.tenureMonths} months
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Outstanding</span>
                          <span>
                            {Math.round(
                              (1 - loan.outstandingAmount / loan.totalAmount) * 100
                            )}% paid
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-slate-900 rounded-full"
                            style={{
                              width: `${Math.round(
                                (1 - loan.outstandingAmount / loan.totalAmount) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Amounts */}
                      <div className="flex gap-6">
                        <div>
                          <p className="text-xs text-slate-400">Outstanding</p>
                          <p className="text-sm font-semibold text-slate-800">
                            {formatCurrency(loan.outstandingAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Total Amount</p>
                          <p className="text-sm font-semibold text-slate-800">
                            {formatCurrency(loan.totalAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Monthly EMI</p>
                          <p className="text-sm font-semibold text-slate-800">
                            {formatCurrency(loan.emiAmount)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right — Actions */}
                    <div
                      className="flex flex-col gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/loans/${loan.id}/edit`)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant={deletingId === loan.id ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => handleDelete(loan.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}