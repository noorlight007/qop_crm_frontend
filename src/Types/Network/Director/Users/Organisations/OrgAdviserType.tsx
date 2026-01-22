export interface OrgAdviserInfo {
  alias: string;
  profile_image: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  role: string;
  joining_date: string;
  is_active: boolean;
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

export interface ViewOrgAdviserModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedAdviser?: Partial<OrgAdviserInfo>;
}
