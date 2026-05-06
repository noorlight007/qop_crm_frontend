"use client";

import { useDeleteOrgUserMutation } from "@/Redux/Reducers/Common/Organisations/OrganisationDetails/OrgUserListApi";
import { DeleteOrgUserModalProps } from "@/Types/Common/Organisations/OrgUserListTypes";

import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const DeleteOrgUserModal: React.FC<DeleteOrgUserModalProps> = ({
  isOpen,
  toggle,
  organisationslug,
  selectedUser,
}) => {
  const [deleteUser, { isLoading }] = useDeleteOrgUserMutation();

  const handleDelete = async () => {
    const userAlias = selectedUser?.alias;
    if (!userAlias) {
      toast.error("User alias not found.");
      return;
    }

    try {
      await deleteUser({
        organisationslug,
        user_alias: userAlias,
      }).unwrap();

      toggle();
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Failed to delete user", error);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        <h3 className="text-danger">Confirm Deletion</h3>
      </ModalHeader>
      <ModalBody>
        <p>
          Are you sure you want to delete user:{" "}
          <strong className="text-danger">{selectedUser?.name}</strong>?
        </p>

        <div className="border border-danger rounded p-3 bg-light text-center">
          <p className="mb-2 fw-semibold text-danger">
            This action is irreversible.
          </p>
          <small className="text-muted">
            Deleting this user will permanently remove all associated data and
            historical records. This data cannot be restored.
          </small>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle} disabled={isLoading}>
          Cancel
        </Button>
        <Button color="danger" onClick={handleDelete} disabled={isLoading}>
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteOrgUserModal;
