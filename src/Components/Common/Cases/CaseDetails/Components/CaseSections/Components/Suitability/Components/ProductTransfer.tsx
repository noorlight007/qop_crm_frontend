import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
  Alert,
} from "reactstrap";

export interface ProductTransferData {
  is_applicable: string; // YES | NO
  process_type: string; // FULL | SHORTENED
  lender: string;
  expiry_date: string;
  svr_rate: string;
  recommendation_reason: string; // COST_EFFECTIVE | TIME_RESTRAINTS | CLIENT_PREFERENCE
  client_preference_detail: string;
  shortened_client_reason: string;
  no_material_changes_confirmed: string; // YES | NO
  cost_comparison: string; // MOST_COST_EFFECTIVE | NOT_MOST_COST_EFFECTIVE
  cost_difference: string;
  additional_notes: string;
}

interface Props {
  data: ProductTransferData;
  onChange: (field: keyof ProductTransferData, value: string) => void;
}

const Tab3_ProductTransfer: React.FC<Props> = ({ data, onChange }) => {
  if (data.is_applicable === "NO") {
    return (
      <Card className="border border-secondary">
        <CardHeader className="bg-secondary bg-opacity-10 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Product Transfer</h5>
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
            Product transfer section is marked as not applicable and will be excluded from the letter.
          </Alert>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="d-flex flex-column gap-3">
      <Card className="border border-secondary">
        <CardHeader className="bg-secondary bg-opacity-10 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Product Transfer</h5>
          <div className="d-flex gap-2 align-items-center">
            <Input
              type="select"
              className="w-auto"
              value={data.process_type}
              onChange={(e) => onChange("process_type", e.target.value)}
            >
              <option value="FULL">Full Process</option>
              <option value="SHORTENED">Shortened Process</option>
            </Input>
            <Input
              type="select"
              className="w-auto"
              value={data.is_applicable}
              onChange={(e) => onChange("is_applicable", e.target.value)}
            >
              <option value="YES">Applicable to this case</option>
              <option value="NO">Not applicable to this case</option>
            </Input>
          </div>
        </CardHeader>
        <CardBody>
          <Row className="g-3">
            <Col md={6}>
              <FormGroup>
                <Label>Current Lender</Label>
                <Input
                  type="text"
                  placeholder="e.g. Halifax"
                  value={data.lender}
                  onChange={(e) => onChange("lender", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label>Current Deal Expiry Date</Label>
                <Input
                  type="text"
                  placeholder="01/01/2025"
                  value={data.expiry_date}
                  onChange={(e) => onChange("expiry_date", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label>SVR Rate (%)</Label>
                <Input
                  type="text"
                  placeholder="e.g. 7.75"
                  value={data.svr_rate}
                  onChange={(e) => onChange("svr_rate", e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Full Process */}
      {data.process_type === "FULL" && (
        <Card className="border border-success">
          <CardHeader className="bg-success bg-opacity-10">
            <h5 className="mb-0 text-success">Reason for Recommending a Product Transfer</h5>
          </CardHeader>
          <CardBody>
            <FormGroup>
              <Label>Primary Reason</Label>
              <Input
                type="select"
                value={data.recommendation_reason}
                onChange={(e) => onChange("recommendation_reason", e.target.value)}
              >
                <option value="">— Please select —</option>
                <option value="COST_EFFECTIVE">More cost-effective than cheapest remortgage available</option>
                <option value="TIME_RESTRAINTS">Time restraints — remortgage may not complete in time</option>
                <option value="CLIENT_PREFERENCE">Client preference for a simpler application process</option>
              </Input>
            </FormGroup>
            {data.recommendation_reason === "CLIENT_PREFERENCE" && (
              <FormGroup>
                <Label>
                  Client Preference Details
                  <small className="text-muted ms-2">e.g. busy work life, family commitments</small>
                </Label>
                <Input
                  type="textarea"
                  rows={3}
                  value={data.client_preference_detail}
                  onChange={(e) => onChange("client_preference_detail", e.target.value)}
                />
              </FormGroup>
            )}
            <FormGroup>
              <Label>Additional Notes / Supporting Reasons</Label>
              <Input
                type="textarea"
                rows={4}
                value={data.additional_notes}
                onChange={(e) => onChange("additional_notes", e.target.value)}
              />
            </FormGroup>
          </CardBody>
        </Card>
      )}

      {/* Shortened Process */}
      {data.process_type === "SHORTENED" && (
        <Card className="border border-success">
          <CardHeader className="bg-success bg-opacity-10">
            <h5 className="mb-0 text-success">Shortened Product Transfer Details</h5>
          </CardHeader>
          <CardBody>
            <Row className="g-3">
              <Col md={12}>
                <FormGroup>
                  <Label>Client Reason for Preferring Product Transfer Over Remortgage</Label>
                  <Input
                    type="textarea"
                    rows={3}
                    placeholder="e.g. ease of process, speed of application, busy lifestyle..."
                    value={data.shortened_client_reason}
                    onChange={(e) => onChange("shortened_client_reason", e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Client Confirmed No Material Changes to Circumstances</Label>
                  <Input
                    type="select"
                    value={data.no_material_changes_confirmed}
                    onChange={(e) => onChange("no_material_changes_confirmed", e.target.value)}
                  >
                    <option value="">— Please select —</option>
                    <option value="YES">Yes — confirmed no changes to income, outgoings or circumstances</option>
                    <option value="NO">No — material changes noted (add details in notes)</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Cost Comparison vs. Remortgage</Label>
                  <Input
                    type="select"
                    value={data.cost_comparison}
                    onChange={(e) => onChange("cost_comparison", e.target.value)}
                  >
                    <option value="">— Please select —</option>
                    <option value="MOST_COST_EFFECTIVE">Most cost-effective deal available — no disadvantage to remaining</option>
                    <option value="NOT_MOST_COST_EFFECTIVE">Not most cost-effective — client accepted the additional cost</option>
                  </Input>
                </FormGroup>
              </Col>
              {data.cost_comparison === "NOT_MOST_COST_EFFECTIVE" && (
                <Col md={6}>
                  <FormGroup>
                    <Label>Additional Cost During Initial Term (£)</Label>
                    <Input
                      type="text"
                      placeholder="e.g. 1,200"
                      value={data.cost_difference}
                      onChange={(e) => onChange("cost_difference", e.target.value)}
                    />
                  </FormGroup>
                </Col>
              )}
              <Col md={12}>
                <FormGroup>
                  <Label>Additional Notes</Label>
                  <Input
                    type="textarea"
                    rows={4}
                    value={data.additional_notes}
                    onChange={(e) => onChange("additional_notes", e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default Tab3_ProductTransfer;