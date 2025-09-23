export interface ExistingProtectionDetailsProps {
  alias: string;
  user: {
    id: number;
    title: string;
    first_name: string;
    middle_name: string;
    last_name: string;
  };
  have_any_existing_Protection_policies_in_place: boolean | undefined;
  policy_type: string | "";
  policy_provider: string | "";
  insurers_reference: string | "";
  sum_assured: number | null;
  premium: number | null;
  premium_payment_type: string | "";
  person_assured: string | "";
  in_trust: string | "";
  guaranteed_reviewable: string | "";
  remaining_policy_term: string | "";
  cancelled_lapsed_date: string | null;
  renewal_date: string | null;
  date_policy_started: string | null;
  waiver_of_premium: boolean;
  indexation: boolean;
  death_in_service_provision: boolean;
  have_non_standard_terms_been_issued: boolean;
  copy_and_paste_non_standard_terms_from_lender: string | "";
  will_this_policy_be_cancelled: boolean;
  reason_for_policy_cancellation: string | "";
  policy_cancellation_notes: string | "";
  why_did_you_take_out_this_policy: string | "";
}

export interface ExistingProtectionTabContentProps {
  activeTab: string | null;
  activeUser: number | null;
  groupedData: Record<number, ExistingProtectionDetailsProps[]>;
}

export interface AddExistingProtectionModalProps {
  isOpen: boolean;
  toggle: () => void;
  existingProtectionData: any;
}
