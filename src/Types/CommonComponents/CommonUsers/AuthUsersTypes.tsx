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
  userRole?: string;
}
