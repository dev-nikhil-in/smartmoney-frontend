import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AppLayout from "../../components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addLoanApi, getLoanByIdApi, updateLoanApi } from "../../api/loans";
import { showSuccess, showError } from "../../lib/toast";

const schema = z.object({
  loanName: z.string().min(1, "Loan name is required").max(100),
  totalAmount: z.coerce.number().positive("Must be greater than 0"),
  outstandingAmount: z.coerce.number().positive("Must be greater than 0"),
  interestRate: z.coerce.number().min(0).max(100, "Must be between 0-100"),
  emiAmount: z.coerce.number().positive("Must be greater than 0"),
  tenureMonths: z.coerce.number().int().positive("Must be greater than 0"),
  startDate: z.string().min(1, "Start date is required"),
});

export default function LoanForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isEdit) fetchLoan();
  }, [id]);

  const fetchLoan = async () => {
    try {
      setFetching(true);
      const res = await getLoanByIdApi(id);
      const loan = res.data.data;
      reset({
        loanName: loan.loanName,
        totalAmount: loan.totalAmount,
        outstandingAmount: loan.outstandingAmount,
        interestRate: loan.interestRate,
        emiAmount: loan.emiAmount,
        tenureMonths: loan.tenureMonths,
        startDate: loan.startDate,
      });
    } catch {
      showError("Failed to load loan details");
      navigate("/loans");
    } finally {
      setFetching(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (isEdit) {
        await updateLoanApi(id, data);
        showSuccess("Loan updated successfully!");
      } else {
        await addLoanApi(data);
        showSuccess("Loan added successfully!");
      }
      navigate("/loans");
    } catch (err) {
      showError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AppLayout
        title={isEdit ? "Edit Loan" : "Add Loan"}
        subtitle={isEdit ? "Update loan details" : "Add a new loan to track"}
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-400">Loading...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={isEdit ? "Edit Loan" : "Add Loan"}
      subtitle={isEdit ? "Update loan details" : "Add a new loan to track"}
    >
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-800">
              Loan Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Loan Name */}
              <div className="space-y-1">
                <Label htmlFor="loanName">Loan Name</Label>
                <Input
                  id="loanName"
                  placeholder="e.g. Home Loan - SBI"
                  {...register("loanName")}
                />
                {errors.loanName && (
                  <p className="text-sm text-red-500">{errors.loanName.message}</p>
                )}
              </div>

              {/* Total + Outstanding */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="totalAmount">Total Amount (₹)</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    placeholder="2000000"
                    {...register("totalAmount")}
                  />
                  {errors.totalAmount && (
                    <p className="text-sm text-red-500">{errors.totalAmount.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="outstandingAmount">Outstanding Amount (₹)</Label>
                  <Input
                    id="outstandingAmount"
                    type="number"
                    placeholder="1500000"
                    {...register("outstandingAmount")}
                  />
                  {errors.outstandingAmount && (
                    <p className="text-sm text-red-500">{errors.outstandingAmount.message}</p>
                  )}
                </div>
              </div>

              {/* Interest + EMI */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    placeholder="8.5"
                    {...register("interestRate")}
                  />
                  {errors.interestRate && (
                    <p className="text-sm text-red-500">{errors.interestRate.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="emiAmount">Monthly EMI (₹)</Label>
                  <Input
                    id="emiAmount"
                    type="number"
                    placeholder="18000"
                    {...register("emiAmount")}
                  />
                  {errors.emiAmount && (
                    <p className="text-sm text-red-500">{errors.emiAmount.message}</p>
                  )}
                </div>
              </div>

              {/* Tenure + Start Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="tenureMonths">Tenure (Months)</Label>
                  <Input
                    id="tenureMonths"
                    type="number"
                    placeholder="240"
                    {...register("tenureMonths")}
                  />
                  {errors.tenureMonths && (
                    <p className="text-sm text-red-500">{errors.tenureMonths.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...register("startDate")}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-500">{errors.startDate.message}</p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={loading}>
                  {loading
                    ? isEdit ? "Updating..." : "Adding..."
                    : isEdit ? "Update Loan" : "Add Loan"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/loans")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}