import { useDeleteNetworkMutation } from "@/Redux/Reducers/Admin/Networks/NetworksApi";
import { DeleteNetworkModalProps } from "@/Types/Admin/Networks/NetworkType";
import React from "react";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const DeleteNetworkModal: React.FC<DeleteNetworkModalProps> = ({
  isOpen,
  toggle,
  network_slug,
}) => {
  const [deleteNetwork, { isLoading }] = useDeleteNetworkMutation();

  const handleDelete = async () => {
    if (!network_slug) return;
    try {
      const response = await deleteNetwork({ network_slug });
      if ("data" in response) {
        toast.success("Network deleted successfully.");
        toggle();
      } else if ("error" in response) {
        const errorMessage =
          (response.error as any)?.data?.message || "Invalid Request...";
        toast.error(errorMessage);
      } else {
        toast.error("Failed to delete the network. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to delete the network. Please try again.");
    }
  };
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <h3 className="text-danger">Delete Network</h3>
      </ModalHeader>
      <ModalBody>
        Are you sure you want to delete the network{" "}
        <strong className="text-danger">{network_slug}</strong>? This action
        cannot be undone.
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

export default DeleteNetworkModal;
