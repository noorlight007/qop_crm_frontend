export type NetworkMemberRole = 'COMPLIANCE' | 'ADVISER';

export type NetworkMemberProps = {
  role: NetworkMemberRole;
};

export type NetworkMemberType = {
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
  note?: string;
  created_by?: {
    name: string;
    email: string;
  } | null;
  created_at?: string;
  is_active?: boolean;
};

export type ViewNetworkMemberModalProps = {
  isOpen: boolean;
  toggle: () => void;
  role: NetworkMemberRole;
  selectedMember: Partial<NetworkMemberType>;
  networkslug: string;
};

export type UpdateNetworkMemberModalProps = {
  isOpen: boolean;
  toggle: () => void;
  networkslug: string;
  role: NetworkMemberRole;
  selectedMember?: Partial<NetworkMemberType>;
};

export type DeleteNetworkMemberModalProps = {
  isOpen: boolean;
  toggle: () => void;
  networkslug: string;
  role: NetworkMemberRole;
  selectedMember?: Partial<NetworkMemberType>;
};
