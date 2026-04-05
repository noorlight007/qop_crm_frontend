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

export interface IslamicMortgageData {
  is_applicable: string; // YES | NO
  method: string; // IJARA | MUSHARAKA | MURABAHA
  provider: string;
  overpayment_type: string; // WITHOUT_PENALTY | WITH_LIMIT
  overpayment_limit_percent: string;
  recommendation_reason: string;
  additional_notes: string;
}

interface Props {
  data: IslamicMortgageData;
  onChange: (field: keyof IslamicMortgageData, value: string) => void;
}

const METHOD_DESCRIPTIONS: Record<string, { title: string; description: string }> = {
  IJARA: {
    title: "Ijara (Sale and Leaseback)",
    description:
      "The provider buys the property and becomes the legal owner, entering into a lease agreement with you. You make regular payments covering both rent and the purchase of the property. At the end of the term, when all payments have been made, legal ownership transfers to you.",
  },
  MUSHARAKA: {
    title: "Musharaka (Co-ownership)",
    description:
      "A co-ownership arrangement where you fund the initial deposit and the provider purchases the remainder. You make monthly payments (part rent, part capital), increasing your stake over time. As your stake grows, the provider's share shrinks and rent reduces accordingly. Full legal ownership transfers to you at the end of the term.",
  },
  MURABAHA: {
    title: "Murabaha (Deferred Sale)",
    description:
      "The provider buys the property and immediately sells it to you at a higher price (original cost plus an agreed profit level). You pay this higher price on a deferred basis by making regular payments in line with a fixed repayment schedule.",
  },
};

const Tab6_IslamicMortgage: React.FC<Props> = ({ data, onChange }) => {
  if (data.is_applicable === "NO") {
    return (
      <Card className="border border-secondary">
        <CardHeader className="bg-secondary bg-opacity-10 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Islamic Mortgage / Home Purchase Plan</h5>
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
            Islamic mortgage section is marked as not applicable and will be excluded from the letter.
          </Alert>
        </CardBody>
      </Card>
    );
  }

  const selectedMethod = METHOD_DESCRIPTIONS[data.method];

  return (
    <div className="d-flex flex-column gap-3">
      <Card className="border border-secondary">
        <CardHeader className="bg-secondary bg-opacity-10 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Islamic Mortgage / Home Purchase Plan</h5>
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
            The client requires finance in a manner acceptable under Sharia Law. The letter will explain that a Home Purchase Plan is recommended as it does not involve the payment of interest.
          </Alert>
        </CardBody>
      </Card>

      <Card className="border border-success">
        <CardHeader className="bg-success bg-opacity-10">
          <h5 className="mb-0 text-success">Home Purchase Plan Method</h5>
        </CardHeader>
        <CardBody>
          <Row className="g-3">
            <Col md={6}>
              <FormGroup>
                <Label>Select the Method</Label>
                <Input
                  type="select"
                  value={data.method}
                  onChange={(e) => onChange("method", e.target.value)}
                >
                  <option value="">— Please select —</option>
                  <option value="IJARA">Ijara (Sale and Leaseback)</option>
                  <option value="MUSHARAKA">Musharaka (Co-ownership)</option>
                  <option value="MURABAHA">Murabaha (Deferred Sale)</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Provider</Label>
                <Input
                  type="text"
                  placeholder="e.g. Ahli United Bank"
                  value={data.provider}
                  onChange={(e) => onChange("provider", e.target.value)}
                />
              </FormGroup>
            </Col>

            {selectedMethod && (
              <Col md={12}>
                <Alert color="light" className="border">
                  <strong>{selectedMethod.title}</strong>
                  <p className="mb-0 mt-1 text-muted">{selectedMethod.description}</p>
                </Alert>
              </Col>
            )}
          </Row>
        </CardBody>
      </Card>

      <Card className="border border-secondary">
        <CardHeader className="bg-secondary bg-opacity-10">
          <h5 className="mb-0">Overpayment Feature</h5>
        </CardHeader>
        <CardBody>
          <Row className="g-3">
            <Col md={6}>
              <FormGroup>
                <Label>Overpayment Flexibility</Label>
                <Input
                  type="select"
                  value={data.overpayment_type}
                  onChange={(e) => onChange("overpayment_type", e.target.value)}
                >
                  <option value="">— Please select —</option>
                  <option value="WITHOUT_PENALTY">Additional payments allowed without penalty at any time</option>
                  <option value="WITH_LIMIT">Additional payments allowed up to a defined annual limit</option>
                </Input>
              </FormGroup>
            </Col>
            {data.overpayment_type === "WITH_LIMIT" && (
              <Col md={6}>
                <FormGroup>
                  <Label>Annual Overpayment Limit (%)</Label>
                  <Input
                    type="text"
                    placeholder="e.g. 10"
                    value={data.overpayment_limit_percent}
                    onChange={(e) => onChange("overpayment_limit_percent", e.target.value)}
                  />
                </FormGroup>
              </Col>
            )}
          </Row>
        </CardBody>
      </Card>

      <Card className="border border-success">
        <CardHeader className="bg-success bg-opacity-10">
          <h5 className="mb-0 text-success">Why This Provider Was Recommended</h5>
        </CardHeader>
        <CardBody>
          <FormGroup>
            <Label>
              Justification
              <small className="text-muted ms-2">All Home Purchase Plan providers and products were researched. Explain why this provider was the most suitable.</small>
            </Label>
            <Input
              type="textarea"
              rows={5}
              value={data.recommendation_reason}
              onChange={(e) => onChange("recommendation_reason", e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>Additional Notes</Label>
            <Input
              type="textarea"
              rows={3}
              value={data.additional_notes}
              onChange={(e) => onChange("additional_notes", e.target.value)}
            />
          </FormGroup>
        </CardBody>
      </Card>
    </div>
  );
};

export default Tab6_IslamicMortgage;