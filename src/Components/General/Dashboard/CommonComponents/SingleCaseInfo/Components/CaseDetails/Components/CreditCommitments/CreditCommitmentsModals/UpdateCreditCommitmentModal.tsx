import { useUpdateCreditCommitmentsDetailsMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/CreditCommitmentsDetails/CreditCommitmentsDetailsApi";
import { useGetCaseUsersQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseUsers/CaseUsersApi";
import { UpdateCreditCommitmentModalProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/CreditCommitmentsTypes";
import { limitDecimalPlaces } from "@/utils/inputHandlers";
import { useEffect, useState } from "react";
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

const UpdateCreditCommitmentModal: React.FC<
  UpdateCreditCommitmentModalProps
> = ({ isOpen, toggle, casealias, creditData }) => {
  // rtk hooks
  const { data: caseUsers, isLoading } = useGetCaseUsersQuery({
    case_alias: casealias,
  });

  const [formData, setFormData] = useState({
    applicant: creditData?.applicant || "",
    joint: creditData?.joint || "",
    type: creditData?.type || "",
    company: creditData?.company || "",
    account_no: creditData?.account_no || "",
    os_balance: creditData?.os_balance || "",
    settlement_balance: creditData?.settlement_balance || "",
    monthly_repayment: creditData?.monthly_repayment || "",
    interest_rate: creditData?.interest_rate || "",
    card_limit: creditData?.card_limit || "",
    term_remaining: creditData?.term_remaining || "",
    balloon_payment: creditData?.balloon_payment || "",
    court_ordered: creditData?.court_ordered || "",
    cost_of_credit: creditData?.cost_of_credit || "",
    paid_on_completion: creditData?.paid_on_completion || "",
    source: creditData?.source || "",
    has_the_unsecured_credit_mounted_up:
      creditData?.has_the_unsecured_credit_mounted_up || "",
  });

  const [updateCreditCommitmentsDetails, { isLoading: isUpdating }] =
    useUpdateCreditCommitmentsDetailsMutation();

  useEffect(() => {
    if (creditData) {
      setFormData(creditData);
    }
  }, [creditData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      const res = await updateCreditCommitmentsDetails({
        case_alias: casealias,
        creditCommitment_alias: creditData.alias,
        payload: formData,
      }).unwrap();
      if (res) {
        toast.success("Credit Commitment updated successfully!");
      } else {
        toast.error("Failed to update Credit Commitment");
      }
      toggle();
    } catch (error) {
      toast.error("Failed to update Credit Commitment");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">Update Credit Commitment</span>
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Applicant*</Label>
                <Input
                  type="select"
                  name="applicant"
                  value={formData.applicant}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select...</option>
                  {isLoading ? (
                    <option>Loading...</option>
                  ) : (
                    caseUsers?.map((user: any) => (
                      <option key={user.id} value={user.id}>
                        {user.first_name} {user.last_name}
                      </option>
                    ))
                  )}
                </Input>
              </FormGroup>
            </Col>
            <Col md={6}>
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
              </FormGroup>
            </Col>
            {/* <Col md={4}>
              <FormGroup>
                <Label>Type*</Label>
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
              </FormGroup>
            </Col> */}
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
                  <Label>Company*</Label>
                  <Input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                  />
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
                    value={formData.account_no || null}
                    onChange={handleInputChange}
                  />
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
                  <Label>OS Balance* (£)</Label>
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
                  <Label>Settlement Balance (£)</Label>
                  <Input
                    type="number"
                    name="settlement_balance"
                    value={formData.settlement_balance}
                    onChange={handleInputChange}
                    step="0.01"
                    inputMode="decimal"
                    onInput={limitDecimalPlaces}
                  />
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
                  <Label>Monthly Repayment (£)</Label>
                  <Input
                    type="number"
                    name="monthly_repayment"
                    value={formData.monthly_repayment}
                    onChange={handleInputChange}
                    step="0.01"
                    inputMode="decimal"
                    onInput={limitDecimalPlaces}
                  />
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
                </FormGroup>
              </Col>
            )}
            {(formData.type === "CREDIT_CARD" ||
              formData.type === "STORE_CARD" ||
              formData.type === "MAIL_ORDER" ||
              formData.type === "BNPL") && (
              <Col md={6}>
                <FormGroup>
                  <Label>Card Limit (£)</Label>
                  <Input
                    type="number"
                    name="card_limit"
                    value={formData.card_limit}
                    onChange={handleInputChange}
                    step="0.01"
                    inputMode="decimal"
                    onInput={limitDecimalPlaces}
                  />
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
                </FormGroup>
              </Col>
            )}
            {formData.type === "PCP" && (
              <Col md={6}>
                <FormGroup>
                  <Label>Balloon Payment (£)</Label>
                  <Input
                    type="number"
                    name="balloon_payment"
                    value={formData.balloon_payment}
                    onChange={handleInputChange}
                    step="0.01"
                    inputMode="decimal"
                    onInput={limitDecimalPlaces}
                  />
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
                  <Label>Cost of Credit (£)</Label>
                  <Input
                    type="number"
                    name="cost_of_credit"
                    value={formData.cost_of_credit}
                    onChange={handleInputChange}
                    step="0.01"
                  />
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
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default UpdateCreditCommitmentModal;
