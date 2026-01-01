// Type for applicants data array
export interface ApplicantProps {
  alias?: string;
  is_company_application: boolean;
  applicant?: {
    title?: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
  };
  title: string;
  maiden_name: string;
  date_of_name_change: string;
  date_of_birth: string;
  anticipated_retirement_age: number;
  state_retirement_age: number;
  is_smoker: boolean;
  gender: string;
  nationality: string;
  is_dual_nationality: boolean;
  dual_nationality: string;
  marital_status: string;
  ni_number: string;
  country_of_birth: string;
  bank_name: string;
  home_phone: string;
  mobile_phone: string;
  work_phone: string;
  email: string;
  has_dependants: boolean;
  number_of_dependants: number;
  date_of_arrival_uk: string;
  indefinite_right_to_reside: boolean;
  visa_details: string;
  visa_expiry_date: string;
  postcode: string;
  house_number_or_name: string;
  address_line1: string;
  city: string;
  county: string;
  country: string;
  effective_from: string;
  time_at_address_years: number;
  time_at_address_months: number;
  residential_status: string;
  current_mortgage_balance: string;
  property_value: string;
  owner_monthly_payment: string;
  lender: string;
  mortgage_start_date: string;
  mortgage_type: string;
  current_interest_rate: string;
  remaining_term: number;
  repayment_type: string;
  current_interest_type: string;
  early_repayment_charge_applies: boolean;
  erc_expiry_date: string;
  erc_amount: string;
  erc_being_paid: boolean;
  mortgage_account_number: string;
  being_redeemed: boolean;
  is_mortgage_portable: boolean;
  is_mortgage_being_ported: boolean;
  mortgage_not_to_complete_until_erc_ended: string;
  mortgage_charter_scheme: boolean;
  property_type: string;
  bedrooms: number;
  tenure: string;
  year_built: number;
  notes: string;
  marketing_preferences?: string[];
  rental_monthly_payment: number | null;
  landlord_name: string | null;
  landlord_telephone: string | null;
  landlord_email: string | null;
  landlord_address_postcode: string | null;
  landlord_house_number_or_name: string | null;
  landlord_address_line_one: string | null;
  landlord_city: string | null;
  landlord_county: string | null;
  landlord_country: string | null;
  intend_to_move_into_the_new_property: boolean;
  new_address_house_number_or_name: string | null;
  new_address_address_one: string | null;
  new_address_address_two: string | null;
  new_address_city: string | null;
  new_address_county: string | null;
  new_address_postcode: string | null;
  new_address_country: string | null;
  new_address_effective_from: string | null;
  updated_by?: any;
}

export interface ApplicantDependantsProps {
  alias: string;
  id: number;
  name: string;
  relationship_type: string;
  other_relationship: string;
  date_of_birth: string;
}

export interface ApplicantDependantsViewModalProps {
  isOpen?: boolean;
  toggle?: () => void;
  slNo?: number;
  applicantAlias?: any;
  applicantsData?: ApplicantProps[];
}
export interface AddDependantFormModalProps {
  isOpen: boolean;
  toggle: () => void;
  case_alias: string;
  applicantDetails_alias: string;
}

export interface AddCompanyDetailsFormModalProps {
  isOpen: boolean;
  toggle: () => void;
  case_alias: string;
  applicantDetails_alias: string;
}

export interface ApplicantCompanyProps {
  company_name: string;
  company_registration_number: string;
  date_of_incorporation: string | null;
  company_type: string;
  trade_business_type: string;
  sic_code: string;
  is_spv: boolean;
  postcode: string;
  house_number_or_name: string;
  address_line1: string;
  city: string;
  county: string;
  country: string;
  directors_shareholders?: DirectorShareholder[];
  number_of_directors_shareholders?: number;
}

export interface DirectorShareholder {
  full_name: string;
  percentage_share: string | number;
  role: string;
}

// Previous address types
export interface PreviousAddressProps {
  alias: string;
  postcode: string;
  house_name_or_number: string;
  address_line1: string;
  city: string;
  county: string;
  country: string;
  pre_effective_from: string;
  pre_effective_to: string;
  time_at_address_years: string;
  time_at_address_months: string;
  residential_status: string;
  notes: string;
  complete_previous_address?: boolean;
}

export interface ViewPreviousAddressModalProps {
  isOpen: boolean;
  toggle: () => void;
  applicantAlias?: string;
}

export interface AddPreviousAddressModalProps {
  isOpen: boolean;
  toggle: () => void;
  case_alias?: string;
  applicantAlias?: string;
  effectiveFromDate?: string;
  lastEffectiveFromDate?: string;
  applicantDetailsAlias?: string;
}
