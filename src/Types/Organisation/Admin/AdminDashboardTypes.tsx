export interface AdminDashboardTypes {
  organisation: string;
  network: string;
  new_clients_this_month: number;
  completed_cases: number;
  upcoming_tasks: number;
  adviser_case: Array<{
    adviser_name: string;
    total_cases: number;
    completed_cases: number;
    completion_percentage: number;
  }>;
  case_stage: {
    enquiry: number;
    fact_find: number;
    research_compliance_check: number;
    decision_in_principle: number;
    full_mortgage_application: number;
    submission: number;
    offer_from_bank: number;
    legal: number;
    completion: number;
    future_opportunity: number;
    accept_waiting_start_date: number;
    accept_on_risk: number;
    further_medical_required: number;
    not_proceed: number;
  };
  adviser_task: Array<{
    adviser_name: string;
    total_tasks: number;
    completed_tasks: number;
    overdue_tasks: number;
    efficiency: number;
  }>;
}
export interface AdminDashboardProps {
  isLoading: boolean;
  dashboardData: AdminDashboardTypes | undefined;
}
