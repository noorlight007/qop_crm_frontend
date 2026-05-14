import { useDeleteNetworkApplicantMutation } from "@/Redux/Reducers/SuperAdmin/Networks/NetworkApplicantsApi";
import { DeleteNetworkApplicantModalProps } from "@/Types/SuperAdmin/Networks/NetworkApplicantTypes";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const DeleteNetworkApplicantModal: React.FC<
  DeleteNetworkApplicantModalProps
> = ({ isOpen, toggle, applicantToDelete, role }) => {
  const { networkslug } = useParams();

  const [deleteNetworkApplicant, { isLoading: isDeleting }] =
    useDeleteNetworkApplicantMutation();

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

    return "Failed to delete lead. Please try again.";
  };

  const handleDeleteApplicant = async () => {
    if (!networkslug || !applicantToDelete?.alias) {
      toast.error("Missing applicant information.");
      return;
    }

    try {
      await deleteNetworkApplicant({
        network_slug: networkslug,
        user_alias: applicantToDelete.alias,
      }).unwrap();
      toast.success(
        `${applicantToDelete.name || "Applicant"} deleted successfully.`,
      );
      toggle();
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        Delete {role === "APPLICANT" ? "Applicant" : "Lead"}
      </ModalHeader>
      <ModalBody>
        Are you sure you want to delete the{" "}
        {role === "APPLICANT" ? "applicant" : "lead"} "
        {applicantToDelete?.name || ""}"?
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button
          color="danger"
          onClick={handleDeleteApplicant}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteNetworkApplicantModal;
