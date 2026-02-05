import { useDeleteNetworkMutation } from "@/Redux/Reducers/Admin/Networks/NetworksApi";
import { useDeleteOrganisationMutation } from "@/Redux/Reducers/Network/Director/Organisations/SingleOrganisation/SingleOrganisationApi";
import { DeleteNetworkModalProps } from "@/Types/Admin/Networks/NetworkType";
import { DeleteOrganisationModalProps } from "@/Types/Network/Director/OrganisationsTypes";
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
          <strong className="text-danger">
            {networkInfo?.network?.name}
          </strong>{" "}
          network?
        </p>
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
