import { useDeleteClientDetailsMutation } from "@/Redux/Reducers/CommonComponents/CommonUsers/ClientDetailsApi";
import { DeleteClientModalProps } from "@/Types/CommonComponents/Directors/ClientTypes";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const DeleteClientModal: React.FC<DeleteClientModalProps> = ({
  isOpen,
  toggle,
  clientName,
  clientAlias,
}) => {
  const [deleteClientDetails, { isLoading }] = useDeleteClientDetailsMutation();

  const handleDelete = async () => {
    if (!clientAlias) return;
    try {
      const response = await deleteClientDetails({ clientAlias });
      if ("data" in response) {
        toast.success("Client deleted successfully.");
        toggle();
      } else if ("error" in response) {
        const errorMessage =
          (response.error as any)?.data?.message || "Invalid Request...";
        toast.error(errorMessage);
      } else {
        toast.error("Failed to delete the client. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Failed to delete the client. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <h3 className="text-danger">Delete Client</h3>
      </ModalHeader>
      <ModalBody>
        Are you sure you want to delete the client{" "}
        <strong className="text-danger">{clientName}</strong>? This action
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

export default DeleteClientModal;
