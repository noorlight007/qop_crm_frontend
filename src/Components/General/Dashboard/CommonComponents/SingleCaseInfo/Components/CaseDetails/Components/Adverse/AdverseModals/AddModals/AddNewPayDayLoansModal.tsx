import { useAddPayDayLoansMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/AdverseDetails/AdverseDetailsApi";
import { AddNewPayDayLoansModalProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/AdverseTypes";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

const AddNewPayDayLoansModal: React.FC<AddNewPayDayLoansModalProps> = ({
  isOpen,
  toggle,
  adverseAlias,
}) => {
  const params = useParams();
  const { casealias } = params;
  const [addPayDayLoans, { isLoading }] = useAddPayDayLoansMutation();

  const [loan_amount, setLoanAmount] = useState<string>("");
  const [loan_date, setLoanDate] = useState<string>("");
  const [has_the_pay_day_loan_been_repaid, setHasPayDayLoanBeenRepaid] =
    useState<boolean>(false);
  const [date_repaid, setDateRepaid] = useState<string>("");
  const [lender_name, setLenderName] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = {
      loan_amount: loan_amount || null,
      loan_date: loan_date || null,
      has_the_pay_day_loan_been_repaid,
      date_repaid: date_repaid || null,
      lender_name,
    };

    const res = await addPayDayLoans({
      case_alias: casealias,
      adverse_alias: adverseAlias,
      value,
    });

    if (res.data) {
      toast.success("Pay Day Loan Added Successfully");
      toggle();
    } else if (res.error) {
      const errorMessage =
        (res.error as any)?.data?.detail || "Failed to add new Pay Day Loan";
      toast.error(errorMessage);
    } else {
      toast.error("Failed to add Pay Day Loan");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <ModalHeader toggle={toggle}>
        <h2>Add New Pay Day Loans</h2>
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody className="p-5">
          <Row>
            <Col sm={6}>
              <FormGroup>
                <Label for="loan_amount">Loan Amount*</Label>
                <InputGroup>
                  <InputGroupText>£</InputGroupText>
                  <Input
                    id="loan_amount"
                    name="loan_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={loan_amount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="form-control"
                    placeholder="Enter loan amount"
                    required
                  />
                </InputGroup>
              </FormGroup>
            </Col>

            <Col sm={6}>
              <FormGroup>
                <Label for="loan_date">Loan Date</Label>
                <Input
                  id="loan_date"
                  name="loan_date"
                  type="date"
                  value={loan_date}
                  onChange={(e) => setLoanDate(e.target.value)}
                  className="form-control"
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={6}>
              <FormGroup>
                <Label for="has_the_pay_day_loan_been_repaid">
                  Has the Pay Day Loan Been Repaid?
                </Label>
                <div>
                  <FormGroup check inline>
                    <Input
                      type="radio"
                      id="repaid_yes"
                      name="has_the_pay_day_loan_been_repaid"
                      checked={has_the_pay_day_loan_been_repaid === true}
                      onChange={() => setHasPayDayLoanBeenRepaid(true)}
                    />
                    <Label check>Yes</Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Input
                      type="radio"
                      id="repaid_no"
                      name="has_the_pay_day_loan_been_repaid"
                      checked={has_the_pay_day_loan_been_repaid === false}
                      onChange={() => setHasPayDayLoanBeenRepaid(false)}
                    />
                    <Label check>No</Label>
                  </FormGroup>
                </div>
              </FormGroup>
            </Col>

            {has_the_pay_day_loan_been_repaid && (
              <Col sm={6}>
                <FormGroup>
                  <Label for="date_repaid">Date Repaid</Label>
                  <Input
                    id="date_repaid"
                    name="date_repaid"
                    type="date"
                    value={date_repaid}
                    onChange={(e) => setDateRepaid(e.target.value)}
                    className="form-control"
                  />
                </FormGroup>
              </Col>
            )}
          </Row>

          <Row>
            <Col sm={6}>
              <FormGroup>
                <Label for="lender_name">Lender Name</Label>
                <Input
                  id="lender_name"
                  name="lender_name"
                  type="text"
                  value={lender_name}
                  onChange={(e) => setLenderName(e.target.value)}
                  className="form-control"
                  placeholder="Enter lender name"
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>

        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddNewPayDayLoansModal;
