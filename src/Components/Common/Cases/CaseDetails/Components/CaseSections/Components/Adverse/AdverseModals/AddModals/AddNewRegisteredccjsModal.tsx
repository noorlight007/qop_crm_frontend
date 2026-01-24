import { useAddCCJsMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/AdverseDetails/AdverseDetailsApi";
import { AddNewRegisteredCCJsModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/AdverseTypes";
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

const AddNewRegisteredCCJsModal: React.FC<AddNewRegisteredCCJsModalProps> = ({
  isOpen,
  toggle,
  adverseAlias,
}) => {
  const params = useParams();
  const { casealias } = params;
  const [addCCJs, { isLoading }] = useAddCCJsMutation();

  const [amount, setAmount] = useState<string>("");
  const [loan_company_name, setLoanCompanyName] = useState<string>("");
  const [date_registered, setDateRegistered] = useState<string>("");
  const [has_satisfied, setHasSatisfied] = useState<boolean>(false);
  const [date_satisfied, setDateSatisfied] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = {
      amount: amount || null,
      loan_company_name,
      date_registered: date_registered || null,
      has_satisfied,
      date_satisfied: date_satisfied || null,
    };

    const res = await addCCJs({
      case_alias: casealias,
      adverse_alias: adverseAlias,
      value,
    });

    if (res.data) {
      toast.success("CCJ Added Successfully");
      toggle();
    } else if (res.error) {
      const errorMessage =
        (res.error as any)?.data?.detail || "Failed to add new CCJ";
      toast.error(errorMessage);
    } else {
      toast.error("Failed to add CCJ");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <ModalHeader toggle={toggle}>
        <h2>Add New Registered CCJs</h2>
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody className="p-5">
          <Row>
            <Col sm={6}>
              <FormGroup>
                <Label for="amount">Amount*</Label>
                <InputGroup>
                  <InputGroupText>£</InputGroupText>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="form-control"
                    placeholder="Enter amount"
                    required
                  />
                </InputGroup>
              </FormGroup>
            </Col>

            <Col sm={6}>
              <FormGroup>
                <Label for="loan_company_name">Loan Company Name</Label>
                <Input
                  id="loan_company_name"
                  name="loan_company_name"
                  type="text"
                  value={loan_company_name}
                  onChange={(e) => setLoanCompanyName(e.target.value)}
                  className="form-control"
                  placeholder="Enter loan company name"
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={6}>
              <FormGroup>
                <Label for="date_registered">Date Registered</Label>
                <Input
                  id="date_registered"
                  name="date_registered"
                  type="date"
                  value={date_registered}
                  onChange={(e) => setDateRegistered(e.target.value)}
                  className="form-control"
                />
              </FormGroup>
            </Col>

            <Col sm={6}>
              <FormGroup>
                <Label for="has_satisfied">Has the CCJ been satisfied?</Label>
                <div>
                  <FormGroup check inline>
                    <Input
                      type="radio"
                      name="has_satisfied"
                      checked={has_satisfied === true}
                      onChange={() => setHasSatisfied(true)}
                    />
                    <Label check>Yes</Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Input
                      type="radio"
                      name="has_satisfied"
                      checked={has_satisfied === false}
                      onChange={() => setHasSatisfied(false)}
                    />
                    <Label check>No</Label>
                  </FormGroup>
                </div>
              </FormGroup>
            </Col>
          </Row>

          {has_satisfied && (
            <Row>
              <Col sm={6}>
                <FormGroup>
                  <Label for="date_satisfied">Date Satisfied</Label>
                  <Input
                    id="date_satisfied"
                    name="date_satisfied"
                    type="date"
                    value={date_satisfied}
                    onChange={(e) => setDateSatisfied(e.target.value)}
                    className="form-control"
                  />
                </FormGroup>
              </Col>
            </Row>
          )}
        </ModalBody>

        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddNewRegisteredCCJsModal;
