import { useAddBankruptsMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/AdverseDetails/AdverseDetailsApi";
import { AddNewBankruptciesModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/AdverseTypes";
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

const AddNewBankruptciesModal: React.FC<AddNewBankruptciesModalProps> = ({
  isOpen,
  toggle,
  adverseAlias,
}) => {
  const params = useParams();
  const { casealias } = params;
  const [addBankruptcies, { isLoading }] = useAddBankruptsMutation();

  const [date_discharged, setDateDischarged] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = {
      date_discharged: date_discharged || null,
    };

    const res = await addBankruptcies({
      case_alias: casealias,
      adverse_alias: adverseAlias,
      value,
    });

    if (res.data) {
      toast.success("Bankruptcy Added Successfully");
      toggle();
    } else if (res.error) {
      const errorMessage =
        (res.error as any)?.data?.detail || "Failed to add bankruptcy";
      toast.error(errorMessage);
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="md">
      <ModalHeader toggle={toggle}>
        <h2>Add New Bankruptcies</h2>
      </ModalHeader>

      <Form onSubmit={handleSubmit}>
        <ModalBody className="p-5">
          <Row className="justify-content-center">
            <Col sm={12}>
              <FormGroup>
                <Label for="date_discharged">Date Discharged*</Label>
                <Input
                  id="date_discharged"
                  name="date_discharged"
                  type="date"
                  value={date_discharged}
                  onChange={(e) => setDateDischarged(e.target.value)}
                  className="form-control w-100"
                  required
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

export default AddNewBankruptciesModal;
