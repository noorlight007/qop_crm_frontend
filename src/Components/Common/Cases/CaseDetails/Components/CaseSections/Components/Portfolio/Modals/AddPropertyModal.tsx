import { useGetPropertyEPCRatingMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Common/PropertyEPCRating";
import {
  useAddPropertyDetailsMutation,
  useGetPortfolioApplicantsQuery,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Portfolio/PortfolioApi";
import { useUpdateSectionCompleteStatusMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SectionCompleteApi";
import { apiAddress } from "@/services/third-party-api";
import { AddPortfolioContentModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/PortfolioTypes";
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
  const [isLimitedCompany, setIsLimitedCompany] = useState(false);

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

  // Scroll to the first DOM element associated with an API error key
  const scrollToFirstError = (errorsObj: Record<string, string>) => {
    try {
      const keys = Object.keys(errorsObj || {});
      if (!keys.length) return;

      const snakeToCamel = (s: string) =>
        s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

      for (const rawKey of keys) {
        if (!rawKey) continue;
        const candidates = [
          rawKey,
          rawKey.replace(/\./g, "_"),
          rawKey.replace(/_/g, "."),
          snakeToCamel(rawKey.replace(/\./g, "_")),
        ];

        for (const id of candidates) {
          if (!id) continue;

          const elById = document.getElementById(id);
          if (elById) {
            (elById as HTMLElement).scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            (elById as HTMLElement).focus?.();
            return;
          }

          const elByName = document.querySelector(`[name="${id}"]`);
          if (elByName) {
            (elByName as HTMLElement).scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            (elByName as HTMLElement).focus?.();
            return;
          }
        }
      }
    } catch (e) {
      // non-fatal
      // eslint-disable-next-line no-console
      console.warn("scrollToFirstError failed", e);
    }
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

    // Add validation for applicants (not required for limited companies)
    // if (!isLimitedCompany && selectedApplicants.length === 0) {
    //   toast.error("Please select at least one applicant!");
    //   return;
    // }

    const formData = new FormData(e.currentTarget);
    try {
      const payload = {
        applicant_ids: selectedApplicants.map((id) => Number(id)),
        postcode: formData.get("postcode"),
        house_name_or_number: formData.get("house_name_or_number"),
        address_1: formData.get("address_1"),
        address_2: formData.get("address_2") || null,
        city: formData.get("city"),
        county: formData.get("county") || null,
        country: formData.get("country"),
        latitude: mapCoords?.lat ?? 0,
        longitude: mapCoords?.lng ?? 0,
        property_value: formData.get("property_value"),
        current_mortgage_balance: formData.get("current_mortgage_balance"),
        monthly_rental_income: formData.get("monthly_rental_income"),
        monthly_mortgage_payment: formData.get("monthly_mortgage_payment"),
        value_at_purchase: formData.get("value_at_purchase"),
        date_purchased: formData.get("date_purchased") || null,
        is_hmo: formData.get("is_hmo") === "on",
        is_mufb: formData.get("is_mufb") === "on",
        mortgage_lender: formData.get("mortgage_lender") || null,
        repayment_type: formData.get("repayment_type") || null,
        to_be_repaid: formData.get("to_be_repaid") || null,
        current_rate: formData.get("current_rate") || null,
        rate_type: formData.get("rate_type") || null,
        current_rate_end_date: formData.get("current_rate_end_date") || null,
        erc_end_date: formData.get("erc_end_date") || null,
        account_number: formData.get("account_number"),
        property_type: formData.get("property_type"),
        ownership: formData.get("ownership") || null,
        leasehold: formData.get("leasehold") || null,
        year_built: formData.get("year_built") || null,
        number_of_bedrooms: formData.get("number_of_bedrooms") || null,
        remaining_mortgage_term:
          formData.get("remaining_mortgage_term") || null,
        is_limited_company: formData.get("is_limited_company") === "on",
        company_name: formData.get("company_name") || null,
        epc_rating: formData.get("epc_rating") || null,
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
        // Scroll to the first field that has a server-side validation error
        scrollToFirstError(parsed);
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
      if (Object.keys(parsed).length) {
        setErrors(parsed);
        scrollToFirstError(parsed);
      }
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

  // if switching to limited company clear any selected applicants since they're irrelevant
  useEffect(() => {
    if (isLimitedCompany) {
      setSelectedApplicants([]);
    }
  }, [isLimitedCompany]);

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
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    name="is_limited_company"
                    className="border-primary"
                    checked={isLimitedCompany}
                    onChange={(e) => setIsLimitedCompany(e.target.checked)}
                  />
                  Is Limited Company
                </Label>
                {getFieldError("is_limited_company") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("is_limited_company")}
                  </small>
                )}
              </FormGroup>
            </Col>
            {isLimitedCompany && (
              <Col md={6}>
                <FormGroup>
                  <Label for="company_name">Company Name</Label>
                  <Input id="company_name" name="company_name" type="text" />
                  {getFieldError("company_name") && (
                    <small
                      className="text-danger"
                      style={{ marginTop: "5px", display: "block" }}
                    >
                      {getFieldError("company_name")}
                    </small>
                  )}
                </FormGroup>
              </Col>
            )}
            {isLimitedCompany === false && (
              <Col md={6}>
                <FormGroup>
                  <Label for="applicants">Applicant&apos;s</Label>
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
                          className="text-end p-1 bg-light sticky-top border-bottom dropdown_close"
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
            )}

            <Col md={12}>
              <FormGroup>
                <Label for="postcode">Postcode<span className="text-danger">*</span></Label>
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

            <Col md={4}>
              <FormGroup>
                <Label for="house_name_or_number">House Name Or Number<span className="text-danger">*</span></Label>
                <Input
                  id="house_name_or_number"
                  name="house_name_or_number"
                  type="text"
                  value={houseNumber}
                  onChange={(e) =>
                    handleManualAddressChange(setHouseNumber, e.target.value)
                  }
                  required
                />
                {getFieldError("house_name_or_number") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("house_name_or_number")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="address_1">Address 1<span className="text-danger">*</span></Label>
                <Input
                  id="address_1"
                  name="address_1"
                  type="text"
                  value={address1}
                  onChange={(e) =>
                    handleManualAddressChange(setAddress1, e.target.value)
                  }
                  required
                />
                {getFieldError("address_1") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("address_1")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="address_2">Address 2</Label>
                <Input
                  id="address_2"
                  name="address_2"
                  type="text"
                  value={address2}
                  onChange={(e) =>
                    handleManualAddressChange(setAddress2, e.target.value)
                  }
                />
                {getFieldError("address_2") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("address_2")}
                  </small>
                )}
              </FormGroup>
            </Col>

            <Col md={4}>
              <FormGroup>
                <Label for="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  value={city}
                  onChange={(e) =>
                    handleManualAddressChange(setCity, e.target.value)
                  }
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
                <Label for="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  type="text"
                  value={country}
                  onChange={(e) =>
                    handleManualAddressChange(setCountry, e.target.value)
                  }
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

            <hr className="border-secondary" />

            <Col md={4}>
              <FormGroup>
                <Label for="property_value">Property Value</Label>
                <Input
                  id="property_value"
                  name="property_value"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  onInput={limitDecimalPlaces}
                />
                {getFieldError("property_value") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("property_value")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="current_mortgage_balance">
                  Current Mortgage Balance
                </Label>
                <Input
                  id="current_mortgage_balance"
                  name="current_mortgage_balance"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  onInput={limitDecimalPlaces}
                />
                {getFieldError("current_mortgage_balance") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("current_mortgage_balance")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="monthly_rental_income">Monthly Rental Income</Label>
                <Input
                  id="monthly_rental_income"
                  name="monthly_rental_income"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  onInput={limitDecimalPlaces}
                />
                {getFieldError("monthly_rental_income") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("monthly_rental_income")}
                  </small>
                )}
              </FormGroup>
            </Col>

            <Col md={4}>
              <FormGroup>
                <Label for="monthly_mortgage_payment">
                  Monthly Mortgage Payment
                </Label>
                <Input
                  id="monthly_mortgage_payment"
                  name="monthly_mortgage_payment"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  onInput={limitDecimalPlaces}
                />
                {getFieldError("monthly_mortgage_payment") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("monthly_mortgage_payment")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="value_at_purchase">Value At Purchase</Label>
                <Input
                  id="value_at_purchase"
                  name="value_at_purchase"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  onInput={limitDecimalPlaces}
                />
                {getFieldError("value_at_purchase") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("value_at_purchase")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="date_purchased">Date Purchased</Label>
                <Input id="date_purchased" name="date_purchased" type="date" />
                {getFieldError("date_purchased") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("date_purchased")}
                  </small>
                )}
              </FormGroup>
            </Col>

            <Col md={4}>
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    name="is_hmo"
                    className="border-primary"
                  />
                  Is the property an HMO
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    name="is_mufb"
                    className="border-primary"
                  />
                  Is the property a MUFB
                </Label>
              </FormGroup>
              {getFieldError("is_hmo") && (
                <small
                  className="text-danger"
                  style={{ marginTop: "5px", display: "block" }}
                >
                  {getFieldError("is_hmo")}
                </small>
              )}
              {getFieldError("is_mufb") && (
                <small
                  className="text-danger"
                  style={{ marginTop: "5px", display: "block" }}
                >
                  {getFieldError("is_mufb")}
                </small>
              )}
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="mortgage_lender">Mortgage Lender</Label>
                <Input
                  id="mortgage_lender"
                  name="mortgage_lender"
                  type="text"
                />
                {getFieldError("mortgage_lender") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("mortgage_lender")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="repayment_type">Repayment Type</Label>
                <Input id="repayment_type" name="repayment_type" type="text" />
                {getFieldError("repayment_type") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("repayment_type")}
                  </small>
                )}
              </FormGroup>
            </Col>

            <Col md={4}>
              <FormGroup>
                <Label for="current_rate">Current Rate (%)</Label>
                <Input
                  id="current_rate"
                  name="current_rate"
                  type="number"
                  step="0.01"
                  min="0"
                  inputMode="decimal"
                  onInput={limitDecimalPlaces}
                />
                {getFieldError("current_rate") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("current_rate")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="rate_type">Rate Type</Label>
                <Input id="rate_type" name="rate_type" type="select">
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
                {getFieldError("rate_type") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("rate_type")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="to_be_repaid">To Be Repaid</Label>
                <Input
                  id="to_be_repaid"
                  name="to_be_repaid"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  onInput={limitDecimalPlaces}
                />
                {getFieldError("to_be_repaid") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("to_be_repaid")}
                  </small>
                )}
              </FormGroup>
            </Col>

            <Col md={4}>
              <FormGroup>
                <Label for="current_rate_end_date">Current Rate End Date</Label>
                <Input
                  id="current_rate_end_date"
                  name="current_rate_end_date"
                  type="date"
                />
                {getFieldError("current_rate_end_date") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("current_rate_end_date")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="erc_end_date">ERC End Date</Label>
                <Input id="erc_end_date" name="erc_end_date" type="date" />
                {getFieldError("erc_end_date") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("erc_end_date")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="account_number">Account Number</Label>
                <Input id="account_number" name="account_number" type="text" />
                {getFieldError("account_number") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("account_number")}
                  </small>
                )}
              </FormGroup>
            </Col>

            <Col md={4}>
              <FormGroup>
                <Label for="property_type">Property Type</Label>
                <Input id="property_type" name="property_type" type="text" />
                {getFieldError("property_type") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("property_type")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="ownership">Ownership</Label>
                <Input id="ownership" name="ownership" type="text" />
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

            <Col md={4}>
              <FormGroup>
                <Label for="year_built">Year Built</Label>
                <Input
                  id="year_built"
                  name="year_built"
                  type="number"
                  step="1"
                />
                {getFieldError("year_built") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("year_built")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="number_of_bedrooms">Number of Bedrooms</Label>
                <Input
                  id="number_of_bedrooms"
                  name="number_of_bedrooms"
                  type="number"
                  step="1"
                />
                {getFieldError("number_of_bedrooms") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("number_of_bedrooms")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="remaining_mortgage_term">
                  Remaining Mortgage Term
                </Label>
                <Input
                  id="remaining_mortgage_term"
                  name="remaining_mortgage_term"
                  type="number"
                  step="1"
                  placeholder="Years"
                />
                {getFieldError("remaining_mortgage_term") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("remaining_mortgage_term")}
                  </small>
                )}
              </FormGroup>
            </Col>

            <Col md={4}>
              <FormGroup>
                <Label for="epc_rating">EPC Rating</Label>
                <Input
                  id="epc_rating"
                  name="epc_rating"
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
                {getFieldError("epc_rating") && (
                  <small
                    className="text-danger"
                    style={{ marginTop: "5px", display: "block" }}
                  >
                    {getFieldError("epc_rating")}
                  </small>
                )}
              </FormGroup>
            </Col>

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
