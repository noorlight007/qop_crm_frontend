import { useAddPropertyRepossessedMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/AdverseDetails/AdverseDetailsApi";
import { AddNewPropertiesRepossessedModalProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/AdverseTypes";
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

const AddNewPropertiesRepossessedModal: React.FC<
  AddNewPropertiesRepossessedModalProps
> = ({ isOpen, toggle, adverseAlias }) => {
  const [lender, setLender] = useState<string>("");
  const [date_of_registration, setDateOfRegistration] = useState<string>("");
  const [date_of_satisfaction, setDateOfSatisfaction] = useState<string>("");
  const params = useParams();
  const { casealias } = params;

  const [addPropertyRepossessed, { isLoading }] =
    useAddPropertyRepossessedMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = {
      lender,
      date_of_registration: date_of_registration || null,
      date_of_satisfaction: date_of_satisfaction || null,
    };

    const res = await addPropertyRepossessed({
      case_alias: casealias,
      adverse_alias: adverseAlias,
      value,
    });
    if (res.data) {
      toast.success("Property Repossessed Added Successfully ");
      toggle();
    } else if (res.error) {
      const errorMessage =
        (res.error as any)?.data?.detail ||
        "Failed to add new Property Repossessed";
      toast.error(errorMessage);
    } else {
      toast.error("Failed to add Property Repossessed");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      {/* Modal Header */}
      <ModalHeader toggle={toggle}>
        <h2>Add New Properties Repossessed</h2>
      </ModalHeader>

      <Form onSubmit={handleSubmit}>
        {/* Modal Body */}
        <ModalBody className="p-5">
          <Row>
            {/* Lender Name Field */}
            <Col sm={6}>
              <FormGroup>
                <Label for="LenderName">Lender*</Label>
                <Input
                  id="LenderName"
                  name="LenderName"
                  type="text"
                  value={lender}
                  onChange={(e) => setLender(e.target.value as string)}
                  className="form-control"
                  placeholder="Enter lender name"
                  required
                />
              </FormGroup>
            </Col>

            {/* Registered Date Field */}
            <Col sm={6}>
              <FormGroup>
                <Label for="RegisteredDate">Date of Registration</Label>
                <Input
                  id="RegisteredDate"
                  name="RegisteredDate"
                  type="date"
                  value={date_of_registration}
                  onChange={(e) =>
                    setDateOfRegistration(e.target.value as string)
                  }
                  className="form-control"
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            {/* Satisfied Date Field */}
            <Col sm={6}>
              <FormGroup>
                <Label for="SatisfiedDate">Date of Satisfaction</Label>
                <Input
                  id="SatisfiedDate"
                  name="SatisfiedDate"
                  type="date"
                  value={date_of_satisfaction}
                  onChange={(e) =>
                    setDateOfSatisfaction(e.target.value as string)
                  }
                  className="form-control"
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>

        {/* Modal Footer */}
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" type="submit">
            {isLoading ? "Submitting.." : "Submit"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddNewPropertiesRepossessedModal;
