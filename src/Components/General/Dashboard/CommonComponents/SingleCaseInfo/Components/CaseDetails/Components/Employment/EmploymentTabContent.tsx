import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/CommonComponents/Cases/CasesApi";
import { basicTabIndicator } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/CaseDetailsTabIndicatorSlice";
import { useUpdateEmploymentDetailsMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/EmploymentDetails/EmploymentDetailsApi";
import {
  EmploymentDetailsProps,
  EmploymentTabContentProps,
} from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/EmploymentTypes";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
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
  InputGroupText,
  Label,
  Row,
} from "reactstrap";
import AddEmploymentDetailsModal from "./EmploymentModals/AddEmploymentDetailsModal";

export const EmploymentTabContent: React.FC<EmploymentTabContentProps> = ({
  activeTab,
  activeUser,
  groupedData,
}) => {
  const [formValues, setFormValues] = useState<EmploymentDetailsProps | null>(
    null
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
  const dispatch = useAppDispatch();
  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias }
  );
  // `useEffect` to reset `formValues` when `activeTab` or `activeUser` changes
  useEffect(() => {
    if (activeTab && activeUser !== null) {
      const userEmploymentRecords = groupedData[activeUser];
      const activeEmploymentRecord = userEmploymentRecords?.find(
        (employment) => employment.alias === activeTab
      );
      // If there's a draft for this alias use it; otherwise use the record
      // coming from props. This preserves unsaved input when switching tabs.
      const draft = draftsRef.current[activeTab as string];
      setFormValues(draft ?? activeEmploymentRecord ?? null);
    }
  }, [activeTab, activeUser, groupedData]);

  if (!activeTab || activeUser === null) {
    return <div>No employment data available.</div>;
  }

  const userEmploymentRecords = groupedData[activeUser];
  const activeEmploymentRecord = userEmploymentRecords?.find(
    (employment) => employment.alias === activeTab
  );

  if (!activeEmploymentRecord) {
    return <div>No matching employment record found.</div>;
  }

  const handleInputChange = (
    name: keyof EmploymentDetailsProps, // Use your type instead of `Applicant`
    value: string | number | boolean | string[] | null
  ) => {
    setFormValues((prevValues) => ({
      ...prevValues!,
      [name]: value,
    }));
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

    const res = await updateEmploymentDetails({
      case_alias: casealias,
      employmentDetails_alias: formValues?.alias,
      employmentDetails: formValues,
    });

    if (res.data) {
      toast.success("Employment details updated successfully.");
      // Clear saved draft on successful save so we don't reapply stale data.
      if (formValues?.alias) delete draftsRef.current[formValues.alias];
      // Only go to next tab if this was a Save & Next action
      if (submitActionRef.current === "next") {
        handleNextTab();
      }
    } else if (res.error) {
      const errorMessage =
        (res.error as any)?.data?.detail ||
        "Failed to update employment details.";
      toast.error(errorMessage);
    } else {
      toast.error("Failed to update employment details.");
    }
  };
  const currentTab: string | null = useAppSelector(
    (state) => state.caseDetails.basicTabId
  );

  const handleNextTab = () => {
    const nextTabNav = getNextTabNav(caseData?.case_stage, currentTab!);
    if (nextTabNav) {
      dispatch(basicTabIndicator(nextTabNav));
    } else {
      toast.warning("This is the last tab.");
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
                Employment Status*
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
                <Label for="occupation">Occupation*</Label>
                <Input
                  type="text"
                  id="occupation"
                  value={formValues?.occupation || ""}
                  onChange={(e) =>
                    handleInputChange("occupation", e.target.value)
                  }
                  required
                />
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
              </FormGroup>
            </Col>
          )}
        </Row>
        <Row>
          {(formValues?.employment_status === "EMPLOYED" ||
            formValues?.employment_status === "CONTRACTOR") && (
            <Col md={6}>
              <FormGroup>
                <Label for="employerName">Employer Name*</Label>
                <Input
                  type="text"
                  id="employerName"
                  value={formValues?.employer_name || ""}
                  onChange={(e) =>
                    handleInputChange("employer_name", e.target.value)
                  }
                  required
                />
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
              </FormGroup>
            </Col>
          )}
        </Row>
        <Row>
          {formValues?.employment_status === "EMPLOYED" && (
            <Col md={6}>
              <FormGroup>
                <Label for="employers_name_for_reference">
                  Employer's Name for Reference
                </Label>
                <Input
                  type="text"
                  id="employers_name_for_reference"
                  value={formValues?.employers_name_for_reference || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "employers_name_for_reference",
                      e.target.value
                    )
                  }
                />
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
                      e.target.value
                    )
                  }
                />
              </FormGroup>
            </Col>
          )}
        </Row>
        <Row>
          {(formValues?.employment_status === "EMPLOYED" ||
            formValues?.employment_status === "CONTRACTOR") && (
            <>
              <Col md={6}>
                <FormGroup>
                  <Label for="employerPostcode">Employer's Postcode</Label>
                  <Input
                    type="text"
                    id="employerPostcode"
                    className="border-primary"
                    value={formValues?.employer_postcode || ""}
                    onChange={(e) =>
                      handleInputChange("employer_postcode", e.target.value)
                    }
                  />
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
                        e.target.value
                      )
                    }
                  />
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
                        e.target.value
                      )
                    }
                  />
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
                        e.target.value
                      )
                    }
                  />
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
                </FormGroup>
              </Col>
            </>
          )}
        </Row>
        <Row>
          {formValues?.employment_status === "EMPLOYED" && (
            <>
              <Col md={6}>
                <Label for="employmentCommenced">Employment Commenced*</Label>
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
                <Label for="grossMonthlyIncome">Gross Monthly Income(£)*</Label>
                <Input
                  type="number"
                  id="grossMonthlyIncome"
                  placeholder="0"
                  value={formValues?.gross_monthly_income || ""}
                  onChange={(e) =>
                    handleInputChange("gross_monthly_income", e.target.value)
                  }
                  required
                />
              </FormGroup>
            </Col>
          )}
          {formValues?.employment_status === "EMPLOYED" && (
            <Col md={6}>
              <FormGroup>
                <Label for="netMonthlyIncome">Net Monthly Income(£)</Label>
                <Input
                  type="number"
                  id="netMonthlyIncome"
                  placeholder="0"
                  value={formValues?.net_monthly_income || ""}
                  onChange={(e) =>
                    handleInputChange("net_monthly_income", e.target.value)
                  }
                />
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
                </FormGroup>
              </Col>
              <Col md={6}>
                {formValues?.is_income_in_foreign_currency && (
                  <FormGroup>
                    <Label for="further_details">Further Details*</Label>
                    <Input
                      type="textarea"
                      id="further_details"
                      value={formValues?.further_details || ""}
                      onChange={(e) =>
                        handleInputChange("further_details", e.target.value)
                      }
                      required
                    />
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
                  <Label for="bonus">Bonus(£)*</Label>
                  <Input
                    type="number"
                    id="bonus"
                    placeholder="0"
                    value={formValues?.bonus || ""}
                    onChange={(e) => handleInputChange("bonus", e.target.value)}
                  />
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
                </FormGroup>
              </Col>
            </Row>
            <Row className="d-flex justify-content-between">
              <Col md={4}>
                <FormGroup>
                  <Label for="overtime">Overtime(£)*</Label>
                  <Input
                    type="number"
                    id="overtime"
                    placeholder="0"
                    value={formValues?.overtime || ""}
                    onChange={(e) =>
                      handleInputChange("overtime", e.target.value)
                    }
                  />
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
                </FormGroup>
              </Col>
            </Row>
            <Row className="d-flex justify-content-between">
              <Col md={4}>
                <FormGroup>
                  <Label for="allowance">Allowance(£)*</Label>
                  <Input
                    type="number"
                    id="allowance"
                    placeholder="0"
                    value={formValues?.allowance || ""}
                    onChange={(e) =>
                      handleInputChange("allowance", e.target.value)
                    }
                  />
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
                            e.target.value
                          )
                        }
                      />
                      <FormText>Years</FormText>
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
                            e.target.value
                          )
                        }
                      />
                      <FormText>Months</FormText>
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
                  <Label for="business_postcode">Business Postcode</Label>
                  <Input
                    type="text"
                    id="business_postcode"
                    className="border-primary"
                    value={formValues?.business_postcode || ""}
                    onChange={(e) =>
                      handleInputChange("business_postcode", e.target.value)
                    }
                  />
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
                        e.target.value
                      )
                    }
                  />
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
                        e.target.value
                      )
                    }
                  />
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
                        e.target.value
                      )
                    }
                  />
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
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
              </Col>
            </>
          )}
        </Row>
        <Row>
          {formValues?.employment_status === "SELF_EMPLOYED" && (
            <Col md={6}>
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
              </FormGroup>
            </Col>
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
                        e.target.value
                      )
                    }
                  />
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
                  <Label for="salary">Salary(£)*</Label>
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
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="dividends">Dividends(£)*</Label>
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
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="turnover">Turn Over(£)</Label>
                  <Input
                    type="number"
                    id="turnover"
                    placeholder="0"
                    value={formValues?.turnover || ""}
                    onChange={(e) =>
                      handleInputChange("turnover", e.target.value)
                    }
                  />
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
                  <Label for="other_income">Other Income(£)</Label>
                  <Input
                    type="number"
                    id="other_income"
                    placeholder="0"
                    value={formValues?.other_income || ""}
                    onChange={(e) =>
                      handleInputChange("other_income", e.target.value)
                    }
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="other_income_source">Other Income Source*</Label>
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
                        e.target.value
                      )
                    }
                  />
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
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="current_contract_start">
                    Current Contract Start*
                  </Label>
                  <Input
                    type="date"
                    id="current_contract_start"
                    value={formValues?.current_contract_start || 0}
                    onChange={(e) =>
                      handleInputChange(
                        "current_contract_start",
                        e.target.value
                      )
                    }
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="current_contract_end">
                    Current Contract End*
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
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label for="time_contracting">Time contracting*</Label>
                  <Input
                    type="text"
                    id="time_contracting"
                    value={formValues?.time_contracting || ""}
                    onChange={(e) =>
                      handleInputChange("time_contracting", e.target.value)
                    }
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="day_rate">Day Rate(£)*</Label>
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
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="hourly_rate">Hourly Rate(£)</Label>
                  <Input
                    type="number"
                    id="hourly_rate"
                    placeholder="0"
                    value={formValues?.hourly_rate || ""}
                    onChange={(e) =>
                      handleInputChange("hourly_rate", e.target.value)
                    }
                  />
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
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-between pt-3">
            <Button
              color="success"
              className="border-success"
              onClick={() => setAddEmploymentModalOpen(true)}
              disabled={session?.user?.user_type === "CLIENT"}
            >
              Add New
            </Button>
            <div className=" d-flex justify-content-end gap-2">
              <Button
                color="primary"
                type="submit"
                disabled={session?.user?.user_type === "CLIENT"}
                onClick={() => {
                  submitActionRef.current = "save";
                }}
              >
                {isUpdateEmploymentDetailsLoading
                  ? "Saving..."
                  : "Save Changes"}
              </Button>
              <Button
                type="submit"
                color="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  if (session?.user?.user_type === "CLIENT") {
                    handleNextTab();
                  } else {
                    submitActionRef.current = "next";
                    formRef.current?.requestSubmit();
                  }
                }}
              >
                {session?.user?.user_type === "CLIENT"
                  ? "Go To Next"
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
      />
    </CardBody>
  );
};
