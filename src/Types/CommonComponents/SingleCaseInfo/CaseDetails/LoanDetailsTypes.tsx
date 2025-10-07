export interface LoanDetailsTabContentProps {
  tabId: string;
  setTabId: (id: string) => void;
}
export interface LoanDetailsFormTab1Props {
  formData: {
    application_type: string;
    lenders_reference: string;
    mortgage_type: string;
    loan_purpose: string;
    borrower_type: string;
    interest_rate_type: string;
    interest_rate: string;
    product_term: string;
    lender: string;
    other_lender_note: string;
    repayment_method: string;
    repayment_vehicle: string;
  };
  handleFormChange: (
    name: string,
    value: string | null | number | boolean
  ) => void;
}

export interface LoanDetailsFormTab2Props {
  formData: {
    mortgage_type: string;
    purchase_price: number;
    property_valuation: number;
    loan_amount: number;
    estimated_value: number;
    ltv: string | null;
    term_years: number;
    term_months: number;
    interest_only_amount: null | string;
    outstanding_balance: null | string;
    deposit_amount: number;
    deposit_source: string | null;
    current_monthly_payment: null | string;
    current_lender: string;
    current_lender_other_note: string;
    original_purchase_price: number;
    date_of_purchase: string | null;
    advice_level: string;
  };
  handleFormChange: (name: string, value: any) => void;
}

export interface LoanDetailsFormTab3Props {
  formData: {
    dip_accept_date: string | null;
    dip_expiry_date: string | null;
    expected_completion_date: string | null;
    product_expiry_date: string | null;
    case_submitted: string | null;
    valuation_instructed_date: string | null;
    valuation_booked_date: string | null;
    valuation_received_date: string | null;
    valuation_expiry_date: string | null;
    case_offered_date: string | null;
    stage_expiry_date: string | null;
    legals_instructed_date: string | null;
    exchange_of_contracts_date: string | null;
    case_completed_date: string | null;
    review_date: string | null;
  };
  caseStage?: string;
  handleFormChange: (
    name: string,
    value: string | number | boolean | null
  ) => void;
}

export interface LoanDetailsFormTab4Props {
  formData: {
    sale_type: string;
    introduction_type: string;
    lead_source: string;
    introducer_payment_terms: string;
    introducer_fee: string | null;
    reasons_for_capital_raising: string;
    accepted_or_declined_by_lender: boolean;
    case_summary: string;
    note: string;
  };
  handleFormChange: (
    name: string,
    value: string | number | boolean | null
  ) => void;
}
