import { useDeleteAuthUserMutation } from "@/Redux/Reducers/Admin/CommonUsers/AuthUsersApi";
import { DeleteLeadsOrApplicantsModalProps } from "@/Types/Admin/Common/LeadsOrApplicants/LeadsOrApplicantsTypes";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const DeleteLeadsOrApplicantsModal: React.FC<
  DeleteLeadsOrApplicantsModalProps
> = ({ isOpen, toggle, selectedLeadsOrApplicants }) => {
  const [deleteUser, { isLoading: isDeletingUser }] =
    useDeleteAuthUserMutation();

  const handleDelete = async () => {
    try {
      const user_alias = selectedLeadsOrApplicants.alias;
      const response = await deleteUser({ user_alias });
      toggle();
      if (response.data === null) {
        toast.success("User deleted successfully!");
      } else {
        toast.error("Failed to delete user.");
      }
    } catch (error) {
      console.error("Failed to delete user", error);
      toast.error("Failed to delete user. Please try again.");
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
          <strong className="text-danger">
            {selectedLeadsOrApplicants?.name}
          </strong>
          ?
        </p>

        <div className="border border-danger rounded p-3 bg-light text-center">
          <p className="mb-2 fw-semibold text-danger">
            This action is irreversible.
          </p>
          <small className="text-muted">
            Deleting this user will permanently remove all associated data
            and all historical records. This data cannot be restored.
          </small>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="info" onClick={toggle} disabled={isDeletingUser}>
          Cancel
        </Button>
        <Button color="danger" onClick={handleDelete} disabled={isDeletingUser}>
          {isDeletingUser ? "Deleting..." : "Delete"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteLeadsOrApplicantsModal;
