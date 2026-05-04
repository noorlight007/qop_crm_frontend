export interface SuitabilityData {
  lender_text: string;
  initial_interest_rate_text: string;
  initial_interest_rate_deal_period_text: string;
  mortgage_term_text: string;
  repayment_method_recommended_text: string;
  mortgage_amount_type: string | null;
  arrangement_fee_type: string | null;
  early_repayment_charges_reason: string | null;
  early_repayment_charges_meaning: string | null;
  portability_recommendation: string | null;
  portability_suggestion: string | null;
  early_repayment_charges_recommendation: string | null;
  portability_meaning: string | null;
  protection: string | null;
  protection_reason: string | null;
  portability_reason: string | null;
  home_insurance: string | null;
  residential_mortgages_type: string | null;
  additional_risk_warnings_text: string;
  debts_explanation: string;
  financial_goal: string;
  consolidation_proceed_reason: string;
  debt_cost_comparison: string | null;
  new_lender_not_recommended_reason: string | null;
  islamic_mortgages_purchase_plan: string | null;
  home_purchase_plan: string;
  why_was_this_recommended_to_you: string;
  what_does_this_mean: string;
  why_was_this_recommended: string;
  product_transfer_reason: string | null;
  product_transfer_recommended: string;
  arrangement_fee: number | null;
  pension_option: string | null;
  overpayment_type: string | null;
  repayment_status_type: string | null;
  max_erc: string | null;
  additional_recipients_text: string | null;
  outstanding_balance: string | null;
}

export interface RecommendationLetterProps {
  caseData: any;
  suitability: any;
  formValues: SuitabilityData;
  onFormChange: (updates: Partial<SuitabilityData>) => void;
}

export interface DebtConsolidationProps {
  caseData: any;
  suitability: any;
  formValues: SuitabilityData;
  onFormChange: (updates: Partial<SuitabilityData>) => void;
}

export interface DebtSummaryRowDraft {
  alias: string | null;
  estimated_cost_text: string;
  has_adding_the_debt_been_recommended: boolean | null;
  debt_summary_reason: string;
}

export interface CreditCommitment {
  type: string;
  company: string;
  os_balance: number | null;
  settlement_balance: number | null;
  monthly_repayment: number | null;
}