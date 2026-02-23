import { useDeleteAuthUserMutation } from "@/Redux/Reducers/Admin/CommonUsers/AuthUsersApi";
import { DeleteAuthUserModalProps } from "@/Types/Admin/Common/AuthUsers/AuthUserType";

import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const DeleteAuthUserModal: React.FC<DeleteAuthUserModalProps> = ({
  isOpen,
  toggle,
  selectedAuthUser,
}) => {
  const [deleteUser, { isLoading: isDeletingUser }] =
    useDeleteAuthUserMutation();

  const handleDelete = async () => {
    try {
      const user_alias = selectedAuthUser.alias;
      const response = await deleteUser({ user_alias });
      toggle();
      if (response.data === null) {
        toast.success("User deleted successfully!");
      } else {
        toast.error("Failed to delete user.");
      }
    } catch (error) {
      console.error("Failed to delete network", error);
      toast.error("Failed to delete network. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <h3 className="text-danger">Confirm Deletion</h3>
      </ModalHeader>
      <ModalBody>
        <p>
          Are you sure you want to delete user:{" "}
          <strong className="text-danger">{selectedAuthUser?.name}</strong>?
        </p>

        <div className="border border-danger rounded p-3 bg-light text-center">
          <p className="mb-2 fw-semibold text-danger">
            This action is irreversible.
          </p>
          <small className="text-muted">
            Deleting this network will permanently remove all associated data
            and all historical records. This data cannot be restored.
          </small>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle} disabled={isDeletingUser}>
          Cancel
        </Button>
        <Button color="danger" onClick={handleDelete} disabled={isDeletingUser}>
          {isDeletingUser ? "Deleting..." : "Delete"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteAuthUserModal;
