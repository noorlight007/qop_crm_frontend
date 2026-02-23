export interface AuthUser {
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

export interface AuthUsersProps {
  title: string;
  authUsersPerPage?: number;
  roles: string | string[];
}

export interface ViewAuthUserModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedAuthUser: Partial<AuthUser>;
}
export interface UpdateAuthUserModalProps {
  title: string;
  isOpen: boolean;
  toggle: () => void;
  selectedAuthUser: Partial<AuthUser>;
}

export interface DeleteAuthUserModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedAuthUser: Partial<AuthUser>;
}