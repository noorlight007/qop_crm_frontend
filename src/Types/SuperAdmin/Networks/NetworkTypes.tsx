export interface Networktype {
  slug: string;
  logo: string;
  name: string;
  email: string;
  subdomain: string;
  primary_mobile: string;
  created_at: string;
}
export interface NetworkDetailstype {
  network: {
    slug: string;
    logo: string;
    name: string;
    subdomain: string;
    primary_mobile: string;
    email: string;
    license_no: string;
    license_image: string;
    website: string;
    other_contact: string;
    contact_person: string;
    created_at: string;
    updated_at: string;
  };
  address: {
    postcode: string;
    house_name_or_number: string;
    address_line_1: string;
    city: string;
    country: string;
  };
  user: {
    profile_image: string;
    name: string;
    title: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    phone: string;
    is_active: boolean;
  };
}

export interface NetworkFormData {
  network: {
    name: string;
    subdomain: string;
    primary_mobile: string;
    email: string;
    license_no: string;
  };
  address: {
    postcode: string;
    house_name_or_number: string;
    address_line_1: string;
    city: string;
    country: string;
  };
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
}

export interface NetworkDetailsProps {
  networkData?: NetworkDetailstype;
  isLoading?: boolean;
  slug?: string;
}

export interface AddNetworkModalProps {
  isOpen: boolean;
  toggle: () => void;
}

export interface UpdateNetworkInfoModalProps {
  isOpen: boolean;
  toggle: () => void;
  slug?: string | undefined;
  networkData?: NetworkDetailstype;
}

export interface DeleteNetworkModalProps {
  isOpen: boolean;
  toggle: () => void;
  networkInfo?: NetworkDetailstype;
  slug?: string | undefined;
}
