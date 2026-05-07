export type OrgMemberRole = "ADMIN" | "INTRODUCER" | "ADVISER";

export type OrgMemberProps = {
  role: OrgMemberRole;
};

export type OrgMembersType = {
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

export type ViewOrgMemberModalProps = {
  isOpen: boolean;
  toggle: () => void;
  role: OrgMemberRole;
  selectedMember: Partial<OrgMembersType>;
};

export type UpdateOrgMemberModalProps = {
  isOpen: boolean;
  toggle: () => void;
  organisationslug: string;
  role: OrgMemberRole;
  selectedMember?: Partial<OrgMembersType>;
};

export type DeleteOrgMemberModalProps = {
  isOpen: boolean;
  toggle: () => void;
  organisationslug: string;
  role: OrgMemberRole;
  selectedMember?: Partial<OrgMembersType>;
};
