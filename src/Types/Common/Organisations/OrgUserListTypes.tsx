export type OrgUserRole = "ADMIN" | "INTRODUCER" | "ADVISER";

export type OrgUserListProps = {
  role: OrgUserRole;
};

export type OrgUserListType = {
  alias?: string;
  name?: string;
  title?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  profile_image?: string;
  email?: string;
  phone?: string;
  joining_date?: string;
  company_name?: string;
  company_address?: string;
  note?: string;
  created_by?: {
    name: string;
    email: string;
  } | null;
  created_at?: string;
  is_active?: boolean;
};

export type ViewOrgUserModalProps = {
  isOpen: boolean;
  toggle: () => void;
  role: OrgUserRole;
  selectedUser: Partial<OrgUserListType>;
};

export type UpdateOrgUserModalProps = {
  isOpen: boolean;
  toggle: () => void;
  organisationslug: string;
  role: OrgUserRole;
  selectedUser?: Partial<OrgUserListType>;
};

export type DeleteOrgUserModalProps = {
  isOpen: boolean;
  toggle: () => void;
  organisationslug: string;
  role: OrgUserRole;
  selectedUser?: Partial<OrgUserListType>;
};
