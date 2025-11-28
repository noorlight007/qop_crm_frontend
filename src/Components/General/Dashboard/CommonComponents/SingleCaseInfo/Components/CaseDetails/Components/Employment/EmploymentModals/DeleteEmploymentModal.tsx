import { useDeleteEmploymentDetailsMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/EmploymentDetails/EmploymentDetailsApi";
import React from "react";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

type Props = {
  isOpen: boolean;
  toggle: () => void;
  caseAlias?: string;
  employmentAlias?: string;
  onSuccess?: () => void;
};

const DeleteEmploymentModal: React.FC<Props> = ({
  isOpen,
  toggle,
  caseAlias,
  employmentAlias,
  onSuccess,
}) => {
  const [deleteEmployment, { isLoading }] =
    useDeleteEmploymentDetailsMutation();

  const handleConfirm = async () => {
    if (!employmentAlias) return;
    try {
      await deleteEmployment({
        case_alias: caseAlias,
        employmentDetails_alias: employmentAlias,
      }).unwrap?.();
      toast.success("Deleted successfully.");
      toggle();
      onSuccess?.();
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete employment record.");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        <h3 className="text-danger">Confirm Delete</h3>
      </ModalHeader>
      <ModalBody>
        Are you sure you want to delete this employment record?
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle} disabled={isLoading}>
          Cancel
        </Button>
        <Button color="danger" onClick={handleConfirm} disabled={isLoading}>
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteEmploymentModal;
