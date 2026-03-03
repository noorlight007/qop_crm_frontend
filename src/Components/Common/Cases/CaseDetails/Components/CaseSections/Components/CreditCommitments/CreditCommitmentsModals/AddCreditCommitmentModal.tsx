import LoadingSpinner from "@/app/loading";
import { useAddCreditCommitmentsDetailsMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CreditCommitmentsDetails/CreditCommitmentsDetailsApi";
import { useUpdateSectionCompleteStatusMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SectionCompleteApi";
import { useGetCaseUsersQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseUsers/CaseUsersApi";
import { AddCreditCommitmentModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/CreditCommitmentsTypes";
import getCurrencySign from "@/utils/currency";
import { limitDecimalPlaces } from "@/utils/inputHandlers";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

const AddCreditCommitmentModal: React.FC<AddCreditCommitmentModalProps> = ({
  isOpen,
  toggle,
}) => {
  const { casealias } = useParams();
  const [formData, setFormData] = useState({
    applicant: "",
    joint: "",
    type: "",
    company: "",
    account_no: null,
    os_balance: "",
    settlement_balance: "",
    monthly_repayment: "",
    interest_rate: "",
    card_limit: "",
    term_remaining: "",
    balloon_payment: "",
    court_ordered: "",
    cost_of_credit: "",
    paid_on_completion: "",
    source: "",
    has_the_unsecured_credit_mounted_up: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const camelToSnake = (s: string) =>
    s.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`);

  const getFieldError = (name: string) => {
    if (!errors) return undefined;
    if (errors[name]) return errors[name];
    const snake = camelToSnake(name);
    if (errors[snake]) return errors[snake];
    return undefined;
  };

  const parseApiErrors = (err: any): Record<string, string> => {
    const out: Record<string, string> = {};
    const data = err?.data || (err?.error && err.error.data) || err;
    const sanitize = (m: string) => String(m).replace(/^\d+[,\s]*/, "");

    const recurse = (value: any, path: string[] = []) => {
      if (value == null) return;
      if (typeof value === "string") {
        out[path.join(".")] = sanitize(value);
        return;
      }
      if (Array.isArray(value)) {
        out[path.join(".")] = value
          .map((v) => (typeof v === "string" ? sanitize(v) : JSON.stringify(v)))
          .join(", ");
        return;
      }
      if (typeof value === "object") {
        for (const k of Object.keys(value)) recurse(value[k], path.concat(k));
        return;
      }
      out[path.join(".")] = String(value);
    };

    recurse(data, []);
    return out;
  };
  // rtk hooks
  const { data: caseUsers, isLoading } = useGetCaseUsersQuery({
    case_alias: casealias,
  });
  const [addCreditCommitmentsDetails, { isLoading: isAdding }] =
    useAddCreditCommitmentsDetailsMutation();
  const [updateSectionCompleteStatus] =
    useUpdateSectionCompleteStatusMutation();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await addCreditCommitmentsDetails({
        case_alias: casealias,
        payload: formData,
      });
      if (res.data) {
        toast.success("Credit Commitment added successfully");
        toggle();
        try {
          await updateSectionCompleteStatus({
            case_alias: casealias,
            section_data: { is_credit_commitments: true },
          });
        } catch (err) {
          console.error("Failed to update section complete status:", err);
        }
        setFormData({
          applicant: "",
          joint: "",
          type: "",
          company: "",
          account_no: null,
          os_balance: "",
          settlement_balance: "",
          monthly_repayment: "",
          interest_rate: "",
          card_limit: "",
          term_remaining: "",
          balloon_payment: "",
          court_ordered: "",
          cost_of_credit: "",
          paid_on_completion: "",
          source: "",
          has_the_unsecured_credit_mounted_up: "",
        });
      } else if (res.error) {
        const parsed = parseApiErrors(res.error as any);
        setErrors(parsed);
        const first = Object.values(parsed)[0];
        toast.error(first || "Failed to add credit commitment");
      } else {
        toast.error("Error adding credit commitment");
      }
    } catch (error) {
      toast.error("Error adding credit commitment");
    }
  };

  if (isLoading || isAdding) return <LoadingSpinner />;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">Add Credit Commitment</span>
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label>Applicant<span className="text-danger">*</span></Label>
                <Input
                  type="select"
                  name="applicant"
                  value={formData.applicant}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select...</option>
                  {caseUsers?.map((user: any) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name}
                    </option>
                  ))}
                </Input>
                {getFieldError("applicant") && (
                  <div className="text-danger small">
                    {getFieldError("applicant")}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Joint</Label>
                <Input
                  type="select"
                  name="joint"
                  value={formData.joint}
                  onChange={handleInputChange}
                >
                  <option value="">Select...</option>
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                </Input>
                {getFieldError("joint") && (
                  <div className="text-danger small">
                    {getFieldError("joint")}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Type<span className="text-danger">*</span></Label>
                <Input
                  type="select"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select...</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="STORE_CARD">Store Card</option>
                  <option value="LOAN">Loan</option>
                  <option value="HP">HP</option>
                  <option value="OVERDRAFT">Overdraft</option>
                  <option value="STUDENT_LOAN">Student Loan</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="LEASE">Lease</option>
                  <option value="UNSECURED">Unsecured</option>
                  <option value="MORTGAGE_RENT">Mortgage / Rent</option>
                  <option value="PUBLIC_UTILITY">Public Utility</option>
                  <option value="COMMUNICATIONS">Communications</option>
                  <option value="INSURANCE">Insurance</option>
                  <option value="SECURED">Secured</option>
                  <option value="PCP">PCP</option>
                  <option value="MAIL_ORDER">Mail Order</option>
                  <option value="CHILDCARE">Childcare</option>
                  <option value="CAR_FINANCE">Car Finance</option>
                  <option value="BNPL">Buy Now Pay Later (BNPL)</option>
                  <option value="CREDIT_COMMITMENT">Credit Commitment</option>
                  <option value="DMP">DMP</option>
                </Input>
                {getFieldError("type") && (
                  <div className="text-danger small">
                    {getFieldError("type")}
                  </div>
                )}
                <small className="text-danger" style={{ fontSize: "9px" }}>
                  Select the "Type" correctly, as it cannot be updated later.
                </small>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            {(formData.type === "CREDIT_CARD" ||
              formData.type === "STORE_CARD" ||
              formData.type === "LOAN" ||
              formData.type === "HP" ||
              formData.type === "OVERDRAFT" ||
              formData.type === "STUDENT_LOAN" ||
              formData.type === "LEASE" ||
              formData.type === "UNSECURED" ||
              formData.type === "MORTGAGE_RENT" ||
              formData.type === "PUBLIC_UTILITY" ||
              formData.type === "COMMUNICATIONS" ||
              formData.type === "INSURANCE" ||
              formData.type === "SECURED" ||
              formData.type === "PCP" ||
              formData.type === "MAIL_ORDER" ||
              formData.type === "BNPL" ||
              formData.type === "DMP") && (
              <Col md={6}>
                <FormGroup>
                  <Label>Company<span className="text-danger">*</span></Label>
                  <Input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                  />
                  {getFieldError("company") && (
                    <div className="text-danger small">
                      {getFieldError("company")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            )}
            {(formData.type === "CREDIT_CARD" ||
              formData.type === "STORE_CARD" ||
              formData.type === "LOAN" ||
              formData.type === "HP" ||
              formData.type === "OVERDRAFT" ||
              formData.type === "STUDENT_LOAN" ||
              formData.type === "UNSECURED" ||
              formData.type === "MORTGAGE_RENT" ||
              formData.type === "SECURED" ||
              formData.type === "PCP" ||
              formData.type === "MAIL_ORDER" ||
              formData.type === "BNPL" ||
              formData.type === "DMP") && (
              <Col md={6}>
                <FormGroup>
                  <Label>Account No.</Label>
                  <Input
                    type="number"
                    name="account_no"
                    value={formData.account_no || ""}
                    onChange={handleInputChange}
                  />
                  {getFieldError("account_no") && (
                    <div className="text-danger small">
                      {getFieldError("account_no")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            )}
            {(formData.type === "CREDIT_CARD" ||
              formData.type === "STORE_CARD" ||
              formData.type === "LOAN" ||
              formData.type === "HP" ||
              formData.type === "OVERDRAFT" ||
              formData.type === "STUDENT_LOAN" ||
              formData.type === "LEASE" ||
              formData.type === "UNSECURED" ||
              formData.type === "MORTGAGE_RENT" ||
              formData.type === "SECURED" ||
              formData.type === "PCP" ||
              formData.type === "MAIL_ORDER" ||
              formData.type === "BNPL" ||
              formData.type === "DMP") && (
              <Col md={6}>
                <FormGroup>
                  <Label>OS Balance<span className="text-danger">*</span> ({getCurrencySign()})</Label>
                  <Input
                    type="number"
                    name="os_balance"
                    value={formData.os_balance}
                    onChange={handleInputChange}
                    step="0.01"
                    inputMode="decimal"
                    onInput={limitDecimalPlaces}
                    required
                  />
                  {getFieldError("os_balance") && (
                    <div className="text-danger small">
                      {getFieldError("os_balance")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            )}
            {(formData.type === "CREDIT_CARD" ||
              formData.type === "STORE_CARD" ||
              formData.type === "LOAN" ||
              formData.type === "HP" ||
              formData.type === "OVERDRAFT" ||
              formData.type === "STUDENT_LOAN" ||
              formData.type === "MAINTENANCE" ||
              formData.type === "LEASE" ||
              formData.type === "UNSECURED" ||
              formData.type === "MORTGAGE_RENT" ||
              formData.type === "PUBLIC_UTILITY" ||
              formData.type === "COMMUNICATIONS" ||
              formData.type === "INSURANCE" ||
              formData.type === "SECURED" ||
              formData.type === "PCP" ||
              formData.type === "MAIL_ORDER" ||
              formData.type === "CHILDCARE" ||
              formData.type === "CAR_FINANCE" ||
              formData.type === "BNPL" ||
              formData.type === "CREDIT_COMMITMENT" ||
              formData.type === "DMP") && (
              <Col md={6}>
                <FormGroup>
                  <Label>Settlement Balance ({getCurrencySign()})</Label>
                  <Input
                    type="number"
                    name="settlement_balance"
                    value={formData.settlement_balance}
                    onChange={handleInputChange}
                    step="0.01"
                    inputMode="decimal"
                    onInput={limitDecimalPlaces}
                  />
                  {getFieldError("settlement_balance") && (
                    <div className="text-danger small">
                      {getFieldError("settlement_balance")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            )}
            {(formData.type === "CREDIT_CARD" ||
              formData.type === "STORE_CARD" ||
              formData.type === "LOAN" ||
              formData.type === "HP" ||
              formData.type === "OVERDRAFT" ||
              formData.type === "STUDENT_LOAN" ||
              formData.type === "MAINTENANCE" ||
              formData.type === "LEASE" ||
              formData.type === "UNSECURED" ||
              formData.type === "MORTGAGE_RENT" ||
              formData.type === "PUBLIC_UTILITY" ||
              formData.type === "COMMUNICATIONS" ||
              formData.type === "INSURANCE" ||
              formData.type === "SECURED" ||
              formData.type === "PCP" ||
              formData.type === "MAIL_ORDER" ||
              formData.type === "CHILDCARE" ||
              formData.type === "BNPL" ||
              formData.type === "DMP") && (
              <Col md={6}>
                <FormGroup>
                  <Label>Monthly Repayment ({getCurrencySign()})</Label>
                  <Input
                    type="number"
                    name="monthly_repayment"
                    value={formData.monthly_repayment}
                    onChange={handleInputChange}
                    step="0.01"
                    inputMode="decimal"
                    onInput={limitDecimalPlaces}
                  />
                  {getFieldError("monthly_repayment") && (
                    <div className="text-danger small">
                      {getFieldError("monthly_repayment")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            )}
            {(formData.type === "CREDIT_CARD" ||
              formData.type === "STORE_CARD" ||
              formData.type === "LOAN" ||
              formData.type === "HP" ||
              formData.type === "OVERDRAFT" ||
              formData.type === "UNSECURED" ||
              formData.type === "MORTGAGE_RENT" ||
              formData.type === "SECURED" ||
              formData.type === "PCP" ||
              formData.type === "MAIL_ORDER" ||
              formData.type === "BNPL" ||
              formData.type === "DMP") && (
              <Col md={6}>
                <FormGroup>
                  <Label>Interest Rate (%)</Label>
                  <Input
                    type="number"
                    name="interest_rate"
                    value={formData.interest_rate}
                    onChange={handleInputChange}
                    step="0.01"
                    inputMode="decimal"
                    onInput={limitDecimalPlaces}
                  />
                  {getFieldError("interest_rate") && (
                    <div className="text-danger small">
                      {getFieldError("interest_rate")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            )}
            {(formData.type === "CREDIT_CARD" ||
              formData.type === "STORE_CARD" ||
              formData.type === "MAIL_ORDER" ||
              formData.type === "BNPL") && (
              <Col md={6}>
                <FormGroup>
                  <Label>Card Limit ({getCurrencySign()})</Label>
                  <Input
                    type="number"
                    name="card_limit"
                    value={formData.card_limit}
                    onChange={handleInputChange}
                    step="0.01"
                    inputMode="decimal"
                    onInput={limitDecimalPlaces}
                  />
                  {getFieldError("card_limit") && (
                    <div className="text-danger small">
                      {getFieldError("card_limit")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            )}
            {(formData.type === "LOAN" ||
              formData.type === "HP" ||
              formData.type === "MAINTENANCE" ||
              formData.type === "LEASE" ||
              formData.type === "UNSECURED" ||
              formData.type === "SECURED" ||
              formData.type === "PCP" ||
              formData.type === "CHILDCARE" ||
              formData.type === "BNPL" ||
              formData.type === "DMP") && (
              <Col md={6}>
                <FormGroup>
                  <Label>Term Remaining (Months)</Label>
                  <Input
                    type="number"
                    name="term_remaining"
                    value={formData.term_remaining}
                    onChange={handleInputChange}
                  />
                  {getFieldError("term_remaining") && (
                    <div className="text-danger small">
                      {getFieldError("term_remaining")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            )}{" "}
            {formData.type === "PCP" && (
              <Col md={6}>
                <FormGroup>
                  <Label>Balloon Payment ({getCurrencySign()})</Label>
                  <Input
                    type="number"
                    name="balloon_payment"
                    value={formData.balloon_payment}
                    onChange={handleInputChange}
                    step="0.01"
                    inputMode="decimal"
                    onInput={limitDecimalPlaces}
                  />
                  {getFieldError("balloon_payment") && (
                    <div className="text-danger small">
                      {getFieldError("balloon_payment")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            )}
            {(formData.type === "MAINTENANCE" ||
              formData.type === "CHILDCARE") && (
              <Col md={6}>
                <FormGroup>
                  <Label>Court Ordered</Label>
                  <Input
                    type="select"
                    name="court_ordered"
                    value={formData.court_ordered}
                    onChange={handleInputChange}
                  >
                    <option value="">Select...</option>
                    <option value="YES">Yes</option>
                    <option value="NO">No</option>
                  </Input>
                  {getFieldError("court_ordered") && (
                    <div className="text-danger small">
                      {getFieldError("court_ordered")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            )}
            {(formData.type === "CREDIT_CARD" ||
              formData.type === "STORE_CARD" ||
              formData.type === "LOAN" ||
              formData.type === "HP" ||
              formData.type === "OVERDRAFT" ||
              formData.type === "STUDENT_LOAN" ||
              formData.type === "LEASE" ||
              formData.type === "UNSECURED" ||
              formData.type === "MORTGAGE_RENT" ||
              formData.type === "SECURED" ||
              formData.type === "PCP" ||
              formData.type === "MAIL_ORDER" ||
              formData.type === "BNPL" ||
              formData.type === "DMP") && (
              <Col md={6}>
                <FormGroup>
                  <Label>Cost of Credit ({getCurrencySign()})</Label>
                  <Input
                    type="number"
                    name="cost_of_credit"
                    value={formData.cost_of_credit}
                    onChange={handleInputChange}
                    step="0.01"
                  />
                  {getFieldError("cost_of_credit") && (
                    <div className="text-danger small">
                      {getFieldError("cost_of_credit")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            )}
            {(formData.type === "CREDIT_CARD" ||
              formData.type === "STORE_CARD" ||
              formData.type === "LOAN" ||
              formData.type === "HP" ||
              formData.type === "OVERDRAFT" ||
              formData.type === "STUDENT_LOAN" ||
              formData.type === "LEASE" ||
              formData.type === "UNSECURED" ||
              formData.type === "MORTGAGE_RENT" ||
              formData.type === "SECURED" ||
              formData.type === "PCP" ||
              formData.type === "MAIL_ORDER" ||
              formData.type === "BNPL" ||
              formData.type === "DMP") && (
              <>
                <Col md={6}>
                  <FormGroup>
                    <Label>Paid on Completion</Label>
                    <Input
                      type="select"
                      name="paid_on_completion"
                      value={formData.paid_on_completion}
                      onChange={handleInputChange}
                    >
                      <option value="">Select...</option>
                      <option value="YES">Yes</option>
                      <option value="NO">No</option>
                    </Input>
                    {getFieldError("paid_on_completion") && (
                      <div className="text-danger small">
                        {getFieldError("paid_on_completion")}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                {formData.paid_on_completion === "YES" && (
                  <Col md={6}>
                    <FormGroup>
                      <Label>Source</Label>
                      <Input
                        type="text"
                        name="source"
                        value={formData.source}
                        onChange={handleInputChange}
                      />
                      {getFieldError("source") && (
                        <div className="text-danger small">
                          {getFieldError("source")}
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                )}
              </>
            )}
            <Col>
              <FormGroup>
                <Label>Note</Label>
                <Input
                  type="textarea"
                  name="has_the_unsecured_credit_mounted_up"
                  value={formData.has_the_unsecured_credit_mounted_up}
                  onChange={handleInputChange}
                />
                {getFieldError("has_the_unsecured_credit_mounted_up") && (
                  <div className="text-danger small">
                    {getFieldError("has_the_unsecured_credit_mounted_up")}
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" type="submit">
            Save Commitment
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddCreditCommitmentModal;
