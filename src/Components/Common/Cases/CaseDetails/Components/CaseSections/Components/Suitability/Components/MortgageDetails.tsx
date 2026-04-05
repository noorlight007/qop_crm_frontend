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

export interface MortgageDetailsData {
  advisor_details: {
    advisor_name: string;
    firm_name: string;
    role: string;
    address_line_1: string;
    city: string;
    postcode: string;
    email: string;
    phone: string;
  };
  client_details: {
    salutation: string;
    first_name: string;
    last_name: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    postcode: string;
    is_joint: string;
    salutation_2: string;
    first_name_2: string;
    last_name_2: string;
  };
  property_transaction: {
    property_address: string;
    transaction_type: string;
    soft_facts_type: string;
    question_one_answer: string;
    question_one_sharia: string;
  };
  mortgage_details: {
    lender: string;
    initial_rate: string;
    rate_type: string;
    deal_period_end: string;
    repayment_method: string;
    mortgage_amount: string;
    arrangement_fee_amount: string;
    term_years: string;
    term_months: string;
    monthly_repayment: string;
  };
}

interface Props {
  data: MortgageDetailsData;
  onChange: <S extends keyof MortgageDetailsData>(
    section: S,
    field: keyof MortgageDetailsData[S],
    value: string
  ) => void;
}

const SALUTATIONS = ["Mr", "Mrs", "Miss", "Ms", "Dr", "Prof"];

