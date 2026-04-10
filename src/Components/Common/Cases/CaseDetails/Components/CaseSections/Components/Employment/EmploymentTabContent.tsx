import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { basicTabIndicator } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CaseDetailsTabIndicatorSlice";
import { useUpdateEmploymentDetailsMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/EmploymentDetails/EmploymentDetailsApi";
import { useUpdateSectionCompleteStatusMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SectionCompleteApi";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import {
  EmploymentDetailsProps,
  EmploymentTabContentProps,
} from "@/Types/Common/Cases/CaseDetails/CaseSections/EmploymentTypes";
import { apiAddress } from "@/services/third-party-api";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import getCurrencySign from "@/utils/currency";
import { calculateMonthsDuration } from "@/utils/dateAndTimeFormatter";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  CardBody,
  Col,
  FormGroup,
  FormText,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from "reactstrap";
import GetAddressModal from "../../CommonModals/GetAddressModal";
import AddEmploymentDetailsModal from "./EmploymentModals/AddEmploymentDetailsModal";

export const EmploymentTabContent: React.FC<EmploymentTabContentProps> = ({
  activeTab,
  activeUser,
  groupedData,
}) => {
  const [formValues, setFormValues] = useState<EmploymentDetailsProps | null>(
    null,
  );
  // UseParams with type assertion
  const params = useParams();
  const { casealias } = params;
  const { data: session } = useSession();
  const [isAddEmploymentModalOpen, setAddEmploymentModalOpen] = useState(false);
  const submitActionRef = useRef<"save" | "next">("save");
  const formRef = useRef<HTMLFormElement>(null);
  // Keep in-memory drafts per employment alias so unsaved edits persist when
  // switching tabs inside this component.
  const draftsRef = useRef<Record<string, EmploymentDetailsProps>>({});

  // RTK Hooks
  const [
    updateEmploymentDetails,
    { isLoading: isUpdateEmploymentDetailsLoading },
  ] = useUpdateEmploymentDetailsMutation();
  const [updateSectionCompleteStatus] =
    useUpdateSectionCompleteStatusMutation();
  const dispatch = useAppDispatch();
  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias },
  );

  const [addressType, setAddressType] = useState<"employer" | "business">(
    "employer",
  );
  const [addressList, setAddressList] = useState<any[]>([]);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [isSearchingPostcode, setIsSearchingPostcode] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const toggleAddressModal = () => setIsAddressModalOpen(!isAddressModalOpen);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<"save" | "save_next" | null>(
    null,
  );

  const camelToSnake = (s: string) =>
    s.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`);

  const getFieldError = (name: string) => {
    if (!errors) return undefined;
    if (errors[name]) return errors[name];
    const snake = camelToSnake(name);
    if (errors[snake]) return errors[snake];
    return undefined;
  };

  const parseApiErrors = (err: any): Record<string, string> => {
    const out: Record<string, string> = {};
    const data = err?.data || (err?.error && err.error.data) || err;
    const sanitize = (m: string) => String(m).replace(/^\d+[,\s]*/, "");

    const recurse = (value: any, path: string[] = []) => {
      if (value == null) return;
      if (typeof value === "string") {
        out[path.join(".")] = sanitize(value);
        return;
      }
      if (Array.isArray(value)) {
        out[path.join(".")] = value
          .map((v) => (typeof v === "string" ? sanitize(v) : JSON.stringify(v)))
          .join(", ");
        return;
      }
      if (typeof value === "object") {
        for (const k of Object.keys(value)) recurse(value[k], path.concat(k));
        return;
      }
      out[path.join(".")] = String(value);
    };

    recurse(data, []);
    return out;
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
  const LONDON_CENTER = { lat: 51.5074, lng: -0.1278 };
  const DEFAULT_ZOOM = 10;
  const DETAIL_ZOOM = 16;

  const [employerMapCoords, setEmployerMapCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [businessMapCoords, setBusinessMapCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [employerZoom, setEmployerZoom] = useState(DEFAULT_ZOOM);
  const [businessZoom, setBusinessZoom] = useState(DEFAULT_ZOOM);

  const getGoogleMapEmbedUrl = (
    lat: number,
    lng: number,
    zoom: number,
  ): string => {
    return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
  };

  // `useEffect` to reset `formValues` when `activeTab` or `activeUser` changes
  useEffect(() => {
    if (activeTab && activeUser !== null) {
      const userEmploymentRecords = groupedData[activeUser];
      const activeEmploymentRecord = userEmploymentRecords?.find(
        (employment) => employment.alias === activeTab,
      );

      // If there's a draft for this alias use it; otherwise use the record
      // coming from props. This preserves unsaved input when switching tabs.
      const draft = draftsRef.current[activeTab as string];

      // Only update if we're actually switching to a different employment record
      if (formValues?.alias !== activeTab) {
        setFormValues(draft ?? activeEmploymentRecord ?? null);

        const employmentData = draft ?? activeEmploymentRecord;

        if (
          employmentData?.employer_latitude &&
          employmentData?.employer_longitude
        ) {
          setEmployerMapCoords({
            lat: employmentData.employer_latitude,
            lng: employmentData.employer_longitude,
          });
          setEmployerZoom(DETAIL_ZOOM);
        } else {
          setEmployerMapCoords(null);
          setEmployerZoom(DEFAULT_ZOOM);
        }

        if (
          employmentData?.business_latitude &&
          employmentData?.business_longitude
        ) {
          setBusinessMapCoords({
            lat: employmentData.business_latitude,
            lng: employmentData.business_longitude,
          });
          setBusinessZoom(DETAIL_ZOOM);
        } else {
          setBusinessMapCoords(null);
          setBusinessZoom(DEFAULT_ZOOM);
        }
      }
    }
  }, [activeTab, activeUser, groupedData]); // Remove formValues from dependencies

  if (!activeTab || activeUser === null) {
    return <div>No employment data available.</div>;
  }

  const userEmploymentRecords = groupedData[activeUser];
  const activeEmploymentRecord = userEmploymentRecords?.find(
    (employment) => employment.alias === activeTab,
  );

  if (!activeEmploymentRecord) {
    return <div>No matching employment record found.</div>;
  }

  const handleInputChange = (
    name: keyof EmploymentDetailsProps, // Use your type instead of `Applicant`
    value: string | number | boolean | string[] | null,
  ) => {
    setFormValues((prevValues) => ({
      ...prevValues!,
      [name]: value,
    }));

    const addressFields = [
      "employer_postcode",
      "employer_house_name_or_number",
      "employer_address_line_1",
      "employer_address_line_2",
      "employer_city",
      "employer_county",
      "employer_country",
      "business_postcode",
      "business_address_line_1",
      "business_address_line_2",
      "business_city",
      "business_county",
      "business_country",
    ];

    if (addressFields.includes(name)) {
      setEmployerMapCoords(LONDON_CENTER);
      setBusinessMapCoords(LONDON_CENTER);
      setEmployerZoom(DEFAULT_ZOOM);
      setBusinessZoom(DEFAULT_ZOOM);
    }

    // Save a draft copy for the currently active alias so edits aren't lost
    // when the user switches tabs. If there's no activeTab yet, skip.
    if (formValues?.alias) {
      const alias = formValues.alias as string;
      const next = {
        ...(draftsRef.current[alias] ?? formValues),
        [name]: value,
        alias,
      } as EmploymentDetailsProps;
      draftsRef.current[alias] = next;
    }
  };
  const handleSaveClick = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    // mark which action is submitting so only that button shows loading label
    const action = submitActionRef.current || "save";
    setSubmitting(action === "next" ? "save_next" : "save");

    try {
      const res = await updateEmploymentDetails({
        case_alias: casealias,
        employmentDetails_alias: formValues?.alias,
        employmentDetails: formValues,
      });

      if (res.data) {
        setErrors({});
        toast.success("Employment details updated successfully.");
        try {
          await updateSectionCompleteStatus({
            case_alias: casealias,
            section_data: { is_employment_income: true },
          });
        } catch (err) {
          console.error("Failed to update section complete status:", err);
        }
        // Clear saved draft on successful save so we don't reapply stale data.
        if (formValues?.alias) delete draftsRef.current[formValues.alias];
        // Only go to next tab if this was a Save & Next action
        if (submitActionRef.current === "next") {
          handleNextTab();
        }
      } else if (res.error) {
        const parsed = parseApiErrors(res.error as any);
        setErrors(parsed);
        // Scroll to the first field with an API validation error
        scrollToFirstError(parsed);
        const first = Object.values(parsed)[0];
        toast.error(first || "Failed to update employment details.");
      } else {
        toast.error("Failed to update employment details.");
      }
    } catch (error: any) {
      const msg = error?.message || "Failed to update employment details.";
      toast.error(msg);
    } finally {
      setSubmitting(null);
    }
  };
  const currentTab: string | null = useAppSelector(
    (state) => state.caseSections.basicTabId,
  );

  const handleNextTab = () => {
    const nextTabNav = getNextTabNav(
      caseData?.case_stage,
      caseData?.case_category,
      currentTab!,
    );
    if (nextTabNav) {
      dispatch(basicTabIndicator(nextTabNav));
    } else {
      toast.warning("This is the last tab.");
    }
  };

  const handleCopyAddress = () => {
    // Get the first SELF_EMPLOYED record from the grouped data
    const firstSelfEmployedRecord = userEmploymentRecords?.find(
      (employment) => employment.employment_status === "SELF_EMPLOYED",
    );

    if (!firstSelfEmployedRecord) {
      toast.warning("No previous self-employed record found to copy from.");
      return;
    }

    // Copy address fields from the first SELF_EMPLOYED record
    const copiedFields = {
      business_postcode: firstSelfEmployedRecord.business_postcode || "",
      business_house_name_or_number:
        firstSelfEmployedRecord.business_house_name_or_number || "",
      business_address_line_1:
        firstSelfEmployedRecord.business_address_line_1 || "",
      business_address_line_2:
        firstSelfEmployedRecord.business_address_line_2 || "",
      business_city: firstSelfEmployedRecord.business_city || "",
      business_county: firstSelfEmployedRecord.business_county || "",
      business_country: firstSelfEmployedRecord.business_country || "",
    };

    // Update form values with copied fields
    setFormValues((prevValues) => ({
      ...prevValues!,
      ...copiedFields,
    }));

    // Update draft for the currently active alias
    if (formValues?.alias) {
      const alias = formValues.alias as string;
      draftsRef.current[alias] = {
        ...(draftsRef.current[alias] ?? formValues),
        ...copiedFields,
        alias,
      } as EmploymentDetailsProps;
    }

    toast.success("Address copied successfully.");
  };

  // Check if we should show the Copy Address button
  const shouldShowCopyAddressButton =
    formValues?.employment_status === "SELF_EMPLOYED" &&
    userEmploymentRecords &&
    userEmploymentRecords.length > 1 &&
    userEmploymentRecords.some(
      (emp) =>
        emp.employment_status === "SELF_EMPLOYED" &&
        emp.alias !== activeTab &&
        (emp.business_postcode ||
          emp.business_address_line_1 ||
          emp.business_city),
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

  const fetchAddressByPostcode = async (
    postcode: string | null,
    type: "employer" | "business",
  ) => {
    if (!postcode) return;
    setAddressType(type);
    setIsSearchingPostcode(true);
    try {
      const response = await apiAddress.get(
        `/autocomplete/${postcode}?api-key=${process.env.NEXT_PUBLIC_GET_ADDRESS_API_KEY}`,
      );
      setAddressList(response.data.suggestions || []);
      setIsAddressModalOpen(true);
    } catch (err: any) {
      const message = getAddressErrorMessage(err.response || err);
      toast.error(message);
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

      const address = res.data;

      if (!address) {
        console.error("❌ No address returned");
        return;
      }

      const updatedFields = {
        employer_postcode: address.postcode || formValues?.employer_postcode,
        employer_house_name_or_number: [
          address.building_name,
          address.building_number,
        ]
          .filter(Boolean)
          .join(" "),
        employer_address_line_1: address.line_1 || "",
        employer_address_line_2: address.line_2 || "",
        employer_city: address.town_or_city || "",
        employer_county: address.county || "",
        employer_country: address.country || "",
        employer_latitude: address.latitude,
        employer_longitude: address.longitude,
      };

      setFormValues((prev: any) => ({
        ...prev,
        ...updatedFields,
      }));

      // Update draft to prevent losing changes
      if (formValues?.alias) {
        const alias = formValues.alias as string;
        draftsRef.current[alias] = {
          ...(draftsRef.current[alias] ?? formValues),
          ...updatedFields,
          alias,
        } as EmploymentDetailsProps;
      }

      if (address.latitude !== undefined && address.longitude !== undefined) {
        setEmployerMapCoords({ lat: address.latitude, lng: address.longitude });
        setEmployerZoom(DETAIL_ZOOM);
      } else {
        setEmployerMapCoords(null);
        setEmployerZoom(DEFAULT_ZOOM);
      }
    } catch (error) {
      console.error("Error fetching detailed address:", error);
    } finally {
      setIsFetchingAddress(false);
    }
  };

  const handleSelectBusinessAddress = async (id: string) => {
    setIsFetchingAddress(true);
    setIsAddressModalOpen(false);

    try {
      const res = await apiAddress.get(
        `/get/${id}?api-key=${process.env.NEXT_PUBLIC_GET_ADDRESS_API_KEY}`,
      );

      const address = res.data;

      if (!address) {
        console.error("❌ No address returned");
        return;
      }

      const updatedFields = {
        business_postcode: address.postcode || formValues?.business_postcode,
        business_house_name_or_number: [
          address.building_name,
          address.building_number,
        ]
          .filter(Boolean)
          .join(" "),
        business_address_line_1: address.line_1 || "",
        business_address_line_2: address.line_2 || "",
        business_city: address.town_or_city || "",
        business_county: address.county || "",
        business_country: address.country || "",
        business_latitude: address.latitude,
        business_longitude: address.longitude,
      };

      setFormValues((prev: any) => ({
        ...prev,
        ...updatedFields,
      }));

      // Update draft to prevent losing changes
      if (formValues?.alias) {
        const alias = formValues.alias as string;
        draftsRef.current[alias] = {
          ...(draftsRef.current[alias] ?? formValues),
          ...updatedFields,
          alias,
        } as EmploymentDetailsProps;
      }

      if (address.latitude !== undefined && address.longitude !== undefined) {
        setBusinessMapCoords({ lat: address.latitude, lng: address.longitude });
        setBusinessZoom(DETAIL_ZOOM);
      } else {
        setBusinessMapCoords(null);
        setBusinessZoom(DEFAULT_ZOOM);
      }
    } catch (error) {
      console.error("Error fetching detailed business address:", error);
    } finally {
      setIsFetchingAddress(false);
    }
  };

  return (
    <CardBody className="px-0 pb-0">
      <h4 className="text-primary pb-0 fs-4 mb-4 mt-2">Employment Details</h4>
      <form ref={formRef} id="employment-form" onSubmit={handleSaveClick}>
        <Row className="d-flex justify-content-center align-items-center">
          <Col md={6}>
            <FormGroup>
              <Label for="employmentStatus" className="fs-5">
                Employment Status<span className="text-danger">*</span>
              </Label>
              <Input
                type="select"
                id="employmentStatus"
                className="border-primary"
                value={formValues?.employment_status || ""}
                onChange={(e) =>
                  handleInputChange("employment_status", e.target.value)
                }
                required
              >
                <option value="">Select...</option>
                <option value="EMPLOYED">Employed</option>
                <option value="SELF_EMPLOYED">Self Employed</option>
                <option value="RETIRED">Retired</option>
                <option value="OTHER">Other</option>
                <option value="UNEMPLOYED">Unemployed</option>
                <option value="HOUSEPERSON">Houseperson</option>
                <option value="CONTRACTOR">Contractor</option>
              </Input>
              {getFieldError("employment_status") && (
                <div className="text-danger small">
                  {getFieldError("employment_status")}
                </div>
              )}
            </FormGroup>
          </Col>
        </Row>
        <hr className="border-secondary" />
        <Row>
          {formValues?.employment_status === "EMPLOYED" && (
            <Col md={6}>
              <FormGroup>
                <Label for="employmentType">Employment Type</Label>
                <Input
                  type="select"
                  id="employmentType"
                  value={formValues?.employment_type || ""}
                  onChange={(e) =>
                    handleInputChange("employment_type", e.target.value)
                  }
                >
                  <option value="">Select...</option>
                  <option value="PERMANENT">Permanent</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="TEMPORARY">Temporary</option>
                </Input>
              </FormGroup>
            </Col>
          )}
        </Row>
        <Row>
          {(formValues?.employment_status === "EMPLOYED" ||
            formValues?.employment_status === "SELF_EMPLOYED" ||
            formValues?.employment_status === "CONTRACTOR") && (
            <Col md={6}>
              <FormGroup>
                <Label for="occupation">
                  Occupation<span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id="occupation"
                  value={formValues?.occupation || ""}
                  onChange={(e) =>
                    handleInputChange("occupation", e.target.value)
                  }
                  required
                />
                {getFieldError("occupation") && (
                  <div className="text-danger small">
                    {getFieldError("occupation")}
                  </div>
                )}
              </FormGroup>
            </Col>
          )}
          {(formValues?.employment_status === "EMPLOYED" ||
            formValues?.employment_status === "SELF_EMPLOYED") && (
            <Col md={6}>
              <FormGroup>
                <Label for="industry">Industry</Label>
                <Input
                  type="text"
                  id="industry"
                  value={formValues?.industry || ""}
                  onChange={(e) =>
                    handleInputChange("industry", e.target.value)
                  }
                />
                {getFieldError("industry") && (
                  <div className="text-danger small">
                    {getFieldError("industry")}
                  </div>
                )}
              </FormGroup>
            </Col>
          )}
        </Row>
        <Row>
          {(formValues?.employment_status === "EMPLOYED" ||
            formValues?.employment_status === "CONTRACTOR") && (
            <Col md={6}>
              <FormGroup>
                <Label for="employerName">
                  Employer Name<span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id="employerName"
                  value={formValues?.employer_name || ""}
                  onChange={(e) =>
                    handleInputChange("employer_name", e.target.value)
                  }
                  required
                />
                {getFieldError("employer_name") && (
                  <div className="text-danger small">
                    {getFieldError("employer_name")}
                  </div>
                )}
              </FormGroup>
            </Col>
          )}
          {(formValues?.employment_status === "EMPLOYED" ||
            formValues?.employment_status === "CONTRACTOR") && (
            <Col md={6}>
              <FormGroup>
                <Label for="employerTelephone">Employer's Telephone</Label>
                <Input
                  type="text"
                  id="employerTelephone"
                  value={formValues?.employer_telephone || ""}
                  onChange={(e) =>
                    handleInputChange("employer_telephone", e.target.value)
                  }
                />
                {getFieldError("employer_telephone") && (
                  <div className="text-danger small">
                    {getFieldError("employer_telephone")}
                  </div>
                )}
              </FormGroup>
            </Col>
          )}
        </Row>
        <Row>
          {formValues?.employment_status === "EMPLOYED" && (
            <Col md={6}>
              <FormGroup>
                <Label for="employer_name_for_reference">
                  Employer's Name for Reference
                </Label>
                <Input
                  type="text"
                  id="employer_name_for_reference"
                  value={formValues?.employer_name_for_reference || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "employer_name_for_reference",
                      e.target.value,
                    )
                  }
                />
                {getFieldError("employer_name_for_reference") && (
                  <div className="text-danger small">
                    {getFieldError("employer_name_for_reference")}
                  </div>
                )}
              </FormGroup>
            </Col>
          )}
          {formValues?.employment_status === "EMPLOYED" && (
            <Col md={6}>
              <FormGroup>
                <Label for="employerEmail">
                  Employer's Email for Reference
                </Label>
                <Input
                  type="email"
                  id="employerEmail"
                  value={formValues?.employer_email_for_reference || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "employer_email_for_reference",
                      e.target.value,
                    )
                  }
                />
                {getFieldError("employer_email_for_reference") && (
                  <div className="text-danger small">
                    {getFieldError("employer_email_for_reference")}
                  </div>
                )}
              </FormGroup>
            </Col>
          )}
        </Row>
        {(formValues?.employment_status === "EMPLOYED" ||
          formValues?.employment_status === "CONTRACTOR") && (
          <Row>
            <Col sm={12}>
              <Label className="fw-semibold mb-2">Location Preview</Label>
              <div className="border rounded overflow-hidden shadow-sm mb-3">
                <iframe
                  src={
                    employerMapCoords
                      ? getGoogleMapEmbedUrl(
                          employerMapCoords.lat,
                          employerMapCoords.lng,
                          employerZoom,
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
                  title="Employer Location"
                />
              </div>
            </Col>
          </Row>
        )}
        <Row>
          {(formValues?.employment_status === "EMPLOYED" ||
            formValues?.employment_status === "CONTRACTOR") && (
            <>
              <Col md={6}>
                <FormGroup>
                  <Label for="employerPostcode">Employer's Postcode</Label>
                  <InputGroup className="d-flex align-items-center gap-2">
                    <Input
                      type="text"
                      id="employerPostcode"
                      className="border-primary rounded"
                      value={formValues.employer_postcode || ""}
                      onChange={(e) =>
                        handleInputChange("employer_postcode", e.target.value)
                      }
                    />
                    <Button
                      color="primary"
                      type="button"
                      className="text-nowrap"
                      style={{ paddingTop: "0.7rem", paddingBottom: "0.7rem" }}
                      onClick={() =>
                        fetchAddressByPostcode(
                          formValues.employer_postcode,
                          "employer",
                        )
                      }
                      disabled={isFetchingAddress || isSearchingPostcode}
                    >
                      {isSearchingPostcode ? "Loading..." : "Lookup"}
                    </Button>
                  </InputGroup>
                  {getFieldError("employer_postcode") && (
                    <div className="text-danger small">
                      {getFieldError("employer_postcode")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="employerHouseNumber">
                    Employer's House Name or Number
                  </Label>
                  <Input
                    type="text"
                    id="employerHouseNumber"
                    value={formValues?.employer_house_name_or_number || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "employer_house_name_or_number",
                        e.target.value,
                      )
                    }
                  />
                  {getFieldError("employer_house_name_or_number") && (
                    <div className="text-danger small">
                      {getFieldError("employer_house_name_or_number")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            </>
          )}
        </Row>
        <Row>
          {(formValues?.employment_status === "EMPLOYED" ||
            formValues?.employment_status === "CONTRACTOR") && (
            <>
              <Col md={6}>
                <FormGroup>
                  <Label for="employerAddressLine1">
                    Employer's Address Line 1
                  </Label>
                  <Input
                    type="text"
                    id="employerAddressLine1"
                    value={formValues?.employer_address_line_1 || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "employer_address_line_1",
                        e.target.value,
                      )
                    }
                  />
                  {getFieldError("employer_address_line_1") && (
                    <div className="text-danger small">
                      {getFieldError("employer_address_line_1")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="employerAddressLine2">
                    Employer's Address Line 2
                  </Label>
                  <Input
                    type="text"
                    id="employerAddressLine2"
                    value={formValues?.employer_address_line_2 || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "employer_address_line_2",
                        e.target.value,
                      )
                    }
                  />
                  {getFieldError("employer_address_line_2") && (
                    <div className="text-danger small">
                      {getFieldError("employer_address_line_2")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            </>
          )}
        </Row>
        <Row>
          {(formValues?.employment_status === "EMPLOYED" ||
            formValues?.employment_status === "CONTRACTOR") && (
            <>
              <Col md={4}>
                <FormGroup>
                  <Label for="employerCity">Employer's City</Label>
                  <Input
                    type="text"
                    id="employerCity"
                    value={formValues?.employer_city || ""}
                    onChange={(e) =>
                      handleInputChange("employer_city", e.target.value)
                    }
                  />
                  {getFieldError("employer_city") && (
                    <div className="text-danger small">
                      {getFieldError("employer_city")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="employerCounty">Employer's County</Label>
                  <Input
                    type="text"
                    id="employerCounty"
                    value={formValues?.employer_county || ""}
                    onChange={(e) =>
                      handleInputChange("employer_county", e.target.value)
                    }
                  />
                  {getFieldError("employer_county") && (
                    <div className="text-danger small">
                      {getFieldError("employer_county")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="employerCountry">Employer's Country</Label>
                  <Input
                    type="text"
                    id="employerCountry"
                    value={formValues?.employer_country || ""}
                    onChange={(e) =>
                      handleInputChange("employer_country", e.target.value)
                    }
                  />
                  {getFieldError("employer_country") && (
                    <div className="text-danger small">
                      {getFieldError("employer_country")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            </>
          )}
        </Row>
        <Row>
          {formValues?.employment_status === "EMPLOYED" && (
            <>
              <Col md={6}>
                <Label for="employmentCommenced">
                  Employment Commenced<span className="text-danger">*</span>
                </Label>
                <FormGroup className="d-flex justify-content-center align-items-center">
                  <Input
                    type="date"
                    id="employmentCommenced"
                    value={formValues?.employment_commenced || ""}
                    className="rounded-end-0"
                    onChange={(e) =>
                      handleInputChange("employment_commenced", e.target.value)
                    }
                    required
                  />
                  <InputGroupText
                    className="border-start-0 rounded-start-0"
                    style={{ padding: "11px 20px" }}
                  >
                    {calculateMonthsDuration(formValues?.employment_commenced)}
                  </InputGroupText>
                  {getFieldError("employment_commenced") && (
                    <div className="text-danger small">
                      {getFieldError("employment_commenced")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="employmentEnded">Employment Ended</Label>
                  <Input
                    type="date"
                    id="employmentEnded"
                    value={formValues?.employment_ended || ""}
                    onChange={(e) =>
                      handleInputChange("employment_ended", e.target.value)
                    }
                  />
                  {getFieldError("employment_ended") && (
                    <div className="text-danger small">
                      {getFieldError("employment_ended")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            </>
          )}
        </Row>
        {formValues?.employment_status === "EMPLOYED" && (
          <Row>
            <p>Please enter previous employment details where applicable.</p>
          </Row>
        )}
        <Row>
          {(formValues?.employment_status === "EMPLOYED" ||
            formValues?.employment_status === "RETIRED") && (
            <Col md={6}>
              <FormGroup>
                <Label for="grossAnnualIncome">
                  Gross Annual Income({getCurrencySign()})
                  <span className="text-danger">*</span>
                </Label>
                <Input
                  type="number"
                  id="grossAnnualIncome"
                  placeholder="0"
                  value={formValues?.gross_annual_income || ""}
                  onChange={(e) =>
                    handleInputChange("gross_annual_income", e.target.value)
                  }
                  required
                />
                {getFieldError("gross_annual_income") && (
                  <div className="text-danger small">
                    {getFieldError("gross_annual_income")}
                  </div>
                )}
              </FormGroup>
            </Col>
          )}
          {formValues?.employment_status === "EMPLOYED" && (
            <Col md={6}>
              <FormGroup>
                <Label for="netMonthlyIncome">
                  Net Monthly Income({getCurrencySign()})
                </Label>
                <Input
                  type="number"
                  id="netMonthlyIncome"
                  placeholder="0"
                  value={formValues?.net_monthly_income || ""}
                  onChange={(e) =>
                    handleInputChange("net_monthly_income", e.target.value)
                  }
                />
                {getFieldError("net_monthly_income") && (
                  <div className="text-danger small">
                    {getFieldError("net_monthly_income")}
                  </div>
                )}
              </FormGroup>
            </Col>
          )}
          {formValues?.employment_status === "RETIRED" && (
            <Col md={6}>
              <FormGroup>
                <Label for="income_source">Income Source</Label>
                <Input
                  type="text"
                  id="income_source"
                  value={formValues?.income_source || ""}
                  onChange={(e) =>
                    handleInputChange("income_source", e.target.value)
                  }
                />
                {getFieldError("income_source") && (
                  <div className="text-danger small">
                    {getFieldError("income_source")}
                  </div>
                )}
              </FormGroup>
            </Col>
          )}
        </Row>
        <Row>
          {formValues?.employment_status === "EMPLOYED" && (
            <Col md={6}>
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    name="probationaryPeriod"
                    checked={formValues?.is_probationary_period || false}
                    onChange={(e) =>
                      setFormValues((prevValues) => ({
                        ...prevValues!,
                        is_probationary_period: e.target.checked,
                      }))
                    }
                  />
                  Are you on a probationary period?
                </Label>
                {getFieldError("is_probationary_period") && (
                  <div className="text-danger small">
                    {getFieldError("is_probationary_period")}
                  </div>
                )}
              </FormGroup>
            </Col>
          )}
        </Row>
        <Row>
          {(formValues?.employment_status === "EMPLOYED" ||
            formValues?.employment_status === "SELF_EMPLOYED" ||
            formValues?.employment_status === "RETIRED" ||
            formValues?.employment_status === "OTHER" ||
            formValues?.employment_status === "CONTRACTOR") && (
            <>
              <Col md={6}>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      name="foreignCurrency"
                      checked={
                        formValues?.is_income_in_foreign_currency || false
                      }
                      onChange={(e) =>
                        setFormValues((prevValues) => ({
                          ...prevValues!,
                          is_income_in_foreign_currency: e.target.checked,
                        }))
                      }
                    />
                    Is any income paid in a foreign currency?
                  </Label>
                  {getFieldError("is_income_in_foreign_currency") && (
                    <div className="text-danger small">
                      {getFieldError("is_income_in_foreign_currency")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                {formValues?.is_income_in_foreign_currency && (
                  <FormGroup>
                    <Label for="further_details">
                      Further Details<span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="textarea"
                      id="further_details"
                      value={formValues?.further_details || ""}
                      onChange={(e) =>
                        handleInputChange("further_details", e.target.value)
                      }
                      required
                    />
                    {getFieldError("further_details") && (
                      <div className="text-danger small">
                        {getFieldError("further_details")}
                      </div>
                    )}
                  </FormGroup>
                )}
              </Col>
            </>
          )}
        </Row>
        {formValues?.employment_status === "EMPLOYED" && (
          <>
            <Row className="d-flex justify-content-between">
              <Col md={4}>
                <FormGroup>
                  <Label for="bonus">
                    Bonus({getCurrencySign()})
                    <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="number"
                    id="bonus"
                    placeholder="0"
                    value={formValues?.bonus || ""}
                    onChange={(e) => handleInputChange("bonus", e.target.value)}
                  />
                  {getFieldError("bonus") && (
                    <div className="text-danger small">
                      {getFieldError("bonus")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup
                  check
                  className="d-flex justify-content-center align-content-center"
                >
                  <Label check>
                    <Input
                      type="checkbox"
                      name="is_bonus_guaranteed"
                      checked={formValues?.is_bonus_guaranteed || false}
                      onChange={(e) =>
                        setFormValues((prevValues) => ({
                          ...prevValues!,
                          is_bonus_guaranteed: e.target.checked,
                        }))
                      }
                    />
                    Bonus Guaranteed?
                  </Label>
                  {getFieldError("is_bonus_guaranteed") && (
                    <div className="text-danger small">
                      {getFieldError("is_bonus_guaranteed")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="bonusFrequency">Bonus Frequency</Label>
                  <Input
                    type="select"
                    id="bonusFrequency"
                    value={formValues?.bonus_frequency || ""}
                    onChange={(e) =>
                      handleInputChange("bonus_frequency", e.target.value)
                    }
                  >
                    <option value="">Select...</option>
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="BI_WEEKLY">Bi Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="BI_MONTHLY">Bi Monthly</option>
                    <option value="QUARTERLY">Quarterly</option>
                    <option value="BI_ANNUALLY">Bi Annually</option>
                    <option value="ANNUALLY">Annually</option>
                  </Input>
                  {getFieldError("bonus_frequency") && (
                    <div className="text-danger small">
                      {getFieldError("bonus_frequency")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row className="d-flex justify-content-between">
              <Col md={4}>
                <FormGroup>
                  <Label for="overtime">
                    Overtime({getCurrencySign()})
                    <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="number"
                    id="overtime"
                    placeholder="0"
                    value={formValues?.overtime || ""}
                    onChange={(e) =>
                      handleInputChange("overtime", e.target.value)
                    }
                  />
                  {getFieldError("overtime") && (
                    <div className="text-danger small">
                      {getFieldError("overtime")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup
                  check
                  className="d-flex justify-content-center align-content-center"
                >
                  <Label check>
                    <Input
                      type="checkbox"
                      name="is_overtime_guaranteed"
                      checked={formValues?.is_overtime_guaranteed || false}
                      onChange={(e) =>
                        setFormValues((prevValues) => ({
                          ...prevValues!,
                          is_overtime_guaranteed: e.target.checked,
                        }))
                      }
                    />
                    Overtime Guaranteed?
                  </Label>
                  {getFieldError("is_overtime_guaranteed") && (
                    <div className="text-danger small">
                      {getFieldError("is_overtime_guaranteed")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="overtimeFrequency">Overtime Frequency</Label>
                  <Input
                    type="select"
                    id="overtimeFrequency"
                    value={formValues?.overtime_frequency || ""}
                    onChange={(e) =>
                      handleInputChange("overtime_frequency", e.target.value)
                    }
                  >
                    <option value="">Select...</option>
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="BI_WEEKLY">Bi Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="BI_MONTHLY">Bi Monthly</option>
                    <option value="QUARTERLY">Quarterly</option>
                    <option value="BI_ANNUALLY">Bi Annually</option>
                    <option value="ANNUALLY">Annually</option>
                  </Input>
                  {getFieldError("overtime_frequency") && (
                    <div className="text-danger small">
                      {getFieldError("overtime_frequency")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row className="d-flex justify-content-between">
              <Col md={4}>
                <FormGroup>
                  <Label for="allowance">
                    Allowance({getCurrencySign()})
                    <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="number"
                    id="allowance"
                    placeholder="0"
                    value={formValues?.allowance || ""}
                    onChange={(e) =>
                      handleInputChange("allowance", e.target.value)
                    }
                  />
                  {getFieldError("allowance") && (
                    <div className="text-danger small">
                      {getFieldError("allowance")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup
                  check
                  className="d-flex justify-content-center align-content-center"
                >
                  <Label check>
                    <Input
                      type="checkbox"
                      name="is_allowance_guaranteed"
                      checked={formValues?.is_allowance_guaranteed || false}
                      onChange={(e) =>
                        setFormValues((prevValues) => ({
                          ...prevValues!,
                          is_allowance_guaranteed: e.target.checked,
                        }))
                      }
                    />
                    Allowance Guaranteed?
                  </Label>
                  {getFieldError("is_allowance_guaranteed") && (
                    <div className="text-danger small">
                      {getFieldError("is_allowance_guaranteed")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="allowanceFrequency">Allowance Frequency</Label>
                  <Input
                    type="select"
                    id="allowanceFrequency"
                    value={formValues?.allowance_frequency || ""}
                    onChange={(e) =>
                      handleInputChange("allowance_frequency", e.target.value)
                    }
                  >
                    <option value="">Select...</option>
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="BI_WEEKLY">Bi Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="BI_MONTHLY">Bi Monthly</option>
                    <option value="QUARTERLY">Quarterly</option>
                    <option value="BI_ANNUALLY">Bi Annually</option>
                    <option value="ANNUALLY">Annually</option>
                  </Input>
                  {getFieldError("allowance_frequency") && (
                    <div className="text-danger small">
                      {getFieldError("allowance_frequency")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            </Row>
          </>
        )}
        <Row>
          {formValues?.employment_status === "SELF_EMPLOYED" && (
            <>
              <Col md={6}>
                <Label for="employmentTime">Employment Time</Label>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Input
                        type="number"
                        id="employment_time_year"
                        placeholder="0"
                        value={formValues?.employment_time_year || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "employment_time_year",
                            e.target.value,
                          )
                        }
                      />
                      <FormText>Years</FormText>
                      {getFieldError("employment_time_year") && (
                        <div className="text-danger small">
                          {getFieldError("employment_time_year")}
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Input
                        type="number"
                        id="employment_time_month"
                        placeholder="0"
                        value={formValues?.employment_time_month || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "employment_time_month",
                            e.target.value,
                          )
                        }
                      />
                      <FormText>Months</FormText>
                      {getFieldError("employment_time_month") && (
                        <div className="text-danger small">
                          {getFieldError("employment_time_month")}
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="business_telephone">Business Telephone</Label>
                  <Input
                    type="text"
                    id="business_telephone"
                    value={formValues?.business_telephone || ""}
                    onChange={(e) =>
                      handleInputChange("business_telephone", e.target.value)
                    }
                  />
                  {getFieldError("business_telephone") && (
                    <div className="text-danger small">
                      {getFieldError("business_telephone")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            </>
          )}
        </Row>
        <Row>
          {formValues?.employment_status === "SELF_EMPLOYED" && (
            <Col sm={12}>
              <Label className="fw-semibold mb-2">Location Preview</Label>
              <div className="border rounded overflow-hidden shadow-sm mb-3">
                <iframe
                  src={
                    businessMapCoords
                      ? getGoogleMapEmbedUrl(
                          businessMapCoords.lat,
                          businessMapCoords.lng,
                          businessZoom,
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
                  title="Business Location"
                />
              </div>
            </Col>
          )}
        </Row>
        <Row>
          {formValues?.employment_status === "SELF_EMPLOYED" && (
            <>
              <Col md={6}>
                <FormGroup>
                  <Label for="business_postcode">Business Postcode</Label>
                  <InputGroup className="d-flex align-items-center gap-2">
                    <Input
                      type="text"
                      id="business_postcode"
                      className="border-primary rounded"
                      value={formValues?.business_postcode || ""}
                      onChange={(e) =>
                        handleInputChange("business_postcode", e.target.value)
                      }
                    />
                    <Button
                      color="primary"
                      type="button"
                      className="text-nowrap"
                      style={{ paddingTop: "0.7rem", paddingBottom: "0.7rem" }}
                      onClick={() =>
                        fetchAddressByPostcode(
                          formValues.business_postcode,
                          "business",
                        )
                      }
                      disabled={isFetchingAddress || isSearchingPostcode}
                    >
                      {isSearchingPostcode ? "Loading..." : "Lookup"}
                    </Button>
                  </InputGroup>
                  {getFieldError("business_postcode") && (
                    <div className="text-danger small">
                      {getFieldError("business_postcode")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="business_house_name_or_number">
                    Business House Name/Number
                  </Label>
                  <Input
                    type="text"
                    id="business_house_name_or_number"
                    value={formValues?.business_house_name_or_number || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "business_house_name_or_number",
                        e.target.value,
                      )
                    }
                  />
                  {getFieldError("business_house_name_or_number") && (
                    <div className="text-danger small">
                      {getFieldError("business_house_name_or_number")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            </>
          )}
        </Row>
        {shouldShowCopyAddressButton && (
          <Row className="mb-3">
            <Col md={12}>
              <Button
                color="info"
                outline
                onClick={handleCopyAddress}
                disabled={session?.user?.role === "APPLICANT"}
              >
                Copy Address from Previous
              </Button>
            </Col>
          </Row>
        )}
        <Row>
          {formValues?.employment_status === "SELF_EMPLOYED" && (
            <>
              <Col md={6}>
                <FormGroup>
                  <Label for="business_address_line_1">
                    Business Address Line 1
                  </Label>
                  <Input
                    type="text"
                    id="business_address_line_1"
                    value={formValues?.business_address_line_1 || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "business_address_line_1",
                        e.target.value,
                      )
                    }
                  />
                  {getFieldError("business_address_line_1") && (
                    <div className="text-danger small">
                      {getFieldError("business_address_line_1")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="business_address_line_2">
                    Business Address Line 2
                  </Label>
                  <Input
                    type="text"
                    id="business_address_line_2"
                    value={formValues?.business_address_line_2 || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "business_address_line_2",
                        e.target.value,
                      )
                    }
                  />
                  {getFieldError("business_address_line_2") && (
                    <div className="text-danger small">
                      {getFieldError("business_address_line_2")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            </>
          )}
        </Row>
        <Row>
          {formValues?.employment_status === "SELF_EMPLOYED" && (
            <>
              <Col md={4}>
                <FormGroup>
                  <Label for="business_city">Business City</Label>
                  <Input
                    type="text"
                    id="business_city"
                    value={formValues?.business_city || ""}
                    onChange={(e) =>
                      handleInputChange("business_city", e.target.value)
                    }
                  />
                  {getFieldError("business_city") && (
                    <div className="text-danger small">
                      {getFieldError("business_city")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="business_county">Business County</Label>
                  <Input
                    type="text"
                    id="business_county"
                    value={formValues?.business_county || ""}
                    onChange={(e) =>
                      handleInputChange("business_county", e.target.value)
                    }
                  />
                  {getFieldError("business_county") && (
                    <div className="text-danger small">
                      {getFieldError("business_county")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="business_country">Business Country</Label>
                  <Input
                    type="text"
                    id="business_country"
                    value={formValues?.business_country || ""}
                    onChange={(e) =>
                      handleInputChange("business_country", e.target.value)
                    }
                  />
                  {getFieldError("business_country") && (
                    <div className="text-danger small">
                      {getFieldError("business_country")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            </>
          )}
        </Row>
        <Row>
          {formValues?.employment_status === "SELF_EMPLOYED" && (
            <>
              <Col md={6}>
                <FormGroup>
                  <Label for="job_title">Job Title</Label>
                  <Input
                    type="text"
                    id="job_title"
                    value={formValues?.job_title || ""}
                    onChange={(e) =>
                      handleInputChange("job_title", e.target.value)
                    }
                  />
                  {getFieldError("job_title") && (
                    <div className="text-danger small">
                      {getFieldError("job_title")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="business_name">Business Name</Label>
                  <Input
                    type="text"
                    id="business_name"
                    value={formValues?.business_name || ""}
                    onChange={(e) =>
                      handleInputChange("business_name", e.target.value)
                    }
                  />
                  {getFieldError("business_name") && (
                    <div className="text-danger small">
                      {getFieldError("business_name")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            </>
          )}
        </Row>
        <Row>
          {formValues?.employment_status === "SELF_EMPLOYED" && (
            <>
              <Col md={6}>
                <FormGroup>
                  <Label for="business_type">Business Type</Label>
                  <Input
                    type="select"
                    id="business_type"
                    value={formValues?.business_type || ""}
                    onChange={(e) =>
                      handleInputChange("business_type", e.target.value)
                    }
                  >
                    <option value="">Select...</option>
                    <option value="SOLE_TRADER">Sole Trader</option>
                    <option value="PUBLIC_LIMITED">
                      Public Limited Company
                    </option>
                    <option value="PRIVATE_LIMITED">
                      Private Limited Company
                    </option>
                    <option value="PARTNERSHIP">Partnership</option>
                    <option value="LLP">LLP</option>
                    <option value="INDIVIDUAL">Individual</option>
                  </Input>
                  {getFieldError("business_type") && (
                    <div className="text-danger small">
                      {getFieldError("business_type")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="percentage_of_business_owned">
                    Percentage Of Business Owned(%)
                  </Label>
                  <Input
                    type="text"
                    id="percentage_of_business_owned"
                    value={formValues?.percentage_of_business_owned || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "percentage_of_business_owned",
                        e.target.value,
                      )
                    }
                  />
                  {getFieldError("percentage_of_business_owned") && (
                    <div className="text-danger small">
                      {getFieldError("percentage_of_business_owned")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            </>
          )}
        </Row>
        <Row>
          {formValues?.employment_status === "SELF_EMPLOYED" && (
            <>
              <Col md={12}>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      name="is_accounts_available"
                      checked={formValues?.is_accounts_available || false}
                      onChange={(e) =>
                        setFormValues((prevValues) => ({
                          ...prevValues!,
                          is_accounts_available: e.target.checked,
                        }))
                      }
                    />
                    Accounts Available?
                  </Label>
                  {getFieldError("is_accounts_available") && (
                    <div className="text-danger small">
                      {getFieldError("is_accounts_available")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={12}>
                {formValues?.is_accounts_available && (
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="year1">
                          Year 1<span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="text"
                          id="year1"
                          placeholder="e.g. 2014"
                          value={formValues?.year1 || ""}
                          onChange={(e) =>
                            handleInputChange("year1", e.target.value)
                          }
                          required
                        />
                        {getFieldError("year1") && (
                          <div className="text-danger small">
                            {getFieldError("year1")}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="year1_net_profit">
                          Year 1 net profit({getCurrencySign()})
                          <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="number"
                          id="year1_net_profit"
                          placeholder="0"
                          value={formValues?.year1_net_profit || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "year1_net_profit",
                              e.target.value,
                            )
                          }
                          required
                        />
                        {getFieldError("year1_net_profit") && (
                          <div className="text-danger small">
                            {getFieldError("year1_net_profit")}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="year2">Year 2</Label>
                        <Input
                          type="text"
                          id="year2"
                          placeholder="e.g. 2013"
                          value={formValues?.year2 || ""}
                          onChange={(e) =>
                            handleInputChange("year2", e.target.value)
                          }
                        />
                        {getFieldError("year2") && (
                          <div className="text-danger small">
                            {getFieldError("year2")}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="year2_net_profit">
                          Year 2 net profit({getCurrencySign()})
                        </Label>
                        <Input
                          type="number"
                          id="year2_net_profit"
                          placeholder="0"
                          value={formValues?.year2_net_profit || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "year2_net_profit",
                              e.target.value,
                            )
                          }
                        />
                        {getFieldError("year2_net_profit") && (
                          <div className="text-danger small">
                            {getFieldError("year2_net_profit")}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="year3">Year 3</Label>
                        <Input
                          type="text"
                          id="year3"
                          placeholder="e.g. 2012"
                          value={formValues?.year3 || ""}
                          onChange={(e) =>
                            handleInputChange("year3", e.target.value)
                          }
                        />
                        {getFieldError("year3") && (
                          <div className="text-danger small">
                            {getFieldError("year3")}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="year3_net_profit">
                          Year 3 net profit({getCurrencySign()})
                        </Label>
                        <Input
                          type="number"
                          id="year3_net_profit"
                          placeholder="0"
                          value={formValues?.year3_net_profit || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "year3_net_profit",
                              e.target.value,
                            )
                          }
                        />
                        {getFieldError("year3_net_profit") && (
                          <div className="text-danger small">
                            {getFieldError("year3_net_profit")}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                )}
              </Col>
            </>
          )}
        </Row>
        <Row>
          {formValues?.employment_status === "SELF_EMPLOYED" && (
            <>
              <Col md={6}>
                <FormGroup>
                  <Label for="accountant_name">Accountant Name</Label>
                  <Input
                    type="text"
                    id="accountant_name"
                    value={formValues?.accountant_name || ""}
                    onChange={(e) =>
                      handleInputChange("accountant_name", e.target.value)
                    }
                  />
                  {getFieldError("accountant_name") && (
                    <div className="text-danger small">
                      {getFieldError("accountant_name")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="accountant_qualifications">
                    Accountant Qualifications
                  </Label>
                  <Input
                    type="text"
                    id="accountant_qualifications"
                    value={formValues?.accountant_qualifications || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "accountant_qualifications",
                        e.target.value,
                      )
                    }
                  />
                  {getFieldError("accountant_qualifications") && (
                    <div className="text-danger small">
                      {getFieldError("accountant_qualifications")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            </>
          )}
        </Row>
        <Row>
          {formValues?.employment_status === "SELF_EMPLOYED" && (
            <>
              <Col md={4}>
                <FormGroup>
                  <Label for="salary">
                    Salary({getCurrencySign()})
                    <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="number"
                    id="salary"
                    placeholder="0"
                    value={formValues?.salary || ""}
                    onChange={(e) =>
                      handleInputChange("salary", e.target.value)
                    }
                    required
                  />
                  {getFieldError("salary") && (
                    <div className="text-danger small">
                      {getFieldError("salary")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="dividends">
                    Dividends({getCurrencySign()})
                    <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="number"
                    id="dividends"
                    placeholder="0"
                    value={formValues?.dividends || ""}
                    onChange={(e) =>
                      handleInputChange("dividends", e.target.value)
                    }
                    required
                  />
                  {getFieldError("dividends") && (
                    <div className="text-danger small">
                      {getFieldError("dividends")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="turnover">Turn Over({getCurrencySign()})</Label>
                  <Input
                    type="number"
                    id="turnover"
                    placeholder="0"
                    value={formValues?.turnover || ""}
                    onChange={(e) =>
                      handleInputChange("turnover", e.target.value)
                    }
                  />
                  {getFieldError("turnover") && (
                    <div className="text-danger small">
                      {getFieldError("turnover")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            </>
          )}
        </Row>
        {formValues?.employment_status === "OTHER" && (
          <>
            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label for="other_income">
                    Other Income({getCurrencySign()})
                  </Label>
                  <Input
                    type="number"
                    id="other_income"
                    placeholder="0"
                    value={formValues?.other_income || ""}
                    onChange={(e) =>
                      handleInputChange("other_income", e.target.value)
                    }
                  />
                  {getFieldError("other_income") && (
                    <div className="text-danger small">
                      {getFieldError("other_income")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="other_income_source">
                    Other Income Source<span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="select"
                    id="other_income_source"
                    required
                    value={formValues?.other_income_source || ""}
                    onChange={(e) =>
                      handleInputChange("other_income_source", e.target.value)
                    }
                  >
                    <option value="">Select...</option>
                    <option value="CARERS_ALLOWANCE">Carer's Allowance</option>
                    <option value="CHILD_BENEFIT">Child Benefit</option>
                    <option value="CHILD_MAINTENANCE_COURT_ORDERED">
                      Child Maintenance Court Ordered
                    </option>
                    <option value="CHILD_MAINTENANCE_NON_COURT_ORDERED">
                      Child Maintenance Non Court Ordered
                    </option>
                    <option value="CHILD_TAX_CREDITS">Child Tax Credits</option>
                    <option value="DISABILITY_LIVING_ALLOWANCE">
                      Disability Living Allowance (DLA)
                    </option>
                    <option value="EMPLOYMENT_AND_SUPPORT_ALLOWANCE">
                      Employment and Support Allowance (ESA)
                    </option>
                    <option value="MAINTENANCE_INCOME">
                      Maintenance Income
                    </option>
                    <option value="PERSONAL_INDEPENDENCE_PAYMENTS">
                      Personal Independence Payments (PIP)
                    </option>
                    <option value="MATERNITY_PAY">Maternity Pay</option>
                    <option value="PENSION_CREDIT">Pension Credit</option>
                    <option value="RENTAL_INCOME">Rental Income</option>
                    <option value="WORKING_TAX_CREDITS">
                      Working Tax Credits
                    </option>
                    <option value="OTHER">Other</option>
                  </Input>
                  {getFieldError("other_income_source") && (
                    <div className="text-danger small">
                      {getFieldError("other_income_source")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              {formValues?.other_income_source === "OTHER" && (
                <Col md={4}>
                  <FormGroup>
                    <Label for="other">Other Income Source Details</Label>
                    <Input
                      type="text"
                      id="other"
                      value={formValues?.other || ""}
                      onChange={(e) =>
                        handleInputChange("other", e.target.value)
                      }
                    />
                    {getFieldError("other") && (
                      <div className="text-danger small">
                        {getFieldError("other")}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              )}
              <Col md={4}>
                <FormGroup>
                  <Label for="other_income_start_date">
                    Other income start date
                  </Label>
                  <Input
                    type="date"
                    id="other_income_start_date"
                    value={formValues?.other_income_start_date || 0}
                    onChange={(e) =>
                      handleInputChange(
                        "other_income_start_date",
                        e.target.value,
                      )
                    }
                  />
                  {getFieldError("other_income_start_date") && (
                    <div className="text-danger small">
                      {getFieldError("other_income_start_date")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            </Row>
          </>
        )}
        {formValues?.employment_status === "CONTRACTOR" && (
          <>
            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label for="contractor_industry">Contractor Industry</Label>
                  <Input
                    type="text"
                    id="contractor_industry"
                    value={formValues?.contractor_industry || ""}
                    onChange={(e) =>
                      handleInputChange("contractor_industry", e.target.value)
                    }
                  />
                  {getFieldError("contractor_industry") && (
                    <div className="text-danger small">
                      {getFieldError("contractor_industry")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="current_contract_start">
                    Current Contract Start<span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="date"
                    id="current_contract_start"
                    value={formValues?.current_contract_start || 0}
                    onChange={(e) =>
                      handleInputChange(
                        "current_contract_start",
                        e.target.value,
                      )
                    }
                    required
                  />
                  {getFieldError("current_contract_start") && (
                    <div className="text-danger small">
                      {getFieldError("current_contract_start")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="current_contract_end">
                    Current Contract End<span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="date"
                    id="current_contract_end"
                    value={formValues?.current_contract_end || 0}
                    onChange={(e) =>
                      handleInputChange("current_contract_end", e.target.value)
                    }
                    required
                  />
                  {getFieldError("current_contract_end") && (
                    <div className="text-danger small">
                      {getFieldError("current_contract_end")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label for="time_contracting">
                    Time contracting<span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="time_contracting"
                    value={formValues?.time_contracting || ""}
                    onChange={(e) =>
                      handleInputChange("time_contracting", e.target.value)
                    }
                    required
                  />
                  {getFieldError("time_contracting") && (
                    <div className="text-danger small">
                      {getFieldError("time_contracting")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="day_rate">
                    Day Rate({getCurrencySign()})
                    <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="number"
                    id="day_rate"
                    placeholder="0"
                    value={formValues?.day_rate || ""}
                    onChange={(e) =>
                      handleInputChange("day_rate", e.target.value)
                    }
                    required
                  />
                  {getFieldError("day_rate") && (
                    <div className="text-danger small">
                      {getFieldError("day_rate")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="hourly_rate">
                    Hourly Rate({getCurrencySign()})
                  </Label>
                  <Input
                    type="number"
                    id="hourly_rate"
                    placeholder="0"
                    value={formValues?.hourly_rate || ""}
                    onChange={(e) =>
                      handleInputChange("hourly_rate", e.target.value)
                    }
                  />
                  {getFieldError("hourly_rate") && (
                    <div className="text-danger small">
                      {getFieldError("hourly_rate")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            </Row>
          </>
        )}
        <Row>
          <Col md={12}>
            <FormGroup>
              <Label for="note">Note</Label>
              <Input
                type="textarea"
                id="note"
                value={formValues?.note || ""}
                onChange={(e) => handleInputChange("note", e.target.value)}
              />
              {getFieldError("note") && (
                <div className="text-danger small">{getFieldError("note")}</div>
              )}
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-between pt-3">
            <Button
              color="success"
              className="border-success"
              onClick={() => setAddEmploymentModalOpen(true)}
              disabled={session?.user?.role === "APPLICANT"}
            >
              Add New
            </Button>
            <div className=" d-flex justify-content-end gap-2">
              <Button
                color="primary"
                type="submit"
                disabled={
                  isUpdateEmploymentDetailsLoading ||
                  session?.user?.role === "APPLICANT"
                }
                onClick={() => {
                  submitActionRef.current = "save";
                }}
              >
                {isUpdateEmploymentDetailsLoading && submitting === "save"
                  ? "Saving..."
                  : "Save Changes"}
              </Button>
              <Button
                type="submit"
                color="secondary"
                disabled={isUpdateEmploymentDetailsLoading}
                onClick={(e) => {
                  e.preventDefault();
                  if (session?.user?.role === "APPLICANT") {
                    handleNextTab();
                  } else {
                    submitActionRef.current = "next";
                    formRef.current?.requestSubmit();
                  }
                }}
              >
                {session?.user?.role === "APPLICANT"
                  ? "Go To Next"
                  : isUpdateEmploymentDetailsLoading &&
                      submitting === "save_next"
                    ? "Saving..."
                    : "Save & Next"}
              </Button>
            </div>
          </Col>
        </Row>
      </form>

      {/* Add new employment details */}
      <AddEmploymentDetailsModal
        isOpen={isAddEmploymentModalOpen}
        toggle={() => setAddEmploymentModalOpen(!isAddEmploymentModalOpen)}
        employmentData={formValues}
        groupedData={groupedData}
      />

      <GetAddressModal
        isOpen={isAddressModalOpen}
        toggle={toggleAddressModal}
        addresses={addressList}
        onSelect={
          addressType === "employer"
            ? handleSelectAddress
            : handleSelectBusinessAddress
        }
      />
    </CardBody>
  );
};
