import { useAddIVAsMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/AdverseDetails/AdverseDetailsApi";
import { AddNewIVAsModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/AdverseTypes";
import getCurrencySign from "@/utils/currency";
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
  InputGroup,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

const AddNewIVAsModal: React.FC<AddNewIVAsModalProps> = ({
  isOpen,
  toggle,
  adverseAlias,
}) => {
  const params = useParams();
  const { casealias } = params;
  const [addIVAs, { isLoading }] = useAddIVAsMutation();

  const [date_registered, setDateRegistered] = useState<string>("");
  const [outstanding_balance, setOutstandingBalance] = useState<string>("");
  const [satisfied, setSatisfied] = useState<boolean>(false);
  const [date_satisfied, setDateSatisfied] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = {
      date_registered: date_registered || null,
      outstanding_balance: outstanding_balance || null,
      satisfied,
      date_satisfied: date_satisfied || null,
    };

    const res = await addIVAs({
      case_alias: casealias,
      adverse_alias: adverseAlias,
      value,
    });
    console.log({ res });

    if (res.data) {
      toast.success("IVA Added Successfully");
      toggle();
    } else if (res.error) {
      const errorMessage =
        (res.error as any)?.data?.detail || "Failed to add new IVA";
      toast.error(errorMessage);
    } else {
      toast.error("Failed to add IVA");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="md">
      <ModalHeader toggle={toggle}>
        <h2>Add New IVAs</h2>
      </ModalHeader>

      <Form onSubmit={handleSubmit}>
        <ModalBody className="p-5">
          <Row>
            <Col sm={12} className="mb-3">
              <FormGroup>
                <Label for="date_registered">Date Registered*</Label>
                <Input
                  id="date_registered"
                  name="date_registered"
                  type="date"
                  value={date_registered}
                  onChange={(e) => setDateRegistered(e.target.value)}
                  className="form-control w-100"
                  required
                />
              </FormGroup>
            </Col>

            <Col sm={12} className="mb-3">
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
                    inputMode="decimal"
                    onInput={limitDecimalPlaces}
                    value={outstanding_balance}
                    onChange={(e) => setOutstandingBalance(e.target.value)}
                    className="form-control"
                  />
                </InputGroup>
              </FormGroup>
            </Col>

            <Col xs={12} className="mb-3">
              <FormGroup check>
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
              <Col xs={12}>
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

export default AddNewIVAsModal;
