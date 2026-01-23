import { useGetApplicantsQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/ApplicantsDetails/ApplicantsDetailsApi";
import { useGetPropertyEPCRatingMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Common/PropertyEPCRating";
import { updateProperty } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/SecurityProperty/SecurityPropertyFormSlice";
import { RootState } from "@/Redux/Store";
import { apiAddress } from "@/services/third-party-api";
import { AddressDetailsProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/SecurityPropertyTypes";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
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
import GetAddressModal from "../../../../CommonModals/GetAddressModal";

const AddressDetails: React.FC<AddressDetailsProps> = ({ propertyData }) => {
  // Get case alias from URL params
  const params = useParams();
  const { casealias } = params;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressList, setAddressList] = useState<any[]>([]);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [isSearchingPostcode, setIsSearchingPostcode] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const LONDON_CENTER = { lat: 51.5074, lng: -0.1278 };
  const DEFAULT_ZOOM = 10;
  const DETAIL_ZOOM = 16;
  const [currentZoom, setCurrentZoom] = useState(DEFAULT_ZOOM);
  const [mapCoords, setMapCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

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

  const [getPropertyEPCRating, { isLoading: isEpcLoading }] =
    useGetPropertyEPCRatingMutation();

  useEffect(() => {
    if (propertyData) {
      const lat = Number(propertyData.latitude);
      const lng = Number(propertyData.longitude);

      dispatch(
        updateProperty({
          postcode: propertyData.postcode || "",
          house_name_or_number: propertyData.house_name_or_number || "",
          address_one: propertyData.address_one || "",
          address_two: propertyData.address_two || "",
          address_three: propertyData.address_three || "",
          address_four: propertyData.address_four || "",
          city: propertyData.city || "",
          county: propertyData.county || "",
          region: propertyData.region || null,
          country: propertyData.country || null,
          latitude: lat || null,
          longitude: lng || null,
        })
      );

      if (lat && lng) {
        setMapCoords({ lat, lng });
      }
    }
  }, [propertyData, dispatch]);

  useEffect(() => {
    const { latitude, longitude } = propertyState;

    if (latitude && longitude && Number(latitude) !== 0) {
      setMapCoords({
        lat: Number(latitude),
        lng: Number(longitude),
      });
      setCurrentZoom(DETAIL_ZOOM);
    } else {
      setMapCoords(LONDON_CENTER);
      setCurrentZoom(DEFAULT_ZOOM);
    }
  }, [propertyState.latitude, propertyState.longitude]);


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

    const addressFields = [
      "postcode",
      "house_name_or_number",
      "address_one",
      "address_two",
      "city",
      "county",
      "country",
    ];

    if (addressFields.includes(name)) {
      setMapCoords(LONDON_CENTER);
      setCurrentZoom(DEFAULT_ZOOM);
    }
    
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

  const getAddressErrorMessage = (err: any) => {
    if (!err) return "Unknown error";

    if (typeof err === "string") return err;

    if (typeof err?.data === "string") return err.data;

    const collect = (value: any): string[] => {
      if (value == null) return [];

      if (typeof value === "string") return [value];

      if (Array.isArray(value))
        return value.map((v) =>
          typeof v === "string" ? v : JSON.stringify(v)
        );

      if (typeof value === "object") {
        try {
          return Object.values(value).flatMap((v) => collect(v));
        } catch {
          return [String(value)];
        }
      }

      return [String(value)];
    };

    if (err?.data?.message) return String(err.data.message);

    if (err?.data && typeof err.data === "object") {
      const msgs = collect(err.data);

      if (msgs.length) return msgs.join(", ");
    }

    if (err?.error) return String(err.error);

    if (err?.message) {
      if (/status code/i.test(err.message)) return "Server returned an error";

      return String(err.message);
    }

    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  };

  const fetchAddressByPostcode = async (postcode: string) => {
    if (!postcode) return;
    setIsSearchingPostcode(true);

    try {
      const response = await apiAddress.get(
        `/autocomplete/${postcode}?api-key=${process.env.NEXT_PUBLIC_GET_ADDRESS_API_KEY}`
      );
      setAddressList(response.data.suggestions || []);
      setIsModalOpen(true);
    } catch (err: any) {
      const message = getAddressErrorMessage(err.response || err);
      toast.error(message);
    } finally {
      setIsSearchingPostcode(false);
    }
  };

  const buildFullAddressForEPC = (property: {
    address_one?: string;
    address_two?: string;
    address_three?: string;
    address_four?: string;
  }) => {
    return [
      property.address_one,
      property.address_two,
      property.address_three,
      property.address_four,
    ]
      .filter((line) => Boolean(line && line.trim()))
      .join(", ");
  };

  const handleSelectAddress = async (id: string) => {
    setIsFetchingAddress(true);
    setIsModalOpen(false);

    dispatch(updateProperty({ epc_rating: "" }));

    try {
      const res = await apiAddress.get(
        `/get/${id}?api-key=${process.env.NEXT_PUBLIC_GET_ADDRESS_API_KEY}`
      );

      const address = res.data;

      if (!address) {
        console.error("❌ No address returned");
        return;
      }

      dispatch(
        updateProperty({
          postcode: address.postcode,
          house_name_or_number:
            address.building_name || address.building_number || "",
          address_one: address.line_1,
          address_two: address.line_2,
          address_three: address.line_3,
          address_four: address.line_4,
          city: address.town_or_city,
          county: address.county,
          country: mapCountryToFormValue(address.country),
          latitude: address.latitude,
          longitude: address.longitude,
        })
      );

      if (address.latitude !== undefined && address.longitude !== undefined) {
        setMapCoords({ lat: address.latitude, lng: address.longitude });
        setCurrentZoom(DETAIL_ZOOM);
      } else {
        setMapCoords(LONDON_CENTER);
        setCurrentZoom(DEFAULT_ZOOM);
      }

      const fullAddressForEPC = buildFullAddressForEPC({
        address_one: address.line_1,
        address_two: address.line_2,
        address_three: address.line_3,
        address_four: address.line_4,
      });

      const epcResponse = await getPropertyEPCRating({
        case_alias: casealias as string,
        property_postcode: address.postcode,
        property_address: fullAddressForEPC,
      }).unwrap();

      dispatch(
        updateProperty({
          epc_rating: epcResponse.epc_rating,
        })
      );

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

  const getGoogleMapEmbedUrl = (lat: number, lng: number, zoom: number): string => {
    // We use maps.google.com/maps with 'q' for the pin and 't' for map type
    return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
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
          <Row className="my-4">
            <Col>
              <Label className="fw-semibold mb-2">Location Preview</Label>
              <div
                className="border rounded overflow-hidden shadow-sm mb-2"
                style={{ backgroundColor: "#f0f0f0" }}
              >
               <iframe
                  src={
                    // Check if mapCoords is valid and not at 0,0
                    mapCoords && mapCoords.lat !== 0 && mapCoords.lng !== 0
                      ? getGoogleMapEmbedUrl(mapCoords.lat, mapCoords.lng, currentZoom)
                      : getGoogleMapEmbedUrl(LONDON_CENTER.lat, LONDON_CENTER.lng, DEFAULT_ZOOM)
                  }
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Address Location Map"
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <FormGroup>
                <Label for="postcode">
                  Postcode <span className="text-danger">*</span>
                </Label>
                <InputGroup>
                  <Input
                    name="postcode"
                    className="form-control border-primary rounded"
                    onChange={handleChange}
                    value={propertyState.postcode}
                    maxLength={10}
                    required
                    disabled={isFetchingAddress}
                  />
                  <Button
                    color="primary"
                    type="button"
                    className="mx-2 rounded"
                    onClick={() =>
                      fetchAddressByPostcode(propertyState.postcode)
                    }
                    disabled={isFetchingAddress || isSearchingPostcode}
                  >
                    {isSearchingPostcode ? "Loading..." : "Lookup"}
                  </Button>
                  <Button
                    color="info"
                    className="rounded"
                    onClick={handleCopyMainAddress}
                    type="button"
                    outline
                    disabled={
                      !applicantsData ||
                      applicantsData.length === 0 ||
                      isLoading ||
                      isFetchingAddress
                    }
                  >
                    Copy Main Address
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

      <GetAddressModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        addresses={addressList}
        onSelect={handleSelectAddress}
      />
    </div>
  );
};

export default AddressDetails;
