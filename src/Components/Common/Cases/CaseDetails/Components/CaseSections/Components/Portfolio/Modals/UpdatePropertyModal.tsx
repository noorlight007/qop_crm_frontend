import { useGetPropertyEPCRatingMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Common/PropertyEPCRating";
import {
  useGetPortfolioApplicantsQuery,
  useUpdatePropertyDetailsMutation,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Portfolio/PortfolioApi";
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

interface UpdatePropertyModalProps {
  isOpen: boolean;
  toggle: () => void;
  property?: any | null;
}

const UpdatePropertyModal: React.FC<UpdatePropertyModalProps> = ({
  isOpen,
  toggle,
  property,
}) => {
  const params = useParams();
  const { casealias } = params;
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [updatePropertyDetails, { isLoading: isUpdating }] =
    useUpdatePropertyDetailsMutation();

  const { data: applicantsData } = useGetPortfolioApplicantsQuery({
    case_alias: casealias,
  });

  const [getPropertyEPCRating, { isLoading: isEpcLoading }] =
    useGetPropertyEPCRatingMutation();

  // Address state
  const [postcode, setPostcode] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [county, setCounty] = useState("");
  const [country, setCountry] = useState("");

  // Financial state
  const [propertyValue, setPropertyValue] = useState("");
  const [currentMortgageBalance, setCurrentMortgageBalance] = useState("");
  const [monthlyRental, setMonthlyRental] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [valueAtPurchase, setValueAtPurchase] = useState("");
  const [datePurchased, setDatePurchased] = useState("");
  const [toBeRepaid, setToBeRepaid] = useState("");

  // Mortgage details state
  const [mortgageLender, setMortgageLender] = useState("");
  const [repaymentType, setRepaymentType] = useState("");
  const [currentRate, setCurrentRate] = useState("");
  const [rateType, setRateType] = useState("");
  const [currentRateEndDate, setCurrentRateEndDate] = useState("");
  const [ercEndDate, setErcEndDate] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  // Property details state
  const [propertyType, setPropertyType] = useState("");
  const [ownership, setOwnership] = useState("");
  const [leasehold, setLeasehold] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [numberOfBedrooms, setNumberOfBedrooms] = useState("");
  const [remainingMortgageTerm, setRemainingMortgageTerm] = useState("");

  // Boolean state
  const [isHMO, setIsHMO] = useState(false);
  const [isMUFB, setIsMUFB] = useState(false);
  const [isLimitedCompany, setIsLimitedCompany] = useState(false);

  const [companyName, setCompanyName] = useState("");

  // Other state
  const [fetchedEpcRating, setFetchedEpcRating] = useState("");
  const [note, setNote] = useState("");
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [addressList, setAddressList] = useState<any[]>([]);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [isSearchingPostcode, setIsSearchingPostcode] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const LONDON_CENTER = { lat: 51.5074, lng: -0.1278 };
  const DEFAULT_ZOOM = 10;
  const DETAIL_ZOOM = 16;
  const [currentZoom, setCurrentZoom] = useState(DEFAULT_ZOOM);
  const [mapCoords, setMapCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // ─── Populate fields when modal opens with property data ───────────────────
  useEffect(() => {
    if (isOpen && property) {
      setPostcode(property.postcode || "");
      setHouseNumber(property.house_name_or_number || "");
      setAddress1(property.address_1 || "");
      setAddress2(property.address_2 || "");
      setCity(property.city || "");
      setCounty(property.county || "");
      setCountry(property.country || "");
      setPropertyValue(property.property_value ?? "");
      setCurrentMortgageBalance(property.current_mortgage_balance ?? "");
      setMonthlyRental(property.monthly_rental_income ?? "");
      setMonthlyPayment(property.monthly_mortgage_payment ?? "");
      setValueAtPurchase(property.value_at_purchase ?? "");
      setDatePurchased(property.date_purchased || "");
      setToBeRepaid(property.to_be_repaid ?? "");
      setMortgageLender(property.mortgage_lender || "");
      setRepaymentType(property.repayment_type || "");
      setCurrentRate(property.current_rate ?? "");
      setRateType(property.rate_type || "");
      setCurrentRateEndDate(property.current_rate_end_date || "");
      setErcEndDate(property.erc_end_date || "");
      setAccountNumber(property.account_number || "");
      setPropertyType(property.property_type || "");
      setOwnership(property.ownership || "");
      setLeasehold(property.leasehold ?? "");
      setYearBuilt(property.year_built ?? "");
      setNumberOfBedrooms(property.number_of_bedrooms ?? "");
      setRemainingMortgageTerm(property.remaining_mortgage_term ?? "");
      setIsHMO(property.is_hmo || false);
      setIsMUFB(property.is_mufb || false);
      setIsLimitedCompany(property.is_limited_company || false);
      setCompanyName(property.company_name || "");
      setFetchedEpcRating(property.epc_rating || "");
      setNote(property.note || "");
      setSelectedApplicants(
        property.applicant?.map((a: any) => String(a.id)) || [],
      );
      if (property.latitude && property.longitude) {
        setMapCoords({ lat: property.latitude, lng: property.longitude });
        setCurrentZoom(DETAIL_ZOOM);
      }
    }

    if (!isOpen) {
      setPostcode("");
      setHouseNumber("");
      setAddress1("");
      setAddress2("");
      setCity("");
      setCounty("");
      setCountry("");
      setPropertyValue("");
      setCurrentMortgageBalance("");
      setMonthlyRental("");
      setMonthlyPayment("");
      setValueAtPurchase("");
      setDatePurchased("");
      setToBeRepaid("");
      setMortgageLender("");
      setRepaymentType("");
      setCurrentRate("");
      setRateType("");
      setCurrentRateEndDate("");
      setErcEndDate("");
      setAccountNumber("");
      setPropertyType("");
      setOwnership("");
      setLeasehold("");
      setYearBuilt("");
      setNumberOfBedrooms("");
      setRemainingMortgageTerm("");
      setIsHMO(false);
      setIsMUFB(false);
      setIsLimitedCompany(false);
      setCompanyName("");
      setFetchedEpcRating("");
      setNote("");
      setSelectedApplicants([]);
      setMapCoords(null);
      setErrors({});
    }
  }, [isOpen, property]);

  // ─── Dropdown close on outside click / escape ──────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setIsDropdownOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDropdownOpen(false);
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  // ─── Helpers ───────────────────────────────────────────────────────────────
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
      if (typeof value === "object")
        return Object.entries(value).flatMap(([k, v]) =>
          collect(v, prefix ? `${prefix}.${k}` : k),
        );
      return [[prefix || "error", String(value)]];
    };
    let payload = err?.data ?? err;
    if (err?.response?.data) payload = err.response.data;
    const result: Record<string, string> = {};
    for (const [k, v] of collect(payload)) {
      result[k.replace(/\.(\d+)$/, "")] = v.replace(/^\d+[,\s]*/, "");
    }
    return result;
  };

  const scrollToFirstError = (errorsObj: Record<string, string>) => {
    try {
      const snakeToCamel = (s: string) =>
        s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      for (const rawKey of Object.keys(errorsObj || {})) {
        if (!rawKey) continue;
        const candidates = [
          rawKey,
          rawKey.replace(/\./g, "_"),
          rawKey.replace(/_/g, "."),
          snakeToCamel(rawKey.replace(/\./g, "_")),
        ];
        for (const id of candidates) {
          const el =
            document.getElementById(id) ||
            document.querySelector(`[name="${id}"]`);
          if (el) {
            (el as HTMLElement).scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            (el as HTMLElement).focus?.();
            return;
          }
        }
      }
    } catch (e) {
      console.warn("scrollToFirstError failed", e);
    }
  };

  const getFieldError = (name: string) => {
    if (!errors) return undefined;
    if (errors[name]) return errors[name];
    const snake = camelToSnake(name);
    if (errors[snake]) return errors[snake];
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

  const getGoogleMapEmbedUrl = (lat: number, lng: number, zoom: number) =>
    `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;

  const handleManualAddressChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string,
  ) => {
    setter(value);
    setMapCoords({ lat: LONDON_CENTER.lat, lng: LONDON_CENTER.lng });
    setCurrentZoom(DEFAULT_ZOOM);
  };

  const handleSelectApplicant = (id: string) => {
    if (!selectedApplicants.includes(id))
      setSelectedApplicants((prev) => [...prev, id]);
  };

  const removeApplicant = (id: string) =>
    setSelectedApplicants((prev) => prev.filter((a) => a !== id));

  const filteredApplicants = applicantsData?.filter(
    (a: any) => !selectedApplicants.includes(a.id.toString()),
  );

  // ─── Address lookup ────────────────────────────────────────────────────────
  const fetchAddressByPostcode = async (pc: string) => {
    if (!pc) return;
    setIsSearchingPostcode(true);
    try {
      const res = await apiAddress.get(
        `/autocomplete/${pc}?api-key=${process.env.NEXT_PUBLIC_GET_ADDRESS_API_KEY}`,
      );
      setAddressList(res.data.suggestions || []);
      setIsAddressModalOpen(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to lookup postcode");
    } finally {
      setIsSearchingPostcode(false);
    }
  };

  const handleSelectAddress = async (id: string) => {
    setIsFetchingAddress(true);
    setIsAddressModalOpen(false);
    try {
      const res = await apiAddress.get(
        `/get/${id}?api-key=${process.env.NEXT_PUBLIC_GET_ADDRESS_API_KEY}`,
      );
      const addr = res.data;
      setHouseNumber(addr.building_number || addr.building_name || "");
      setAddress1(addr.line_1 || "");
      setAddress2(addr.line_2 || "");
      setCity(addr.town_or_city || "");
      setCounty(addr.county || "");
      setCountry(addr.country || "");
      if (addr.latitude && addr.longitude) {
        setMapCoords({
          lat: Number(addr.latitude),
          lng: Number(addr.longitude),
        });
        setCurrentZoom(DETAIL_ZOOM);
      }
      const fullAddress = [addr.line_1, addr.line_2, addr.line_3, addr.line_4]
        .filter(Boolean)
        .join(", ");
      const epcRes = await getPropertyEPCRating({
        case_alias: casealias as string,
        property_postcode: addr.postcode,
        property_address: fullAddress,
      }).unwrap();
      setFetchedEpcRating(epcRes.epc_rating);
    } catch (err) {
      console.error("Error fetching address:", err);
    } finally {
      setIsFetchingAddress(false);
    }
  };

  // ─── Submit ────────────────────────────────────────────────────────────────
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedApplicants.length === 0) {
      toast.error("Please select at least one applicant!");
      return;
    }
    try {
      const payload = {
        applicant_ids: selectedApplicants.map(Number),
        postcode,
        house_name_or_number: houseNumber,
        address_1: address1,
        address_2: address2 || null,
        city,
        county: county || null,
        country,
        latitude: mapCoords?.lat ?? 0,
        longitude: mapCoords?.lng ?? 0,
        property_value: propertyValue,
        current_mortgage_balance: currentMortgageBalance,
        monthly_rental_income: monthlyRental,
        monthly_mortgage_payment: monthlyPayment || null,
        value_at_purchase: valueAtPurchase || null,
        date_purchased: datePurchased || null,
        is_hmo: isHMO,
        is_mufb: isMUFB,
        mortgage_lender: mortgageLender || null,
        repayment_type: repaymentType || null,
        to_be_repaid: toBeRepaid || null,
        current_rate: currentRate || null,
        rate_type: rateType || null,
        current_rate_end_date: currentRateEndDate || null,
        erc_end_date: ercEndDate || null,
        account_number: accountNumber || null,
        property_type: propertyType,
        ownership: ownership || null,
        leasehold: leasehold || null,
        year_built: yearBuilt || null,
        number_of_bedrooms: numberOfBedrooms || null,
        remaining_mortgage_term: remainingMortgageTerm || null,
        is_limited_company: isLimitedCompany,
        company_name: isLimitedCompany ? companyName || null : null,
        epc_rating: fetchedEpcRating || null,
        note: note || null,
      };

      const response = await updatePropertyDetails({
        case_alias: casealias,
        property_alias: property?.alias,
        propertyDetails: payload,
      });

      if (response.data) {
        setErrors({});
        toast.success("Property updated successfully!");
        toggle();
      } else if (response.error) {
        const parsed = parseApiErrors(
          (response.error as any)?.data ?? response.error,
        );
        setErrors(parsed);
        scrollToFirstError(parsed);
        toast.error(Object.values(parsed)[0] || "Failed to update property");
      }
    } catch (error) {
      const parsed = parseApiErrors(error);
      if (Object.keys(parsed).length) {
        setErrors(parsed);
        scrollToFirstError(parsed);
      }
      toast.error(
        Object.values(parsed)[0] ||
          "Failed to update property. Please try again!",
      );
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">Edit Property</span>
      </ModalHeader>
      <ModalBody className="p-4">
        <Form onSubmit={handleUpdate}>
          {/* Map Preview */}
          <Row>
            <Col sm={12}>
              <Label className="fw-semibold mb-2">Location Preview</Label>
              <div className="border rounded overflow-hidden shadow-sm mb-3">
                <iframe
                  src={getGoogleMapEmbedUrl(
                    mapCoords?.lat ?? LONDON_CENTER.lat,
                    mapCoords?.lng ?? LONDON_CENTER.lng,
                    mapCoords ? currentZoom : DEFAULT_ZOOM,
                  )}
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  loading="lazy"
                  title="Property Location"
                />
              </div>
            </Col>

            {/* Applicants */}
            <Col md={6}>
              <FormGroup>
                <Label>Applicant/s*</Label>
                <div className="position-relative" ref={dropdownRef}>
                  <div
                    className="form-control d-flex flex-wrap align-items-center position-relative custom_input_field"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {selectedApplicants.length === 0 && (
                      <span className="text-muted">Select applicants...</span>
                    )}
                    {selectedApplicants.map((id) => {
                      const applicant = applicantsData?.find(
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
                            ? formatChoiceFieldValue(applicant.title)
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
                    />
                  </div>
                  {isDropdownOpen && (
                    <div className="position-absolute w-100 bg-white border mt-1 rounded-2 dropdown_style">
                      <div
                        className="text-end p-1 bg-light sticky-top border-bottom dropdown_close"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="fw-bold fs-5">
                          <X size={20} />
                        </span>
                      </div>
                      {filteredApplicants?.map((applicant: any) => (
                        <div
                          key={applicant.id}
                          className="px-2 py-1 dropdown_item"
                          onClick={() =>
                            handleSelectApplicant(applicant.id.toString())
                          }
                        >
                          {applicant?.title
                            ? formatChoiceFieldValue(applicant.title)
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
                  <small className="text-danger d-block mt-1">
                    {getFieldError("applicant_ids") ||
                      getFieldError("applicants")}
                  </small>
                )}
              </FormGroup>
            </Col>

            {/* Postcode */}
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
                  <small className="text-danger d-block mt-1">
                    {getFieldError("postcode")}
                  </small>
                )}
              </FormGroup>
            </Col>
          </Row>

          {/* Address Fields */}
          <Row>
            {[
              {
                id: "house_name_or_number",
                label: "House Name Or Number*",
                value: houseNumber,
                setter: setHouseNumber,
                required: true,
              },
              {
                id: "address_1",
                label: "Address 1*",
                value: address1,
                setter: setAddress1,
                required: true,
              },
              {
                id: "address_2",
                label: "Address 2",
                value: address2,
                setter: setAddress2,
                required: false,
              },
            ].map(({ id, label, value, setter, required }) => (
              <Col md={4} key={id}>
                <FormGroup>
                  <Label for={id}>{label}</Label>
                  <Input
                    id={id}
                    name={id}
                    type="text"
                    value={value}
                    onChange={(e) =>
                      handleManualAddressChange(setter, e.target.value)
                    }
                    required={required}
                  />
                  {getFieldError(id) && (
                    <small className="text-danger d-block mt-1">
                      {getFieldError(id)}
                    </small>
                  )}
                </FormGroup>
              </Col>
            ))}
          </Row>
          <Row>
            {[
              {
                id: "city",
                label: "City*",
                value: city,
                setter: setCity,
                required: true,
              },
              {
                id: "county",
                label: "County",
                value: county,
                setter: setCounty,
                required: false,
              },
              {
                id: "country",
                label: "Country*",
                value: country,
                setter: setCountry,
                required: true,
              },
            ].map(({ id, label, value, setter, required }) => (
              <Col md={4} key={id}>
                <FormGroup>
                  <Label for={id}>{label}</Label>
                  <Input
                    id={id}
                    name={id}
                    type="text"
                    value={value}
                    onChange={(e) =>
                      handleManualAddressChange(setter, e.target.value)
                    }
                    required={required}
                  />
                  {getFieldError(id) && (
                    <small className="text-danger d-block mt-1">
                      {getFieldError(id)}
                    </small>
                  )}
                </FormGroup>
              </Col>
            ))}
          </Row>

          <hr className="border-secondary" />

          {/* Financial Fields */}
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="property_value">Property Value*</Label>
                <Input
                  id="property_value"
                  name="property_value"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  onInput={limitDecimalPlaces}
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(e.target.value)}
                  required
                />
                {getFieldError("property_value") && (
                  <small className="text-danger d-block mt-1">
                    {getFieldError("property_value")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="current_mortgage_balance">
                  Current Mortgage Balance*
                </Label>
                <Input
                  id="current_mortgage_balance"
                  name="current_mortgage_balance"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  onInput={limitDecimalPlaces}
                  value={currentMortgageBalance}
                  onChange={(e) => setCurrentMortgageBalance(e.target.value)}
                  required
                />
                {getFieldError("current_mortgage_balance") && (
                  <small className="text-danger d-block mt-1">
                    {getFieldError("current_mortgage_balance")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="monthly_rental_income">
                  Monthly Rental Income*
                </Label>
                <Input
                  id="monthly_rental_income"
                  name="monthly_rental_income"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  onInput={limitDecimalPlaces}
                  value={monthlyRental}
                  onChange={(e) => setMonthlyRental(e.target.value)}
                  required
                />
                {getFieldError("monthly_rental_income") && (
                  <small className="text-danger d-block mt-1">
                    {getFieldError("monthly_rental_income")}
                  </small>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
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
                  value={monthlyPayment}
                  onChange={(e) => setMonthlyPayment(e.target.value)}
                />
                {getFieldError("monthly_mortgage_payment") && (
                  <small className="text-danger d-block mt-1">
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
                  value={valueAtPurchase}
                  onChange={(e) => setValueAtPurchase(e.target.value)}
                />
                {getFieldError("value_at_purchase") && (
                  <small className="text-danger d-block mt-1">
                    {getFieldError("value_at_purchase")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="date_purchased">Date Purchased</Label>
                <Input
                  id="date_purchased"
                  name="date_purchased"
                  type="date"
                  value={datePurchased}
                  onChange={(e) => setDatePurchased(e.target.value)}
                />
                {getFieldError("date_purchased") && (
                  <small className="text-danger d-block mt-1">
                    {getFieldError("date_purchased")}
                  </small>
                )}
              </FormGroup>
            </Col>
          </Row>

          {/* Checkboxes + Lender + Repayment */}
          <Row>
            <Col md={4}>
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    name="is_hmo"
                    checked={isHMO}
                    onChange={(e) => setIsHMO(e.target.checked)}
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
                    checked={isMUFB}
                    onChange={(e) => setIsMUFB(e.target.checked)}
                    className="border-primary"
                  />
                  Is the property a MUFB
                </Label>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="mortgage_lender">Mortgage Lender</Label>
                <Input
                  id="mortgage_lender"
                  name="mortgage_lender"
                  type="text"
                  value={mortgageLender}
                  onChange={(e) => setMortgageLender(e.target.value)}
                />
                {getFieldError("mortgage_lender") && (
                  <small className="text-danger d-block mt-1">
                    {getFieldError("mortgage_lender")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="repayment_type">Repayment Type</Label>
                <Input
                  id="repayment_type"
                  name="repayment_type"
                  type="text"
                  value={repaymentType}
                  onChange={(e) => setRepaymentType(e.target.value)}
                />
                {getFieldError("repayment_type") && (
                  <small className="text-danger d-block mt-1">
                    {getFieldError("repayment_type")}
                  </small>
                )}
              </FormGroup>
            </Col>
          </Row>

          {/* Rate Fields */}
          <Row>
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
                  value={currentRate}
                  onChange={(e) => setCurrentRate(e.target.value)}
                />
                {getFieldError("current_rate") && (
                  <small className="text-danger d-block mt-1">
                    {getFieldError("current_rate")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="rate_type">Rate Type</Label>
                <Input
                  id="rate_type"
                  name="rate_type"
                  type="select"
                  value={rateType}
                  onChange={(e) => setRateType(e.target.value)}
                >
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
                  <small className="text-danger d-block mt-1">
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
                  value={toBeRepaid}
                  onChange={(e) => setToBeRepaid(e.target.value)}
                />
                {getFieldError("to_be_repaid") && (
                  <small className="text-danger d-block mt-1">
                    {getFieldError("to_be_repaid")}
                  </small>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="current_rate_end_date">Current Rate End Date</Label>
                <Input
                  id="current_rate_end_date"
                  name="current_rate_end_date"
                  type="date"
                  value={currentRateEndDate}
                  onChange={(e) => setCurrentRateEndDate(e.target.value)}
                />
                {getFieldError("current_rate_end_date") && (
                  <small className="text-danger d-block mt-1">
                    {getFieldError("current_rate_end_date")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="erc_end_date">ERC End Date</Label>
                <Input
                  id="erc_end_date"
                  name="erc_end_date"
                  type="date"
                  value={ercEndDate}
                  onChange={(e) => setErcEndDate(e.target.value)}
                />
                {getFieldError("erc_end_date") && (
                  <small className="text-danger d-block mt-1">
                    {getFieldError("erc_end_date")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="account_number">Account Number</Label>
                <Input
                  id="account_number"
                  name="account_number"
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
                {getFieldError("account_number") && (
                  <small className="text-danger d-block mt-1">
                    {getFieldError("account_number")}
                  </small>
                )}
              </FormGroup>
            </Col>
          </Row>

          {/* Property Details */}
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="property_type">Property Type*</Label>
                <Input
                  id="property_type"
                  name="property_type"
                  type="text"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  required
                />
                {getFieldError("property_type") && (
                  <small className="text-danger d-block mt-1">
                    {getFieldError("property_type")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="ownership">Ownership*</Label>
                <Input
                  id="ownership"
                  name="ownership"
                  type="text"
                  value={ownership}
                  onChange={(e) => setOwnership(e.target.value)}
                  required
                />
                {getFieldError("ownership") && (
                  <small className="text-danger d-block mt-1">
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
                  value={leasehold}
                  onChange={(e) => setLeasehold(e.target.value)}
                />
                {getFieldError("leasehold") && (
                  <small className="text-danger d-block mt-1">
                    {getFieldError("leasehold")}
                  </small>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="year_built">Year Built</Label>
                <Input
                  id="year_built"
                  name="year_built"
                  type="number"
                  step="1"
                  value={yearBuilt}
                  onChange={(e) => setYearBuilt(e.target.value)}
                />
                {getFieldError("year_built") && (
                  <small className="text-danger d-block mt-1">
                    {getFieldError("year_built")}
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="number_of_bedrooms">Number of Bedrooms*</Label>
                <Input
                  id="number_of_bedrooms"
                  name="number_of_bedrooms"
                  type="number"
                  step="1"
                  value={numberOfBedrooms}
                  onChange={(e) => setNumberOfBedrooms(e.target.value)}
                  required
                />
                {getFieldError("number_of_bedrooms") && (
                  <small className="text-danger d-block mt-1">
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
                  value={remainingMortgageTerm}
                  onChange={(e) => setRemainingMortgageTerm(e.target.value)}
                />
                {getFieldError("remaining_mortgage_term") && (
                  <small className="text-danger d-block mt-1">
                    {getFieldError("remaining_mortgage_term")}
                  </small>
                )}
              </FormGroup>
            </Col>
          </Row>

          {/* Limited Company + EPC */}
          <Row>
            <Col md={4}>
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    name="is_limited_company"
                    checked={isLimitedCompany}
                    onChange={(e) => setIsLimitedCompany(e.target.checked)}
                    className="border-primary"
                  />
                  Is Limited Company
                </Label>
                {getFieldError("is_limited_company") && (
                  <small className="text-danger d-block mt-1">
                    {getFieldError("is_limited_company")}
                  </small>
                )}
              </FormGroup>
            </Col>

            {isLimitedCompany && (
              <Col md={4}>
                <FormGroup>
                  <Label for="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    name="company_name"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
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
                {getFieldError("epc_rating") && (
                  <small className="text-danger d-block mt-1">
                    {getFieldError("epc_rating")}
                  </small>
                )}
              </FormGroup>
            </Col>
          </Row>

          {/* Note */}
          <Row>
            <Col sm={12}>
              <FormGroup>
                <Label for="note">Note</Label>
                <Input
                  id="note"
                  name="note"
                  type="textarea"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                {getFieldError("note") && (
                  <small className="text-danger d-block mt-1">
                    {getFieldError("note")}
                  </small>
                )}
              </FormGroup>
            </Col>
          </Row>

          {/* Actions */}
          <Row>
            <Col className="d-flex justify-content-end gap-2">
              <Button color="secondary" type="button" onClick={toggle}>
                Cancel
              </Button>
              <Button color="primary" type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Portfolio"}
              </Button>
            </Col>
          </Row>
        </Form>
      </ModalBody>

      <GetAddressModal
        isOpen={isAddressModalOpen}
        toggle={() => setIsAddressModalOpen(!isAddressModalOpen)}
        addresses={addressList}
        onSelect={handleSelectAddress}
      />
    </Modal>
  );
};

export default UpdatePropertyModal;
