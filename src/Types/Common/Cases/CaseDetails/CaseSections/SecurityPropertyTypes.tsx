export interface SecurityPropertyFormStateProps {
  Properties: {
    // Valuation and Purchase Details
    alias?: string; // ""
    case?: Case; // Case
    property_purchase_price: number; // 0.0
    property_estimated_valuation: number; // 0.0
    have_you_found_a_property_yet: boolean; // false
    notes: string; // ""

    // Address Details
    postcode: string; // "62522"
    house_name_or_number: string; // "1040 Blackstone Drive"
    address_one: string; // "as1"
    address_two: string; // ""
    address_three?: string;
    address_four?: string;
    city: string; // "Decatur"
    county: string; // "IL"
    region: string | null; // "SOUTH_EAST"
    country: string | null; // "SCOTLAND"
    latitude?: number | null;
    longitude?: number | null;

    // Property Characteristics
    property_type: string; // "SELECT"
    house_type: string; // "SELECT"
    flat_type: string; // "SELECT"
    construction_of_walls: string; // "PLEASE_SELECT_A_CONSTRUCTION_TYPE"
    construction_of_roof: string; // ""
    bedrooms: number | null; // 2
    bathrooms: number | null; // 1
    reception_rooms: number | null; // null
    kitchens: number | null; // 1
    garages: number | null; // null
    parking_spaces: number | null; // null
    charge_type: string; // "ONE"
    epc_rating: string; // "SELECT"
    floor: number; // 1
    flats: number; // 1
    number_of_storeys_in_the_building: number; // 1
    year_built: number; // 1
    lift_access: boolean; // false

    // Tenure Details
    tenure: string; // "FREEHOLD"
    property_lease_term: number; // 0.0
    service_charge_per_month: number | null; // null
    ground_rent_per_annum: number | null; // null

    // Property Usage
    residential: boolean | null; // null
    commercial: boolean | null; // null
    is_the_property_a_listed_building: boolean; // false
    number_of_units: number | null; // null
    listed_status_of_the_building: string; // "SELECT"
    listed_building_notes: string; // ""
    do_you_or_will_you_own_part_or_all_of_the_freehold: boolean; // true
    is_the_property_part_of_a_help_to_buy_shared_ownership_scheme: boolean; // true
    is_the_property_above_or_near_commercial_premises: boolean; // true
    is_the_property_a_new_build: boolean; // false
    new_build_warranty_provider: string; // "SELECT_WARRANTY_PROVIDER"
    other_new_build_warranty_rovider: string; // ""
    is_the_property_a_right_to_buy: boolean; // true
    date_of_purchase: string | null; // "2025-03-22"
    discounted_price: number | null; // null
    is_the_property_ex_local_authority: boolean; // false
    is_this_property_being_purchased_from_the_council_with_this_application: boolean; // false
    is_there_an_annexe_within_the_property: boolean; // false
    will_the_property_be_owner_occupied: boolean; // false
    please_provide_further_details: string; // ""
    is_the_property_on_the_market: boolean; // false
    is_the_property_rented_out_to_be_rented_out: boolean; // false
    is_the_property_standard_construction: boolean; // false
    comments_details: string; // ""
    does_the_property_have_solar_panels: boolean; // false
    do_you_own_the_solar_panels: boolean; // true
    is_the_property_used_purely_for_residential_purposes: boolean; // true
    other_new_build_warranty_provider: string; // "";

    // Valuation and Contact Details
    valuation_type: string; // "standard_val"
    applicant: string; // "SELECT"
    contact_for_access: string; // ""
    contacts_name: string; // ""
    contacts_daytime_telephone: string; // ""
    contacts_mobile_telephone: string; // ""
    contacts_email_address: string; // ""
    estimated_value: number | null; // null
    api_errors?: Record<string, string>;
  };
}

export interface User {
  id: number;
  alias: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  profile_image: string | null;
  user_type: string;
}

export interface Case {
  alias: string;
  name: string;
  case_category: string;
  applicant_type: string;
  case_status: string;
  case_stage: string;
  created_at: string;
}

export interface PropertyData {
  alias: string;
  case: Case;
  property_purchase_price: number;
  property_estimated_valuation: number;
  have_you_found_a_property_yet: boolean;
  notes: string;

  postcode: string;
  house_name_or_number: string;
  address_one: string;
  address_two: string;
  address_three: string;
  address_four: string;

  city: string;
  county: string;
  region: string | null;
  country: string | null;
  latitude?: number | null;
  longitude?: number | null;

  property_type: string;
  house_type: string;
  flat_type: string;
  construction_of_walls: string;
  construction_of_roof: string;
  bedrooms: number | null;
  bathrooms: number | null;
  reception_rooms: number | null;
  kitchens: number | null;
  garages: number | null;
  parking_spaces: number | null;
  charge_type: string;
  epc_rating: string;
  floor: number;
  flats: number;
  number_of_storeys_in_the_building: number;
  year_built: number;
  lift_access: boolean;
  tenure: string;
  property_lease_term: number;
  service_charge_per_month: number | null;
  ground_rent_per_annum: number | null;
  residential: boolean | null;
  commercial: boolean | null;
  is_the_property_a_listed_building: boolean;
  number_of_units: number | null;
  listed_status_of_the_building: string;
  listed_building_notes: string;
  do_you_or_will_you_own_part_or_all_of_the_freehold: boolean;
  is_the_property_part_of_a_help_to_buy_shared_ownership_scheme: boolean;
  is_the_property_above_or_near_commercial_premises: boolean;
  is_the_property_a_new_build: boolean;
  new_build_warranty_provider: string;
  other_new_build_warranty_rovider: string;
  is_the_property_a_right_to_buy: boolean;
  date_of_purchase: string | null;
  discounted_price: number | null;
  is_the_property_ex_local_authority: boolean;
  is_this_property_being_purchased_from_the_council_with_this_application: boolean;
  is_there_an_annexe_within_the_property: boolean;
  will_the_property_be_owner_occupied: boolean;
  please_provide_further_details: string;
  is_the_property_on_the_market: boolean;
  is_the_property_rented_out_to_be_rented_out: boolean;
  is_the_property_standard_construction: boolean;
  comments_details: string;
  does_the_property_have_solar_panels: boolean;
  do_you_own_the_solar_panels: boolean;
  is_the_property_used_purely_for_residential_purposes: boolean;
  other_new_build_warranty_provider: string;
  valuation_type: string;
  applicant: string;
  contact_for_access: string;
  contacts_name: string;
  contacts_daytime_telephone: string;
  contacts_mobile_telephone: string;
  contacts_email_address: string;
  estimated_value: number | null;
  created_at: string;
  updated_at: string;
  created_by: User;
  updated_by: User | null;
}

export interface FoundPropertyProps {
  onPropertyFound: (value: boolean) => void;
  property: any;
}

export interface AdditionalInfoProps {
  propertyData?: any;
}

export interface AddressDetailsProps {
  propertyData?: PropertyData;
}

export interface PropertyDetailsProps {
  propertyData?: any;
}

export interface ValuationInfoProps {
  propertyData?: any;
}

export interface PropertyDetailsModalTabProps {
  isOpen: boolean;
  toggle: () => void;
}

export interface AddressItem {
  address: string;
  id: string;
  url: string;
  [key: string]: any;
}
export interface GetAddressModalProps {
  isOpen: boolean;
  toggle: () => void;
  addresses: AddressItem[];
  onSelect: (id: string) => void;
}
