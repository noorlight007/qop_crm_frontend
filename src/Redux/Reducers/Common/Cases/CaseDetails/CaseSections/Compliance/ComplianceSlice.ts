import { ComplianceState } from "@/Types/Common/Cases/CaseDetails/CaseSections/ComplianceTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ─── New Types for Reviews ────────────────────────────────────────────────────

export type ComplianceGrade =
  | "SUITABLE"
  | "SUITABLE_WITH_DEVELOPMENT"
  | "UNSUITABLE"
  | null;

export type ComplianceStage =
  | "PRE_SUBMISSION"
  | "POST_SUBMISSION"
  | "POST_COMPLETION";

export interface ReviewStageState {
  id?: number;
  stage?: ComplianceStage;
  file_review_request_date: string | null;
  file_reviewed_date: string | null;
  remedial_actions_due_date: string | null;
  compliance_sign_off_date: string | null;
  admin_grade: ComplianceGrade;
  advice_grade: ComplianceGrade;
  comments: string | null;
  _touched?: boolean;
}

export interface ReviewsState {
  PRE_SUBMISSION: ReviewStageState;
  POST_SUBMISSION: ReviewStageState;
  POST_COMPLETION: ReviewStageState;
}

// ─── Extended State (ComplianceState + reviews) ───────────────────────────────
// We extend ComplianceState so the existing reducers/selectors stay intact.
// The `reviews` field is the only addition — remove old fields when ready.

export interface ExtendedComplianceState extends ComplianceState {
  reviews: ReviewsState;
}

// ─── Default Stage ────────────────────────────────────────────────────────────

