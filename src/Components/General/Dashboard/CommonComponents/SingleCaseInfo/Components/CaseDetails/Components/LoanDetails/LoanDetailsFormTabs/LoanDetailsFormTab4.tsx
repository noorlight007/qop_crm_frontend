import { LoanDetailsFormTab4Props } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/LoanDetailsTypes";
import React from "react";
import { Col, Form, FormGroup, Input, Label, Row } from "reactstrap";

const LoanDetailsFormTab4: React.FC<LoanDetailsFormTab4Props> = ({
  formData,
  handleFormChange,
}) => {
  return (
    <Form>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="sale_type">Sale Type</Label>
            <Input
              type="select"
              name="sale_type"
              value={formData.sale_type}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            >
              <option value="">Select...</option>
              <option value="UNKNOWN">Unknown</option>
              <option value="FACE_TO_FACE">Face to Face</option>
              <option value="TELEPHONE">Telephone</option>
              <option value="INTERNET">Internet</option>
              <option value="OTHER">Other</option>
            </Input>
          </FormGroup>
        </Col>

        <Col md={6}>
          <FormGroup>
            <Label for="introduction_type">Introduction Type</Label>
            <Input
              type="select"
              name="introduction_type"
              value={formData.introduction_type}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            >
              <option value="">Select...</option>
              <option value="DIRECT">Direct</option>
              <option value="RDI">RDI</option>
            </Input>
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="lead_source">Lead Source</Label>
            <Input
              type="select"
              name="lead_source"
              value={formData.lead_source}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            >
              <option value="">Select...</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="ESTATE_AGENTS">Estate Agents</option>
              <option value="TV3">TV3</option>
              <option value="FAMILY">Family</option>
              <option value="FRIENDS">Friends</option>
              <option value="REFERRALS">Referrals</option>
              <option value="WEBSITE">Website</option>
            </Input>
          </FormGroup>
        </Col>

        <Col md={6}>
          <FormGroup>
            <Label for="introducer_payment_terms">
              Introducer Payment Terms
            </Label>
            <Input
              type="select"
              name="introducer_payment_terms"
              value={formData.introducer_payment_terms}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            >
              <option value="">Select...</option>
              <option value="NOT_APPLICABLE">Not Applicable</option>
              <option value="ON_APPLICATION">On Application</option>
              <option value="ON_OFFER">On Offer</option>
              <option value="ON_COMPLETION">On Completion</option>
            </Input>
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="introducer_fee">Introducer Fee</Label>
            <Input
              type="text"
              name="introducer_fee"
              value={formData.introducer_fee || ""}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            />
          </FormGroup>
        </Col>

        <Col md={6}>
          <FormGroup>
            <Label for="reasons_for_capital_raising">
              Reasons for Capital Raising
            </Label>
            <Input
              type="text"
              name="reasons_for_capital_raising"
              value={formData.reasons_for_capital_raising}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="is_mortgage_being_ported">
              Has this been accepted or declined with any lender already?
            </Label>
            {["yes", "no"].map((value) => (
              <div key={value}>
                <Label className="me-2">
                  <Input
                    type="radio"
                    name="accepted_or_declined_by_lender"
                    className="me-1"
                    value={value}
                    checked={
                      formData.accepted_or_declined_by_lender ===
                      (value === "yes")
                    }
                    onChange={(e) =>
                      handleFormChange(
                        "accepted_or_declined_by_lender",
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
            <Label for="case_summary">Case Summary</Label>
            <Input
              type="textarea"
              name="case_summary"
              value={formData.case_summary}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            />
          </FormGroup>
        </Col>
        <Col sm={12}>
          <FormGroup>
            <Label for="note">Note</Label>
            <Input
              type="textarea"
              name="note"
              value={formData.note}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            />
          </FormGroup>
        </Col>
      </Row>
    </Form>
  );
};

export default LoanDetailsFormTab4;
