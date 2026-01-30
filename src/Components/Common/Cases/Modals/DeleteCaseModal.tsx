import { useDeleteCaseMutation } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { DeleteCaseModalProps } from "@/Types/Common/Cases/CaseTypes";
import React from "react";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const DeleteCaseModal: React.FC<DeleteCaseModalProps> = ({
  isOpen,
  toggle,
  caseData,
  onDelete,
}) => {
  const [deleteCaseDetails, { isLoading: isDeleting }] =
    useDeleteCaseMutation();

  const handleCaseDeletion = async (caseAlias: string) => {
    try {
      await deleteCaseDetails({ caseAlias }).unwrap();
      toast.success("Case deleted successfully.");
      onDelete();
    } catch (error) {
      console.error("Error deleting case:", error);
      toast.error("Failed to delete case. Please try again.");
    }
  };
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle} className="text-danger">
        Confirm Case Deletion
      </ModalHeader>
      <ModalBody>
        {caseData ? (
          <p>
            Are you sure you want to delete the case number{" "}
            <strong className="text-danger">{caseData.name}</strong>? This
            action cannot be undone.
          </p>
        ) : (
          <p>No case selected for deletion.</p>
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          color="danger"
          onClick={() => caseData && handleCaseDeletion(caseData.alias)}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
        <Button color="secondary" onClick={toggle} disabled={isDeleting}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteCaseModal;
