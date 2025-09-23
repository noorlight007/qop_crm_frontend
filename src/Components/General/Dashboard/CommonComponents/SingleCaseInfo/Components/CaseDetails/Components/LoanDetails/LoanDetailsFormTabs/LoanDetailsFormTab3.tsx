import { LoanDetailsFormTab3Props } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/LoanDetailsTypes";
import React from "react";
import { Col, Form, FormGroup, Input, Label, Row } from "reactstrap";

const LoanDetailsFormTab3: React.FC<LoanDetailsFormTab3Props> = ({
  formData,
  caseStage,
  handleFormChange,
}) => {
  return (
    <Form>
      <Row>
        <Col md={4}>
          <FormGroup>
            <Label for="dip_accept_date">DIP Accept Date</Label>
            <Input
              type="date"
              name="dip_accept_date"
              value={formData.dip_accept_date || ""}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            />
          </FormGroup>
        </Col>
        {caseStage !== "COMPLETION" &&
          caseStage !== "FULL_MORTGAGE_APPLICATION" &&
          caseStage !== "OFFER_FROM_BANK" &&
          caseStage !== "LEGAL" &&
          caseStage !== "COMPLETION" &&
          caseStage !== "FUTURE_OPPORTUNITY" &&
          caseStage !== "NOT_PROCEED" && (
            <Col md={4}>
              <FormGroup>
                <Label for="dip_expiry_date">DIP Expiry Date</Label>
                <Input
                  type="date"
                  name="dip_expiry_date"
                  value={formData.dip_expiry_date || ""}
                  onChange={(e) =>
                    handleFormChange(e.target.name, e.target.value)
                  }
                />
              </FormGroup>
            </Col>
          )}
        {caseStage !== "ENQUIRY" &&
          caseStage !== "FACT_FIND" &&
          caseStage !== "RESEARCH_COMPLIANCE_CHECK" &&
          caseStage !== "DECISION_IN_PRINCIPLE" && (
            <>
              <Col md={4}>
                <FormGroup>
                  <Label for="case_submitted">Case Submitted</Label>
                  <Input
                    type="date"
                    name="case_submitted"
                    value={formData.case_submitted || ""}
                    onChange={(e) =>
                      handleFormChange(e.target.name, e.target.value)
                    }
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="valuation_instructed_date">
                    Valuation Instructed Date
                  </Label>
                  <Input
                    type="date"
                    name="valuation_instructed_date"
                    value={formData.valuation_instructed_date || ""}
                    onChange={(e) =>
                      handleFormChange(e.target.name, e.target.value)
                    }
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="valuation_booked_date">
                    Valuation Booked Date
                  </Label>
                  <Input
                    type="date"
                    name="valuation_booked_date"
                    value={formData.valuation_booked_date || ""}
                    onChange={(e) =>
                      handleFormChange(e.target.name, e.target.value)
                    }
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="valuation_received_date">
                    Valuation Received Date
                  </Label>
                  <Input
                    type="date"
                    name="valuation_received_date"
                    value={formData.valuation_received_date || ""}
                    onChange={(e) =>
                      handleFormChange(e.target.name, e.target.value)
                    }
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="valuation_expiry_date">
                    Valuation Expiry Date
                  </Label>
                  <Input
                    type="date"
                    name="valuation_expiry_date"
                    value={formData.valuation_expiry_date || ""}
                    onChange={(e) =>
                      handleFormChange(e.target.name, e.target.value)
                    }
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="case_offered_date">Case Offered Date</Label>
                  <Input
                    type="date"
                    name="case_offered_date"
                    value={formData.case_offered_date || ""}
                    onChange={(e) =>
                      handleFormChange(e.target.name, e.target.value)
                    }
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="stage_expiry_date">Offer Expiry Date</Label>
                  <Input
                    type="date"
                    name="stage_expiry_date"
                    value={formData.stage_expiry_date || ""}
                    onChange={(e) =>
                      handleFormChange(e.target.name, e.target.value)
                    }
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="legals_instructed_date">
                    Legals Instructed Date
                  </Label>
                  <Input
                    type="date"
                    name="legals_instructed_date"
                    value={formData.legals_instructed_date || ""}
                    onChange={(e) =>
                      handleFormChange(e.target.name, e.target.value)
                    }
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="exchange_of_contracts_date">
                    Exchange of Contracts Date
                  </Label>
                  <Input
                    type="date"
                    name="exchange_of_contracts_date"
                    value={formData.exchange_of_contracts_date || ""}
                    onChange={(e) =>
                      handleFormChange(e.target.name, e.target.value)
                    }
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="case_completed_date">Case Completed Date</Label>
                  <Input
                    type="date"
                    name="case_completed_date"
                    value={formData.case_completed_date || ""}
                    onChange={(e) =>
                      handleFormChange(e.target.name, e.target.value)
                    }
                  />
                </FormGroup>
              </Col>
            </>
          )}
        <Col md={4}>
          <FormGroup>
            <Label for="expected_completion_date">
              Expected Completion Date
            </Label>
            <Input
              type="date"
              name="expected_completion_date"
              value={formData.expected_completion_date || ""}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            />
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="product_expiry_date">Product Expiry Date</Label>
            <Input
              type="date"
              name="product_expiry_date"
              value={formData.product_expiry_date || ""}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            />
          </FormGroup>
        </Col>
        {(caseStage === "COMPLETION" ||
          caseStage === "FULL_MORTGAGE_APPLICATION" ||
          caseStage === "OFFER_FROM_BANK" ||
          caseStage === "LEGAL" ||
          caseStage === "FUTURE_OPPORTUNITY" ||
          caseStage === "NOT_PROCEED") && (
          <Col md={4}>
            <FormGroup>
              <Label for="review_date">Review Date</Label>
              <Input
                type="date"
                name="review_date"
                value={formData.review_date || ""}
                onChange={(e) =>
                  handleFormChange(e.target.name, e.target.value)
                }
              />
            </FormGroup>
          </Col>
        )}
      </Row>
    </Form>
  );
};

export default LoanDetailsFormTab3;
