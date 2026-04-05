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
} from "reactstrap";

export interface ProtectionInsuranceData {
  protection: {
    protection_type: string;
    protection_option: string;
    question_one_answer: string;
    question_two_answer: string;
    question_one_sharia: string;
    question_two_sharia: string;
  };
  buildings_insurance: {
    buildings_insurance_type: string;
    insurance_option: string;
    question_one_answer: string;
    question_one_sharia: string;
  };
}

interface Props {
  data: ProtectionInsuranceData;
  onChange: <S extends keyof ProtectionInsuranceData>(
    section: S,
    field: keyof ProtectionInsuranceData[S],
    value: string
  ) => void;
}

const PROTECTION_OPTIONS = [
  { value: "", label: "— Please select —" },
  { value: "SPECIALIST_RECOMMENDED", label: "Recommend specialist protection advisor" },
  { value: "CLIENT_DECLINED", label: "Client declined recommendations" },
  { value: "NO_NEW_POLICIES", label: "No new protection policies required" },
  { value: "FURTHER_LETTER", label: "Further recommendation letter to follow" },
  { value: "DISCUSSION_OUTSTANDING", label: "Protection discussion outstanding" },
];

const HOME_INSURANCE_OPTIONS = [
  { value: "", label: "— Please select —" },
  { value: "FURTHER_LETTER", label: "Further recommendation letter to follow" },
  { value: "DISCUSSION_OUTSTANDING", label: "Insurance discussion outstanding" },
  { value: "CLIENT_OWN_COVER", label: "Client arranging own cover" },
  { value: "SPECIALIST_RECOMMENDED", label: "Recommend specialist for this cover" },
];

const TypeToggle: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => (
  <Input type="select" className="w-auto" value={value} onChange={(e) => onChange(e.target.value)}>
    <option value="GENERAL">General</option>
    <option value="SHARIA">Sharia</option>
  </Input>
);

const Tab9_ProtectionInsurance: React.FC<Props> = ({ data, onChange }) => {
  const isSharia = (type: string) => type === "SHARIA";

  return (
    <div className="d-flex flex-column gap-3">

      {/* ── Protection ── */}
      <Card className="border border-secondary">
        <CardHeader className="bg-secondary bg-opacity-10 d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">Protection</h5>
            <small className="text-muted">
              Mortgage is a large financial commitment — document protection needs and advice
            </small>
          </div>
          <TypeToggle
            value={data.protection.protection_type}
            onChange={(v) => onChange("protection", "protection_type", v)}
          />
        </CardHeader>
        <CardBody>
          <Row className="g-3">
            <Col md={12}>
              <FormGroup>
                <Label>Protection Option</Label>
                <Input
                  type="select"
                  value={data.protection.protection_option}
                  onChange={(e) => onChange("protection", "protection_option", e.target.value)}
                >
                  {PROTECTION_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Input>
              </FormGroup>
            </Col>

            {!isSharia(data.protection.protection_type) ? (
              <>
                <Col md={12}>
                  <FormGroup>
                    <Label>
                      Answer 1
                      <small className="text-muted ms-2">
                        Provide details — if recommendation declined or existing policies adequate, document in full
                      </small>
                    </Label>
                    <Input
                      type="textarea"
                      rows={4}
                      value={data.protection.question_one_answer}
                      onChange={(e) => onChange("protection", "question_one_answer", e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <FormGroup>
                    <Label>Answer 2 <span className="text-muted">(optional — any further detail)</span></Label>
                    <Input
                      type="textarea"
                      rows={3}
                      value={data.protection.question_two_answer}
                      onChange={(e) => onChange("protection", "question_two_answer", e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </>
            ) : (
              <>
                <Col md={12}>
                  <FormGroup>
                    <Label>Answer 1</Label>
                    <Input
                      type="textarea"
                      rows={4}
                      value={data.protection.question_one_sharia}
                      onChange={(e) => onChange("protection", "question_one_sharia", e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <FormGroup>
                    <Label>Answer 2</Label>
                    <Input
                      type="textarea"
                      rows={3}
                      value={data.protection.question_two_sharia}
                      onChange={(e) => onChange("protection", "question_two_sharia", e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </>
            )}
          </Row>
        </CardBody>
      </Card>

      {/* ── Buildings Insurance ── */}
      <Card className="border border-success">
        <CardHeader className="bg-success bg-opacity-10 d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0 text-success">Buildings Insurance</h5>
            <small className="text-muted">
              A condition of the mortgage — must be in place at exchange of contracts for purchases
            </small>
          </div>
          <TypeToggle
            value={data.buildings_insurance.buildings_insurance_type}
            onChange={(v) => onChange("buildings_insurance", "buildings_insurance_type", v)}
          />
        </CardHeader>
        <CardBody>
          <Row className="g-3">
            <Col md={12}>
              <FormGroup>
                <Label>Home Insurance Option</Label>
                <Input
                  type="select"
                  value={data.buildings_insurance.insurance_option}
                  onChange={(e) => onChange("buildings_insurance", "insurance_option", e.target.value)}
                >
                  {HOME_INSURANCE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Label>
                  Answer 1
                  <small className="text-muted ms-2">If recommendation was declined, document the reason</small>
                </Label>
                <Input
                  type="textarea"
                  rows={3}
                  value={
                    isSharia(data.buildings_insurance.buildings_insurance_type)
                      ? data.buildings_insurance.question_one_sharia
                      : data.buildings_insurance.question_one_answer
                  }
                  onChange={(e) =>
                    onChange(
                      "buildings_insurance",
                      isSharia(data.buildings_insurance.buildings_insurance_type)
                        ? "question_one_sharia"
                        : "question_one_answer",
                      e.target.value
                    )
                  }
                />
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* ── Standard disclosures preview ── */}
      <Card className="border border-light bg-light">
        <CardHeader className="bg-light border-bottom">
          <h5 className="mb-0 text-muted">Standard Letter Disclosures (Auto-included)</h5>
        </CardHeader>
        <CardBody>
          <p className="text-muted small mb-2">The following sections are always included in the generated letter:</p>
          <ul className="text-muted small mb-0">
            <li><strong>Lasting Power of Attorney (LPOA)</strong> — Recommendation to seek independent legal advice if a registered LPOA is in place.</li>
            <li><strong>Wills</strong> — Recommendation to speak to a solicitor about creating or updating a will.</li>
            <li><strong>Help us to improve our service</strong> — Standard survey invitation paragraph.</li>
            <li><strong>Repossession warning</strong> — "Your property can be repossessed if you do not keep up your payments."</li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
};

export default Tab9_ProtectionInsurance;