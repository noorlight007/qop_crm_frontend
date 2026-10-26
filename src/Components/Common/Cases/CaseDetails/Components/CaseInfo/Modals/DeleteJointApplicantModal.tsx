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
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <h3 className="text-danger">Delete Joint Applicant</h3>
      </ModalHeader>
      <ModalBody>
        <p>
          Are you sure you want to delete{" "}
          <strong className="text-danger">
            {selectedApplicant.customer?.name ||
              selectedApplicant.customer?.email}
          </strong>
          ?
        </p>

        <div className="border border-danger rounded p-3 bg-light">
          <p className="mb-2 fw-semibold text-danger">
            This action is irreversible.
          </p>
          <small className="text-muted">
            Deleting this joint applicant will permanently remove them from
            this case along with their personal, employment, and financial
            details. This data cannot be restored.
          </small>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="danger"
          onClick={handleDelete}
          disabled={isDeletingJointApplicant}
        >
          {isDeletingJointApplicant ? "Deleting..." : "Delete"}
        </Button>
        <Button color="info" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteJointApplicantModal;
