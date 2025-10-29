interface User {
  id: number;
  alias: string;
  email: string;
  phone: string;
  title: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  profile_image: string | null;
  user_type: string;
}

interface Organization {
  alias: string;
  email: string;
  name: string;
  logo: string;
  profile_image: string;
  hero_image: string | null;
}

export interface SingleClientApplicationProps {
  alias: string;
  name: string;
  lead_user: User;
  organization: Organization;
  case_category: string;
  case_stage: string;
  notes: string;
  is_removed: boolean;
  created_by: User;
  updated_by: User;
  created_at: string;
  updated_at: string;
}
