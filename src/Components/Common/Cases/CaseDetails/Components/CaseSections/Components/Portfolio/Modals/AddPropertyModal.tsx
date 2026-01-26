import { useGetPropertyEPCRatingMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Common/PropertyEPCRating";
import {
  useAddPropertyDetailsMutation,
  useGetPortfolioApplicantsQuery,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Portfolio/PortfolioApi";
import { useUpdateSectionCompleteStatusMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SectionCompleteApi";
import { apiAddress } from "@/services/third-party-api";
import formatChoiceFieldValue from "@/utils/formatters";
import { limitDecimalPlaces } from "@/utils/inputHandlers";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { X } from "react-feather";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import GetAddressModal from "../../../CommonModals/GetAddressModal";
import "../PortfolioContent.css";

interface AddPortfolioContentModalProps {
  isOpen: boolean;
  toggle: () => void;
}

const AddPropertyModal: React.FC<AddPortfolioContentModalProps> = ({
  isOpen,
  toggle,
}) => {
  const params = useParams();
  const { casealias } = params;
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [addPropertyDetails, { isLoading: isAddPropertiesLoading }] =
    useAddPropertyDetailsMutation();
  const [updateSectionCompleteStatus] =
    useUpdateSectionCompleteStatusMutation();
  const { data, isLoading: isGetApplicantsLoading } =
    useGetPortfolioApplicantsQuery({
      case_alias: casealias,
    });
  const [postcode, setPostcode] = useState("");
  const [fetchedEpcRating, setFetchedEpcRating] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressList, setAddressList] = useState<any[]>([]);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const [isSearchingPostcode, setIsSearchingPostcode] = useState(false);

  const [houseNumber, setHouseNumber] = useState<string>("");
  const [address1, setAddress1] = useState<string>("");
  const [address2, setAddress2] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [county, setCounty] = useState<string>("");
  const [country, setCountry] = useState<string>("");

  const LONDON_CENTER = { lat: 51.5074, lng: -0.1278 };
  const DEFAULT_ZOOM = 10;
  const DETAIL_ZOOM = 16;
  const [currentZoom, setCurrentZoom] = useState(DEFAULT_ZOOM);
  const [mapCoords, setMapCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const camelToSnake = (str: string) =>
    str
      .replace(/([A-Z])/g, "_$1")
      .toLowerCase()
      .replace(/^_/, "");

  const parseApiErrors = (err: any): Record<string, string> => {
    if (!err) return {};

    const collect = (value: any, prefix = ""): Array<[string, string]> => {
      if (value == null) return [];

      if (typeof value === "string") return [[prefix || "error", value]];

      if (Array.isArray(value))
        return value.flatMap((v) => collect(v, prefix || "error"));

      if (typeof value === "object") {
        return Object.entries(value).flatMap(([k, v]) =>
          collect(v, prefix ? `${prefix}.${k}` : k),
        );
      }

      return [[prefix || "error", String(value)]];
    };

    let payload = err?.data ?? err;

    if (err?.response?.data) payload = err.response.data;

    const entries = collect(payload);

    const result: Record<string, string> = {};
    for (const [k, v] of entries) {
      // remove numeric codes like "400, " at start
      const sanitized = v.replace(/^\d+[,\s]*/, "");
      const key = k.replace(/\.(\d+)$/, "");
      result[key] = sanitized;
    }

    return result;
  };

  const getFieldError = (name: string) => {
    if (!errors) return undefined;

    if (errors[name]) return errors[name];
    const snake = camelToSnake(name);
    if (errors[snake]) return errors[snake];

    // common alias mappings
    const aliases: Record<string, string[]> = {
      houseNumber: ["house_name_or_number"],
      applicants: ["applicant_ids"],
      propertyValue: ["property_value"],
      currentMortgageBalance: ["current_mortgage_balance"],
      monthlyRental: ["monthly_rental_income"],
      monthlyPayment: ["monthly_mortgage_payment"],
      valueAtPurchase: ["value_at_purchase"],
      numberOfBedrooms: ["number_of_bedrooms"],
      remainingMortgageTerm: ["remaining_mortgage_term"],
      isLimitedCompany: ["is_limited_company"],
    };

    const alt = aliases[name] || aliases[snake] || [];
    for (const a of alt) if (errors[a]) return errors[a];

    return undefined;
  };

  const getGoogleMapEmbedUrl = (
    lat: number,
    lng: number,
    zoom: number,
  ): string => {
    return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
  };

  const [getPropertyEPCRating, { isLoading: isEpcLoading }] =
    useGetPropertyEPCRatingMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Add validation for applicants
    if (selectedApplicants.length === 0) {
      toast.error("Please select at least one applicant!");
      return;
    }

    const formData = new FormData(e.currentTarget);
    try {
      const payload = {
        applicant_ids: selectedApplicants.map((id) => Number(id)),
        postcode: formData.get("postcode"),
        house_name_or_number: formData.get("houseNumber"),
        address_1: formData.get("address1"),
        address_2: formData.get("address2") || null,
        city: formData.get("city"),
        county: formData.get("county") || null,
        country: formData.get("country"),
        latitude: mapCoords?.lat ?? 0,
        longitude: mapCoords?.lng ?? 0,
        property_value: formData.get("propertyValue"),
        current_mortgage_balance: formData.get("currentMortgageBalance"),
        monthly_rental_income: formData.get("monthlyRental"),
        monthly_mortgage_payment: formData.get("monthlyPayment"),
        value_at_purchase: formData.get("valueAtPurchase"),
        date_purchased: formData.get("datePurchased") || null,
        is_hmo: formData.get("isHMO") === "on",
        is_mufb: formData.get("isMUFB") === "on",
        mortgage_lender: formData.get("mortgageLender") || null,
        repayment_type: formData.get("repaymentType") || null,
        to_be_repaid: formData.get("toBeRepaid") || null,
        current_rate: formData.get("currentRate") || null,
        rate_type: formData.get("rateType") || null,
        current_rate_end_date: formData.get("currentRateEndDate") || null,
        erc_end_date: formData.get("ercEndDate") || null,
        account_number: formData.get("accountNumber"),
        property_type: formData.get("propertyType"),
        ownership: formData.get("ownership") || null,
        leasehold: formData.get("leasehold") || null,
        year_built: formData.get("yearBuilt") || null,
        number_of_bedrooms: formData.get("numberOfBedrooms") || null,
        remaining_mortgage_term: formData.get("remainingMortgageTerm") || null,
        is_limited_company: true,
        epc_rating: formData.get("epcRating") || null,
        note: formData.get("note") || null,
      };
      const response = await addPropertyDetails({
        case_alias: casealias,
        propertyDetails: payload,
      });

      if (response.data) {
        setErrors({});
        toast.success("Property added successfully!");
        try {
          await updateSectionCompleteStatus({
            case_alias: casealias,
            section_data: { is_portfolio: true },
          });
        } catch (err) {
          console.error("Failed to update section complete status:", err);
        }
        // Portfolio summary will be refreshed via RTK Query tag invalidation.
        toggle();
      } else if (response.error) {
        const parsed = parseApiErrors(
          (response.error as any)?.data ?? response.error,
        );
        setErrors(parsed);
        const first =
          Object.values(parsed)[0] ||
          (response.error as any)?.data?.detail ||
          "Failed to add property";
        toast.error(String(first));
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Failed to add property:", error);
      const parsed = parseApiErrors(error);
      if (Object.keys(parsed).length) setErrors(parsed);
      const first =
        Object.values(parsed)[0] || "Failed to add property. Please try again!";
      toast.error(String(first));
    }
  };

  useEffect(() => {
    if (!isOpen) setErrors({});
  }, [isOpen]);

  const handleSelect = (id: string) => {
    if (!selectedApplicants.includes(id)) {
      setSelectedApplicants([...selectedApplicants, id]);
    }
  };

  const handleManualAddressChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string,
  ) => {
    setter(value);
    // If any address field is manually touched, reset coordinates to 0
    setMapCoords({
      lat: LONDON_CENTER.lat,
      lng: LONDON_CENTER.lng,
    });
    setCurrentZoom(DEFAULT_ZOOM);
  };

  const removeApplicant = (id: string) => {
    setSelectedApplicants(selectedApplicants.filter((appId) => appId !== id));
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsDropdownOpen(false);
    }

    if (isDropdownOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  // Filter out selected applicants from the dropdown options
  const filteredData = data?.filter(
    (applicant: any) => !selectedApplicants.includes(applicant.id.toString()),
  );

  const getAddressErrorMessage = (err: any) => {
    if (!err) return "Unknown error";

    if (typeof err === "string") return err;

    if (typeof err?.data === "string") return err.data;

    const collect = (value: any): string[] => {
      if (value == null) return [];

      if (typeof value === "string") return [value];

      if (Array.isArray(value))
        return value.map((v) =>
          typeof v === "string" ? v : JSON.stringify(v),
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
        `/autocomplete/${postcode}?api-key=${process.env.NEXT_PUBLIC_GET_ADDRESS_API_KEY}`,
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

    try {
      const res = await apiAddress.get(
        `/get/${id}?api-key=${process.env.NEXT_PUBLIC_GET_ADDRESS_API_KEY}`,
      );

      const address = res.data;

      if (!address) {
        console.error("❌ No address returned");
        return;
      }

      setHouseNumber(address.building_number || address.building_name || "");
      setAddress1(address.line_1 || "");
      setAddress2(address.line_2 || "");
      setCity(address.town_or_city || "");
      setCounty(address.county || "");
      setCountry(address.country || "");

      if (address.latitude && address.longitude) {
        setMapCoords({
          lat: Number(address.latitude),
          lng: Number(address.longitude),
        });
        setCurrentZoom(DETAIL_ZOOM);
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
      setFetchedEpcRating(epcResponse.epc_rating);
    } catch (error) {
      console.error("Error fetching detailed address:", error);
    } finally {
      setIsFetchingAddress(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setMapCoords(null);
      setPostcode("");
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">Add Property</span>
      </ModalHeader>
      <ModalBody className="p-4">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col sm={12}>
              <Label className="fw-semibold mb-2">Location Preview</Label>
              <div className="border rounded overflow-hidden shadow-sm mb-3">
                <iframe
                  src={
                    mapCoords
                      ? getGoogleMapEmbedUrl(
                          mapCoords.lat,
                          mapCoords.lng,
                          currentZoom,
                        )
                      : getGoogleMapEmbedUrl(
                          LONDON_CENTER.lat,
                          LONDON_CENTER.lng,
                          DEFAULT_ZOOM,
                        )
                  }
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  loading="lazy"
                  title="Solicitor Location"
                />
              </div>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="applicants">Applicant/s*</Label>
                <div className="position-relative" ref={dropdownRef}>
                  {/* Custom Input Field */}
                  <div
                    className="form-control d-flex flex-wrap align-items-center position-relative custom_input_field"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {selectedApplicants.length === 0 && (
                      <span className="text-muted">Select applicants...</span>
                    )}
                    {selectedApplicants.map((id) => {
                      const applicant = data.find(
                        (a: any) => a.id === Number(id),
                      );
                      return (
                        <span
                          key={id}
                          className="badge bg-primary me-1 mb-1 d-flex align-items-center"
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeApplicant(id);
                          }}
                        >
                          {applicant?.title
                            ? formatChoiceFieldValue(applicant?.title)
                            : ""}{" "}
                          {applicant?.first_name} {applicant?.middle_name}{" "}
                          {applicant?.last_name}
                          <span className="ms-1">x</span>
                        </span>
                      );
                    })}
                    <i
                      className="fa-solid fa-angle-down position-absolute"
                      style={{
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    ></i>
                  </div>

                  {/* Dropdown */}
                  {isDropdownOpen && (
                    <div className="position-absolute w-100 bg-white border mt-1 rounded-2 dropdown_style">
                      {/* Close Button - Moved to top */}
                      <div
                        className="text-end p-1 bg-primary sticky-top border-bottom dropdown_close"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="fw-bold fs-5">
                          <X size={20} />
                        </span>
                      </div>
                      {/* Dropdown Options */}
                      {filteredData?.map((applicant: any) => (
                        <div
                          key={applicant.id}
                          className="px-2 py-1 dropdown_item"
                          onClick={() => handleSelect(applicant.id)}
                        >
                          {applicant?.title
                            ? formatChoiceFieldValue(applicant?.title)
                            : ""}{" "}
                          {applicant?.first_name} {applicant?.middle_name}{" "}
                          {applicant?.last_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {(getFieldError("applicant_ids") ||
                  getFieldError("applicants")) && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("applicant_ids") ||
                      getFieldError("applicants")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="postcode">Postcode*</Label>
                <InputGroup className="d-flex align-items-center gap-2">
                  <Input
                    id="postcode"
                    type="text"
                    name="postcode"
                    className="rounded"
                    value={postcode}
                    onChange={(e) =>
                      handleManualAddressChange(setPostcode, e.target.value)
                    }
                    required
                  />
                  <Button
                    color="primary"
                    type="button"
                    className="text-nowrap"
                    onClick={() => fetchAddressByPostcode(postcode)}
                    disabled={isFetchingAddress || isSearchingPostcode}
                  >
                    {isSearchingPostcode ? "Loading..." : "Lookup"}
                  </Button>
                </InputGroup>
                {getFieldError("postcode") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("postcode")}
                  </small>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="houseNumber">House Name Or Number*</Label>
                <Input
                  id="houseNumber"
                  name="houseNumber"
                  type="text"
                  value={houseNumber}
                  onChange={(e) =>
                    handleManualAddressChange(setHouseNumber, e.target.value)
                  }
                  required
                />
                {getFieldError("houseNumber") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("houseNumber")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="address1">Address 1*</Label>
                <Input
                  id="address1"
                  name="address1"
                  type="text"
                  value={address1}
                  onChange={(e) =>
                    handleManualAddressChange(setAddress1, e.target.value)
                  }
                  required
                />
                {getFieldError("address1") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("address1")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="address2">Address 2</Label>
                <Input
                  id="address2"
                  name="address2"
                  type="text"
                  value={address2}
                  onChange={(e) =>
                    handleManualAddressChange(setAddress2, e.target.value)
                  }
                />
                {getFieldError("address2") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("address2")}
                  </small>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="city">City*</Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  value={city}
                  onChange={(e) =>
                    handleManualAddressChange(setCity, e.target.value)
                  }
                  required
                />
                {getFieldError("city") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("city")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="county">County</Label>
                <Input
                  id="county"
                  name="county"
                  type="text"
                  value={county}
                  onChange={(e) =>
                    handleManualAddressChange(setCounty, e.target.value)
                  }
                />
                {getFieldError("county") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("county")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="country">Country*</Label>
                <Input
                  id="country"
                  name="country"
                  type="text"
                  value={country}
                  onChange={(e) =>
                    handleManualAddressChange(setCountry, e.target.value)
                  }
                  required
                />
                {getFieldError("country") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("country")}
                  </small>
                )}
              </FormGroup>
            </Col>
          </Row>
          <hr className="border-secondary" />
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="propertyValue">Property Value*</Label>
                <Input
                  id="propertyValue"
                  name="propertyValue"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  onInput={limitDecimalPlaces}
                  required
                />
                {getFieldError("propertyValue") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("propertyValue")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="currentMortgageBalance">
                  Current Mortgage Balance*
                </Label>
                <Input
                  id="currentMortgageBalance"
                  name="currentMortgageBalance"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  onInput={limitDecimalPlaces}
                  required
                />
                {getFieldError("currentMortgageBalance") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("currentMortgageBalance")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="monthlyRental">Monthly Rental Income*</Label>
                <Input
                  id="monthlyRental"
                  name="monthlyRental"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  onInput={limitDecimalPlaces}
                  required
                />
                {getFieldError("monthlyRental") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("monthlyRental")}
                  </small>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="monthlyPayment">Monthly Mortgage Payment</Label>
                <Input
                  id="monthlyPayment"
                  name="monthlyPayment"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  onInput={limitDecimalPlaces}
                />
                {getFieldError("monthlyPayment") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("monthlyPayment")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="valueAtPurchase">Value At Purchase</Label>
                <Input
                  id="valueAtPurchase"
                  name="valueAtPurchase"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  onInput={limitDecimalPlaces}
                />
                {getFieldError("valueAtPurchase") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("valueAtPurchase")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="datePurchased">Date Purchased</Label>
                <Input id="datePurchased" name="datePurchased" type="date" />
                {getFieldError("datePurchased") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("datePurchased")}
                  </small>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    name="isHMO"
                    className="border-primary"
                  />
                  Is the property an HMO
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    name="isMUFB"
                    className="border-primary"
                  />
                  Is the property a MUFB
                </Label>
              </FormGroup>
              {getFieldError("isHMO") && (
                <small
                  className="text-danger"
                  style={{ marginTop: "5px", display: "block" }}
                >
                  {getFieldError("isHMO")}
                </small>
              )}
              {getFieldError("isMUFB") && (
                <small
                  className="text-danger"
                  style={{ marginTop: "5px", display: "block" }}
                >
                  {getFieldError("isMUFB")}
                </small>
              )}
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="mortgageLender">Mortgage Lender</Label>
                <Input id="mortgageLender" name="mortgageLender" type="text" />
                {getFieldError("mortgageLender") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("mortgageLender")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="repaymentType">Repayment Type</Label>
                <Input id="repaymentType" name="repaymentType" type="text" />
                {getFieldError("repaymentType") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("repaymentType")}
                  </small>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="currentRate">Current Rate (%)</Label>
                <Input
                  id="currentRate"
                  name="currentRate"
                  type="number"
                  step="0.01"
                  min="0"
                  inputMode="decimal"
                  onInput={limitDecimalPlaces}
                />
                {getFieldError("currentRate") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("currentRate")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="rateType">Rate Type</Label>
                <Input id="rateType" name="rateType" type="select">
                  <option value="">Select...</option>
                  <option value="UNKNOWN">Unknown</option>
                  <option value="FIXED">Fixed</option>
                  <option value="VARIABLE">Variable</option>
                  <option value="TRACKER">Tracker</option>
                  <option value="LIBOR_LINKED">Libor Linked</option>
                  <option value="DISCOUNT">Discount</option>
                  <option value="CAPPED">Capped</option>
                  <option value="ALL">All</option>
                  <option value="SVR">SVR</option>
                  <option value="OFFSET">Offset</option>
                  <option value="LIFETIME">Lifetime</option>
                  <option value="OTHER">Other</option>
                </Input>
                {getFieldError("rateType") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("rateType")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="toBeRepaid">To Be Repaid</Label>
                <Input
                  id="toBeRepaid"
                  name="toBeRepaid"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  onInput={limitDecimalPlaces}
                />
                {getFieldError("toBeRepaid") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("toBeRepaid")}
                  </small>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="currentRateEndDate">Current Rate End Date</Label>
                <Input
                  id="currentRateEndDate"
                  name="currentRateEndDate"
                  type="date"
                />
                {getFieldError("currentRateEndDate") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("currentRateEndDate")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="ercEndDate">ERC End Date</Label>
                <Input id="ercEndDate" name="ercEndDate" type="date" />
                {getFieldError("ercEndDate") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("ercEndDate")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="accountNumber">Account Number</Label>
                <Input id="accountNumber" name="accountNumber" type="text" />
                {getFieldError("accountNumber") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("accountNumber")}
                  </small>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="propertyType">Property Type*</Label>
                <Input
                  id="propertyType"
                  name="propertyType"
                  type="text"
                  required
                />
                {getFieldError("propertyType") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("propertyType")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="ownership">Ownership*</Label>
                <Input id="ownership" name="ownership" type="text" required />
                {getFieldError("ownership") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("ownership")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="leasehold">Leasehold</Label>
                <Input
                  id="leasehold"
                  name="leasehold"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  onInput={limitDecimalPlaces}
                  placeholder="Years"
                />
                {getFieldError("leasehold") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("leasehold")}
                  </small>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="yearBuilt">Year Built</Label>
                <Input id="yearBuilt" name="yearBuilt" type="number" step="1" />
                {getFieldError("yearBuilt") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("yearBuilt")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="numberOfBedrooms">Number of Bedrooms*</Label>
                <Input
                  id="numberOfBedrooms"
                  name="numberOfBedrooms"
                  type="number"
                  step="1"
                  required
                />
                {getFieldError("numberOfBedrooms") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("numberOfBedrooms")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="remainingMortgageTerm">
                  Remaining Mortgage Term
                </Label>
                <Input
                  id="remainingMortgageTerm"
                  name="remainingMortgageTerm"
                  type="number"
                  step="1"
                  placeholder="Years"
                />
                {getFieldError("remainingMortgageTerm") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("remainingMortgageTerm")}
                  </small>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    name="isLimitedCompany"
                    className="border-primary"
                  />
                  Is Limited Company
                </Label>
                {getFieldError("isLimitedCompany") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("isLimitedCompany")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="epcRating">EPC Rating</Label>
                <Input
                  id="epcRating"
                  name="epcRating"
                  type="text"
                  value={fetchedEpcRating}
                  onChange={(e) => setFetchedEpcRating(e.target.value)}
                  placeholder={isEpcLoading ? "Fetching..." : "e.g. C"}
                />
                {address1 && !fetchedEpcRating && !isEpcLoading && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    No EPC rating found for this address.
                  </small>
                )}
                {getFieldError("epcRating") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("epcRating")}
                  </small>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <FormGroup>
                <Label for="note">Note</Label>
                <Input id="note" name="note" type="textarea" rows={3} />
                {getFieldError("note") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("note")}
                  </small>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-end gap-2">
              <Button color="secondary" onClick={toggle}>
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                disabled={isAddPropertiesLoading}
              >
                {isAddPropertiesLoading ? "Adding..." : "Add Property"}
              </Button>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <GetAddressModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        addresses={addressList}
        onSelect={handleSelectAddress}
      />
    </Modal>
  );
};

export default AddPropertyModal;
