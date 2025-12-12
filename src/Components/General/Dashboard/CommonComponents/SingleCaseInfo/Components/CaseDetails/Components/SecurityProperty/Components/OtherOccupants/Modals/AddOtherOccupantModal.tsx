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

  const [formData, setFormData] = useState<{
    full_name: string;
    date_of_birth: string | null;
    relationship: string;
  }>({
    full_name: "",
    date_of_birth: null,
    relationship: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.full_name || !formData.date_of_birth) return;

    try {
      await addOtherOccupant({
        case_alias: casealias,
        newOccupant: formData,
      }).unwrap();
      toast.success("Other occupant added successfully");
      // reset and close on success
      setFormData({ full_name: "", date_of_birth: null, relationship: "" });
      toggle();
    } catch (err: any) {
      console.error("Failed to add other occupant", err);
      // Log full error for debugging (safe stringify)
      try {
        console.error(
          "Full error (stringified):",
          JSON.stringify(err, Object.getOwnPropertyNames(err), 2)
        );
      } catch (loggingErr) {
        console.error("Error while logging error", loggingErr);
      }

      // Normalize various possible error shapes into a user-friendly string
      const extractErrorMessage = (e: any): string => {
        if (!e) return "";
        if (typeof e === "string") return e;
        // RTK Query often puts payload on `data`
        if (e.data) {
          if (typeof e.data === "string") return e.data;
          if (e.data.message) return String(e.data.message);
          if (e.data.detail) return String(e.data.detail);
          // Validation errors can be an object of arrays/strings
          if (typeof e.data === "object") {
            const parts: string[] = [];
            Object.entries(e.data).forEach(([k, v]) => {
              if (Array.isArray(v)) parts.push(`${k}: ${v.join(", ")}`);
              else if (typeof v === "object")
                parts.push(`${k}: ${JSON.stringify(v)}`);
              else parts.push(`${k}: ${String(v)}`);
            });
            if (parts.length) return parts.join("; ");
          }
        }
        if (e.error)
          return typeof e.error === "string"
            ? e.error
            : JSON.stringify(e.error);
        if (e.message) return String(e.message);
        try {
          return JSON.stringify(e);
        } catch {
          return String(e);
        }
      };

      const serverMsg =
        extractErrorMessage(err) || "Failed to add other occupant";
      toast.error(serverMsg);
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
              placeholder="Enter date of birth"
              required
              onChange={(e) =>
                setFormData((p) => ({ ...p, date_of_birth: e.target.value }))
              }
            />
          </FormGroup>
          <FormGroup>
            <Label for="relationship">Relationship</Label>
            <Input
              type="select"
              id="relationship"
              name="relationship"
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