const Tab1_MortgageDetails: React.FC<Props> = ({ data, onChange }) => {
  return (
    <div className="d-flex flex-column gap-3">

      {/* ── Advisor Details ── */}
      <Card className="border border-success">
        <CardHeader className="bg-success bg-opacity-10">
          <h5 className="mb-0 text-success">Advisor Details</h5>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Advisor Name</Label>
                <Input
                  type="text"
                  value={data.advisor_details.advisor_name}
                  onChange={(e) => onChange("advisor_details", "advisor_name", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Firm / Company Name</Label>
                <Input
                  type="text"
                  value={data.advisor_details.firm_name}
                  onChange={(e) => onChange("advisor_details", "firm_name", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Role</Label>
                <Input
                  type="text"
                  value={data.advisor_details.role}
                  onChange={(e) => onChange("advisor_details", "role", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={data.advisor_details.email}
                  onChange={(e) => onChange("advisor_details", "email", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Phone</Label>
                <Input
                  type="text"
                  value={data.advisor_details.phone}
                  onChange={(e) => onChange("advisor_details", "phone", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={5}>
              <FormGroup>
                <Label>Address</Label>
                <Input
                  type="text"
                  value={data.advisor_details.address_line_1}
                  onChange={(e) => onChange("advisor_details", "address_line_1", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>City</Label>
                <Input
                  type="text"
                  value={data.advisor_details.city}
                  onChange={(e) => onChange("advisor_details", "city", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label>Postcode</Label>
                <Input
                  type="text"
                  value={data.advisor_details.postcode}
                  onChange={(e) => onChange("advisor_details", "postcode", e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* ── Client Details ── */}
      <Card className="border border-secondary">
        <CardHeader className="bg-secondary bg-opacity-10 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Client Details</h5>
          <Input
            type="select"
            className="w-auto"
            value={data.client_details.is_joint}
            onChange={(e) => onChange("client_details", "is_joint", e.target.value)}
          >
            <option value="NO">Single Applicant</option>
            <option value="YES">Joint Applicant</option>
          </Input>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md={2}>
              <FormGroup>
                <Label>Title</Label>
                <Input
                  type="select"
                  value={data.client_details.salutation}
                  onChange={(e) => onChange("client_details", "salutation", e.target.value)}
                >
                  {SALUTATIONS.map((s) => <option key={s}>{s}</option>)}
                </Input>
              </FormGroup>
            </Col>
            <Col md={5}>
              <FormGroup>
                <Label>First Name</Label>
                <Input
                  type="text"
                  value={data.client_details.first_name}
                  onChange={(e) => onChange("client_details", "first_name", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={5}>
              <FormGroup>
                <Label>Last Name</Label>
                <Input
                  type="text"
                  value={data.client_details.last_name}
                  onChange={(e) => onChange("client_details", "last_name", e.target.value)}
                />
              </FormGroup>
            </Col>

            {data.client_details.is_joint === "YES" && (
              <>
                <Col md={12}>
                  <p className="text-muted fw-semibold mb-2 border-top pt-2">Second Applicant</p>
                </Col>
                <Col md={2}>
                  <FormGroup>
                    <Label>Title</Label>
                    <Input
                      type="select"
                      value={data.client_details.salutation_2}
                      onChange={(e) => onChange("client_details", "salutation_2", e.target.value)}
                    >
                      {SALUTATIONS.map((s) => <option key={s}>{s}</option>)}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={5}>
                  <FormGroup>
                    <Label>First Name</Label>
                    <Input
                      type="text"
                      value={data.client_details.first_name_2}
                      onChange={(e) => onChange("client_details", "first_name_2", e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col md={5}>
                  <FormGroup>
                    <Label>Last Name</Label>
                    <Input
                      type="text"
                      value={data.client_details.last_name_2}
                      onChange={(e) => onChange("client_details", "last_name_2", e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </>
            )}

            <Col md={12}>
              <p className="text-muted fw-semibold mb-2 border-top pt-2">Client Address</p>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Address Line 1</Label>
                <Input
                  type="text"
                  value={data.client_details.address_line_1}
                  onChange={(e) => onChange("client_details", "address_line_1", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Address Line 2</Label>
                <Input
                  type="text"
                  value={data.client_details.address_line_2}
                  onChange={(e) => onChange("client_details", "address_line_2", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={8}>
              <FormGroup>
                <Label>City</Label>
                <Input
                  type="text"
                  value={data.client_details.city}
                  onChange={(e) => onChange("client_details", "city", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Postcode</Label>
                <Input
                  type="text"
                  value={data.client_details.postcode}
                  onChange={(e) => onChange("client_details", "postcode", e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* ── Property & Transaction ── */}
      <Card className="border border-success">
        <CardHeader className="bg-success bg-opacity-10 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-success">Property & Transaction</h5>
          <Input
            type="select"
            className="w-auto"
            value={data.property_transaction.soft_facts_type}
            onChange={(e) => onChange("property_transaction", "soft_facts_type", e.target.value)}
          >
            <option value="GENERAL">General</option>
            <option value="SHARIA">Sharia</option>
          </Input>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md={8}>
              <FormGroup>
                <Label>Property Address</Label>
                <Input
                  type="text"
                  value={data.property_transaction.property_address}
                  onChange={(e) => onChange("property_transaction", "property_address", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Transaction Type</Label>
                <Input
                  type="select"
                  value={data.property_transaction.transaction_type}
                  onChange={(e) => onChange("property_transaction", "transaction_type", e.target.value)}
                >
                  <option value="PURCHASE">Purchase</option>
                  <option value="REMORTGAGE">Remortgage</option>
                  <option value="PRODUCT_TRANSFER">Product Transfer</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Label>
                  Soft Facts / Transaction Background
                  <small className="text-muted ms-2">Client goals, circumstances and relevant context</small>
                </Label>
                <Input
                  type="textarea"
                  rows={5}
                  value={
                    data.property_transaction.soft_facts_type === "SHARIA"
                      ? data.property_transaction.question_one_sharia
                      : data.property_transaction.question_one_answer
                  }
                  onChange={(e) =>
                    onChange(
                      "property_transaction",
                      data.property_transaction.soft_facts_type === "SHARIA"
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

      {/* ── Mortgage Recommendation ── */}
      <Card className="border border-secondary">
        <CardHeader className="bg-secondary bg-opacity-10">
          <h5 className="mb-0">Mortgage Recommendation Details</h5>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Lender</Label>
                <Input
                  type="text"
                  placeholder="e.g. HSBC"
                  value={data.mortgage_details.lender}
                  onChange={(e) => onChange("mortgage_details", "lender", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label>Initial Rate (%)</Label>
                <Input
                  type="text"
                  placeholder="e.g. 3.86"
                  value={data.mortgage_details.initial_rate}
                  onChange={(e) => onChange("mortgage_details", "initial_rate", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label>Rate Type</Label>
                <Input
                  type="select"
                  value={data.mortgage_details.rate_type}
                  onChange={(e) => onChange("mortgage_details", "rate_type", e.target.value)}
                >
                  <option value="FIXED">Fixed</option>
                  <option value="TRACKER">Tracker</option>
                  <option value="VARIABLE">Variable</option>
                  <option value="DISCOUNT">Discount</option>
                  <option value="CAPPED">Capped</option>
                  <option value="SONIA_LINKED">Sonia Linked</option>
                  <option value="STEPPED">Stepped</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Deal Period End Date</Label>
                <Input
                  type="text"
                  placeholder="e.g. 30/09/2030"
                  value={data.mortgage_details.deal_period_end}
                  onChange={(e) => onChange("mortgage_details", "deal_period_end", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Repayment Method</Label>
                <Input
                  type="select"
                  value={data.mortgage_details.repayment_method}
                  onChange={(e) => onChange("mortgage_details", "repayment_method", e.target.value)}
                >
                  <option value="REPAYMENT">Repayment</option>
                  <option value="INTEREST_ONLY">Interest Only</option>
                  <option value="PART_AND_PART">Part &amp; Part</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Mortgage Amount (£)</Label>
                <Input
                  type="text"
                  placeholder="e.g. 110000"
                  value={data.mortgage_details.mortgage_amount}
                  onChange={(e) => onChange("mortgage_details", "mortgage_amount", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Arrangement Fee (£)</Label>
                <Input
                  type="text"
                  placeholder="Leave blank if none"
                  value={data.mortgage_details.arrangement_fee_amount}
                  onChange={(e) => onChange("mortgage_details", "arrangement_fee_amount", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Term (Years)</Label>
                <Input
                  type="text"
                  placeholder="e.g. 20"
                  value={data.mortgage_details.term_years}
                  onChange={(e) => onChange("mortgage_details", "term_years", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Term (Months)</Label>
                <Input
                  type="text"
                  placeholder="e.g. 0"
                  value={data.mortgage_details.term_months}
                  onChange={(e) => onChange("mortgage_details", "term_months", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Monthly Repayment (£)</Label>
                <Input
                  type="text"
                  placeholder="e.g. 657.81"
                  value={data.mortgage_details.monthly_repayment}
                  onChange={(e) => onChange("mortgage_details", "monthly_repayment", e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default Tab1_MortgageDetails;