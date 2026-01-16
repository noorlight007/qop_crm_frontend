export type MonthName =
  | "january"
  | "february"
  | "march"
  | "april"
  | "may"
  | "june"
  | "july"
  | "august"
  | "september"
  | "october"
  | "november"
  | "december";

export interface MonthlyRevenueItem {
  "monthly-revenue": number;
}

export interface MonthlyCasesItem {
  completed_cases: number;
  pending_cases: number;
}

export interface MonthlyClientsItem {
  client: number;
}

export interface TopAdviser {
  rank: number;
  profile_image?: string;
  name: string;
  total_cases: number;
  total_loan_amount: number;
}

export interface OrganisationDirectorDashboardData {
  network: string;
  organisation: string;
  total_advisers: number;
  active_clients: number;
  revenue_this_month: number;
  monthly_revenue_trend: Record<MonthName, MonthlyRevenueItem>;
  monthly_cases: Record<MonthName, MonthlyCasesItem>;
  monthly_clients: Record<MonthName, MonthlyClientsItem>;
  top_advisers: TopAdviser[];
}

export interface OrganisationDirectorDashboardProps {
  isLoading: boolean;
  organisationDirectorDashboardData?: OrganisationDirectorDashboardData;
}
