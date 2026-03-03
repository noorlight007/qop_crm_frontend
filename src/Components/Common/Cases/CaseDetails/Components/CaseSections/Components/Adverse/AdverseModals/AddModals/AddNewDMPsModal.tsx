import { useAddDMPsMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/AdverseDetails/AdverseDetailsApi";
import { AddNewDMPsModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/AdverseTypes";
import getCurrencySign from "@/utils/currency";
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

const AddNewDMPsModal: React.FC<AddNewDMPsModalProps> = ({
  isOpen,
  toggle,
  adverseAlias,
}) => {
  const params = useParams();
  const { casealias } = params;
  const [addDMPs, { isLoading }] = useAddDMPsMutation();

  const [plan, setPlan] = useState<"DIRECT" | "THIRD_PARTY">("DIRECT");
  const [loan_company_name, setLoanCompanyName] = useState<string>("");
  const [date_registered, setDateRegistered] = useState<string>("");
  const [outstanding_balance, setOutstandingBalance] = useState<string>("");
  const [satisfied, setSatisfied] = useState<boolean>(false);
  const [date_satisfied, setDateSatisfied] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = {
      plan,
      loan_company_name,
      date_registered: date_registered || null,
      outstanding_balance: outstanding_balance || null,
      satisfied,
      date_satisfied: date_satisfied || null,
    };

    const res = await addDMPs({
      case_alias: casealias,
      adverse_alias: adverseAlias,
      value,
    });

    if (res.data) {
      toast.success("DMP Added Successfully");
      toggle();
    } else if (res.error) {
      const errorMessage =
        (res.error as any)?.data?.detail || "Failed to add new DMP";
      toast.error(errorMessage);
    } else {
      toast.error("Failed to add DMP");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <ModalHeader toggle={toggle}>
        <h2>Add New DMPs</h2>
      </ModalHeader>

      <Form onSubmit={handleSubmit}>
        <ModalBody className="p-5">
          <Row>
            <Col sm={12} className="mb-3">
              <FormGroup>
                <Label>Direct or Via a 3rd Party?</Label>
                <div>
                  <FormGroup check inline>
                    <Input
                      type="radio"
                      name="plan"
                      value="DIRECT"
                      checked={plan === "DIRECT"}
                      onChange={(e) => setPlan(e.target.value as "DIRECT")}
                    />
                    <Label check>Directly</Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Input
                      type="radio"
                      name="plan"
                      value="THIRD_PARTY"
                      checked={plan === "THIRD_PARTY"}
                      onChange={(e) => setPlan(e.target.value as "THIRD_PARTY")}
                    />
                    <Label check>3rd Party</Label>
                  </FormGroup>
                </div>
              </FormGroup>
            </Col>

            <Col sm={6} className="mb-3">
              <FormGroup>
                <Label for="date_registered">Date Registered</Label>
                <Input
                  id="date_registered"
                  name="date_registered"
                  type="date"
                  value={date_registered}
                  onChange={(e) => setDateRegistered(e.target.value)}
                  className="form-control w-100"
                />
              </FormGroup>
            </Col>

            <Col sm={6} className="mb-3">
              <FormGroup>
                <Label for="loan_company_name">Loan Company Name<span className="text-danger">*</span></Label>
                <Input
                  id="loan_company_name"
                  name="loan_company_name"
                  type="text"
                  value={loan_company_name}
                  onChange={(e) => setLoanCompanyName(e.target.value)}
                  className="form-control w-100"
                  required
                />
              </FormGroup>
            </Col>

            <Col sm={6} className="mb-3">
              <FormGroup>
                <Label for="outstanding_balance">Outstanding Balance</Label>
                <InputGroup>
                  <InputGroupText>{getCurrencySign()}</InputGroupText>
                  <Input
                    id="outstanding_balance"
                    name="outstanding_balance"
                    type="number"
                    min="0"
                    step="0.01"
                    value={outstanding_balance}
                    onChange={(e) => setOutstandingBalance(e.target.value)}
                    className="form-control"
                  />
                </InputGroup>
              </FormGroup>
            </Col>

            <Col sm={6} className="mb-3">
              <FormGroup check className="mt-4">
                <Label check>
                  <Input
                    type="checkbox"
                    checked={satisfied}
                    onChange={(e) => setSatisfied(e.target.checked)}
                  />{" "}
                  Satisfied?
                </Label>
              </FormGroup>
            </Col>

            {satisfied && (
              <Col sm={6}>
                <FormGroup>
                  <Label for="date_satisfied">Date Satisfied</Label>
                  <Input
                    id="date_satisfied"
                    name="date_satisfied"
                    type="date"
                    value={date_satisfied}
                    onChange={(e) => setDateSatisfied(e.target.value)}
                    className="form-control w-100"
                  />
                </FormGroup>
              </Col>
            )}
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

export default AddNewDMPsModal;
