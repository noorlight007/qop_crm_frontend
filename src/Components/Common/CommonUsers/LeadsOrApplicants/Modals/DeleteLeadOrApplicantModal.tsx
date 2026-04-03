import { useDeleteLeadsOrApplicantsMutation } from "@/Redux/Reducers/Common/CommonUsers/LeadsOrApplicantsApi";
import { DeleteLeadOrApplicantModalProps } from "@/Types/Common/CommonUsers/LeadsOrApplicantsTypes";
import React from "react";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const DeleteLeadOrApplicantModal: React.FC<DeleteLeadOrApplicantModalProps> = ({
  isOpen,
  toggle,
  selectedLeadOrApplicant,
}) => {
  const [deleteLeadOrApplicant, { isLoading }] =
    useDeleteLeadsOrApplicantsMutation();

  const handleDelete = async () => {
    if (!selectedLeadOrApplicant?.alias) return;
    try {
      const response = await deleteLeadOrApplicant({
        customerAlias: selectedLeadOrApplicant.alias,
      });

      if ("data" in response) {
        toast.success("Lead deleted successfully.");
        toggle();
      } else if ("error" in response) {
        const errorMessage =
          (response.error as any)?.data?.message || "Invalid Request...";
        toast.error(errorMessage);
      } else {
        toast.error("Failed to delete the lead. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to delete the lead. Please try again.");
    }
  };
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <h3 className="text-danger">Delete User</h3>
      </ModalHeader>
      <ModalBody>
        Are you sure you want to delete the user{" "}
        <strong className="text-danger">{selectedLeadOrApplicant?.name}</strong>
        ? This action cannot be undone.
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={handleDelete}>
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
        <Button color="info" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteLeadOrApplicantModal;
