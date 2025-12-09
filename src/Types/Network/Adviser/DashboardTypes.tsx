export interface CaseStage {
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
}

export interface MonthlyPerformance {
  target: number;
  performance: number;
}

export interface Performances {
  january: MonthlyPerformance;
  february: MonthlyPerformance;
  march: MonthlyPerformance;
  april: MonthlyPerformance;
  may: MonthlyPerformance;
  june: MonthlyPerformance;
  july: MonthlyPerformance;
  august: MonthlyPerformance;
  september: MonthlyPerformance;
  october: MonthlyPerformance;
  november: MonthlyPerformance;
  december: MonthlyPerformance;
}

export interface Document {
  file: string;
  file_type: string;
  created_at: string;
  updated_at: string;
}

export interface NetworkAdviserSummary {
  network: string;
  new_clients_this_month: number;
  completed_cases: number;
  upcoming_tasks: number;
  case_stage: CaseStage;
  performances: Performances;
  documents: Document[];
}
export interface CommonNetworkAdviserSummaryProps {
  isLoading: boolean;
  netAdviserSummaryData: NetworkAdviserSummary;
}

export interface ClientData {
  name: string;
  email: string;
  phone: string;
  total_cases: number;
}
export interface CommonNetworkAdviserClientProps {
  isLoading: boolean;
  netAdviserClientData: ClientData[];
}
