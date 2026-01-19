interface AuthUser {
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
}

interface AuthUsersProps {
  title: string;
  authUsersPerPage?: number;
  userRole?: string;
}

interface ViewAuthUserModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedAuthUser: Partial<AuthUser>;
}

export interface AddAuthUserModalProps {
  isOpen: boolean;
  toggle: () => void;
}

interface UpdateAuthUserModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedAuthUser: Partial<AuthUser>;
}

export type {
  AuthUser,
  AuthUsersProps,
  UpdateAuthUserModalProps,
  ViewAuthUserModalProps,
};
