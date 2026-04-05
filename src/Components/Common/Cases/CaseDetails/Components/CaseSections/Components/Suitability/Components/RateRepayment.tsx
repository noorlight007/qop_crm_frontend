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

export interface RateRepaymentData {
  recommending_lender: {
    recommending_lender_type: string;
    question_one_answer: string;
    question_one_sharia: string;
  };
  recommending_rate_type: {
    recommending_rate_type: string;
    question_one_answer: string;
    question_two_answer: string;
    question_three_answer: string;
    question_one_sharia: string;
    question_two_sharia: string;
  };
  recommending_deal_period: {
    recommending_deal_period_type: string;
    question_one_answer: string;
    question_two_answer: string;
    question_three_answer: string;
    question_one_sharia: string;
  };
  recommending_repayment: {
    recommending_repayment_type: string;
    question_one_answer: string;
    question_one_sharia: string;
  };
  mortgage_amount_selection: { selection: string };
  arrangement_fee_selection: { selection: string };
  recommending_term: {
    recommending_term_type: string;
    question_one_answer: string;
    question_one_sharia: string;
  };
  erc_selection: { selection: string; max_erc_amount: string };
  portability_selection: { selection: string };
  rate_switch_selection: { selection: string };
  additional_information: {
    additional_information_type: string;
    question_one_answer: string;
    question_one_sharia: string;
  };
}

interface Props {
  data: RateRepaymentData;
  rateType: string; // from mortgage_details.rate_type in Tab1
  repaymentMethod: string; // from mortgage_details.repayment_method in Tab1
  onChange: <S extends keyof RateRepaymentData>(
    section: S,
    field: keyof RateRepaymentData[S],
    value: string
  ) => void;
}

const MORTGAGE_AMOUNT_OPTIONS = [
  { value: "", label: "— Please select —" },
  { value: "HOME_IMPROVEMENTS", label: "Includes additional funds for home improvements" },
  { value: "DEBT_REPAYMENT", label: "Includes additional funds to repay debts (with disclaimer)" },
  { value: "OTHER_REASONS", label: "Includes additional funds — other stated reasons" },
  { value: "EQUAL_OUTSTANDING", label: "Equal to current outstanding balance" },
  { value: "OVERPAYMENT", label: "Less than outstanding — overpayment being made" },
  { value: "PURCHASE_MINUS_DEPOSIT", label: "Equal to purchase price minus deposit" },
];

const ARRANGEMENT_FEE_OPTIONS = [
  { value: "", label: "— Please select —" },
  { value: "ADDED_TO_MORTGAGE", label: "Fee added to mortgage" },
  { value: "PAID_UPFRONT", label: "Fee paid up front" },
  { value: "NO_FEE", label: "No arrangement fee on this product" },
];

const ERC_OPTIONS = [
  { value: "", label: "— Please select —" },
  { value: "ERC_APPLY", label: "ERCs apply during initial rate period" },
  { value: "NO_ERC", label: "No ERCs on this mortgage" },
  { value: "CHARGES_PARTIAL", label: "Charges apply for early full / partial repayment" },
  { value: "NO_ERC_ADMIN_POSSIBLE", label: "No ERCs — lender may charge an admin fee" },
  { value: "CLIENT_ACCEPTS_ERC", label: "Client accepts ERCs to secure the deal" },
  { value: "FLEXIBILITY_PREFERRED", label: "No ERCs preferred — flexibility required" },
];

const PORTABILITY_OPTIONS = [
  { value: "", label: "— Please select —" },
  { value: "IS_PORTABLE", label: "Mortgage is portable" },
  { value: "NOT_PORTABLE", label: "Mortgage is not portable" },
  { value: "PORTABLE_RECOMMENDED", label: "Portable — recommended for client's circumstances" },
  { value: "NOT_PORTABLE_RECOMMENDED", label: "Not portable — recommended for client's circumstances" },
];

const RATE_SWITCH_OPTIONS = [
  { value: "", label: "— Please select —" },
  { value: "NOT_APPLICABLE", label: "Rate switch not applicable to this lender" },
  { value: "CUSTOMER_RESPONSIBILITY", label: "Customer's responsibility to monitor rates" },
  { value: "ADVISOR_INFORMAL", label: "Advisor will notify informally if rate reduces" },
  { value: "ADVISOR_COMMITTED", label: "Advisor commits to regular rate checks" },
];

