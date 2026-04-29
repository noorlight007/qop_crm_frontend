export interface OrgAdminInfo {
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
    email?: string;
  };
  created_at: string;
}

export interface ViewOrgAdminModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedAdmin?: Partial<OrgAdminInfo>;
}