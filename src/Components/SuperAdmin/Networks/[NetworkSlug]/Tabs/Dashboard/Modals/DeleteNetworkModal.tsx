import { useDeleteNetworkMutation } from "@/Redux/Reducers/SuperAdmin/Networks/NetworksApi";
import { DeleteNetworkModalProps } from "@/Types/SuperAdmin/Networks/NetworkType";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const DeleteNetworkModal: React.FC<DeleteNetworkModalProps> = ({
  isOpen,
  toggle,
  networkInfo,
}) => {
  const router = useRouter();
  // rtk hooks
  const [deleteNetwork, { isLoading }] = useDeleteNetworkMutation();

  const handleDelete = async () => {
    try {
      const network_slug = networkInfo?.network?.slug;
      const response = await deleteNetwork({ network_slug });
      toggle();
      if (response.data === null) {
        toast.success("Network deleted successfully!");
      } else {
        toast.error("Failed to delete network.");
      }
      router.push("/admin/networks");
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
          Are you sure you want to delete{" "}
          <strong className="text-danger">{networkInfo?.network?.name}</strong>{" "}
          network?
        </p>

        <div className="border border-danger rounded p-3 bg-light">
          <p className="mb-2 fw-semibold text-danger">
            This action is irreversible.
          </p>
          <small className="text-muted">
            Deleting this network will permanently remove all associated data,
            including organisations, cases, leads, clients, advisers, admins,
            joint applicants, appearance preferences, settings, profile
            information, and all historical records. This data cannot be
            restored.
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

export default DeleteNetworkModal;
