"use client";
import { useDeleteNetworkCaseMutation } from "@/Redux/Reducers/SuperAdmin/Networks/NetworkCasesApi";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

interface DeleteNetworkCaseModalProps {
  isOpen: boolean;
  toggle: () => void;
  caseToDelete: {
    alias: string;
    name: string;
  } | null;
}
const DeleteNetworkCaseModal: React.FC<DeleteNetworkCaseModalProps> = ({
  isOpen,
  toggle,
  caseToDelete,
}) => {
  const { networkslug } = useParams();

  const [deleteNetworkCase, { isLoading: isDeletingCase }] =
    useDeleteNetworkCaseMutation();

  const getErrorMessage = (error: any) => {
    const data = error?.data || error?.error?.data || error;

    if (typeof data?.detail === "string") return data.detail;
    if (typeof data?.message === "string") return data.message;

    if (data && typeof data === "object") {
      const firstField = Object.values(data)[0];
      if (Array.isArray(firstField) && firstField.length > 0) {
        return String(firstField[0]);
      }
      if (typeof firstField === "string") {
        return firstField;
      }
    }

    return "Failed to delete case. Please try again.";
  };

  const handleDeleteCase = async () => {
    if (!networkslug || !caseToDelete?.alias) {
      toast.error("Missing case information.");
      return;
    }

    try {
      await deleteNetworkCase({
        network_slug: networkslug,
        case_alias: caseToDelete.alias,
      }).unwrap();
      toast.success("Case deleted successfully.");
      toggle();
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Delete Case</ModalHeader>
      <ModalBody>
        Are you sure you want to delete the case "{caseToDelete?.name || ""}"?
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button color="danger" onClick={handleDeleteCase}>
          {isDeletingCase ? "Deleting..." : "Delete"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteNetworkCaseModal;
