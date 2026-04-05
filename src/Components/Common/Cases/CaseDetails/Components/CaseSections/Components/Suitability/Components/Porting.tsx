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

export interface PortingData {
  is_applicable: string; // YES | NO
  existing_product_end_date: string;
  new_product_end_date: string;
  erc_amount: string;
  new_lender_assessed: string; // YES | NO
  new_lender_not_recommended_reason: string;
  second_charge_considered: string; // YES | NO
  second_charge_not_needed_reason: string;
  additional_considerations: string;
}

interface Props {
  data: PortingData;
  onChange: (field: keyof PortingData, value: string) => void;
}

const Tab4_Porting: React.FC<Props> = ({ data, onChange }) => {
  if (data.is_applicable === "NO") {
    return (
      <Card className="border border-secondary">
        <CardHeader className="bg-secondary bg-opacity-10 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Porting & Mortgage Increase</h5>
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
            Porting section is marked as not applicable and will be excluded from the letter.
          </Alert>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="d-flex flex-column gap-3">
      <Card className="border border-secondary">
        <CardHeader className="bg-secondary bg-opacity-10 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Porting & Mortgage Increase</h5>
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
          <Alert color="info" className="py-2">
            The client is moving home and needs to increase the size of their mortgage. The letter will explain that porting transfers the existing product to the new property alongside any additional borrowing on a separate product.
          </Alert>
          <Row className="g-3">
            <Col md={6}>
              <FormGroup>
                <Label>Existing Product End Date</Label>
                <Input
                  type="text"
                  placeholder="01/01/2027"
                  value={data.existing_product_end_date}
                  onChange={(e) => onChange("existing_product_end_date", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>New Product End Date</Label>
                <Input
                  type="text"
                  placeholder="01/01/2030"
                  value={data.new_product_end_date}
                  onChange={(e) => onChange("new_product_end_date", e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card className="border border-success">
        <CardHeader className="bg-success bg-opacity-10">
          <h5 className="mb-0 text-success">Options Considered</h5>
        </CardHeader>
        <CardBody>
          <Row className="g-3">
            <Col md={6}>
              <FormGroup>
                <Label>Was using a new lender assessed?</Label>
                <Input
                  type="select"
                  value={data.new_lender_assessed}
                  onChange={(e) => onChange("new_lender_assessed", e.target.value)}
                >
                  <option value="">— Please select —</option>
                  <option value="YES">Yes — assessed but not recommended</option>
                  <option value="NO">No — not assessed</option>
                </Input>
              </FormGroup>
            </Col>
            {data.new_lender_assessed === "YES" && (
              <Col md={6}>
                <FormGroup>
                  <Label>Early Repayment Charge with Current Lender (£)</Label>
                  <Input
                    type="text"
                    placeholder="e.g. 5,000"
                    value={data.erc_amount}
                    onChange={(e) => onChange("erc_amount", e.target.value)}
                  />
                </FormGroup>
              </Col>
            )}
            {data.new_lender_assessed === "YES" && (
              <Col md={12}>
                <FormGroup>
                  <Label>Why was a new lender not recommended?</Label>
                  <Input
                    type="select"
                    value={data.new_lender_not_recommended_reason}
                    onChange={(e) => onChange("new_lender_not_recommended_reason", e.target.value)}
                  >
                    <option value="">— Please select —</option>
                    <option value="RATES_HIGHER">Interest rates available were higher than the existing mortgage rate</option>
                    <option value="ERC_EXCEEDED_SAVINGS">Early repayment charge was greater than potential savings</option>
                    <option value="OTHER">Other reason — specify in additional notes</option>
                  </Input>
                </FormGroup>
              </Col>
            )}

            <Col md={6}>
              <FormGroup>
                <Label>Was a second charge mortgage considered?</Label>
                <Input
                  type="select"
                  value={data.second_charge_considered}
                  onChange={(e) => onChange("second_charge_considered", e.target.value)}
                >
                  <option value="">— Please select —</option>
                  <option value="YES">Yes — considered but not required</option>
                  <option value="NO">No — not considered</option>
                </Input>
              </FormGroup>
            </Col>

            <Col md={12}>
              <FormGroup>
                <Label>
                  Additional Considerations
                  <small className="text-muted ms-2">Expand with any further reasoning that supported the recommendation to port</small>
                </Label>
                <Input
                  type="textarea"
                  rows={5}
                  value={data.additional_considerations}
                  onChange={(e) => onChange("additional_considerations", e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default Tab4_Porting;