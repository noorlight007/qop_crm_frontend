import { useDeleteAdviserDetailsMutation } from "@/Redux/Reducers/CommonComponents/Directors/AdviserDetailsApi";
import { DeleteAdviserModalProps } from "@/Types/CommonComponents/Directors/AdviserTypes";
import React from "react";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const DeleteAdviserModal: React.FC<DeleteAdviserModalProps> = ({
  isOpen,
  toggle,
  adviserName,
  adviserAlias,
}) => {
  const [deleteAdviserDetails, { isLoading }] =
    useDeleteAdviserDetailsMutation();
  const handleDelete = async () => {
    if (!adviserAlias) return;
    try {
      const response = await deleteAdviserDetails({ adviserAlias });
      if ("data" in response) {
        toast.success("Adviser deleted successfully.");
        toggle();
      } else if ("error" in response) {
        const errorMessage =
          (response.error as any)?.data?.message || "Invalid Request...";
        toast.error(errorMessage);
      } else toast.error("Failed to delete adviser.");
    } catch (error) {
      toast.error("Failed to delete adviser.");
    }
  };
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <h3 className="text-danger">Delete Adviser</h3>
      </ModalHeader>
      <ModalBody>
        Are you sure you want to delete the adviser{" "}
        <strong className="text-danger">{adviserName}</strong>? This action
        cannot be undone.
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={handleDelete} disabled={isLoading}>
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteAdviserModal;