const isVariableRate = (rt: string) =>
  ["TRACKER", "VARIABLE", "DISCOUNT", "CAPPED", "SONIA_LINKED", "STEPPED"].includes(rt);

const isInterestOnly = (rm: string) => rm === "INTEREST_ONLY";

const TypeToggle: React.FC<{
  value: string;
  onChange: (v: string) => void;
}> = ({ value, onChange }) => (
  <Input type="select" className="w-auto" value={value} onChange={(e) => onChange(e.target.value)}>
    <option value="GENERAL">General</option>
    <option value="SHARIA">Sharia</option>
  </Input>
);

const Tab2_RateRepayment: React.FC<Props> = ({ data, rateType, repaymentMethod, onChange }) => {
  return (
    <div className="d-flex flex-column gap-3">

      {/* ── Why this lender? ── */}
      <Card className="border border-success">
        <CardHeader className="bg-success bg-opacity-10 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-success">Why Are We Recommending This Lender?</h5>
          <TypeToggle
            value={data.recommending_lender.recommending_lender_type}
            onChange={(v) => onChange("recommending_lender", "recommending_lender_type", v)}
          />
        </CardHeader>
        <CardBody>
          <FormGroup>
            <Label>
              Justification
              <small className="text-muted ms-2">Why this lender was the most suitable choice</small>
            </Label>
            <Input
              type="textarea"
              rows={4}
              value={
                data.recommending_lender.recommending_lender_type === "SHARIA"
                  ? data.recommending_lender.question_one_sharia
                  : data.recommending_lender.question_one_answer
              }
              onChange={(e) =>
                onChange(
                  "recommending_lender",
                  data.recommending_lender.recommending_lender_type === "SHARIA"
                    ? "question_one_sharia"
                    : "question_one_answer",
                  e.target.value
                )
              }
            />
          </FormGroup>
        </CardBody>
      </Card>

      {/* ── Why this rate type? ── */}
      <Card className="border border-secondary">
        <CardHeader className="bg-secondary bg-opacity-10 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Why Are We Recommending This Rate Type?</h5>
          <TypeToggle
            value={data.recommending_rate_type.recommending_rate_type}
            onChange={(v) => onChange("recommending_rate_type", "recommending_rate_type", v)}
          />
        </CardHeader>
        <CardBody>
          {isVariableRate(rateType) && (
            <Alert color="info" className="py-2">
              <strong>Variable rate selected.</strong> The letter will include: <em>"Your payments can fluctuate during the initial deal period. You did not need the certainty of fixed monthly repayments and were satisfied with payments that can fluctuate because…"</em>
            </Alert>
          )}
          {data.recommending_rate_type.recommending_rate_type === "GENERAL" ? (
            <Row className="g-3">
              <Col md={12}>
                <FormGroup>
                  <Label>Answer 1 — Why this rate type suits the client</Label>
                  <Input
                    type="textarea"
                    rows={4}
                    value={data.recommending_rate_type.question_one_answer}
                    onChange={(e) => onChange("recommending_rate_type", "question_one_answer", e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label>Answer 2 — Why alternative rate types were not suitable</Label>
                  <Input
                    type="textarea"
                    rows={4}
                    value={data.recommending_rate_type.question_two_answer}
                    onChange={(e) => onChange("recommending_rate_type", "question_two_answer", e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label>Answer 3 — Any additional supporting reasons <span className="text-muted">(optional)</span></Label>
                  <Input
                    type="textarea"
                    rows={3}
                    value={data.recommending_rate_type.question_three_answer}
                    onChange={(e) => onChange("recommending_rate_type", "question_three_answer", e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
          ) : (
            <Row className="g-3">
              <Col md={12}>
                <FormGroup>
                  <Label>Answer 1</Label>
                  <Input
                    type="textarea"
                    rows={4}
                    value={data.recommending_rate_type.question_one_sharia}
                    onChange={(e) => onChange("recommending_rate_type", "question_one_sharia", e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label>Answer 2</Label>
                  <Input
                    type="textarea"
                    rows={4}
                    value={data.recommending_rate_type.question_two_sharia}
                    onChange={(e) => onChange("recommending_rate_type", "question_two_sharia", e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
          )}
        </CardBody>
      </Card>

      {/* ── Why this deal period? ── */}
      <Card className="border border-success">
        <CardHeader className="bg-success bg-opacity-10 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-success">Why Are We Recommending This Deal Period?</h5>
          <TypeToggle
            value={data.recommending_deal_period.recommending_deal_period_type}
            onChange={(v) => onChange("recommending_deal_period", "recommending_deal_period_type", v)}
          />
        </CardHeader>
        <CardBody>
          {data.recommending_deal_period.recommending_deal_period_type === "GENERAL" ? (
            <Row className="g-3">
              <Col md={12}>
                <FormGroup>
                  <Label>Answer 1 — Why this specific deal period was recommended</Label>
                  <Input
                    type="textarea"
                    rows={4}
                    value={data.recommending_deal_period.question_one_answer}
                    onChange={(e) => onChange("recommending_deal_period", "question_one_answer", e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Answer 2 — Why a <strong>shorter</strong> deal period was not suitable</Label>
                  <Input
                    type="textarea"
                    rows={3}
                    value={data.recommending_deal_period.question_two_answer}
                    onChange={(e) => onChange("recommending_deal_period", "question_two_answer", e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Answer 3 — Why a <strong>longer</strong> deal period was not suitable</Label>
                  <Input
                    type="textarea"
                    rows={3}
                    value={data.recommending_deal_period.question_three_answer}
                    onChange={(e) => onChange("recommending_deal_period", "question_three_answer", e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
          ) : (
            <FormGroup>
              <Label>Answer 1</Label>
              <Input
                type="textarea"
                rows={5}
                value={data.recommending_deal_period.question_one_sharia}
                onChange={(e) => onChange("recommending_deal_period", "question_one_sharia", e.target.value)}
              />
            </FormGroup>
          )}
        </CardBody>
      </Card>

      {/* ── Why this repayment method? ── */}
      <Card className="border border-secondary">
        <CardHeader className="bg-secondary bg-opacity-10 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Why Are We Recommending This Repayment Method?</h5>
          <TypeToggle
            value={data.recommending_repayment.recommending_repayment_type}
            onChange={(v) => onChange("recommending_repayment", "recommending_repayment_type", v)}
          />
        </CardHeader>
        <CardBody>
          {isInterestOnly(repaymentMethod) && (
            <Alert color="warning" className="py-2">
              <strong>Interest Only selected.</strong> The letter will include: <em>"Your mortgage balance will not be repaid by the end of the term. You will be responsible for paying the balance in full at the end of the term."</em>
            </Alert>
          )}
          <FormGroup>
            <Label>Answer 1</Label>
            <Input
              type="textarea"
              rows={4}
              value={
                data.recommending_repayment.recommending_repayment_type === "SHARIA"
                  ? data.recommending_repayment.question_one_sharia
                  : data.recommending_repayment.question_one_answer
              }
              onChange={(e) =>
                onChange(
                  "recommending_repayment",
                  data.recommending_repayment.recommending_repayment_type === "SHARIA"
                    ? "question_one_sharia"
                    : "question_one_answer",
                  e.target.value
                )
              }
            />
          </FormGroup>
        </CardBody>
      </Card>

      {/* ── Mortgage amount / Arrangement fee ── */}
      <Row className="g-3">
        <Col md={6}>
          <Card className="border border-success h-100">
            <CardHeader className="bg-success bg-opacity-10">
              <h5 className="mb-0 text-success">Mortgage Amount Reason</h5>
            </CardHeader>
            <CardBody>
              <FormGroup>
                <Label>Select the applicable reason</Label>
                <Input
                  type="select"
                  value={data.mortgage_amount_selection.selection}
                  onChange={(e) => onChange("mortgage_amount_selection", "selection", e.target.value)}
                >
                  {MORTGAGE_AMOUNT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Input>
              </FormGroup>
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="border border-secondary h-100">
            <CardHeader className="bg-secondary bg-opacity-10">
              <h5 className="mb-0">Arrangement Fee</h5>
            </CardHeader>
            <CardBody>
              <FormGroup>
                <Label>Fee option</Label>
                <Input
                  type="select"
                  value={data.arrangement_fee_selection.selection}
                  onChange={(e) => onChange("arrangement_fee_selection", "selection", e.target.value)}
                >
                  {ARRANGEMENT_FEE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Input>
              </FormGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* ── Why this term? ── */}
      <Card className="border border-success">
        <CardHeader className="bg-success bg-opacity-10 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-success">Why Are We Recommending This Mortgage Term?</h5>
          <TypeToggle
            value={data.recommending_term.recommending_term_type}
            onChange={(v) => onChange("recommending_term", "recommending_term_type", v)}
          />
        </CardHeader>
        <CardBody>
          <FormGroup>
            <Label>
              Answer 1
              <small className="text-muted ms-2">If lending past retirement age, fully cover feasibility and affordability</small>
            </Label>
            <Input
              type="textarea"
              rows={4}
              value={
                data.recommending_term.recommending_term_type === "SHARIA"
                  ? data.recommending_term.question_one_sharia
                  : data.recommending_term.question_one_answer
              }
              onChange={(e) =>
                onChange(
                  "recommending_term",
                  data.recommending_term.recommending_term_type === "SHARIA"
                    ? "question_one_sharia"
                    : "question_one_answer",
                  e.target.value
                )
              }
            />
          </FormGroup>
        </CardBody>
      </Card>

      {/* ── ERCs / Portability / Rate switch ── */}
      <Row className="g-3">
        <Col md={4}>
          <Card className="border border-secondary h-100">
            <CardHeader className="bg-secondary bg-opacity-10">
              <h5 className="mb-0">Early Repayment Charges</h5>
            </CardHeader>
            <CardBody>
              <FormGroup>
                <Label>ERC Option</Label>
                <Input
                  type="select"
                  value={data.erc_selection.selection}
                  onChange={(e) => onChange("erc_selection", "selection", e.target.value)}
                >
                  {ERC_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Input>
              </FormGroup>
              {data.erc_selection.selection !== "" && data.erc_selection.selection !== "NO_ERC" && (
                <FormGroup>
                  <Label>Maximum ERC Amount (£)</Label>
                  <Input
                    type="text"
                    placeholder="e.g. 2750"
                    value={data.erc_selection.max_erc_amount}
                    onChange={(e) => onChange("erc_selection", "max_erc_amount", e.target.value)}
                  />
                </FormGroup>
              )}
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border border-success h-100">
            <CardHeader className="bg-success bg-opacity-10">
              <h5 className="mb-0 text-success">Portability</h5>
            </CardHeader>
            <CardBody>
              <FormGroup>
                <Label>Portability Option</Label>
                <Input
                  type="select"
                  value={data.portability_selection.selection}
                  onChange={(e) => onChange("portability_selection", "selection", e.target.value)}
                >
                  {PORTABILITY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Input>
              </FormGroup>
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border border-secondary h-100">
            <CardHeader className="bg-secondary bg-opacity-10">
              <h5 className="mb-0">Rate Switch</h5>
            </CardHeader>
            <CardBody>
              <FormGroup>
                <Label>Rate Switch Option</Label>
                <Input
                  type="select"
                  value={data.rate_switch_selection.selection}
                  onChange={(e) => onChange("rate_switch_selection", "selection", e.target.value)}
                >
                  {RATE_SWITCH_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Input>
              </FormGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* ── Additional Information ── */}
      <Card className="border border-success">
        <CardHeader className="bg-success bg-opacity-10 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-success">Additional Information</h5>
          <TypeToggle
            value={data.additional_information.additional_information_type}
            onChange={(v) => onChange("additional_information", "additional_information_type", v)}
          />
        </CardHeader>
        <CardBody>
          <FormGroup>
            <Label>
              Answer 1
              <small className="text-muted ms-2">
                If initial recommendation was rejected, state original recommendation, why it was suitable, and the reason for the change
              </small>
            </Label>
            <Input
              type="textarea"
              rows={5}
              value={
                data.additional_information.additional_information_type === "SHARIA"
                  ? data.additional_information.question_one_sharia
                  : data.additional_information.question_one_answer
              }
              onChange={(e) =>
                onChange(
                  "additional_information",
                  data.additional_information.additional_information_type === "SHARIA"
                    ? "question_one_sharia"
                    : "question_one_answer",
                  e.target.value
                )
              }
            />
          </FormGroup>
        </CardBody>
      </Card>
    </div>
  );
};

export default Tab2_RateRepayment;