export type MortgageType = "" | "interest-only" | "repayment";

export interface MortgageInputs {
  amount: number | string;
  mortgageType: MortgageType;
  interestRate: number | string;
  termYears: number | string;
  termMonths: number | string;
}

export interface RemortgageCalculatorState {
  current: MortgageInputs;
  newMortgage: MortgageInputs & {
    arrangementFeeAdded: number | string;
    otherCosts: number | string;
  };
  compareYears: number | string;
  compareMonths: number | string;
}

export interface CalculationResults {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  totalRepayments: number;
}
