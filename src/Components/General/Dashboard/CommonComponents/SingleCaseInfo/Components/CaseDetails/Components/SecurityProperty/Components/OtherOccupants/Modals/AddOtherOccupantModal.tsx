import { useAddOtherOccupantMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/SecurityProperty/OtherOccupantsApi";
import { OtherOccupantModalProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/OtherOccupantsTypes";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";

const AddOtherOccupantModal: React.FC<OtherOccupantModalProps> = ({
  isOpen,
  toggle,
}) => {
  const { casealias } = useParams();
  const [addOtherOccupant, { isLoading }] = useAddOtherOccupantMutation();

  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    relationship: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !formData.full_name ||
      !formData.date_of_birth ||
      !formData.relationship
    )
      return;

    try {
      await addOtherOccupant({
        case_alias: casealias,
        newOccupant: formData,
      }).unwrap();
      toast.success("Other occupant added successfully");
      // reset and close on success
      setFormData({ full_name: "", date_of_birth: "", relationship: "" });
      toggle();
    } catch (err) {
      console.error("Failed to add other occupant", err);
      toast.error("Failed to add other occupant");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        <h3 className="text-primary">Add Other Occupant</h3>
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <FormGroup>
            <Label for="full_name">Full Name*</Label>
            <Input
              type="text"
              id="full_name"
              name="full_name"
              required
              placeholder="Enter full name"
              value={formData.full_name}
              onChange={(e) =>
                setFormData((p) => ({ ...p, full_name: e.target.value }))
              }
            />
          </FormGroup>
          <FormGroup>
            <Label for="date_of_birth">Date of Birth*</Label>
            <Input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              required
              value={formData.date_of_birth}
              onChange={(e) =>
                setFormData((p) => ({ ...p, date_of_birth: e.target.value }))
              }
            />
          </FormGroup>
          <FormGroup>
            <Label for="relationship">Relationship*</Label>
            <Input
              type="select"
              id="relationship"
              name="relationship"
              required
              value={formData.relationship}
              onChange={(e) =>
                setFormData((p) => ({ ...p, relationship: e.target.value }))
              }
            >
              <option value="">Select Relationship</option>
              <option value="PARTNER">Partner</option>
              <option value="SPOUSE">Friend</option>
              <option value="SIBLING">Sibling</option>
              <option value="PARENT">Parent</option>
              <option value="CARER">Carer</option>
              <option value="FAMILY">Family</option>
              <option value="OTHER_FAMILY">Other Family</option>
              <option value="OTHER">Other</option>
              <option value="CHILD">Child</option>
              <option value="CIVIL_PARTNER">Civil Partner</option>
              <option value="SON">Son</option>
              <option value="DAUGHTER">Daughter</option>
              <option value="GRANDPARENT">Grandparent</option>
              <option value="BROTHER">Brother</option>
              <option value="SISTER">Sister</option>
              <option value="UNCLE_AUNT">Uncle/Aunt</option>
              <option value="FOSTER_ADOPTIVE_PARENTS">
                Foster/Adoptive Parents
              </option>
              <option value="LEGAL_GUARDIAN">Legal Guardian</option>
            </Input>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Other Occupant"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddOtherOccupantModal;
