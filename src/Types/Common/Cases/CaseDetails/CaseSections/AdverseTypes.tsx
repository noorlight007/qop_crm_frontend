export interface AdverseUser {
  id: number;
  alias: string;
  email: string;
  title: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  profile_image: null | string;
}
export interface AdverseProps {
  alias: string;
  has_any_ccj_registered_in_the_last_six_years: boolean;
  has_any_defaults_registered_in_the_last_six_years: boolean;
  has_ever_been_made_bankrupt: boolean;
  is_a_property_repossessed: boolean;
  is_direct_debit_returned_in_the_last_three_months: boolean;
  is_ever_enter_into_a_debt_management_plan_or_debt_relief_order: boolean;
  is_ever_taken_out_a_pay_day_loan: boolean;
  is_exceeded_your_overdraft_in_the_last_three_months: boolean;
  missed_any_payments_on_commitments_in_the_last_five_years: boolean;
  customer: AdverseUser;
  why_did_the_adverse_occur: null | string; // Assuming this can be a string if not null
}

export interface ViewPropertiesRepossessedModalProps {
  isOpen: boolean;
  toggle: () => void;
  adverseAlias: string;
}

export interface AddNewPropertiesRepossessedModalProps {
  isOpen: boolean;
  toggle: () => void;
  adverseAlias: string;
}

export interface AddNewCommitmentPaymentsMissedModalProps {
  isOpen: boolean;
  toggle: () => void;
  adverseAlias: string;
}

export interface ViewCommitmentPaymentsMissedModalProps {
  isOpen: boolean;
  toggle: () => void;
  adverseAlias: string;
}

export interface AddNewDefaultsModalProps {
  isOpen: boolean;
  toggle: () => void;
  adverseAlias: string;
}

export interface ViewDefaultsModalProps {
  isOpen: boolean;
  toggle: () => void;
  adverseAlias: string;
}

export interface AddNewBankruptciesModalProps {
  isOpen: boolean;
  toggle: () => void;
  adverseAlias: string;
}

export interface ViewBankruptciesModalProps {
  isOpen: boolean;
  toggle: () => void;
  adverseAlias: string;
}

export interface AddNewIVAsModalProps {
  isOpen: boolean;
  toggle: () => void;
  adverseAlias: string;
}

export interface ViewIVAsModalProps {
  isOpen: boolean;
  toggle: () => void;
  adverseAlias: string;
}

export interface IVAItemProps {
  date_registered: string | null;
  outstanding_balance: string | null;
  satisfied: boolean;
  date_satisfied: string | null;
}

export interface AddNewDMPsModalProps {
  isOpen: boolean;
  toggle: () => void;
  adverseAlias: string;
}

export interface ViewDMPsModalProps {
  isOpen: boolean;
  toggle: () => void;
  adverseAlias: string;
}

export interface DMPItemProps {
  plan: "DIRECT" | "THIRD_PARTY";
  loan_company_name: string;
  date_registered: string | null;
  outstanding_balance: string | null;
  satisfied: boolean;
  date_satisfied: string | null;
}

export interface AddNewPayDayLoansModalProps {
  isOpen: boolean;
  toggle: () => void;
  adverseAlias: string;
}

export interface ViewPayDayLoansModalProps {
  isOpen: boolean;
  toggle: () => void;
  adverseAlias: string;
}

export interface PayDayLoanProps {
  loan_amount: string | null;
  loan_date: string | null;
  has_the_pay_day_loan_been_repaid: boolean;
  date_repaid: string | null;
  lender_name: string;
}

export interface AddNewRegisteredCCJsModalProps {
  isOpen: boolean;
  toggle: () => void;
  adverseAlias: string;
}

export interface ViewCCJsModalProps {
  isOpen: boolean;
  toggle: () => void;
  adverseAlias: string;
}

export interface CCJProps {
  amount: string | null;
  loan_company_name: string;
  date_registered: string | null;
  has_satisfied: boolean;
  date_satisfied: string | null;
}
