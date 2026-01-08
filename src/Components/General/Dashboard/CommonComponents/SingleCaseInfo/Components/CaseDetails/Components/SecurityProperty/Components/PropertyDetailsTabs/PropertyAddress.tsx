import { useGetApplicantsQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/ApplicantsDetails/ApplicantsDetailsApi";
import { updateProperty } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/SecurityProperty/SecurityPropertyFormSlice";
import { RootState } from "@/Redux/Store";
import apiAddress from "@/services/api-address";
import { AddressDetailsProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/SecurityPropertyTypes";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Col,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import PropertyAddressModal from "./Modals/PropertyAddressModal";

const AddressDetails: React.FC<AddressDetailsProps> = ({ propertyData }) => {
  // Get case alias from URL params
  const params = useParams();
  const { casealias } = params;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressList, setAddressList] = useState<any[]>([]);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // Fetch applicants data
  const { data: applicantsData, isLoading } = useGetApplicantsQuery({
    case_alias: casealias,
  });

  const dispatch = useDispatch();
  const propertyState = useSelector(
    (state: RootState) => state.propertyForm.Properties
  );

  // Add local error state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (propertyData) {
      dispatch(
        updateProperty({
          postcode: propertyData.postcode || "",
          house_name_or_number: propertyData.house_name_or_number || "",
          address_one: propertyData.address_one || "",
          address_two: propertyData.address_two || "",
          city: propertyData.city || "",
          county: propertyData.county || "",
          region: propertyData.region || null,
          country: propertyData.country || null,
        })
      );
    }
  }, [propertyData, dispatch]);

  // Helper to get error message for each field
  const getErrorMessage = (name: string) => {
    switch (name) {
      case "postcode":
        return "Postcode is required";
      case "house_name_or_number":
        return "House Name or Number is required";
      case "address_one":
        return "Address 1 is required";
      case "city":
        return "City is required";
      default:
        return "This field is required";
    }
  };

  // Show errors for required fields immediately on mount
  useEffect(() => {
    const newErrors: { [key: string]: string } = {};
    if (!propertyState.postcode)
      newErrors.postcode = getErrorMessage("postcode");
    if (!propertyState.house_name_or_number)
      newErrors.house_name_or_number = getErrorMessage("house_name_or_number");
    if (!propertyState.address_one)
      newErrors.address_one = getErrorMessage("address_one");
    if (!propertyState.city) newErrors.city = getErrorMessage("city");
    setErrors(newErrors);
    // eslint-disable-next-line
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    dispatch(updateProperty({ [name]: value }));
    // Live validation: show error if field is empty, clear if not
    setErrors((prev) => ({
      ...prev,
      [name]: value.trim() === "" ? getErrorMessage(name) : "",
    }));
  };

  // Copy main address from first applicant
  const handleCopyMainAddress = () => {
    if (applicantsData && applicantsData.length > 0) {
      const firstApplicant = applicantsData[0];

      dispatch(
        updateProperty({
          postcode: firstApplicant.postcode || "",
          house_name_or_number: firstApplicant.house_number_or_name || "",
          address_one: firstApplicant.address_line1 || "",
          city: firstApplicant.city || "",
          county: firstApplicant.county || "",
          // country: firstApplicant.country || null,
        })
      );

      // Clear errors for fields that now have values
      const newErrors = { ...errors };
      if (firstApplicant.postcode) delete newErrors.postcode;
      if (firstApplicant.house_number_or_name)
        delete newErrors.house_name_or_number;
      if (firstApplicant.address_line1) delete newErrors.address_one;
      if (firstApplicant.city) delete newErrors.city;
      setErrors(newErrors);
    }
  };

  // Manual validation logic (fallback if needed)
  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};

    if (!propertyState.postcode) newErrors.postcode = "Postcode is required";
    if (!propertyState.house_name_or_number)
      newErrors.house_name_or_number = "House Name or Number is required";
    if (!propertyState.address_one)
      newErrors.address_one = "Address 1 is required";
    if (!propertyState.city) newErrors.city = "City is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    // dispatch(saveAction(propertyState)); // Uncomment and use your actual save action
    console.log("Form submitted:", propertyState);
    return true;
  };

  const fetchAddressByPostcode = async (postcode: string) => {
    if (!postcode) return;
    try {
      const response = await apiAddress.get(
        `/autocomplete/${postcode}?api-key=${process.env.NEXT_PUBLIC_ADRESS_API_KEY}`
      );
      setAddressList(response.data.suggestions || []);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error looking up address:", err);
    }
  };
  
  const handleSelectAddress = async (id: string) => {
    setIsFetchingAddress(true);
    // Close the modal immediately after selection
    setIsModalOpen(false); 

    try {
      // Calling the specific get/{id} endpoint
      const res = await apiAddress.get(
        `/get/${id}?api-key=${process.env.NEXT_PUBLIC_ADRESS_API_KEY}`
      );

      const address = res.data;

      if (!address) {
        console.error("❌ No address returned");
        return;
      }

      // Dispatching the detailed data to your Redux store
      dispatch(
        updateProperty({
          postcode: address.postcode,
          // Often building name/number are separate; we prioritize building_name
          house_name_or_number: address.building_name || address.building_number || "",
          address_one: address.line_1,
          address_two: address.line_2,
          city: address.town_or_city,
          county: address.county,
          country: mapCountryToFormValue(address.country),
        })
      );

      // Clear validation errors for the fields we just filled
      setErrors((prev) => {
        const updatedErrors = { ...prev };
        delete updatedErrors.postcode;
        delete updatedErrors.house_name_or_number;
        delete updatedErrors.address_one;
        delete updatedErrors.city;
        return updatedErrors;
      });

    } catch (error) {
      console.error("Error fetching detailed address:", error);
      // Optional: add a toast or error state here to notify the user
    } finally {
      setIsFetchingAddress(false);
    }
  };



  // Helper function to map country values from API to form values
  const mapCountryToFormValue = (country: string | undefined) => {
    if (!country) return null;

    const countryLower = country.toLowerCase();
    if (countryLower.includes("england")) return "ENGLAND";
    if (countryLower.includes("scotland")) return "SCOTLAND";
    if (countryLower.includes("wales")) return "WALES";
    if (countryLower.includes("northern ireland")) return "NORTHERN_IRELAND";
    if (countryLower.includes("united kingdom") || countryLower.includes("uk"))
      return "UNITED_KINGDOM";

    return null;
  };

  return (
    <div>
      {isFetchingAddress && (
        <div className="text-center mb-3">
          <Spinner size="sm" color="primary" /> Loading address details...
        </div>
      )}

      <Row>
        <Col sm={12}>
          <Row>
            <Col sm={12}>
              <FormGroup>
                <Label for="postcode">
                  Postcode <span className="text-danger">*</span>
                </Label>
                <InputGroup>
                  <Input
                    name="postcode"
                    className="form-control border-primary"
                    onChange={handleChange}
                    value={propertyState.postcode}
                    maxLength={10}
                    required
                    disabled={isFetchingAddress}
                  />
                  <Button
                    color="primary"
                    className="mx-2"
                    onClick={handleCopyMainAddress}
                    type="button"
                    disabled={
                      !applicantsData ||
                      applicantsData.length === 0 ||
                      isLoading ||
                      isFetchingAddress
                    }
                  >
                    Copy Main Address
                  </Button>
                  <Button
                    color="info"
                    type="button"
                    onClick={() => fetchAddressByPostcode(propertyState.postcode)}
                    disabled={isFetchingAddress}
                  >
                    Lookup
                  </Button>
                </InputGroup>
                {errors.postcode && (
                  <div className="text-danger">{errors.postcode}</div>
                )}
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={6}>
              <FormGroup>
                <Label for="house_name_or_number">
                  House Name or Number <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id="house_name_or_number"
                  name="house_name_or_number"
                  value={propertyState.house_name_or_number}
                  onChange={handleChange}
                  maxLength={255}
                  required
                  disabled={isFetchingAddress}
                />
                {errors.house_name_or_number && (
                  <div className="text-danger">
                    {errors.house_name_or_number}
                  </div>
                )}
              </FormGroup>
            </Col>

            <Col sm={6}>
              <FormGroup>
                <Label for="address_one">
                  Address 1 <span className="text-danger">*</span>
                </Label>
                <Input
                  id="address_one"
                  name="address_one"
                  value={propertyState.address_one}
                  onChange={handleChange}
                  maxLength={255}
                  required
                  disabled={isFetchingAddress}
                />
                {errors.address_one && (
                  <div className="text-danger">{errors.address_one}</div>
                )}
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={6}>
              <FormGroup>
                <Label for="address_two">Address 2</Label>
                <Input
                  id="address_two"
                  name="address_two"
                  value={propertyState.address_two}
                  onChange={handleChange}
                  maxLength={255}
                  disabled={isFetchingAddress}
                />
              </FormGroup>
            </Col>

            <Col sm={6}>
              <FormGroup>
                <Label for="city">
                  City <span className="text-danger">*</span>
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={propertyState.city}
                  onChange={handleChange}
                  maxLength={255}
                  required
                  disabled={isFetchingAddress}
                />
                {errors.city && (
                  <div className="text-danger">{errors.city}</div>
                )}
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={6}>
              <FormGroup>
                <Label for="county">County</Label>
                <Input
                  id="county"
                  name="county"
                  value={propertyState.county}
                  onChange={handleChange}
                  maxLength={255}
                  disabled={isFetchingAddress}
                />
              </FormGroup>
            </Col>

            <Col sm={6}>
              <FormGroup>
                <Label for="region">Region</Label>
                <Input
                  type="select"
                  id="region"
                  name="region"
                  value={propertyState.region || ""}
                  onChange={handleChange}
                  disabled={isFetchingAddress}
                >
                  <option value="">Please select a region</option>
                  <option value="NORTH">North</option>
                  <option value="NORTH_WEST">North West</option>
                  <option value="YORKSHIRE_AND_HUMBERSIDE">
                    Yorkshire and Humberside
                  </option>
                  <option value="EAST_MIDLANDS">East Midlands</option>
                  <option value="WEST_MIDLANDS">West Midlands</option>
                  <option value="EAST_ANGLIA">East Anglia</option>
                  <option value="LONDON">London</option>
                  <option value="SOUTH_EAST_NOT_LONDON">
                    South East (Not London)
                  </option>
                  <option value="SOUTH_WEST">South West</option>
                  <option value="WALES">Wales</option>
                  <option value="SCOTLAND">Scotland</option>
                  <option value="NORTHERN_IRELAND">Northern Ireland</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={6}>
              <FormGroup>
                <Label for="country">Country</Label>
                <Input
                  type="select"
                  id="country"
                  name="country"
                  value={propertyState.country || ""}
                  onChange={handleChange}
                  disabled={isFetchingAddress}
                >
                  <option value="">Please select a country</option>
                  <option value="UNITED_KINGDOM">United Kingdom</option>
                  <option value="ENGLAND">England</option>
                  <option value="SCOTLAND">Scotland</option>
                  <option value="WALES">Wales</option>
                  <option value="NORTHERN_IRELAND">Northern Ireland</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
        </Col>
      </Row>

      <PropertyAddressModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        addresses={addressList}
        onSelect={handleSelectAddress}
      />
    </div>
  );
};

export default AddressDetails;