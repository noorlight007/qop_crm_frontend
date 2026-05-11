export interface CompanyInfo {
  name?: string;
  subdomain?: string;
  email?: string;
  primary_mobile?: string;
  other_contact?: string;
  contact_person?: string;
  contact_person_designation?: string;
  website?: string;
  license_no?: string;
  license_image?: string;
  address:{
    postcode?: string;
    house_name_or_number?: string;
    address_line_1?: string;
    city?: string;
    country?: string;
  }
}
export interface ContactInfoProps {
  companyInfo?: CompanyInfo;
  isLoading: boolean;
}

export interface UpdateCompanyInfoModalProps {
  isOpen: boolean;
  toggle: () => void;
  companyInfo?: CompanyInfo;
}
