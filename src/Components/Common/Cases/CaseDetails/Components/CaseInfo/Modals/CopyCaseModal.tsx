import { useCopyCaseMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseCopy/CaseCopyApi";
import { CaseInfoPrpos } from "@/Types/Common/Cases/CaseTypes";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";

interface CopyCaseModalProps {
  isOpen: boolean;
  toggle: () => void;
  caseData: CaseInfoPrpos;
}

const CopyCaseModal: React.FC<CopyCaseModalProps> = ({
  isOpen,
  toggle,
  caseData,
}) => {
  const [copyCase, { isLoading }] = useCopyCaseMutation();

  // Helper function to get available tabs based on case category and stage
  const getAvailableTabs = (category: string, stage: string): string[] => {
    if (category === "MORTGAGE") {
      switch (stage) {
        case "ENQUIRY":
          return [
            "Loan Details",
            "Applicant(s) Details",
            "Portfolio",
            "Notes",
            "Product",
            "Documents",
          ];
        case "FACT_FIND":
        case "RESEARCH_COMPLIANCE_CHECK":
        case "DECISION_IN_PRINCIPLE":
          return [
            "Loan Details",
            "Applicant(s) Details",
            "Employment/Income",
            "Credit Commitments",
            "Adverse",
            "Portfolio",
            "Security Property",
            "Solicitors & Accountants",
            "Budget Planner",
            "Existing Protection",
            "Mortgage Your Needs",
            "Notes",
            "Product",
            "DIP History",
            "Suitability",
            "Insurance Health",
            "Fees",
            "Compliance",
            "Documents",
          ];
        case "FULL_MORTGAGE_APPLICATION":
          return [
            "Loan Details",
            "Applicant(s) Details",
            "Employment/Income",
            "Credit Commitments",
            "Adverse",
            "Portfolio",
            "Security Property",
            "Solicitors & Accountants",
            "Budget Planner",
            "Existing Protection",
            "Mortgage Your Needs",
            "Notes",
            "Product",
            "DIP History",
            "Suitability",
            "Insurance Health",
            "Fees",
            "Compliance",
            "Client Survey",
            "Documents",
          ];
        case "SUBMISSION":
        case "OFFER_FROM_BANK":
        case "LEGAL":
        case "COMPLETION":
        case "FUTURE_OPPORTUNITY":
        case "NOT_PROCEED":
          return [
            "Loan Details",
            "Applicant(s) Details",
            "Employment/Income",
            "Credit Commitments",
            "Adverse",
            "Portfolio",
            "Security Property",
            "Solicitors & Accountants",
            "Budget Planner",
            "Existing Protection",
            "Mortgage Your Wants",
            "Notes",
            "Product",
            "DIP History",
            "Suitability",
            "Insurance Health",
            "Fees",
            "Compliance",
            "Client Survey",
            "Documents",
          ];
        default:
          return [];
      }
    } else if (category === "PROTECTION" || category === "GENERAL_INSURANCE") {
      switch (stage) {
        case "ENQUIRY":
          return [
            "Insurance Overview",
            "Applicant(s) Details",
            "Notes",
            "Documents",
          ];
        case "FACT_FIND":
        case "SUBMISSION":
        case "ACCEPT_WAITING_START_DATE":
        case "ACCEPTED_ON_RISK":
        case "FURTHER_MEDICAL_REQUIRED":
        case "NOT_PROCEED":
          return [
            "Insurance Overview",
            "Applicant(s) Details",
            "Health Check",
            "Employment/Income",
            "Credit Commitments",
            "Security Property",
            "Budget Planner",
            "Existing Protection",
            "Notes",
            "Insurance Health",
            "Commission",
            "Fees",
            "Compliance",
            "Documents",
          ];
        default:
          return [];
      }
    }
    return [];
  };

  // Check if a field should be visible based on available tabs
  const isFieldVisible = (fieldLabel: string): boolean => {
    const availableTabs = getAvailableTabs(
      caseData.case_category,
      formData.case_stage || caseData.case_stage,
    );
    return availableTabs.includes(fieldLabel);
  };
  const [formData, setFormData] = useState({
    case_stage: "",
    is_loan_details: false,
    is_insurance_loan_details: false,
    is_commission: false,
    is_applicants_details: false,
    is_employment_income: false,
    is_credit_commitments: false,
    is_adverse: false,
    is_portfolio: false,
    is_security_property: false,
    is_solicitors_accountants: false,
    is_budget_planner: false,
    is_existing_protection: false,
    is_needs_and_preferences: false,
    is_notes: false,
    is_product: false,
    is_dip_history: false,
    is_suitability: false,
    is_fees: false,
    is_compliance: false,
    is_client_survey: false,
    is_documents: false,
    is_health_insurance: false,
    is_link_cases_together: false,
  });

  useEffect(() => {
    if (isOpen && caseData) {
      setFormData({
        case_stage: caseData.case_stage || "",
        is_loan_details: false,
        is_insurance_loan_details: false,
        is_commission: false,
        is_applicants_details: false,
        is_employment_income: false,
        is_credit_commitments: false,
        is_adverse: false,
        is_portfolio: false,
        is_security_property: false,
        is_solicitors_accountants: false,
        is_budget_planner: false,
        is_existing_protection: false,
        is_needs_and_preferences: false,
        is_notes: false,
        is_product: false,
        is_dip_history: false,
        is_suitability: false,
        is_fees: false,
        is_compliance: false,
        is_client_survey: false,
        is_documents: false,
        is_health_insurance: false,
        is_link_cases_together: false,
      });
    }
  }, [isOpen, caseData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!caseData.case_stage || !formData.case_stage) {
      toast.error("Please select a case stage.");
      return;
    }

    try {
      const payload = {
        case_stage: formData.case_stage,
        is_loan_details: formData.is_loan_details,
        is_insurance_loan_details: formData.is_insurance_loan_details,
        is_commission: formData.is_commission,
        is_applicants_details: formData.is_applicants_details,
        is_employment_income: formData.is_employment_income,
        is_credit_commitments: formData.is_credit_commitments,
        is_adverse: formData.is_adverse,
        is_portfolio: formData.is_portfolio,
        is_security_property: formData.is_security_property,
        is_solicitors_accountants: formData.is_solicitors_accountants,
        is_budget_planner: formData.is_budget_planner,
        is_existing_protection: formData.is_existing_protection,
        is_needs_and_preferences: formData.is_needs_and_preferences,
        is_notes: formData.is_notes,
        is_product: formData.is_product,
        is_dip_history: formData.is_dip_history,
        is_suitability: formData.is_suitability,
        is_fees: formData.is_fees,
        is_compliance: formData.is_compliance,
        is_client_survey: formData.is_client_survey,
        is_documents: formData.is_documents,
        is_health_insurance: formData.is_health_insurance,
        is_link_cases_together: formData.is_link_cases_together,
      };

      await copyCase({ case_alias: caseData.alias, payload }).unwrap();
      toggle();
      toast.success("Case copied successfully!");
    } catch (error: any) {
      console.error("Failed to copy case:", error);
      if (error?.data) {
        const errorMessage = Object.entries(error.data)
          .map(([key, value]: [string, any]) => `${key}: ${value.join(", ")}`)
          .join("\n");
        toast.error(errorMessage || "Failed to copy case. Please try again.");
      } else {
        toast.error("Failed to copy case. Please try again.");
      }
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        <h3 className="text-primary">Copy Case</h3>
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="case_stage">
              Case Stage <span className="text-danger">*</span>
            </Label>
            <Input
              type="select"
              name="case_stage"
              id="case_stage"
              value={formData?.case_stage}
              onChange={handleInputChange}
              className="border-primary"
              required
            >
              {caseData?.case_category === "MORTGAGE" ? (
                <>
                  <option value="">Select...</option>
                  <option value="ENQUIRY">Enquiry</option>
                  <option value="FACT_FIND">Fact Find</option>
                  <option value="RESEARCH_COMPLIANCE_CHECK">
                    Research and Compliance Check
                  </option>
                  <option value="DECISION_IN_PRINCIPLE">
                    Decision in Principle
                  </option>
                  <option value="FULL_MORTGAGE_APPLICATION">
                    Full Mortgage Application
                  </option>
                  <option value="SUBMISSION">Submission</option>
                  <option value="OFFER_FROM_BANK">Offer From Bank</option>
                  <option value="LEGAL">Legal</option>
                  <option value="COMPLETION">Completion</option>
                  <option value="FUTURE_OPPORTUNITY">Future Opportunity</option>
                  <option value="NOT_PROCEED">Not Proceed</option>
                </>
              ) : (
                <>
                  <option value="">Select...</option>
                  <option value="ENQUIRY">Enquiry</option>
                  <option value="FACT_FIND">Fact Find</option>
                  <option value="SUBMISSION">Submission</option>
                  <option value="ACCEPT_WAITING_START_DATE">
                    Accept Awaiting Start Date
                  </option>
                  <option value="ACCEPTED_ON_RISK">Accepted on Risk</option>
                  <option value="FURTHER_MEDICAL_REQUIRED">
                    Further Medical Required
                  </option>
                  <option value="NOT_PROCEED">Not Proceed</option>
                </>
              )}
            </Input>
          </FormGroup>

          <Row>
            {isFieldVisible("Loan Details") && (
              <Col sm="12" md="6">
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="is_loan_details"
                    id="is_loan_details"
                    checked={formData.is_loan_details}
                    onChange={handleInputChange}
                    className="border-primary"
                  />
                  <Label for="is_loan_details" check>
                    Loan Details
                  </Label>
                </FormGroup>
              </Col>
            )}

            {isFieldVisible("Insurance Overview") && (
              <Col sm="12" md="6">
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="is_insurance_loan_details"
                    id="is_insurance_loan_details"
                    checked={formData.is_insurance_loan_details}
                    onChange={handleInputChange}
                    className="border-primary"
                  />
                  <Label for="is_insurance_loan_details" check>
                    Insurance Overview
                  </Label>
                </FormGroup>
              </Col>
            )}
            {isFieldVisible("Commission") && (
              <Col sm="12" md="6">
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="is_commission"
                    id="is_commission"
                    checked={formData.is_commission}
                    onChange={handleInputChange}
                    className="border-primary"
                  />
                  <Label for="is_commission" check>
                    Commission
                  </Label>
                </FormGroup>
              </Col>
            )}

            {isFieldVisible("Applicant(s) Details") && (
              <Col sm="12" md="6">
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="is_applicants_details"
                    id="is_applicants_details"
                    checked={formData.is_applicants_details}
                    onChange={handleInputChange}
                    className="border-primary"
                  />
                  <Label for="is_applicants_details" check>
                    Applicants Details
                  </Label>
                </FormGroup>
              </Col>
            )}
            {isFieldVisible("Employment/Income") && (
              <Col sm="12" md="6">
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="is_employment_income"
                    id="is_employment_income"
                    checked={formData.is_employment_income}
                    onChange={handleInputChange}
                    className="border-primary"
                  />
                  <Label for="is_employment_income" check>
                    Employment Income
                  </Label>
                </FormGroup>
              </Col>
            )}
            {isFieldVisible("Credit Commitments") && (
              <Col sm="12" md="6">
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="is_credit_commitments"
                    id="is_credit_commitments"
                    checked={formData.is_credit_commitments}
                    onChange={handleInputChange}
                    className="border-primary"
                  />
                  <Label for="is_credit_commitments" check>
                    Credit Commitments
                  </Label>
                </FormGroup>
              </Col>
            )}
            {isFieldVisible("Adverse") && (
              <Col sm="12" md="6">
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="is_adverse"
                    id="is_adverse"
                    checked={formData.is_adverse}
                    onChange={handleInputChange}
                    className="border-primary"
                  />
                  <Label for="is_adverse" check>
                    Adverse
                  </Label>
                </FormGroup>
              </Col>
            )}
            {isFieldVisible("Portfolio") && (
              <Col sm="12" md="6">
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="is_portfolio"
                    id="is_portfolio"
                    checked={formData.is_portfolio}
                    onChange={handleInputChange}
                    className="border-primary"
                  />
                  <Label for="is_portfolio" check>
                    Portfolio
                  </Label>
                </FormGroup>
              </Col>
            )}
            {isFieldVisible("Security Property") && (
              <Col sm="12" md="6">
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="is_security_property"
                    id="is_security_property"
                    checked={formData.is_security_property}
                    onChange={handleInputChange}
                    className="border-primary"
                  />
                  <Label for="is_security_property" check>
                    Security Property
                  </Label>
                </FormGroup>
              </Col>
            )}
            {isFieldVisible("Solicitors & Accountants") && (
              <Col sm="12" md="6">
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="is_solicitors_accountants"
                    id="is_solicitors_accountants"
                    checked={formData.is_solicitors_accountants}
                    onChange={handleInputChange}
                    className="border-primary"
                  />
                  <Label for="is_solicitors_accountants" check>
                    Solicitors & Accountants
                  </Label>
                </FormGroup>
              </Col>
            )}
            {isFieldVisible("Budget Planner") && (
              <Col sm="12" md="6">
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="is_budget_planner"
                    id="is_budget_planner"
                    checked={formData.is_budget_planner}
                    onChange={handleInputChange}
                    className="border-primary"
                  />
                  <Label for="is_budget_planner" check>
                    Budget Planner
                  </Label>
                </FormGroup>
              </Col>
            )}
            {isFieldVisible("Existing Protection") && (
              <Col sm="12" md="6">
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="is_existing_protection"
                    id="is_existing_protection"
                    checked={formData.is_existing_protection}
                    onChange={handleInputChange}
                    className="border-primary"
                  />
                  <Label for="is_existing_protection" check>
                    Existing Protection
                  </Label>
                </FormGroup>
              </Col>
            )}
            {(isFieldVisible("Mortgage Your Needs") ||
              isFieldVisible("Mortgage Your Wants")) && (
              <Col sm="12" md="6">
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="is_needs_and_preferences"
                    id="is_needs_and_preferences"
                    checked={formData.is_needs_and_preferences}
                    onChange={handleInputChange}
                    className="border-primary"
                  />
                  <Label for="is_needs_and_preferences" check>
                    Mortgage Your Needs
                  </Label>
                </FormGroup>
              </Col>
            )}
            {isFieldVisible("Notes") && (
              <Col sm="12" md="6">
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="is_notes"
                    id="is_notes"
                    checked={formData.is_notes}
                    onChange={handleInputChange}
                    className="border-primary"
                  />
                  <Label for="is_notes" check>
                    Notes
                  </Label>
                </FormGroup>
              </Col>
            )}
            {isFieldVisible("Product") && (
              <Col sm="12" md="6">
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="is_product"
                    id="is_product"
                    checked={formData.is_product}
                    onChange={handleInputChange}
                    className="border-primary"
                  />
                  <Label for="is_product" check>
                    Product
                  </Label>
                </FormGroup>
              </Col>
            )}
            {isFieldVisible("DIP History") && (
              <Col sm="12" md="6">
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="is_dip_history"
                    id="is_dip_history"
                    checked={formData.is_dip_history}
                    onChange={handleInputChange}
                    className="border-primary"
                  />
                  <Label for="is_dip_history" check>
                    DIP History
                  </Label>
                </FormGroup>
              </Col>
            )}
            {isFieldVisible("Suitability") && (
              <Col sm="12" md="6">
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="is_suitability"
                    id="is_suitability"
                    checked={formData.is_suitability}
                    onChange={handleInputChange}
                    className="border-primary"
                  />
                  <Label for="is_suitability" check>
                    Suitability
                  </Label>
                </FormGroup>
              </Col>
            )}
            {isFieldVisible("Fees") && (
              <Col sm="12" md="6">
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="is_fees"
                    id="is_fees"
                    checked={formData.is_fees}
                    onChange={handleInputChange}
                    className="border-primary"
                  />
                  <Label for="is_fees" check>
                    Fees
                  </Label>
                </FormGroup>
              </Col>
            )}
            {isFieldVisible("Compliance") && (
              <Col sm="12" md="6">
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="is_compliance"
                    id="is_compliance"
                    checked={formData.is_compliance}
                    onChange={handleInputChange}
                    className="border-primary"
                  />
                  <Label for="is_compliance" check>
                    Compliance
                  </Label>
                </FormGroup>
              </Col>
            )}
            {isFieldVisible("Client Survey") && (
              <Col sm="12" md="6">
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="is_client_survey"
                    id="is_client_survey"
                    checked={formData.is_client_survey}
                    onChange={handleInputChange}
                    className="border-primary"
                  />
                  <Label for="is_client_survey" check>
                    Client Survey
                  </Label>
                </FormGroup>
              </Col>
            )}
            {isFieldVisible("Documents") && (
              <Col sm="12" md="6">
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="is_documents"
                    id="is_documents"
                    checked={formData.is_documents}
                    onChange={handleInputChange}
                    className="border-primary"
                  />
                  <Label for="is_documents" check>
                    Documents
                  </Label>
                </FormGroup>
              </Col>
            )}
            {isFieldVisible("Insurance Health") && (
              <Col sm="12" md="6">
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="is_health_insurance"
                    id="is_health_insurance"
                    checked={formData.is_health_insurance}
                    onChange={handleInputChange}
                    className="border-primary"
                  />
                  <Label for="is_health_insurance" check>
                    Health Insurance
                  </Label>
                </FormGroup>
              </Col>
            )}
            <Col sm="12" md="6">
              <FormGroup check>
                <Input
                  type="checkbox"
                  name="is_link_cases_together"
                  id="is_link_cases_together"
                  checked={formData.is_link_cases_together}
                  onChange={handleInputChange}
                  className="border-primary"
                />
                <Label for="is_link_cases_together" check>
                  Link Cases Together
                </Label>
              </FormGroup>
            </Col>
          </Row>
          <div className="d-flex justify-content-end mt-4 gap-2">
            <Button onClick={toggle}>Cancel</Button>
            <Button
              color="primary"
              type="submit"
              disabled={isLoading || !caseData.case_stage}
            >
              {isLoading ? "Copying..." : "Copy Case"}
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default CopyCaseModal;