const defaultStageState: ReviewStageState = {
  file_review_request_date: null,
  file_reviewed_date: null,
  remedial_actions_due_date: null,
  compliance_sign_off_date: null,
  admin_grade: null,
  advice_grade: null,
  comments: null,
  _touched: false,
};

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: ExtendedComplianceState = {
  // --- OLD FIELDS (kept for backward compat — remove when migration complete) ---
  date_file_checked: undefined,
  date_file_rechecked: undefined,
  file_checked: undefined,
  remedial_actions_required: undefined,
  remedial_actions_complete: undefined,
  comments: undefined,
  rating_a: undefined,
  rating_b: undefined,
  rating_c: undefined,
  //
  terms_of_business: undefined,
  terms_of_business_text: undefined,
  privacy_notice: undefined,
  privacy_notice_text: undefined,
  fee_agreement: undefined,
  fee_agreement_text: undefined,
  factfind_filled: undefined,
  factfind_filled_text: undefined,
  nivo_idv_check: undefined,
  nivo_idv_check_text: undefined,
  financial_sanctions_checked: undefined,
  financial_sanctions_checked_text: undefined,
  proof_of_id: undefined,
  proof_of_id_text: undefined,
  proof_of_address: undefined,
  proof_of_address_text: undefined,
  proof_of_income: undefined,
  proof_of_income_text: undefined,
  proof_of_deposit: undefined,
  proof_of_deposit_text: undefined,
  bank_statements: undefined,
  bank_statements_text: undefined,
  credit_reports: undefined,
  credit_reports_text: undefined,
  affordability_calculator: undefined,
  affordability_calculator_text: undefined,
  evidence_of_research: undefined,
  evidence_of_research_text: undefined,
  agreement_in_principle: undefined,
  agreement_in_principle_text: undefined,
  signed_application: undefined,
  signed_application_text: undefined,
  suitability_letter: undefined,
  suitability_letter_text: undefined,
  mortgage_offer: undefined,
  mortgage_offer_text: undefined,
  debt_consolidation_calculator: undefined,
  debt_consolidation_calculator_text: undefined,
  shared_equity_documentation: undefined,
  shared_equity_documentation_text: undefined,
  proof_of_lending: undefined,
  proof_of_lending_text: undefined,
  proof_of_repayment: undefined,
  proof_of_repayment_text: undefined,
  //
  loan_details_fully_completed: undefined,
  loan_details_fully_completed_text: undefined,
  has_source_of_lead_been_recorded: undefined,
  has_source_of_lead_been_recorded_text: undefined,
  realistic_proximity_to_the_advisor: undefined,
  realistic_proximity_to_the_advisor_text: undefined,
  personal_details: undefined,
  personal_details_text: undefined,
  retirement_age: undefined,
  retirement_age_text: undefined,
  does_the_occupation_compared: undefined,
  does_the_occupation_compared_text: undefined,
  employment_details: undefined,
  employment_details_text: undefined,
  has_due_diligence_been_completed: undefined,
  has_due_diligence_been_completed_text: undefined,
  does_the_stated_income: undefined,
  does_the_stated_income_text: undefined,
  does_the_stated_net_income: undefined,
  does_the_stated_net_income_text: undefined,
  is_the_client_in_an_occupation: undefined,
  is_the_client_in_an_occupation_text: undefined,
  has_property_portfolio_fully_completed: undefined,
  has_property_portfolio_fully_completed_text: undefined,
  has_proposed_property_details_fully_completed: undefined,
  has_proposed_property_details_fully_completed_text: undefined,
  has_your_needs_fully_completed: undefined,
  has_your_needs_fully_completed_text: undefined,
  has_repayment_vehicle_recorded: undefined,
  has_repayment_vehicle_recorded_text: undefined,
  have_figures_been_input: undefined,
  have_figures_been_input_text: undefined,
  is_deposit_come_from_sale_of_property: undefined,
  is_deposit_come_from_sale_of_property_text: undefined,
  has_adviser_completed_calculator: undefined,
  has_adviser_completed_calculator_text: undefined,
  has_accountant_solicitor_details_confirmed: undefined,
  has_accountant_solicitor_details_confirmed_text: undefined,
  //
  has_credit_commitments_fully_completed: undefined,
  has_credit_commitments_fully_completed_text: undefined,
  is_any_credit_commitments: undefined,
  is_any_credit_commitments_text: undefined,
  has_client_adverse_credit: undefined,
  has_client_adverse_credit_text: undefined,
  has_budget_planner_been_completed: undefined,
  has_budget_planner_been_completed_text: undefined,
  has_all_direct_debits_been_recorded: undefined,
  has_all_direct_debits_been_recorded_text: undefined,
  //
  has_adviser_sourced_mortgage_requirements: undefined,
  has_adviser_sourced_mortgage_requirement_text: undefined,
  does_figures_stated_in_mortgage_requirements: undefined,
  does_figures_stated_in_mortgage_requirements_text: undefined,
  are_results_stored_in_order_of_client_preference: undefined,
  are_results_stored_in_order_of_client_preference_text: undefined,
  is_recommended_product_showing_evidence_research: undefined,
  is_recommended_product_showing_evidence_research_text: undefined,
  is_the_address_on_the_kfi_correct: undefined,
  is_the_address_on_the_kfi_correct_text: undefined,
  does_figures_features_mortgage_requirements: undefined,
  does_figures_features_mortgage_requirement_text: undefined,
  does_monthly_payment_fit_within_disposable_income: undefined,
  does_monthly_payment_fit_within_disposable_income_text: undefined,
  are_fees_disclosed_correctly: undefined,
  are_fees_disclosed_correctly_text: undefined,
  lender_fees_added: undefined,
  lender_fees_added_text: undefined,
  has_illustration_been_produced: undefined,
  has_illustration_been_produced_text: undefined,
  interest_only: undefined,
  interest_only_text: undefined,
  has_product_been_fully_completed: undefined,
  has_product_been_fully_completed_text: undefined,
  //
  personal_details_match_the_factfind: undefined,
  personal_details_match_the_factfind_text: undefined,
  does_employment_and_income_details_match: undefined,
  does_employment_and_income_details_match_text: undefined,
  does_property_loan_details_match: undefined,
  does_property_loan_details_match_text: undefined,
  does_mortgage_application_confirm: undefined,
  does_mortgage_application_confirm_text: undefined,
  //
  has_suitability_letter_been_generated: undefined,
  has_suitability_letter_been_generated_text: undefined,
  post_application_changes: undefined,
  post_application_changes_text: undefined,
  is_applicants_live_at_separate_addresses: undefined,
  is_applicants_live_at_separate_addresses_text: undefined,
  is_replacement_suitability_letter: undefined,
  is_replacement_suitability_letter_text: undefined,
  has_reasons_for_mortgage_been_personalised: undefined,
  has_reasons_for_mortgage_been_personalised_text: undefined,
  has_meeting_discussion_been_personalised: undefined,
  has_meeting_discussion_been_personalised_text: undefined,
  has_circumstances_objectives_personalised: undefined,
  has_circumstances_objectives_personalised_text: undefined,
  has_budget_affordability_been_personalised: undefined,
  has_budget_affordability_been_personalised_text: undefined,
  has_new_mortgage_details_been_completed: undefined,
  has_new_mortgage_details_been_complete_text: undefined,
  has_mortgage_section_one_personalised: undefined,
  has_mortgage_section_one_personalised_text: undefined,
  has_mortgage_section_two_personalised: undefined,
  has_mortgage_section_two_personalised_text: undefined,
  are_we_recommending_repayment_method: undefined,
  are_we_recommending_repayment_method_text: undefined,
  are_we_recommending_mortgage_type: undefined,
  are_we_recommending_mortgage_type_text: undefined,
  are_we_recommending_mortgage_term: undefined,
  are_we_recommending_mortgage_term_text: undefined,
  are_we_recommending_mortgage_lender: undefined,
  are_we_recommending_mortgage_lender_text: undefined,
  are_we_recommending_mortgage_amount: undefined,
  are_we_recommending_mortgage_amount_text: undefined,
  are_cost_and_fees_been_completed: undefined,
  are_cost_and_fees_been_complete_text: undefined,
  are_disadvantages_risks_been_selected: undefined,
  are_disadvantages_risks_been_selected_text: undefined,
  has_adviser_personalised: undefined,
  has_adviser_personalised_text: undefined,
  has_adviser_included: undefined,
  has_adviser_included_text: undefined,
  has_protection_section_personalised: undefined,
  has_protection_section_personalised_text: undefined,
  has_b_and_c_section_personalised: undefined,
  has_b_and_c_section_personalised_text: undefined,
  has_wills_section_personalised: undefined,
  has_wills_section_personalised_text: undefined,
  does_recommended_product_match_your_needs_section: undefined,
  does_recommended_product_match_your_needs_section_text: undefined,

  // --- NEW REVIEWS SHAPE ---
  reviews: {
    PRE_SUBMISSION: { ...defaultStageState },
    POST_SUBMISSION: { ...defaultStageState },
    POST_COMPLETION: { ...defaultStageState },
  },
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const complianceSlice = createSlice({
  name: "compliance",
  initialState,
  reducers: {
    // --- EXISTING ACTIONS (unchanged) ---
    updateComplianceAnswer: (
      state,
      action: PayloadAction<{
        field: keyof ComplianceState;
        value: string | null | boolean;
      }>,
    ) => {
      const { field, value } = action.payload;
      (state[field] as string | null | undefined | boolean) = value;
    },
    updateComplianceComment: (
      state,
      action: PayloadAction<{
        field: keyof ComplianceState;
        value: string | null | boolean;
      }>,
    ) => {
      const { field, value } = action.payload;
      (state[field] as string | null | undefined | boolean) = value;
    },
    setComplianceData: (state, action: PayloadAction<ComplianceState>) => {
      // Preserve reviews when resetting flat compliance data
      const currentReviews = state.reviews;
      return { ...action.payload, reviews: currentReviews };
    },

    // --- NEW REVIEW ACTIONS ---

    // Update a single field in a stage and mark it as touched
    updateReviewField: (
      state,
      action: PayloadAction<{
        stage: ComplianceStage;
        field: keyof Omit<ReviewStageState, "_touched">;
        value: any;
      }>,
    ) => {
      const { stage, field, value } = action.payload;
      (state.reviews[stage] as any)[field] = value;
      state.reviews[stage]._touched = true;
    },

    // Populate reviews from GET API response — resets _touched on all stages
    hydrateReviews: (
      state,
      action: PayloadAction<ReviewsState>,
    ) => {
      const stages: ComplianceStage[] = [
        "PRE_SUBMISSION",
        "POST_SUBMISSION",
        "POST_COMPLETION",
      ];
      stages.forEach((stage) => {
        if (action.payload[stage]) {
          state.reviews[stage] = {
            ...action.payload[stage],
            _touched: false,
          };
        }
      });
    },

    // Reset _touched on all stages after a successful save
    resetReviewTouched: (state) => {
      const stages: ComplianceStage[] = [
        "PRE_SUBMISSION",
        "POST_SUBMISSION",
        "POST_COMPLETION",
      ];
      stages.forEach((stage) => {
        state.reviews[stage]._touched = false;
      });
    },
  },
});

export const {
  updateComplianceAnswer,
  updateComplianceComment,
  setComplianceData,
  updateReviewField,
  hydrateReviews,
  resetReviewTouched,
} = complianceSlice.actions;

export default complianceSlice.reducer;
