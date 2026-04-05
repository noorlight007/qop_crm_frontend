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

export interface LendingIntoRetirementData {
  is_applicable: string; // YES | NO
  mortgage_term_years: string;
  pension_statement_required: string; // YES | NO
  years_to_retirement: string;
  client_specific_notes: string;
}

interface Props {
  data: LendingIntoRetirementData;
  onChange: (field: keyof LendingIntoRetirementData, value: string) => void;
}

const Tab7_LendingIntoRetirement: React.FC<Props> = ({ data, onChange }) => {
  if (data.is_applicable === "NO") {
    return (
      <Card className="border border-secondary">
        <CardHeader className="bg-secondary bg-opacity-10 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Lending Into Retirement</h5>
          <Input
            type="select"
            className="w-auto"
            value={data.is_applicable}
            onChange={(e) => onChange("is_applicable", e.target.value)}
          >
            <option value="YES">Applicable to this case</option>
            <option value="NO">Not applicable to this case</option>
          </Input>
        </CardHeader>
        <CardBody>
          <Alert color="secondary">
            Lending into retirement section is marked as not applicable and will be excluded from the letter.
          </Alert>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="d-flex flex-column gap-3">
      <Card className="border border-secondary">
        <CardHeader className="bg-secondary bg-opacity-10 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Lending Into Retirement</h5>
          <Input
            type="select"
            className="w-auto"
            value={data.is_applicable}
            onChange={(e) => onChange("is_applicable", e.target.value)}
          >
            <option value="YES">Applicable to this case</option>
            <option value="NO">Not applicable to this case</option>
          </Input>
        </CardHeader>
        <CardBody>
          <Alert color="warning" className="py-2">
            <strong>Important:</strong> The letter will include the standard disclaimer that it is not usually recommended to arrange a mortgage that extends into retirement, along with the required regulatory disclosures about pension contribution expectations and overpayment recommendations.
          </Alert>
        </CardBody>
      </Card>

      <Card className="border border-success">
        <CardHeader className="bg-success bg-opacity-10">
          <h5 className="mb-0 text-success">Retirement Lending Details</h5>
        </CardHeader>
        <CardBody>
          <Row className="g-3">
            <Col md={4}>
              <FormGroup>
                <Label>Agreed Mortgage Term (Years)</Label>
                <Input
                  type="text"
                  placeholder="e.g. 30"
                  value={data.mortgage_term_years}
                  onChange={(e) => onChange("mortgage_term_years", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Pension Statement Required by Lender?</Label>
                <Input
                  type="select"
                  value={data.pension_statement_required}
                  onChange={(e) => onChange("pension_statement_required", e.target.value)}
                >
                  <option value="">— Please select —</option>
                  <option value="YES">Yes — pension statements assessed</option>
                  <option value="NO">No — not required by lender</option>
                </Input>
              </FormGroup>
            </Col>
            {data.pension_statement_required === "NO" && (
              <Col md={4}>
                <FormGroup>
                  <Label>Years to Retirement</Label>
                  <Input
                    type="text"
                    placeholder="e.g. 12"
                    value={data.years_to_retirement}
                    onChange={(e) => onChange("years_to_retirement", e.target.value)}
                  />
                </FormGroup>
              </Col>
            )}
          </Row>
        </CardBody>
      </Card>

      {data.pension_statement_required === "YES" && (
        <Card className="border border-secondary">
          <CardHeader className="bg-secondary bg-opacity-10">
            <h5 className="mb-0">Pension Assessment Summary</h5>
          </CardHeader>
          <CardBody>
            <Alert color="info" className="py-2">
              The letter will state that an assessment of potential retirement income was carried out based on existing retirement provision and continued contributions, demonstrating ability to afford repayments into retirement.
            </Alert>
          </CardBody>
        </Card>
      )}

      {data.pension_statement_required === "NO" && (
        <Card className="border border-secondary">
          <CardHeader className="bg-secondary bg-opacity-10">
            <h5 className="mb-0">Pension Contribution Note</h5>
          </CardHeader>
          <CardBody>
            <Alert color="info" className="py-2">
              The letter will note that pension statements were not required by the lender as the client is more than {data.years_to_retirement || "X"} years from retirement, and that the client is making pension contributions. The letter will advise the client to continue contributions throughout the mortgage term and review pension projections regularly.
            </Alert>
          </CardBody>
        </Card>
      )}

      <Card className="border border-success">
        <CardHeader className="bg-success bg-opacity-10">
          <h5 className="mb-0 text-success">Client-Specific Notes</h5>
        </CardHeader>
        <CardBody>
          <FormGroup>
            <Label>
              Individual Circumstances
              <small className="text-muted ms-2">
                Type any information relevant to the client's individual needs and why the term was recommended into retirement
              </small>
            </Label>
            <Input
              type="textarea"
              rows={6}
              value={data.client_specific_notes}
              onChange={(e) => onChange("client_specific_notes", e.target.value)}
            />
          </FormGroup>
        </CardBody>
      </Card>
    </div>
  );
};

export default Tab7_LendingIntoRetirement;