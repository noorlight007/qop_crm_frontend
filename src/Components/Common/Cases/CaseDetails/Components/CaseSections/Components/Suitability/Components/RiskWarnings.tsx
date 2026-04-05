import React from "react";
import {
  Alert,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";

export interface RiskWarningsData {
  high_ltv_applicable: string; // YES | NO
  extending_term_applicable: string; // YES | NO
  shared_ownership_applicable: string; // YES | NO
  first_homes_scheme_applicable: string; // YES | NO
  buy_to_let_applicable: string; // YES | NO
  jbsp_applicable: string; // YES | NO — Joint Borrower Sole Proprietor
  additional_risk_notes: string;
}

interface Props {
  data: RiskWarningsData;
  onChange: (field: keyof RiskWarningsData, value: string) => void;
}

interface RiskToggleProps {
  label: string;
  description: string;
  value: string;
  onChange: (v: string) => void;
  warningText?: string;
  color?: string;
}

const RiskToggle: React.FC<RiskToggleProps> = ({
  label,
  description,
  value,
  onChange,
  warningText,
  color = "warning",
}) => (
  <Card className={`border border-${value === "YES" ? color : "light"}`}>
    <CardBody>
      <div className="d-flex justify-content-between align-items-start gap-3">
        <div className="flex-grow-1">
          <p className="fw-semibold mb-1">{label}</p>
          <p className="text-muted small mb-0">{description}</p>
        </div>
        <Input
          type="select"
          className="w-auto flex-shrink-0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="NO">Not applicable</option>
          <option value="YES">Applicable — include in letter</option>
        </Input>
      </div>
      {value === "YES" && warningText && (
        <Alert color={color} className="mt-3 mb-0 py-2">
          <small>{warningText}</small>
        </Alert>
      )}
    </CardBody>
  </Card>
);

const Tab8_RiskWarnings: React.FC<Props> = ({ data, onChange }) => {
  return (
    <div className="d-flex flex-column gap-3">
      <Card className="border border-secondary">
        <CardHeader className="bg-secondary bg-opacity-10">
          <h5 className="mb-0">Risk Warnings & Additional Disclaimers</h5>
        </CardHeader>
        <CardBody>
          <p className="text-muted mb-0">
            Select all risk warnings that apply to this case. The relevant paragraphs will be automatically included in the generated suitability letter.
          </p>
        </CardBody>
      </Card>

      <Row className="g-3">
        <Col md={6}>
          <RiskToggle
            label="High Loan-to-Value"
            description="The LTV ratio on the mortgage is high, increasing the risk of negative equity and repossession."
            value={data.high_ltv_applicable}
            onChange={(v) => onChange("high_ltv_applicable", v)}
            color="danger"
            warningText='The letter will include: "The loan-to-value ratio on your mortgage is high. This puts you at greater risk of negative equity if property values fall... High loan-to-value mortgages are also associated with a higher risk of repossession, please consider these risks carefully."'
          />
        </Col>
        <Col md={6}>
          <RiskToggle
            label="Extending Mortgage Term"
            description="The mortgage term is being extended beyond the original or recommended period."
            value={data.extending_term_applicable}
            onChange={(v) => onChange("extending_term_applicable", v)}
            warningText="The letter will include an extended term disclaimer reminding the client of the additional interest cost over the longer period."
          />
        </Col>
        <Col md={6}>
          <RiskToggle
            label="Shared Ownership"
            description="The property is being purchased under a shared ownership scheme."
            value={data.shared_ownership_applicable}
            onChange={(v) => onChange("shared_ownership_applicable", v)}
            warningText="The letter will include relevant shared ownership disclaimers and staircasing information."
          />
        </Col>
        <Col md={6}>
          <RiskToggle
            label="First Homes Scheme"
            description="The property is being purchased under the First Homes government scheme."
            value={data.first_homes_scheme_applicable}
            onChange={(v) => onChange("first_homes_scheme_applicable", v)}
            warningText="The letter will include First Homes scheme eligibility conditions and resale restrictions."
          />
        </Col>
        <Col md={6}>
          <RiskToggle
            label="Buy to Let"
            description="The mortgage is for a buy-to-let property rather than a primary residence."
            value={data.buy_to_let_applicable}
            onChange={(v) => onChange("buy_to_let_applicable", v)}
            warningText="The letter will include buy-to-let specific risk disclosures including rental income dependency and void periods."
          />
        </Col>
        <Col md={6}>
          <RiskToggle
            label="Joint Borrower Sole Proprietor (JBSP)"
            description="A JBSP arrangement is being used, with independent legal advice recommended."
            value={data.jbsp_applicable}
            onChange={(v) => onChange("jbsp_applicable", v)}
            warningText="The letter will include a recommendation for all parties to seek independent legal advice (ILA) regarding their JBSP obligations."
          />
        </Col>
      </Row>

      <Card className="border border-secondary">
        <CardHeader className="bg-secondary bg-opacity-10">
          <h5 className="mb-0">Additional Risk Notes</h5>
        </CardHeader>
        <CardBody>
          <FormGroup className="mb-0">
            <Label>
              Any further risk warnings or bespoke disclaimers
              <small className="text-muted ms-2">These will appear in the "What else do you need to know?" section of the letter</small>
            </Label>
            <Input
              type="textarea"
              rows={5}
              value={data.additional_risk_notes}
              onChange={(e) => onChange("additional_risk_notes", e.target.value)}
            />
          </FormGroup>
        </CardBody>
      </Card>
    </div>
  );
};

export default Tab8_RiskWarnings;