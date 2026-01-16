import { useDeleteJointApplicantInfoMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/JointApplicant/JointApplicantApi";
import { DeleteJointApplicantModalProps } from "@/Types/CommonComponents/SingleCaseInfo/JointApplicant/JointApplicantTypes";

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
    if (!selectedApplicant?.id) {
      toast.error("Invalid applicant ID");
      return;
    }

    const res = await deleteJointApplicantInfo({
      case_alias: casealias,
      joint_applicant_id: selectedApplicant.id,
    });

    if (res.data) {
      toast.success("Joint applicant deleted successfully!");
      toggle();
      if (onDelete) {
        onDelete();
      }
    } else if ("error" in res) {
      const errorMessage =
        (res.error as any)?.data?.detail || "Failed to delete joint applicant.";
      toast.error(errorMessage);
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
          <strong>
            {selectedApplicant.joint_user_details?.first_name}{" "}
            {selectedApplicant.joint_user_details?.last_name}
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
