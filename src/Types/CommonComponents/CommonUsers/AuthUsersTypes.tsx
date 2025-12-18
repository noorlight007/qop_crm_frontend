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
}

interface AuthUsersProps {
  title: string;
  authUsersPerPage?: number;
  organizationUsersRole?: string;
}

interface ViewAuthUserModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedAuthUser: Partial<AuthUser>;
}

interface UpdateAuthUserModalProps {
  isOpen: boolean;
  toggle: () => void;
  onSave: (data: Partial<AuthUser>) => void;
  selectedAuthUser: Partial<AuthUser>;
}

export type {
  AuthUser,
  AuthUsersProps,
  UpdateAuthUserModalProps,
  ViewAuthUserModalProps,
};
