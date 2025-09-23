export interface PropertiesTypeProps {
  alias: string;
  created_at: string;
  updated_at: string;
  created_by: {
    first_name: string;
    last_name: string;
  };
  updated_by: null | {
    first_name: string;
    last_name: string;
  };

  applicant: Array<{
    first_name: string;
    last_name: string;
  }>;
  is_property_owner: boolean;
  postcode: string;
  house_name_or_number: string;
  address_1: string;
  address_2: string;
  city: string;
  county: string | null;
  country: string;
  property_value: number;
  current_mortgage_balance: number;
  monthly_rental_income: number;
  monthly_mortgage_payment: number | null;
  value_at_purchase: number | null;
  date_purchased: string | null;
  is_hmo: boolean;
  is_mufb: boolean;
  mortgage_lender: string | null;
  repayment_type: string | null;
  to_be_repaid: string | null;
  current_rate: string | null;
  rate_type: string | null;
  current_rate_end_date: string | null;
  erc_end_date: string | null;
  account_number: string;
  property_type: string;
  ownership: "yes" | "no" | string;
  leasehold: boolean | null;
  year_built: number | null;
  number_of_bedrooms: number;
  remaining_mortgage_term: string | null;
  is_limited_company: boolean;
  epc_rating: string | null;
}
