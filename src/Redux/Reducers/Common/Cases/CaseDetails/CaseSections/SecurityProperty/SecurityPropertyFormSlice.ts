import { SecurityPropertyFormStateProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/SecurityPropertyTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: SecurityPropertyFormStateProps = {
  Properties: {
    property_purchase_price: 0,
    property_estimated_valuation: 0,
    have_you_found_a_property_yet: false,
    notes: "",

    postcode: "",
    house_name_or_number: "",
    address_one: "",
    address_two: "",
    city: "",
    county: "",
    region: null,
    country: null,

    property_type: "",
    house_type: "",
    flat_type: "",
    construction_of_walls: "",
    construction_of_roof: "",
    bedrooms: null,
    bathrooms: null,
    reception_rooms: null,
    kitchens: null,
    garages: null,
    parking_spaces: null,
    charge_type: "",
    epc_rating: "",
    floor: 0,
    flats: 0,
    number_of_storeys_in_the_building: 0,
    year_built: 0,
    lift_access: false,
    tenure: "",
    property_lease_term: 0,
    service_charge_per_month: null,
    ground_rent_per_annum: null,
    residential: null,
    commercial: null,
    is_the_property_a_listed_building: false,
    number_of_units: null,
    listed_status_of_the_building: "",
    listed_building_notes: "",
    do_you_or_will_you_own_part_or_all_of_the_freehold: false,
    is_the_property_part_of_a_help_to_buy_shared_ownership_scheme: false,
    is_the_property_above_or_near_commercial_premises: false,
    is_the_property_a_new_build: false,
    new_build_warranty_provider: "",
    other_new_build_warranty_rovider: "",
    is_the_property_a_right_to_buy: false,
    date_of_purchase: null,
    discounted_price: null,
    is_the_property_ex_local_authority: false,
    is_this_property_being_purchased_from_the_council_with_this_application: false,
    is_there_an_annexe_within_the_property: false,
    will_the_property_be_owner_occupied: false,
    please_provide_further_details: "",
    is_the_property_on_the_market: false,
    is_the_property_rented_out_to_be_rented_out: false,
    is_the_property_standard_construction: false,
    comments_details: "",
    does_the_property_have_solar_panels: false,
    do_you_own_the_solar_panels: false,
    is_the_property_used_purely_for_residential_purposes: false,
    valuation_type: "",
    applicant: "",
    contact_for_access: "",
    contacts_name: "",
    contacts_daytime_telephone: "",
    contacts_mobile_telephone: "",
    contacts_email_address: "",
    estimated_value: null,
    other_new_build_warranty_provider: "",
    api_errors: {} as Record<string, string>,
  },
};

const propertyFormSlice = createSlice({
  name: "SecurityPropertyForm",
  initialState,
  reducers: {
    updateProperty: (
      state,
      action: PayloadAction<
        Partial<SecurityPropertyFormStateProps["Properties"]>
      >,
    ) => {
      state.Properties = { ...state.Properties, ...action.payload };
    },
    setPropertyErrors: (
      state,
      action: PayloadAction<Record<string, string>>,
    ) => {
      state.Properties = { ...state.Properties, api_errors: action.payload };
    },
    clearPropertyErrors: (state) => {
      state.Properties = { ...state.Properties, api_errors: {} };
    },
    initializeForm: (
      state,
      action: PayloadAction<SecurityPropertyFormStateProps["Properties"]>,
    ) => {
      state.Properties = action.payload;
    },
    resetForm: () => initialState,
  },
});

export const {
  updateProperty,
  resetForm,
  initializeForm,
  setPropertyErrors,
  clearPropertyErrors,
} = propertyFormSlice.actions;
export default propertyFormSlice.reducer;
