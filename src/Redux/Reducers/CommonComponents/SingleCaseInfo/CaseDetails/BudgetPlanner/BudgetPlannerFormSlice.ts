import { BudgetPlanner } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/BudgetPlannerTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Initial state matching your data structure
const initialState: BudgetPlanner = {
  current_income: {
    applicant_one_net_monthly_income: 0,
    applicant_two_net_monthly_income: 0,
    rental_income: 0,
    part_time_income: 0,
    jobseekers_allowance: 0,
    child_benefit: 0,
    tax_credits: 0,
    working_tax_credits: 0,
    maintenance: 0,
    pension: 0,
    other_benefits: 0,
    total_income: 0,
  },
  post_income: {
    applicant_one_net_monthly_income: 0,
    applicant_two_net_monthly_income: 0,
    rental_income: 0,
    part_time_income: 0,
    jobseekers_allowance: 0,
    child_benefit: 0,
    tax_credits: 0,
    working_tax_credits: 0,
    maintenance: 0,
    pension: 0,
    other_benefits: 0,
    total_income: 0,
  },
  current_debt_repayments: {
    mortgage_rent: 0,
    second_mortgage: 0,
    shared_ownership_rental: 0,
    total_debt_repayment: 0,
  },
  post_debt_repayments: {
    mortgage_rent: 0,
    second_mortgage: 0,
    shared_ownership_rental: 0,
    total_debt_repayment: 0,
  },
  current_priority_debt: {
    mortgage_arrears: 0,
    gas_arrears: 0,
    maintenance_arrears: 0,
    defaults: 0,
    ccjs: 0,
    debt_management_plans: 0,
    magistrate_court_fines: 0,
    council_tax_arrears: 0,
    total_priority_debt: 0,
  },
  post_priority_debt: {
    mortgage_arrears: 0,
    gas_arrears: 0,
    maintenance_arrears: 0,
    defaults: 0,
    ccjs: 0,
    debt_management_plans: 0,
    magistrate_court_fines: 0,
    council_tax_arrears: 0,
    total_priority_debt: 0,
  },
  current_unsecured_borrowing: {
    credit_cards: 0,
    loans: 0,
    car_finance: 0,
    overdraft: 0,
    store_cards: 0,
    student_loans: 0,
    other_borrowing: 0,
    total_unsecured_borrowing: 0,
  },
  post_unsecured_borrowing: {
    credit_cards: 0,
    loans: 0,
    car_finance: 0,
    overdraft: 0,
    store_cards: 0,
    student_loans: 0,
    other_borrowing: 0,
    total_unsecured_borrowing: 0,
  },
  current_living_cost: {
    electricity: 0,
    gas: 0,
    water: 0,
    landline_mobile_phone: 0,
    tv_license: 0,
    council_tax: 0,
    ground_rent_service_charges: 0,
    buildings_contents: 0,
    mortgage_payment_protection: 0,
    endowment: 0,
    pension_contribution: 0,
    childcare: 0,
    maintenance: 0,
    food: 0,
    car_maintenance: 0,
    fuel: 0,
    public_transport: 0,
    tv_broadband: 0,
    recreation_holidays: 0,
    clothing: 0,
    medical_expenses: 0,
    education: 0,
    other_living_costs: 0,
    total_living_expenses: 0,
  },
  post_living_cost: {
    electricity: 0,
    gas: 0,
    water: 0,
    landline_mobile_phone: 0,
    tv_license: 0,
    council_tax: 0,
    ground_rent_service_charges: 0,
    buildings_contents: 0,
    mortgage_payment_protection: 0,
    endowment: 0,
    pension_contribution: 0,
    childcare: 0,
    maintenance: 0,
    food: 0,
    car_maintenance: 0,
    fuel: 0,
    public_transport: 0,
    tv_broadband: 0,
    recreation_holidays: 0,
    clothing: 0,
    medical_expenses: 0,
    education: 0,
    other_living_costs: 0,
    total_living_expenses: 0,
  },
  current_insurance: {
    motor_insurance: 0,
    health_insurance: 0,
    payment_protection: 0,
    life_insurance: 0,
    dental_insurance: 0,
    other_insurance: 0,
    total_insurance_expenses: 0,
  },
  post_insurance: {
    motor_insurance: 0,
    health_insurance: 0,
    payment_protection: 0,
    life_insurance: 0,
    dental_insurance: 0,
    other_insurance: 0,
    total_insurance_expenses: 0,
  },
  current_sub_total: {
    total_income: 0,
    total_debt_repayment: 0,
    total_living_expenses: 0,
    available_income: 0,
  },
  post_sub_total: {
    total_income: 0,
    total_debt_repayment: 0,
    total_living_expenses: 0,
    available_income: 0,
  },
  disclaimer: false,
  disclaimer_details: "",
};

// Create the slice
const budgetPlannerSlice = createSlice({
  name: "budgetPlanner",
  initialState,
  reducers: {
    // Update specific BudgetPlanner section
    updateBudgetPlannerSection: (
      state,
      action: PayloadAction<{
        section: keyof BudgetPlanner;
        data: any;
      }>
    ) => {
      const { section, data } = action.payload;
      if (typeof data === "object" && data !== null) {
        if (section === "disclaimer") {
          state.disclaimer = Boolean(data);
        } else if (section === "disclaimer_details") {
          state.disclaimer_details = String(data);
        } else {
          // Ensure required fields have default values
          const updatedData = {
            ...data,
            ...(section === "current_debt_repayments" && {
              total_debt_repayment: data.total_debt_repayment ?? 0,
            }),
            ...(section === "post_debt_repayments" && {
              total_debt_repayment: data.total_debt_repayment ?? 0,
            }),
            ...(section === "current_sub_total" && {
              available_income: data.available_income ?? 0,
            }),
            ...(section === "post_sub_total" && {
              available_income: data.available_income ?? 0,
            }),
          };

          state[section] = {
            ...(state[section] as object),
            ...updatedData,
          };
        }
      }
    },

    // Initialize entire form with new data
    initializeBudgetPlannerForm: (
      state,
      action: PayloadAction<BudgetPlanner>
    ) => {
      return { ...state, ...action.payload };
    },

    // Reset form to initial state
    resetBudgetPlannerForm: () => initialState,

    // Update specific field in a section
    updateField: (
      state,
      action: PayloadAction<{
        section: keyof BudgetPlanner;
        field: string;
        value: number | null | boolean | string;
      }>
    ) => {
      const { section, field, value } = action.payload;
      if (section === "disclaimer") {
        state.disclaimer = value as boolean;
      } else if (section === "disclaimer_details") {
        state.disclaimer_details = value as string;
      } else {
        (state[section] as any)[field] = value;
      }
    },
  },
});

// Export actions
export const {
  updateBudgetPlannerSection,
  initializeBudgetPlannerForm,
  resetBudgetPlannerForm,
  updateField,
} = budgetPlannerSlice.actions;

// Export reducer
export default budgetPlannerSlice.reducer;
