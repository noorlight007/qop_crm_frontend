export interface OrgLeadInfo {
  alias: string;
  profile_image: string;
  name: string;
  title: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  role: string;
  enquiry_type: string;
  other_enquiry_type: string;
  source: string;
  other_source: string;
  note: string;
  created_by: {
    name?: string;
    title?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    user_type?: string;
  };
  created_at: string;
}

export interface ViewOrgLeadModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedLead?: Partial<OrgLeadInfo>;
}
