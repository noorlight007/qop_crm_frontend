interface Organization {
  alias: string;
  email: string;
  name: string;
  logo: string;
  profile_image: string;
  hero_image: string | null;
}

export interface ApplicantUser {
  id: number;
  alias: string;
  email: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  profile_image: string | null;
  title: string;
  name?: string;
}

export interface ApplicantCustomer {
  id: number;
  alias: string;
  email: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  title: string;
  enquiry_type: string;
  other_enquiry_type: string;
  source: string;
  other_source: string;
  note: string;
}

export interface ApplicantJointUser {
  id: number;
  alias: string;
  email: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  title: string;
  enquiry_type: string;
  other_enquiry_type: string | null;
  source: string;
  other_source: string | null;
  note: string;
}

export interface ApplicantNetwork {
  alias: string;
  email: string;
  hero_image: string | null;
  logo: string | null;
  name: string;
  primary_mobile: string;
  profile_image: string | null;
  slug: string;
}

export interface ApplicantPropertyDetails {
  alias: string;
  address_one: string | null;
  address_two: string | null;
  bathrooms: number;
  bedrooms: number;
  charge_type: string | null;
  city: string | null;
  comments_details: string | null;
  commercial: number;
  construction_of_roof: string | null;
  construction_of_walls: string | null;
  contact_for_access: string | null;
  contacts_daytime_telephone: string | null;
  contacts_email_address: string | null;
  contacts_mobile_telephone: string | null;
  contacts_name: string | null;
  country: string | null;
  county: string | null;
  created_at: string;
  created_by: string | null;
  date_of_purchase: string | null;
  discounted_price: number;
  do_you_or_will_you_own_part_or_all_of_the_freehold: boolean;
  do_you_own_the_solar_panels: boolean;
  does_the_property_have_solar_panels: boolean;
  epc_rating: string | null;
  estimated_value: number;
  flat_type: string | null;
  flats: number;
  floor: number;
  garages: number;
  ground_rent_per_annum: number;
  house_name_or_number: string | null;
  house_type: string | null;
  is_the_property_a_listed_building: boolean;
  is_the_property_a_new_build: boolean;
  is_the_property_a_right_to_buy: boolean;
  is_the_property_above_or_near_commercial_premises: boolean;
  is_the_property_ex_local_authority: boolean;
  is_the_property_on_the_market: boolean;
  is_the_property_part_of_a_help_to_buy_shared_ownership_scheme: boolean;
  is_the_property_rented_out_to_be_rented_out: boolean;
  is_the_property_standard_construction: boolean;
  is_the_property_used_purely_for_residential_purposes: boolean;
  is_there_an_annexe_within_the_property: boolean;
  is_this_property_being_purchased_from_the_council_with_this_application: boolean;
  kitchens: number;
  lift_access: boolean;
  listed_building_notes: string | null;
  listed_status_of_the_building: string | null;
  monthly_gross_rental: number | null;
  new_build_warranty_provider: string | null;
  note: string | null;
  notes: string | null;
  number_of_storeys_in_the_building: number;
  number_of_units: number | null;
  other_new_build_warranty_rovider: string | null;
  parking_spaces: number;
  please_provide_further_details: string | null;
  postcode: string | null;
  property_estimated_valuation: number;
  property_lease_term: number;
  property_purchase_price: number;
  property_type: string | null;
  reception_rooms: number;
  region: string | null;
  residential: number;
  service_charge_per_month: number;
  tenure: string | null;
  updated_at: string;
  updated_by: string | null;
  valuation_type: string | null;
  will_the_property_be_owner_occupied: boolean;
  year_built: number;
}

export interface ApplicantCaseTypes {
  alias: string;
  name: string;
  case_category: string;
  case_stage: string;
  application_type: string | null;
  mortgage_type: string | null;
  loan_amount: string;
  purchase_price: string;
  property_valuation: string;
  notes: string;
  lead: string | null;
  lender: string | null;
  organization: string | null;
  is_removed: boolean;
  created_at: string;
  updated_at: string;
  completion_date: string | null;
  review_date: string | null;
  customer: ApplicantCustomer;
  joint_users: ApplicantJointUser[];
  assigned_user: ApplicantUser | null;
  assigned_admin: ApplicantUser | null;
  assigned_to_admin: ApplicantUser | null;
  created_by: ApplicantUser;
  updated_by: ApplicantUser;
  network: ApplicantNetwork;
  property_details: ApplicantPropertyDetails;
}

export interface ApplicantCaseResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApplicantCaseTypes[];
}
