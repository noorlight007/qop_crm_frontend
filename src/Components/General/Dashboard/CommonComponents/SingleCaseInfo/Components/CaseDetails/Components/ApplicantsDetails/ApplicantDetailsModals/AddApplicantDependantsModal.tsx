import { useAddDependantsMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/ApplicantsDetails/ApplicantsDetailsApi";
import { AddDependantFormModalProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/ApplicantsDetailsTypes";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";

const AddDependantFormModal: React.FC<AddDependantFormModalProps> = ({
  isOpen,
  toggle,
  case_alias,
  applicantDetails_alias,
}) => {
  const [addDependants, { isLoading: isDependantsLoading }] =
    useAddDependantsMutation();
  const [formData, setFormData] = useState({
    name: "",
    date_of_birth: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await addDependants({
      case_alias,
      applicantDetails_alias,
      dependantsInfo: formData,
    });
    if (response.data) {
      toast.success("Dependant added successfully");
      toggle();
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        <p className=" fs-3 text-primary fw-bold">Add Dependants</p>
      </ModalHeader>
      <ModalBody>
        <Container className="m-2 p-4 border rounded shadow-sm">
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name" className="small">
                Name
              </Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
              />
            </FormGroup>

            <FormGroup>
              <Label for="date_of_birth" className="small">
                Date of Birth
              </Label>
              <Input
                type="date"
                name="date_of_birth"
                id="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </FormGroup>

            <Row className="justify-content-end">
              <Col xs="auto">
                <Button color="primary" type="submit">
                  {isDependantsLoading ? "Loading..." : "Submit"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </ModalBody>
    </Modal>
  );
};

export default AddDependantFormModal;
