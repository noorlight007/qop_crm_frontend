import { useDeleteJointUserInfoMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/JointUser/JointUserDetailsApi";
import { JointUserDeleteModalProps } from "@/Types/CommonComponents/SingleCaseInfo/JointUser/JointUserTypes";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const JointUserDeleteModal: React.FC<JointUserDeleteModalProps> = ({
  isOpen,
  toggle,
  selectedUser,
}) => {
  const params = useParams();
  const { casealias } = params;
  const [deleteJointUserInfo, { isLoading: isDeleting }] =
    useDeleteJointUserInfoMutation();

  const deleteUser = async () => {
    const res = await deleteJointUserInfo({
      case_alias: casealias,
      userAlias: selectedUser.alias,
    });
    if (res.data === null) {
      toast.success("User deleted successfully!");
      toggle();
    } else {
      console.error("Error deleting joint user:", res.error);
      toast.error("Failed to delete the user. Please try again.");
    }
  };
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Delete Joint User</ModalHeader>
      <ModalBody>
        Are you sure you want to delete the file{" "}
        <strong>
          {selectedUser?.joint_user_details?.first_name}{" "}
          {selectedUser?.joint_user_details?.last_name}
        </strong>
        ?
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={deleteUser} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
        <Button color="secondary" onClick={toggle} disabled={isDeleting}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default JointUserDeleteModal;
