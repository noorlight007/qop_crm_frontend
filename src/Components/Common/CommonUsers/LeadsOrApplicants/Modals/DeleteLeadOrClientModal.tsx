import { useDeleteLeadsOrClientsMutation } from "@/Redux/Reducers/Common/CommonUsers/LeadsOrApplicantsApi";
import { DeleteLeadOrClientModalProps } from "@/Types/Common/CommonUsers/LeadsOrApplicantsTypes";
import React from "react";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const DeleteLeadOrClientModal: React.FC<DeleteLeadOrClientModalProps> = ({
  isOpen,
  toggle,
  selectedLeadOrClient,
}) => {
  const [deleteLeadOrClient, { isLoading }] = useDeleteLeadsOrClientsMutation();

  const handleDelete = async () => {
    if (!selectedLeadOrClient?.alias) return;
    try {
      const response = await deleteLeadOrClient({
        customerAlias: selectedLeadOrClient.alias,
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
        <h3 className="text-danger">Delete Lead</h3>
      </ModalHeader>
      <ModalBody>
        Are you sure you want to delete the lead{" "}
        <strong className="text-danger">{selectedLeadOrClient?.name}</strong>?
        This action cannot be undone.
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={handleDelete}>
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteLeadOrClientModal;
