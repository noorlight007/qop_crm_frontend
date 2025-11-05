"use client";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/CommonComponents/Cases/CasesApi";
import { useGetPreviousAddressQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/ApplicantsDetails/ApplicantPreviousAddressApi";
import { useUpdateApplicantDetailsMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/ApplicantsDetails/ApplicantsDetailsApi";
import { basicTabIndicator } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/CaseDetailsTabIndicatorSlice";
import {
  useGetCaseLoanDetailsQuery,
  useGetLoanDetailsQuery,
} from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/LoanDetails/LoanDetailsApi";
import { ApplicantProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/ApplicantsDetailsTypes";
import { ApplicantsUsersProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/ApplicantsUserTypes";
import LoadingSpinner from "@/app/loading";
import { countries } from "@/utils/Countries";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { skipToken } from "@reduxjs/toolkit/query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Container,
  FormGroup,
  FormText,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from "reactstrap";
import AddCompanyDetailsFormModal from "./ApplicantDetailsModals/AddApplicantCompanyInfoModal";
import AddDependantFormModal from "./ApplicantDetailsModals/AddApplicantDependantsModal";
import AddPreviousAddressModal from "./ApplicantDetailsModals/AddPreviousAddressModal";
import ApplicantDependantsViewModal from "./ApplicantDetailsModals/ApplicantDependantsViewModal";
import ViewPreviousAddressModal from "./ApplicantDetailsModals/ViewPreviousAddressModal";

const ApplicantsDetailsTabContent: React.FC<ApplicantsUsersProps> = ({
  applicantsData,
  basicTab,
  onTabChange,
}) => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const params = useParams();
  const { casealias } = params;
  const [isLoading, setIsLoading] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isDependantsModalOpen, setIsDependantsModalOpen] = useState(false);
  const [isDependantsViewModalOpen, setIsDependantsViewModalOpen] =
    useState(false);
  const [isAddPreviousAddressModalOpen, setIsAddPreviousAddressModalOpen] =
    useState(false);
  const [isViewPreviousAddressModalOpen, setIsViewPreviousAddressModalOpen] =
    useState(false);
  const submitActionRef = useRef<
    "save" | "next" | "next-applicant" | "previous-applicant"
  >("save");
  const formRef = useRef<HTMLFormElement>(null);

  const toggleViewModal = () => {
    setIsDependantsViewModalOpen(!isDependantsViewModalOpen);
  };

  // Rtk hooks
  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias }
  );
  const [updateApplicantDetails, { isLoading: isUpdatingApplicant }] =
    useUpdateApplicantDetailsMutation();
  const { data } = useGetCaseLoanDetailsQuery(casealias);

  // Ensure data exists and has elements before accessing [0]
  const loandetailsAlias =
    Array.isArray(data) && data.length > 0 ? data[0].alias : null;
  const { data: loandetailsData, isLoading: isLoandetailsDataLoading } =
    useGetLoanDetailsQuery(
      loandetailsAlias
        ? { case_alias: casealias, loanDetails_alias: loandetailsAlias }
        : skipToken
    );

  const applicationType = loandetailsData?.application_type;

  const currentTab: string | null = useAppSelector(
    (state) => state.caseDetails.basicTabId
  );

  const [formValues, setFormValues] = useState<ApplicantProps>({
    alias: basicTab || "",
    is_company_application: false,
    title: "",
    maiden_name: "",
    date_of_name_change: "",
    date_of_birth: "",
    anticipated_retirement_age: 0,
    state_retirement_age: 0,
    is_smoker: false,
    gender: "",
    nationality: "GB",
    is_dual_nationality: false,
    dual_nationality: "",
    marital_status: "",
    ni_number: "",
    country_of_birth: "",
    bank_name: "",
    home_phone: "",
    mobile_phone: "",
    work_phone: "",
    email: "",
    has_dependants: false,
    number_of_dependants: 0,
    date_of_arrival_uk: "",
    indefinite_right_to_reside: true,
    visa_details: "",
    visa_expiry_date: "",
    postcode: "",
    house_number_or_name: "",
    address_line1: "",
    city: "",
    county: "",
    country: "",
    effective_from: "",
    time_at_address_years: 0,
    time_at_address_months: 0,
    residential_status: "",
    current_mortgage_balance: "",
    property_value: "",
    owner_monthly_payment: "",
    lender: "",
    mortgage_start_date: "",
    mortgage_type: "",
    current_interest_rate: "",
    remaining_term: 0,
    repayment_type: "",
    current_interest_type: "",
    early_repayment_charge_applies: false,
    erc_expiry_date: "",
    erc_amount: "",
    erc_being_paid: false,
    mortgage_account_number: "",
    being_redeemed: false,
    is_mortgage_portable: false,
    is_mortgage_being_ported: false,
    mortgage_not_to_complete_until_erc_ended: "",
    mortgage_charter_scheme: false,
    property_type: "",
    bedrooms: 0,
    tenure: "",
    year_built: 0,
    notes: "",
    rental_monthly_payment: null,
    landlord_name: null,
    landlord_telephone: null,
    landlord_email: null,
    landlord_address_postcode: null,
    landlord_house_number_or_name: null,
    landlord_address_line_one: null,
    landlord_city: null,
    landlord_county: null,
    landlord_country: null,
    intend_to_move_into_the_new_property: false,
    new_address_house_number_or_name: null,
    new_address_address_one: null,
    new_address_address_two: null,
    new_address_city: null,
    new_address_county: null,
    new_address_postcode: null,
    new_address_country: null,
    new_address_effective_from: null,
    updated_by: "",
  });

  // RTK previous address api hooks
  const { data: previousAddressesData, isLoading: isPreviousAddressesLoading } =
    useGetPreviousAddressQuery(
      {
        case_alias: casealias,
        applicantDetails_alias: formValues.alias,
      },
      {
        skip: !casealias || !formValues.alias,
        refetchOnMountOrArgChange: true,
      }
    );

  const selectedApplicant = applicantsData?.find(
    (applicant) => applicant.alias === basicTab
  );

  useEffect(() => {
    if (selectedApplicant) {
      const { marketing_preferences, ...newValue } = selectedApplicant;
      setFormValues(newValue);
    }
  }, [selectedApplicant]);

  useEffect(() => {
    // Calculate years and months when effective_from date changes
    if (formValues.effective_from) {
      const effectiveDate = new Date(formValues.effective_from);
      const today = new Date();

      // Calculate the difference in milliseconds
      const diffTime = Math.abs(today.getTime() - effectiveDate.getTime());

      // Calculate total months between the two dates
      const totalMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // Average days in a month

      // Calculate years and remaining months
      const years = Math.floor(totalMonths / 12);
      const months = totalMonths % 12;

      // Update the form values
      setFormValues((prevValues) => ({
        ...prevValues,
        time_at_address_years: years,
        time_at_address_months: months,
      }));
    }
  }, [formValues.effective_from]);

  if (!selectedApplicant) {
    return <div>No applicant data available.</div>;
  }

  const handleInputChange = (
    name: keyof ApplicantProps,
    value: string | number | boolean | string[] | null
  ) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await updateApplicantDetails({
        case_alias: casealias as string,
        applicantDetails_alias: formValues.alias as string,
        applicantDetails: formValues,
      });

      if (response.data) {
        toast.success("Applicant details updated successfully!");
        // Handle different submit actions
        if (submitActionRef.current === "next") {
          handleNextTab();
        } else if (submitActionRef.current === "next-applicant") {
          handleNextApplicantTab();
        } else if (submitActionRef.current === "previous-applicant") {
          handlePreviousApplicantTab();
        }
      } else if (response.error) {
        // Extract backend error message - prioritize details field
        const errorMessage =
          (response.error as any)?.data?.detail ||
          "Error updating applicant details!";
        toast.error(errorMessage);
      } else {
        toast.error("Error updating applicant details!");
      }
    } catch (error: any) {
      // Handle any unexpected errors
      const errorMessage = error?.message || "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextTab = () => {
    const nextTabNav = getNextTabNav(caseData?.case_stage, currentTab!);
    if (nextTabNav) {
      dispatch(basicTabIndicator(nextTabNav));
    } else {
      toast.warning("This is the last tab.");
    }
  };

  const handleNextApplicantTab = () => {
    // Find the current applicant index
    const currentIndex = applicantsData?.findIndex(
      (applicant) => applicant.alias === basicTab
    );

    // Check if there's a next applicant
    if (
      currentIndex !== undefined &&
      currentIndex !== -1 &&
      applicantsData &&
      currentIndex < applicantsData.length - 1
    ) {
      const nextApplicant = applicantsData[currentIndex + 1];
      if (onTabChange && nextApplicant.alias) {
        onTabChange(nextApplicant.alias);
        toast.success("Moved to next applicant!");
      }
      return nextApplicant.alias;
    } else {
      toast.warning("This is the last applicant.");
      return null;
    }
  };

  const handlePreviousApplicantTab = () => {
    // Find the current applicant index
    const currentIndex = applicantsData?.findIndex(
      (applicant) => applicant.alias === basicTab
    );

    // Check if there's a previous applicant
    if (currentIndex !== undefined && currentIndex > 0 && applicantsData) {
      const previousApplicant = applicantsData[currentIndex - 1];
      if (onTabChange && previousApplicant.alias) {
        onTabChange(previousApplicant.alias);
        toast.success("Moved to previous applicant!");
      }
      return previousApplicant.alias;
    } else {
      toast.warning("This is the first applicant.");
      return null;
    }
  };

  const handleCopyAddress = () => {
    // Find the current applicant index
    const currentIndex = applicantsData?.findIndex(
      (applicant) => applicant.alias === basicTab
    );

    // Check if there's a previous applicant
    if (currentIndex && currentIndex > 0 && applicantsData) {
      const previousApplicant = applicantsData[currentIndex - 1];

      // Copy address fields from previous applicant
      setFormValues((prevValues) => ({
        ...prevValues,
        postcode: previousApplicant.postcode || "",
        house_number_or_name: previousApplicant.house_number_or_name || "",
        address_line1: previousApplicant.address_line1 || "",
        city: previousApplicant.city || "",
        county: previousApplicant.county || "",
        country: previousApplicant.country || "",
        residential_status: previousApplicant.residential_status || "",
      }));

      toast.success("Address copied from previous applicant!");
    }
  };

  if (isCaseFetching) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <Row>
        <form ref={formRef} id="applicant-form" onSubmit={handleSubmit}>
          {applicationType === "RESIDENTIAL_MORTGAGE" ||
          applicationType === "SELECT_APPLICATION_TYPE" ? (
            ""
          ) : (
            <Row className="mb-3 border-primary rounded-2 p-3">
              <h3 className="text-info fs-4 mb-2">Company Applicant</h3>
              {/* Company Applicant Section */}
              <FormGroup>
                <Label>Is this application being made in a company name?</Label>
                {["yes", "no"].map((option) => (
                  <div key={option}>
                    <Label>
                      <Input
                        type="radio"
                        name="is_company_application"
                        value={option}
                        checked={
                          formValues.is_company_application ===
                          (option === "yes")
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "is_company_application",
                            e.target.value === "yes"
                          )
                        }
                        className="me-1"
                      />
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Label>
                  </div>
                ))}
                {formValues?.is_company_application && (
                  <Button
                    onClick={() => setIsCompanyModalOpen(true)}
                    color="primary"
                  >
                    Continue with Company Application
                  </Button>
                )}
              </FormGroup>
            </Row>
          )}

          <h3 className="text-primary fs-4 mb-2"> Applicant</h3>
          {/* Personal Details Section */}
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  style={{ padding: "11px 11px" }}
                  value={formValues?.applicant?.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  readOnly
                />

                <FormText className="text-warning small">
                  Read Only Field
                </FormText>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="first_name">First Name</Label>
                <Input
                  id="first_name"
                  type="text"
                  value={formValues.applicant?.first_name || ""}
                  readOnly
                />
                <FormText className="text-warning small">
                  Read Only Field
                </FormText>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="middle_name">Middle Name(s)</Label>
                <Input
                  id="maiden_name"
                  type="text"
                  value={formValues.applicant?.middle_name || ""}
                  readOnly
                />
                <FormText className="text-warning small">
                  Read Only Field
                </FormText>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  type="text"
                  value={formValues.applicant?.last_name || ""}
                  readOnly
                />
                <FormText className="text-warning small">
                  Read Only Field
                </FormText>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="maiden_name">Maiden / Previous Last Name</Label>
                <Input
                  id="maiden_name"
                  type="text"
                  value={formValues.maiden_name || ""}
                  onChange={(e) =>
                    handleInputChange("maiden_name", e.target.value)
                  }
                />
              </FormGroup>
            </Col>
            {formValues?.maiden_name && (
              <Col md={6}>
                <FormGroup>
                  <Label for="date_of_name_change">
                    Date of Maiden Name Change (if applicable)
                  </Label>
                  <Input
                    id="date_of_name_change"
                    type="date"
                    value={formValues.date_of_name_change || ""}
                    onChange={(e) =>
                      handleInputChange("date_of_name_change", e.target.value)
                    }
                  />
                </FormGroup>
              </Col>
            )}
            <Col md={6}>
              <Row>
                <Col md={8}>
                  <Label for="date_of_birth">Date of Birth*</Label>
                  <FormGroup className="d-flex justify-content-center align-items-center">
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={formValues.date_of_birth || ""}
                      className="rounded-end-0"
                      onChange={(e) =>
                        handleInputChange("date_of_birth", e.target.value)
                      }
                      required
                    />
                    <InputGroupText
                      className="border-start-0 rounded-start-0"
                      style={{ padding: "11px 20px" }}
                    >
                      {formValues.date_of_birth
                        ? Math.floor(
                            (new Date().getTime() -
                              new Date(formValues.date_of_birth).getTime()) /
                              (1000 * 60 * 60 * 24 * 365.25)
                          ) + "y"
                        : "0y"}
                    </InputGroupText>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="is_smoker">Are you a smoker?</Label>
                    {["yes", "no"].map((value) => (
                      <div key={value}>
                        <Label className="me-2">
                          <Input
                            type="radio"
                            name="is_smoker"
                            className="me-1"
                            value={value}
                            checked={formValues.is_smoker === (value === "yes")}
                            onChange={(e) =>
                              handleInputChange(
                                "is_smoker",
                                e.target.value === "yes"
                              )
                            }
                          />
                          {value.charAt(0).toUpperCase() + value.slice(1)}
                        </Label>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="anticipated_retirement_age">
                  Anticipated Retirement Age*
                </Label>
                <Input
                  id="anticipated_retirement_age"
                  type="number"
                  value={formValues.anticipated_retirement_age || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "anticipated_retirement_age",
                      e.target.value
                    )
                  }
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="state_retirement_age">State Retirement Age</Label>
                <Input
                  id="state_retirement_age"
                  type="number"
                  value={formValues.state_retirement_age || ""}
                  onChange={(e) =>
                    handleInputChange("state_retirement_age", e.target.value)
                  }
                />
              </FormGroup>
            </Col>

            {/* Additional Fields */}
            <Col md={6}>
              <FormGroup>
                <Label for="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  type="select"
                  value={formValues.nationality}
                  onChange={(e) =>
                    handleInputChange("nationality", e.target.value)
                  }
                >
                  <option value="">Select a country</option>
                  {/* Map through the list of countries */}
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="is_dual_nationality">
                  Does the applicant have a dual nationality?
                </Label>
                {["yes", "no"].map((value) => (
                  <div key={value}>
                    <Label className="me-2">
                      <Input
                        type="radio"
                        name="is_dual_nationality"
                        className="me-1"
                        value={value}
                        checked={
                          formValues.is_dual_nationality === (value === "yes")
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "is_dual_nationality",
                            e.target.value === "yes"
                          )
                        }
                      />
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </Label>
                  </div>
                ))}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="marital_status">Marital Status</Label>
                <Input
                  id="marital_status"
                  type="select"
                  value={formValues.marital_status}
                  onChange={(e) =>
                    handleInputChange("marital_status", e.target.value)
                  }
                >
                  <option value="">Select an option</option>
                  <option value="SINGLE">Single</option>
                  <option value="MARRIED">Married</option>
                  <option value="DIVORCED">Divorced</option>
                  <option value="SEPARATED">Separated</option>
                  <option value="WIDOW">Widow</option>
                  <option value="WIDOWER">Widower</option>
                  <option value="CO_HABITING">Co-Habiting</option>
                  <option value="CIVIL_PARTNER">Civil Partner</option>
                  <option value="RELIGIOUSLY_MARRIED">
                    Religiously Married
                  </option>
                </Input>
              </FormGroup>
            </Col>
            {formValues.is_dual_nationality && (
              <Col md={6}>
                <FormGroup>
                  <Label for="dual_nationality">Dual Nationality</Label>
                  <Input
                    id="dual_nationality"
                    type="select"
                    value={formValues.dual_nationality}
                    onChange={(e) =>
                      handleInputChange("dual_nationality", e.target.value)
                    }
                  >
                    <option value="">Select a country</option>
                    {/* Map through the list of countries */}
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            )}
          </Row>

          {/* Conditional Fields */}
          {formValues.nationality !== "GB" && formValues.nationality !== "" && (
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="date_of_arrival_uk">Date of Arrival in UK</Label>
                  <Input
                    id="date_of_arrival_uk"
                    type="date"
                    value={formValues.date_of_arrival_uk || ""}
                    onChange={(e) =>
                      handleInputChange("date_of_arrival_uk", e.target.value)
                    }
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="indefinite_right_to_reside">
                    Indefinite Right To Reside?
                  </Label>
                  {["yes", "no"].map((option) => (
                    <div key={option}>
                      <Label className="me-2">
                        <Input
                          type="radio"
                          name="indefinite_right_to_reside"
                          className="me-1"
                          value={option}
                          checked={
                            formValues.indefinite_right_to_reside ===
                            (option === "no")
                          }
                          onChange={(e) =>
                            handleInputChange(
                              "indefinite_right_to_reside",
                              e.target.value === "no"
                            )
                          }
                        />
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Label>
                    </div>
                  ))}
                </FormGroup>
              </Col>
            </Row>
          )}

          {/* Visa Details - Hidden if Indefinite Right to Reside is "yes" */}
          {formValues.nationality !== "GB" &&
            formValues.nationality !== "" &&
            !formValues.indefinite_right_to_reside && (
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="visa_details">Visa Details</Label>
                    <Input
                      id="visa_details"
                      type="text"
                      value={formValues.visa_details || ""}
                      onChange={(e) =>
                        handleInputChange("visa_details", e.target.value)
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="visa_expiry_date">Visa Expiry Date</Label>
                    <Input
                      id="visa_expiry_date"
                      type="date"
                      value={formValues.visa_expiry_date || ""}
                      onChange={(e) =>
                        handleInputChange("visa_expiry_date", e.target.value)
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
            )}

          {/* Identification and Contact Information */}
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="ni_number">NI Number</Label>
                <Input
                  id="ni_number"
                  type="text"
                  value={formValues.ni_number || ""}
                  onChange={(e) =>
                    handleInputChange("ni_number", e.target.value)
                  }
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="country_of_birth">Country of Birth</Label>
                <Input
                  id="country_of_birth"
                  type="text"
                  value={formValues.country_of_birth || ""}
                  onChange={(e) =>
                    handleInputChange("country_of_birth", e.target.value)
                  }
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="bank_name">Who do you bank with?</Label>
                <Input
                  id="bank_name"
                  type="text"
                  value={formValues.bank_name || ""}
                  onChange={(e) =>
                    handleInputChange("bank_name", e.target.value)
                  }
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <Label for="how_long_banked">
                How long have you banked with them?
              </Label>
              <FormGroup className="d-flex justify-content-center align-items-center gap-3">
                <Input
                  id="how_long_banked"
                  type="number"
                  placeholder="Years"
                  // value={formValues.how_long_banked || ""}
                  // onChange={(e) =>
                  //   handleInputChange("how_long_banked", e.target.value)
                  // }
                />
                <Input
                  id="how_long_banked"
                  type="number"
                  placeholder="Months"
                  // value={formValues.how_long_banked || ""}
                  // onChange={(e) =>
                  //   handleInputChange("how_long_banked", e.target.value)
                  // }
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="home_phone">Home Telephone</Label>
                <Input
                  id="home_phone"
                  type="text"
                  value={formValues.home_phone || ""}
                  onChange={(e) =>
                    handleInputChange("home_phone", e.target.value)
                  }
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="mobile_phone">Mobile Number*</Label>
                <Input
                  id="mobile_phone"
                  type="text"
                  value={formValues.mobile_phone || ""}
                  onChange={(e) =>
                    handleInputChange("mobile_phone", e.target.value)
                  }
                  required
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="work_phone">Work Number</Label>
                <Input
                  id="work_phone"
                  type="text"
                  value={formValues.work_phone || ""}
                  onChange={(e) =>
                    handleInputChange("work_phone", e.target.value)
                  }
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formValues.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>

          {/* Marketing Preferences */}
          {/* <Row>
            <Col md={12}>
              <FormGroup>
                <Label for="marketing_preferences">
                  Marketing Preferences:
                </Label>
                {["EMAIL", "TELEPHONE", "SMS", "POST", "NO_COMMUNICATION"].map(
                  (type) => (
                    <Label key={type} className="me-2">
                      <Input
                        type="checkbox"
                        checked={formValues.marketing_preferences.includes(
                          type
                        )}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          const currentValue =
                            formValues.marketing_preferences || [];
                          const updatedValue = isChecked
                            ? [...currentValue, type]
                            : currentValue.filter((item) => item !== type);
                          handleInputChange(
                            "marketing_preferences",
                            updatedValue
                          );
                        }}
                      />
                      {type.charAt(0).toUpperCase() +
                        type.slice(1).toLowerCase().replace("_", " ")}
                    </Label>
                  )
                )}
              </FormGroup>
            </Col>
          </Row> */}

          {/* Dependents */}
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="has_dependants">Do you have any dependants?</Label>
                {["yes", "no"].map((value) => (
                  <div key={value}>
                    <Label className="me-2">
                      <Input
                        type="radio"
                        name="has_dependants"
                        className="me-1"
                        value={value}
                        checked={
                          formValues.has_dependants === (value === "yes")
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "has_dependants",
                            e.target.value === "yes"
                          )
                        }
                      />
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </Label>
                  </div>
                ))}
              </FormGroup>
            </Col>
            {formValues.has_dependants && (
              <Col
                md={6}
                className="d-flex align-items-center justify-content-center gap-3"
              >
                <Button onClick={() => setIsDependantsModalOpen(true)}>
                  Add Dependants
                </Button>
                <Button color="success" onClick={toggleViewModal}>
                  View Dependants
                </Button>
              </Col>
            )}
          </Row>
          <Row className="d-flex justify-content-between align-items-center mb-3">
            <Col xs="auto">
              <h3 className="text-info my-0">Current Address</h3>
            </Col>
            {applicantsData &&
              applicantsData.findIndex(
                (applicant) => applicant.alias === basicTab
              ) > 0 && (
                <Col xs="auto">
                  <Button
                    color="info"
                    size="sm"
                    outline
                    onClick={handleCopyAddress}
                    title="Copy address from first applicant"
                  >
                    <i className="fa fa-copy me-2"></i>
                    Copy Address from First Applicant
                  </Button>
                </Col>
              )}
          </Row>
          {/* Current Address */}
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="postcode">Postcode*</Label>
                <Input
                  id="postcode"
                  type="text"
                  value={formValues.postcode || ""}
                  onChange={(e) =>
                    handleInputChange("postcode", e.target.value)
                  }
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="house_number_or_name">House Name or Number*</Label>
                <Input
                  id="house_number_or_name"
                  type="text"
                  value={formValues.house_number_or_name || ""}
                  onChange={(e) =>
                    handleInputChange("house_number_or_name", e.target.value)
                  }
                  required
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="address_line1">Address Line 1*</Label>
                <Input
                  id="address_line1"
                  type="text"
                  value={formValues.address_line1 || ""}
                  onChange={(e) =>
                    handleInputChange("address_line1", e.target.value)
                  }
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="city">City*</Label>
                <Input
                  id="city"
                  type="text"
                  value={formValues.city || ""}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  required
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="county">County</Label>
                <Input
                  id="county"
                  type="text"
                  value={formValues.county || ""}
                  onChange={(e) => handleInputChange("county", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="country">Country*</Label>
                <Input
                  id="country"
                  type="text"
                  value={formValues.country || ""}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  required
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="effective_from">
                  Effective From*
                  <small className="text-danger">
                    (Three years address history required)
                  </small>
                </Label>
                <Input
                  id="effective_from"
                  type="date"
                  value={formValues.effective_from || ""}
                  onChange={(e) =>
                    handleInputChange("effective_from", e.target.value)
                  }
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <Label for="time_at_address">Time at this Address</Label>
              <FormGroup className="d-flex justify-content-center align-items-center gap-3">
                <InputGroup>
                  <Input
                    id="time_at_address_years"
                    type="number"
                    placeholder="Years"
                    readOnly
                    className="rounded-end-0"
                    value={formValues.time_at_address_years || ""}
                    onChange={(e) =>
                      handleInputChange("time_at_address_years", e.target.value)
                    }
                  />
                  <InputGroupText className="border-start-0 rounded-start-0">
                    Years
                  </InputGroupText>
                </InputGroup>

                <InputGroup>
                  <Input
                    id="time_at_address"
                    type="number"
                    placeholder="Months"
                    readOnly
                    className="rounded-end-0"
                    value={formValues.time_at_address_months || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "time_at_address_months",
                        e.target.value
                      )
                    }
                  />
                  <InputGroupText className="border-start-0 rounded-start-0">
                    Months
                  </InputGroupText>
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              {formValues.effective_from &&
                new Date(formValues.effective_from) >
                  new Date(
                    new Date().setFullYear(new Date().getFullYear() - 3)
                  ) && (
                  <div className="mb-3">
                    <div className="d-flex gap-3 mt-2 mb-2">
                      <Button
                        color="primary"
                        onClick={() => setIsAddPreviousAddressModalOpen(true)}
                        disabled={previousAddressesData?.length > 0}
                      >
                        Add Previous Address
                      </Button>
                      <Button
                        color="success"
                        onClick={() => setIsViewPreviousAddressModalOpen(true)}
                      >
                        View Previous Address
                      </Button>
                    </div>
                    <small className="text-danger">
                      Note: If you add a new address, the previous address
                      button will be disabled.
                    </small>
                  </div>
                )}
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="residential_status">Residential Status*</Label>
                <Input
                  id="residential_status"
                  type="select"
                  value={formValues.residential_status || ""}
                  onChange={(e) => {
                    handleInputChange("residential_status", e.target.value);
                  }}
                  required
                >
                  <option value="">Select...</option>
                  <option value="OWNER">Owner</option>
                  <option value="RENTING_PRIVATE">Renting - Private</option>
                  <option value="RENTING_LOCAL_AUTHORITY">
                    Renting - Local Authority
                  </option>
                  <option value="TIED_ACCOMMODATION">Tied Accommodation</option>
                  <option value="LIVING_WITH_PARENTS">
                    Living with Parents
                  </option>
                  <option value="LIVING_WITH_FRIENDS_FAMILY">
                    Living with Friends/Family
                  </option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            {formValues.residential_status === "OWNER" && (
              <>
                <Col md={6}>
                  <FormGroup>
                    <Label for="current_mortgage_balance">
                      Current Mortgage Balance
                    </Label>
                    <Input
                      id="current_mortgage_balance"
                      type="number"
                      value={formValues.current_mortgage_balance || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "current_mortgage_balance",
                          e.target.value
                        )
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="property_value">Property Value</Label>
                    <Input
                      id="property_value"
                      type="number"
                      value={formValues.property_value || ""}
                      onChange={(e) =>
                        handleInputChange("property_value", e.target.value)
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="owner_monthly_payment">
                      Owner Monthly Payment
                    </Label>
                    <Input
                      id="owner_monthly_payment"
                      type="number"
                      value={formValues.owner_monthly_payment || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "owner_monthly_payment",
                          e.target.value
                        )
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="lender">Lender</Label>
                    <Input
                      id="lender"
                      type="text"
                      value={formValues.lender || ""}
                      onChange={(e) =>
                        handleInputChange("lender", e.target.value)
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="current_interest_rate">
                      Current Interest Rate
                    </Label>
                    <Input
                      id="current_interest_rate"
                      type="number"
                      value={formValues.current_interest_rate || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "current_interest_rate",
                          e.target.value
                        )
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="mortgage_start_date">Mortgage Start Date</Label>
                    <Input
                      id="mortgage_start_date"
                      type="date"
                      value={formValues.mortgage_start_date || ""}
                      onChange={(e) =>
                        handleInputChange("mortgage_start_date", e.target.value)
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="remaining_term">Remaining Term</Label>
                    <Input
                      id="remaining_term"
                      type="number"
                      value={formValues.remaining_term || ""}
                      onChange={(e) =>
                        handleInputChange("remaining_term", e.target.value)
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="mortgage_type">Mortgage Type</Label>
                    <Input
                      id="mortgage_type"
                      type="select"
                      value={formValues.mortgage_type || ""}
                      onChange={(e) =>
                        handleInputChange("mortgage_type", e.target.value)
                      }
                    >
                      <option value="">Select...</option>
                      <option value="SECURED_LOAN">
                        Secured Loan (Applicant Commitments)
                      </option>
                      <option value="SECOND_HOME">
                        Second Home (Applicant Commitments)
                      </option>
                      <option value="HOLIDAY_HOME">
                        Holiday Home (Applicant Commitments)
                      </option>
                      <option value="BUY_TO_LET">
                        Buy to Let (Applicant Mortgage Details)
                      </option>
                      <option value="HOLIDAY_LET">
                        Holiday Let (Applicant Mortgage Details)
                      </option>
                      <option value="COMMERCIAL_INVESTMENT">
                        Commercial Investment (Applicant Mortgage Details)
                      </option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="repayment_type">Repayment Type</Label>
                    <Input
                      id="repayment_type"
                      type="select"
                      value={formValues.repayment_type || ""}
                      onChange={(e) =>
                        handleInputChange("repayment_type", e.target.value)
                      }
                    >
                      <option value="">Select...</option>
                      <option value="CAPITAL_INTEREST">
                        Capital and Interest
                      </option>
                      <option value="INTEREST_ONLY">Interest Only</option>
                      <option value="PART_AND_PART">Part And Part</option>
                      <option value="SERVICED">Serviced</option>
                      <option value="ROLLED_UP">Rolled Up</option>
                      <option value="RETAINED">Retained</option>
                      <option value="OTHER">Other</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="current_interest_type">
                      Current Interest Type
                    </Label>
                    <Input
                      id="current_interest_type"
                      type="select"
                      value={formValues.current_interest_type || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "current_interest_type",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select...</option>
                      <option value="FIXED">Fixed</option>
                      <option value="VARIABLE">Variable</option>
                      <option value="TRACKER">Tracker</option>
                      <option value="DISCOUNT">Discount</option>
                      <option value="CAPPED">Capped</option>
                      <option value="SVR">SVR</option>
                      <option value="OFFSET">Offset</option>
                      <option value="LIFETIME">Lifetime</option>
                      <option value="OTHER">Other</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="early_repayment_charge_applies">
                      Does an early repayment charge apply?
                    </Label>
                    {["yes", "no"].map((value) => (
                      <div key={value}>
                        <Label className="me-2">
                          <Input
                            type="radio"
                            name="early_repayment_charge_applies"
                            className="me-1"
                            value={value}
                            checked={
                              formValues.early_repayment_charge_applies ===
                              (value === "yes")
                            }
                            onChange={(e) =>
                              handleInputChange(
                                "early_repayment_charge_applies",
                                e.target.value === "yes"
                              )
                            }
                          />
                          {value.charAt(0).toUpperCase() + value.slice(1)}
                        </Label>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
                {formValues.early_repayment_charge_applies === true && (
                  <>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="erc_expiry_date">ERC Expiry Date</Label>
                        <Input
                          id="early_repayment_charge"
                          type="number"
                          value={formValues.erc_expiry_date || ""}
                          onChange={(e) =>
                            handleInputChange("erc_expiry_date", e.target.value)
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="mortgage_not_to_complete_until_erc_ended">
                          Mortgage not to complete until ERC ended
                        </Label>
                        <Input
                          id="mortgage_not_to_complete_until_erc_ended"
                          type="select"
                          value={
                            formValues.mortgage_not_to_complete_until_erc_ended ||
                            ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              "mortgage_not_to_complete_until_erc_ended",
                              e.target.value
                            )
                          }
                        >
                          <option value="">Select...</option>
                          <option value="NA">N/A</option>
                          <option value="YES">Yes</option>
                          <option value="NO">No</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="erc_amount">ERC Amount</Label>
                        <Input
                          id="erc_amount"
                          type="number"
                          value={formValues.erc_amount || ""}
                          onChange={(e) =>
                            handleInputChange("erc_amount", e.target.value)
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="erc_being_paid">
                          Is The ERC Being Paid?
                        </Label>
                        {["yes", "no"].map((value) => (
                          <div key={value}>
                            <Label className="me-2 text-success">
                              <Input
                                type="radio"
                                name="erc_being_paid"
                                className="border-success me-1"
                                value={value}
                                checked={
                                  formValues.erc_being_paid ===
                                  (value === "yes")
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    "erc_being_paid",
                                    e.target.value === "yes"
                                  )
                                }
                              />
                              {value.charAt(0).toUpperCase() + value.slice(1)}
                            </Label>
                          </div>
                        ))}
                      </FormGroup>
                    </Col>
                  </>
                )}
                <Col md={6}>
                  <FormGroup>
                    <Label for="being_redeemed">Being Redeemed?</Label>
                    {["yes", "no"].map((value) => (
                      <div key={value}>
                        <Label className="me-2">
                          <Input
                            type="radio"
                            name="being_redeemed"
                            className="me-1"
                            value={value}
                            checked={
                              formValues.being_redeemed === (value === "yes")
                            }
                            onChange={(e) =>
                              handleInputChange(
                                "being_redeemed",
                                e.target.value === "yes"
                              )
                            }
                          />
                          {value.charAt(0).toUpperCase() + value.slice(1)}
                        </Label>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="is_mortgage_portable">
                      Is The Mortgage Portable?
                    </Label>
                    {["yes", "no"].map((value) => (
                      <div key={value}>
                        <Label className="me-2">
                          <Input
                            type="radio"
                            name="is_mortgage_portable"
                            className="me-1"
                            value={value}
                            checked={
                              formValues.is_mortgage_portable ===
                              (value === "yes")
                            }
                            onChange={(e) =>
                              handleInputChange(
                                "is_mortgage_portable",
                                e.target.value === "yes"
                              )
                            }
                          />
                          {value.charAt(0).toUpperCase() + value.slice(1)}
                        </Label>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
                {formValues.is_mortgage_portable === true && (
                  <>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="is_mortgage_being_ported">
                          Is The Mortgage Being Ported?
                        </Label>
                        {["yes", "no"].map((value) => (
                          <div key={value}>
                            <Label className="me-2 text-success">
                              <Input
                                type="radio"
                                name="is_mortgage_being_ported"
                                className="border-success me-1"
                                value={value}
                                checked={
                                  formValues.is_mortgage_being_ported ===
                                  (value === "yes")
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    "is_mortgage_being_ported",
                                    e.target.value === "yes"
                                  )
                                }
                              />
                              {value.charAt(0).toUpperCase() + value.slice(1)}
                            </Label>
                          </div>
                        ))}
                      </FormGroup>
                    </Col>
                  </>
                )}
                <Col md={6}>
                  <FormGroup>
                    <Label for="mortgage_account_number">
                      Mortgage Account Number
                    </Label>
                    <Input
                      id="mortgage_account_number"
                      type="text"
                      value={formValues.mortgage_account_number || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "mortgage_account_number",
                          e.target.value
                        )
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="mortgage_charter_scheme">
                      Are you in a Mortgage Charter Scheme?
                    </Label>
                    {["yes", "no"].map((value) => (
                      <div key={value}>
                        <Label className="me-2">
                          <Input
                            type="radio"
                            name="mortgage_charter_scheme"
                            className="me-1"
                            value={value}
                            checked={
                              formValues.mortgage_charter_scheme ===
                              (value === "yes")
                            }
                            onChange={(e) =>
                              handleInputChange(
                                "mortgage_charter_scheme",
                                e.target.value === "yes"
                              )
                            }
                          />
                          {value.charAt(0).toUpperCase() + value.slice(1)}
                        </Label>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="property_type">Property Type</Label>
                    <Input
                      id="property_type"
                      type="select"
                      value={formValues.property_type || ""}
                      onChange={(e) =>
                        handleInputChange("property_type", e.target.value)
                      }
                    >
                      <option value="">Select...</option>
                      <option value="HOUSE">House</option>
                      <option value="FLAT">Flat</option>
                      <option value="MAISONETTE">Maisonette</option>
                      <option value="BUNGALOW">Bungalow</option>
                      <option value="WAREHOUSE">Warehouse</option>
                      <option value="LAND">Land</option>
                      <option value="COMMERCIAL">Commercial</option>
                      <option value="SEMI_COMMERCIAL">Semi-Commercial</option>
                      <option value="MULTI_UNIT_BLOCK">
                        Multi-Unit Block (MUB)
                      </option>
                      <option value="HMO">HMO</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={formValues.bedrooms || ""}
                      onChange={(e) =>
                        handleInputChange("bedrooms", e.target.value)
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="tenure">Tenure</Label>
                    <Input
                      id="tenure"
                      type="select"
                      value={formValues.tenure || ""}
                      onChange={(e) =>
                        handleInputChange("tenure", e.target.value)
                      }
                    >
                      <option value="">Select...</option>
                      <option value="FREEHOLD">Freehold</option>
                      <option value="LEASEHOLD">Leasehold</option>
                      <option value="COMMONHOLD">Commonhold</option>
                      <option value="FEUDAL">Feudal</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="year_built">Year Built</Label>
                    <Input
                      id="year_built"
                      type="number"
                      value={formValues.year_built || ""}
                      onChange={(e) =>
                        handleInputChange("year_built", e.target.value)
                      }
                    />
                  </FormGroup>
                </Col>
              </>
            )}
            {formValues.residential_status === "RENTING_PRIVATE" ||
            formValues.residential_status === "RENTING_LOCAL_AUTHORITY" ? (
              <>
                <Col md={6}>
                  <FormGroup>
                    <Label for="rental_monthly_payment">
                      Rental Monthly Payment
                    </Label>
                    <Input
                      id="rental_monthly_payment"
                      type="number"
                      value={formValues.rental_monthly_payment || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "rental_monthly_payment",
                          e.target.value
                        )
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="landlord_name">Landlord Name</Label>
                    <Input
                      id="landlord_name"
                      type="text"
                      value={formValues.landlord_name || ""}
                      onChange={(e) =>
                        handleInputChange("landlord_name", e.target.value)
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="landlord_telephone">Landlord's Telephone</Label>
                    <Input
                      id="landlord_telephone"
                      type="text"
                      value={formValues.landlord_telephone || ""}
                      onChange={(e) =>
                        handleInputChange("landlord_telephone", e.target.value)
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="landlord_email">Landlord's Email</Label>
                    <Input
                      id="landlord_email"
                      type="email"
                      value={formValues.landlord_email || ""}
                      onChange={(e) =>
                        handleInputChange("landlord_email", e.target.value)
                      }
                    />
                  </FormGroup>
                </Col>
                <h3 className="mb-2 mt-2">Landlord Address</h3>
                <Col md={6}>
                  <FormGroup>
                    <Label for="landlord_address_postcode">Postcode</Label>
                    <Input
                      id="landlord_address_postcode"
                      type="text"
                      value={formValues.landlord_address_postcode || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "landlord_address_postcode",
                          e.target.value
                        )
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="landlord_address_line_1">Address Line 1</Label>
                    <Input
                      id="landlord_address_line_1"
                      type="text"
                      value={formValues.landlord_address_line_one || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "landlord_address_line_one",
                          e.target.value
                        )
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="landlord_city">City</Label>
                    <Input
                      id="landlord_city"
                      type="text"
                      value={formValues.landlord_city || ""}
                      onChange={(e) =>
                        handleInputChange("landlord_city", e.target.value)
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="landlord_country">Country</Label>
                    <Input
                      id="landlord_country"
                      type="text"
                      value={formValues.landlord_country || ""}
                      onChange={(e) =>
                        handleInputChange("landlord_country", e.target.value)
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="landlord_county">County</Label>
                    <Input
                      id="landlord_county"
                      type="text"
                      value={formValues.landlord_county || ""}
                      onChange={(e) =>
                        handleInputChange("landlord_county", e.target.value)
                      }
                    />
                  </FormGroup>
                </Col>
              </>
            ) : null}
          </Row>
          {loandetailsData?.application_type === "RESIDENTIAL_MORTGAGE" &&
            loandetailsData?.mortgage_type === "PURCHASE" &&
            loandetailsData?.case_completed_date !== null && (
              <Row className="border-dark rounded p-2">
                <Col md={12}>
                  <FormGroup>
                    <Label for="intend_to_move_into_the_new_property">
                      Do you intend to move into the new property immediately
                      after completion?
                    </Label>
                    <div className="d-flex flex-wrap">
                      <Button
                        className="me-2"
                        color={
                          formValues.intend_to_move_into_the_new_property
                            ? "primary"
                            : "outline-primary"
                        }
                        onClick={() =>
                          handleInputChange(
                            "intend_to_move_into_the_new_property",
                            true
                          )
                        }
                      >
                        Yes
                      </Button>
                      <Button
                        className="me-2"
                        color={
                          !formValues.intend_to_move_into_the_new_property
                            ? "danger"
                            : "outline-danger"
                        }
                        onClick={() =>
                          handleInputChange(
                            "intend_to_move_into_the_new_property",
                            false
                          )
                        }
                      >
                        No
                      </Button>
                    </div>
                  </FormGroup>
                </Col>
                {formValues.intend_to_move_into_the_new_property === true ? (
                  <>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="new_address_house_number_or_name">
                          New Address House Number or Name
                        </Label>
                        <Input
                          id="new_address_house_number_or_name"
                          type="text"
                          readOnly
                          value={
                            formValues.new_address_house_number_or_name || ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              "new_address_house_number_or_name",
                              e.target.value
                            )
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="new_address_address_one">
                          Address Line 1
                        </Label>
                        <Input
                          id="new_address_address_one"
                          type="text"
                          readOnly
                          value={formValues.new_address_address_one || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "new_address_address_one",
                              e.target.value
                            )
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="new_address_address_two">
                          Address Line 2
                        </Label>
                        <Input
                          id="new_address_address_two"
                          type="text"
                          readOnly
                          value={formValues.new_address_address_two || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "new_address_address_two",
                              e.target.value
                            )
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="new_address_city">City</Label>
                        <Input
                          id="new_address_city"
                          type="text"
                          readOnly
                          value={formValues.new_address_city || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "new_address_city",
                              e.target.value
                            )
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="new_address_county">County</Label>
                        <Input
                          id="new_address_county"
                          type="text"
                          readOnly
                          value={formValues.new_address_county || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "new_address_county",
                              e.target.value
                            )
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="new_address_postcode">Postcode</Label>
                        <Input
                          id="new_address_postcode"
                          type="text"
                          readOnly
                          value={formValues.new_address_postcode || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "new_address_postcode",
                              e.target.value
                            )
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="new_address_country">Country</Label>
                        <Input
                          id="new_address_country"
                          type="text"
                          readOnly
                          value={
                            formValues.new_address_country
                              ? formValues.new_address_country
                                  .split("_")
                                  .map((word) =>
                                    word
                                      .toLowerCase()
                                      .replace(/\b\w/g, (l) => l.toUpperCase())
                                  )
                                  .join(" ")
                              : ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              "new_address_country",
                              e.target.value
                            )
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="new_address_effective_from">
                          Effective From
                        </Label>
                        <Input
                          id="new_address_effective_from"
                          type="date"
                          readOnly
                          value={formValues.new_address_effective_from || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "new_address_effective_from",
                              e.target.value
                            )
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormText className="text-warning">
                        Note1: These fields are only for view.
                      </FormText>
                      <br />
                      <FormText className="text-warning">
                        Note2: These data auto-fill from the Security Property.
                        If you don't see any data, please check the Security
                        Property section.
                      </FormText>
                    </Col>
                  </>
                ) : null}
              </Row>
            )}

          <Row>
            <Col md={12}>
              <FormGroup>
                <Label for="notes">Notes</Label>
                <Input
                  id="notes"
                  type="textarea"
                  value={formValues.notes || ""}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
          {/* Submit Button */}
          <div className="d-flex justify-content-end gap-3">
            <Button
              type="submit"
              color="primary"
              disabled={
                isLoading ||
                (session?.user?.user_type === "CLIENT" &&
                  selectedApplicant?.updated_by !== null)
              }
              onClick={() => {
                submitActionRef.current = "save";
              }}
            >
              {isUpdatingApplicant ? "Updating..." : "Save Changes"}
            </Button>
            <Button
              type="submit"
              color="warning"
              disabled={
                isLoading ||
                (session?.user?.user_type === "CLIENT" &&
                  selectedApplicant?.updated_by !== null) ||
                !applicantsData ||
                applicantsData.findIndex(
                  (applicant) => applicant.alias === basicTab
                ) <= 0
              }
              onClick={(e) => {
                e.preventDefault();
                submitActionRef.current = "previous-applicant";
                formRef.current?.requestSubmit();
              }}
            >
              Save & Previous Applicant
            </Button>
            <Button
              type="submit"
              color="info"
              disabled={
                isLoading ||
                (session?.user?.user_type === "CLIENT" &&
                  selectedApplicant?.updated_by !== null) ||
                !applicantsData ||
                applicantsData.findIndex(
                  (applicant) => applicant.alias === basicTab
                ) >=
                  applicantsData.length - 1
              }
              onClick={(e) => {
                e.preventDefault();
                submitActionRef.current = "next-applicant";
                formRef.current?.requestSubmit();
              }}
            >
              Save & Next Applicant
            </Button>
            <Button
              type="submit"
              color="secondary"
              onClick={(e) => {
                e.preventDefault();
                if (
                  session?.user?.user_type === "CLIENT" &&
                  selectedApplicant?.updated_by !== null
                ) {
                  handleNextTab();
                } else {
                  submitActionRef.current = "next";
                  formRef.current?.requestSubmit();
                }
              }}
            >
              {session?.user?.user_type === "CLIENT" &&
              selectedApplicant?.updated_by !== null
                ? "Go To Next"
                : "Save & Next Section"}
            </Button>
          </div>
        </form>
      </Row>

      {/* Company Applicant Modal */}
      {formValues?.is_company_application === true ? (
        <AddCompanyDetailsFormModal
          isOpen={isCompanyModalOpen}
          toggle={() => setIsCompanyModalOpen(false)}
          case_alias={casealias as string}
          applicantDetails_alias={formValues.alias as string}
        />
      ) : (
        ""
      )}

      {/* Dependants of Applicant Modal */}
      <AddDependantFormModal
        isOpen={isDependantsModalOpen}
        toggle={() => setIsDependantsModalOpen(false)}
        case_alias={casealias as string}
        applicantDetails_alias={formValues.alias as string}
      />
      {/* Modal Component */}
      {formValues?.has_dependants === true ? (
        <ApplicantDependantsViewModal
          isOpen={isDependantsViewModalOpen}
          toggle={toggleViewModal}
          applicantAlias={formValues.alias as string}
        />
      ) : (
        ""
      )}
      <AddPreviousAddressModal
        isOpen={isAddPreviousAddressModalOpen}
        toggle={() =>
          setIsAddPreviousAddressModalOpen(!isAddPreviousAddressModalOpen)
        }
        applicantAlias={formValues.alias}
        effectiveFromDate={formValues.effective_from}
      />
      <ViewPreviousAddressModal
        isOpen={isViewPreviousAddressModalOpen}
        toggle={() =>
          setIsViewPreviousAddressModalOpen(!isViewPreviousAddressModalOpen)
        }
        applicantAlias={formValues.alias}
      />
    </Container>
  );
};

export default ApplicantsDetailsTabContent;
