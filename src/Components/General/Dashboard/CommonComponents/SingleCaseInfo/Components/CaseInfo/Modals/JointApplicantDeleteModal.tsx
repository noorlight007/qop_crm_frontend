import { useDeleteJointApplicantInfoMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/JointApplicant/JointApplicantApi";
import { JointApplicantDeleteModalProps } from "@/Types/CommonComponents/SingleCaseInfo/JointApplicant/JointApplicantTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const JointApplicantDeleteModal: React.FC<JointApplicantDeleteModalProps> = ({
  isOpen,
  toggle,
  selectedApplicant,
}) => {
  const params = useParams();
  const { casealias } = params;
  const [deleteJointApplicantInfo, { isLoading: isDeleting }] =
    useDeleteJointApplicantInfoMutation();

  const deleteApplicant = async () => {
    const res = await deleteJointApplicantInfo({
      case_alias: casealias,
      userAlias: selectedApplicant.alias,
    });
    if (res.data === null) {
      toast.success("Applicant deleted successfully!");
      toggle();
    } else {
      console.error("Error deleting joint user:", res.error);
      toast.error("Failed to delete the user. Please try again.");
    }
  };
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Delete Joint Applicant</ModalHeader>
      <ModalBody>
        Are you sure you want to delete the file{" "}
        <strong>
          {selectedApplicant?.joint_user_details?.title
            ? formatChoiceFieldValue(
                selectedApplicant.joint_user_details.title
              ) + " "
            : " "}
          {selectedApplicant?.joint_user_details?.first_name}{" "}
          {selectedApplicant?.joint_user_details?.middle_name && (
            <>{selectedApplicant.joint_user_details.middle_name} </>
          )}
          {selectedApplicant?.joint_user_details?.last_name}
        </strong>
        ?
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={deleteApplicant} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
        <Button color="secondary" onClick={toggle} disabled={isDeleting}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default JointApplicantDeleteModal;
