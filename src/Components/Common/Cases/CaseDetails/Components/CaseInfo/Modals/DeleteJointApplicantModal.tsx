import { useDeleteJointApplicantInfoMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/JointApplicant/JointApplicantApi";
import { DeleteJointApplicantModalProps } from "@/Types/Common/Cases/CaseDetails/JointApplicant/JointApplicantTypes";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const DeleteJointApplicantModal: React.FC<DeleteJointApplicantModalProps> = ({
  isOpen,
  toggle,
  selectedApplicant,
  onDelete,
}) => {
  const params = useParams();
  const { casealias } = params;
  const [deleteJointApplicantInfo, { isLoading: isDeletingJointApplicant }] =
    useDeleteJointApplicantInfoMutation(undefined);

  const handleDelete = async () => {
    if (!selectedApplicant?.alias) {
      toast.error("Invalid applicant");
      return;
    }

    try {
      const res = await deleteJointApplicantInfo({
        case_alias: casealias,
        userAlias: selectedApplicant?.alias,
      });
      if (res.data || !("error" in res)) {
        toast.success("Joint applicant deleted successfully!");
        toggle();
        if (onDelete) {
          onDelete();
        }
      } else if ("error" in res) {
        const errorMessage =
          (res.error as any)?.data?.detail ||
          "Failed to delete joint applicant.";
        toast.error(errorMessage);
        return;
      }
    } catch (error) {
      console.error("Error deleting joint applicant:", error);
      toast.error("Failed to delete joint applicant. Please try again.");
      return;
    }
  };

  if (!selectedApplicant) return null;

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        <h5 className="text-danger">Delete Joint Applicant</h5>
      </ModalHeader>
      <ModalBody>
        <p>
          Are you sure you want to delete{" "}
          <strong className="text-danger">
            {selectedApplicant.customer?.name ||
              selectedApplicant.customer?.email}
          </strong>
          ? This action cannot be undone.
        </p>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button
          color="danger"
          onClick={handleDelete}
          disabled={isDeletingJointApplicant}
        >
          {isDeletingJointApplicant ? "Deleting..." : "Delete"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteJointApplicantModal;
