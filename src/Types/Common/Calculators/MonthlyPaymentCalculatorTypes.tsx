export interface CalculatorState {
  mortgageAmount: number | string;
  arrangementFee: number | string;
  mortgageType: "" | "interest-only" | "repayment";
  interestRate: number | string;
  years: number | string;
  months: number | string;
}

export interface CalculationResults {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  totalRepayments: number;
}