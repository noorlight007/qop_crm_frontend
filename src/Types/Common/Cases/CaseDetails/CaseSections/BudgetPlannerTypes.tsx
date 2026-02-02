export interface BudgetPlanner {
  alias?: string;
  current_income: {
    applicant_one_net_monthly_income: number | null;
    applicant_two_net_monthly_income: number | null;
    rental_income: number | null;
    part_time_income: number | null;
    jobseekers_allowance: number | null;
    child_benefit: number | null;
    tax_credits: number | null;
    working_tax_credits: number | null;
    maintenance: number | null;
    pension: number | null;
    other_benefits: number | null;
    total_income: number | null;
  };
  post_income: {
    applicant_one_net_monthly_income: number | null;
    applicant_two_net_monthly_income: number | null;
    rental_income: number | null;
    part_time_income: number | null;
    jobseekers_allowance: number | null;
    child_benefit: number | null;
    tax_credits: number | null;
    working_tax_credits: number | null;
    maintenance: number | null;
    pension: number | null;
    other_benefits: number | null;
    total_income: number | null;
  };
  current_debt_repayments: {
    mortgage_rent: number | null;
    second_mortgage: number | null;
    shared_ownership_rental: number | null;
    total_debt_repayment: number | null;
  };
  post_debt_repayments: {
    mortgage_rent: number | null;
    second_mortgage: number | null;
    shared_ownership_rental: number | null;
    total_debt_repayment: number | null;
  };
  current_priority_debt: {
    mortgage_arrears: number | null;
    gas_arrears: number | null;
    maintenance_arrears: number | null;
    defaults: number | null;
    ccjs: number | null;
    debt_management_plans: number | null;
    magistrate_court_fines: number | null;
    council_tax_arrears: number | null;
    total_priority_debt: number | null;
  };
  post_priority_debt: {
    mortgage_arrears: number | null;
    gas_arrears: number | null;
    maintenance_arrears: number | null;
    defaults: number | null;
    ccjs: number | null;
    debt_management_plans: number | null;
    magistrate_court_fines: number | null;
    council_tax_arrears: number | null;
    total_priority_debt: number | null;
  };
  current_unsecured_borrowing: {
    credit_cards: number | null;
    loans: number | null;
    car_finance: number | null;
    overdraft: number | null;
    store_cards: number | null;
    student_loans: number | null;
    other_borrowing: number | null;
    total_unsecured_borrowing: number | null;
  };
  post_unsecured_borrowing: {
    credit_cards: number | null;
    loans: number | null;
    car_finance: number | null;
    overdraft: number | null;
    store_cards: number | null;
    student_loans: number | null;
    other_borrowing: number | null;
    total_unsecured_borrowing: number | null;
  };
  current_living_cost: {
    electricity: number | null;
    gas: number | null;
    water: number | null;
    landline_mobile_phone: number | null;
    tv_license: number | null;
    council_tax: number | null;
    ground_rent_service_charges: number | null;
    buildings_contents: number | null;
    mortgage_payment_protection: number | null;
    endowment: number | null;
    pension_contribution: number | null;
    childcare: number | null;
    maintenance: number | null;
    food: number | null;
    car_maintenance: number | null;
    fuel: number | null;
    public_transport: number | null;
    tv_broadband: number | null;
    recreation_holidays: number | null;
    clothing: number | null;
    medical_expenses: number | null;
    education: number | null;
    other_living_costs: number | null;
    total_living_expenses: number | null;
  };
  post_living_cost: {
    electricity: number | null;
    gas: number | null;
    water: number | null;
    landline_mobile_phone: number | null;
    tv_license: number | null;
    council_tax: number | null;
    ground_rent_service_charges: number | null;
    buildings_contents: number | null;
    mortgage_payment_protection: number | null;
    endowment: number | null;
    pension_contribution: number | null;
    childcare: number | null;
    maintenance: number | null;
    food: number | null;
    car_maintenance: number | null;
    fuel: number | null;
    public_transport: number | null;
    tv_broadband: number | null;
    recreation_holidays: number | null;
    clothing: number | null;
    medical_expenses: number | null;
    education: number | null;
    other_living_costs: number | null;
    total_living_expenses: number | null;
  };
  current_insurance: {
    motor_insurance: number | null;
    health_insurance: number | null;
    payment_protection: number | null;
    life_insurance: number | null;
    dental_insurance: number | null;
    other_insurance: number | null;
    buildings_insurance: number | null;
    contents_insurance: number | null;
    building_content_insurance: number | null;
    total_insurance_expenses: number | null;
  };
  post_insurance: {
    motor_insurance: number | null;
    health_insurance: number | null;
    payment_protection: number | null;
    life_insurance: number | null;
    dental_insurance: number | null;
    other_insurance: number | null;
    buildings_insurance: number | null;
    contents_insurance: number | null;
    building_content_insurance: number | null;
    total_insurance_expenses: number | null;
  };
  current_sub_total: {
    total_income: number | null;
    total_debt_repayment: number | null;
    total_living_expenses: number | null;
    available_income: number | null;
  };
  post_sub_total: {
    total_income: number | null;
    total_debt_repayment: number | null;
    total_living_expenses: number | null;
    available_income: number | null;
  };
  disclaimer: boolean;
  disclaimer_details: string;
}

export interface BudgetPlannerModalProps {
  isOpen: boolean;
  toggle: () => void;
}

export interface BudgetPlannerTabContentProps {
  tabId: number | null;
  setTabId: (id: number) => void;
  updateField: (field: string, value: any) => void;
  errors?: Record<string, string>;
  setErrors?: (e: Record<string, string>) => void;
}

export interface DebtRepaymentTabContentProps {
  updateField: (field: string, value: any) => void;
  errors?: Record<string, string>;
}

export interface DisclaimerTabContentsProps {
  updateField: (field: string, value: any) => void;
  errors?: Record<string, string>;
}

export interface HouseHoldIncomeTabContentProps {
  updateField: (field: string, value: any) => void;
  errors?: Record<string, string>;
}

export interface LivingExpensesTabContentsProps {
  updateField: (field: string, value: any) => void;
  errors?: Record<string, string>;
}
export interface MonthlyBudgetTabContentsProps {
  updateField: (field: string, value: any) => void;
  errors?: Record<string, string>;
}
