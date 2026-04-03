export interface LeadsOrApplicants {
  alias: string;
  name: string;
  title: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  gender: string;
  created_at: string;
  created_by: string | null;
  joining_date: string;
  is_active: boolean;
  profile_image: string | null;
  company_name?: string;
  company_address?: string;
  role?: string;
}

export interface LeadsOrApplicantsProps {
  title: string;
  leadsOrApplicantsPerPage?: number;
  roles: string | string[];
}

export interface ViewLeadsOrApplicantsModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedLeadsOrApplicants: Partial<LeadsOrApplicants>;
  title: string;
}
export interface UpdateLeadsOrApplicantsModalProps {
  title: string;
  isOpen: boolean;
  toggle: () => void;
  selectedLeadsOrApplicants: Partial<LeadsOrApplicants>;
}

export interface DeleteLeadsOrApplicantsModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedLeadsOrApplicants: Partial<LeadsOrApplicants>;
}
