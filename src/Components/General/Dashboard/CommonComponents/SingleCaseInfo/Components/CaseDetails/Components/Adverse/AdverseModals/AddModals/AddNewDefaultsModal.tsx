import { useAddDefaultsMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/AdverseDetails/AdverseDetailsApi";
import { AddNewDefaultsModalProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/AdverseTypes";
import { limitDecimalPlaces } from "@/utils/inputHandlers";
import { useParams } from "next/navigation";
import React, { useState } from "react";
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

const AddNewDefaultsModal: React.FC<AddNewDefaultsModalProps> = ({
  isOpen,
  toggle,
  adverseAlias,
}) => {
  const params = useParams();
  const { casealias } = params;
  const [addDefaults, { isLoading }] = useAddDefaultsMutation();

  const [amount, setAmount] = useState<string>("");
  const [loan_company_name, setLoanCompanyName] = useState<string>("");
  const [date_registered, setDateRegistered] = useState<string>("");
  const [has_satisfied, setHasSatisfied] = useState<boolean | null>(null);
  const [date_satisfied, setDateSatisfied] = useState<string>("");

  const handleRadioChange = (value: boolean) => {
    setHasSatisfied(value);
    if (!value) {
      setDateSatisfied("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = {
      amount: amount || "0.00",
      loan_company_name,
      date_registered: date_registered || null,
      has_satisfied: has_satisfied || false,
      date_satisfied: date_satisfied || null,
    };

    const res = await addDefaults({
      case_alias: casealias,
      adverse_alias: adverseAlias,
      value,
    });

    if (res.data) {
      toast.success("Default Added Successfully");
      toggle();
    } else if (res.error) {
      const errorMessage =
        (res.error as any)?.data?.detail || "Failed to add new default";
      toast.error(errorMessage);
    } else {
      toast.error("Failed to add new default");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <ModalHeader toggle={toggle}>
        <h2>Add New Defaults</h2>
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody className="p-5">
          <Row>
            <Col sm={6}>
              <FormGroup>
                <Label for="amount">Amount*</Label>
                <div className="input-group">
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    inputMode="decimal"
                    onInput={limitDecimalPlaces}
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="form-control"
                    placeholder="Enter amount"
                    required
                  />
                </div>
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
                <Label for="has_satisfied">
                  Has the Default been satisfied?*
                </Label>
                <div className="d-flex align-items-center">
                  <div>
                    <Input
                      id="has_satisfied_yes"
                      name="has_satisfied"
                      type="radio"
                      onChange={() => handleRadioChange(true)}
                      checked={has_satisfied === true}
                      className="me-2"
                      required
                    />
                    Yes
                  </div>
                  <div className="ms-3">
                    <Input
                      id="has_satisfied_no"
                      name="has_satisfied"
                      type="radio"
                      onChange={() => handleRadioChange(false)}
                      checked={has_satisfied === false}
                      className="me-2"
                      required
                    />
                    No
                  </div>
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

export default AddNewDefaultsModal;
