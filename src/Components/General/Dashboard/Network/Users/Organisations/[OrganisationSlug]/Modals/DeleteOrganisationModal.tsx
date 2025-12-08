import { useDeleteOrganisationMutation } from "@/Redux/Reducers/Network/Director/Organisations/SingleOrganisation/SingleOrganisationApi";
import { DeleteOrganisationModalProps } from "@/Types/Network/OrganisationsTypes";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const DeleteOrganisationModal: React.FC<DeleteOrganisationModalProps> = ({
  isOpen,
  toggle,
  organisationInfo,
}) => {
  const router = useRouter();
  // rtk hooks
  const [deleteOrganisation, { isLoading }] = useDeleteOrganisationMutation();

  const handleDelete = async () => {
    try {
      const slug = organisationInfo?.slug;
      const response = await deleteOrganisation({ slug });
      toggle();
      if (response.data === null) {
        toast.success("Organisation deleted successfully!");
      } else {
        toast.error("Failed to delete organisation.");
      }
      router.push("/dashboard/network");
    } catch (error) {
      console.error("Failed to delete organisation", error);
      toast.error("Failed to delete organisation. Please try again.");
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
          <strong className="text-danger">{organisationInfo?.name}</strong>{" "}
          organisation? This action cannot be undone.
        </p>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={handleDelete} disabled={isLoading}>
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
        <Button color="secondary" onClick={toggle} disabled={isLoading}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteOrganisationModal;
