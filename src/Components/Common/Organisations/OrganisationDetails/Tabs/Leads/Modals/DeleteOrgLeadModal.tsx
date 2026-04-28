import { useDeleteOrgLeadOrApplicantMutation } from "@/Redux/Reducers/Common/Organisations/OrganisationDetails/OrgUserListApi";
import { OrgLeadInfo } from "@/Types/Common/Organisations/OrgLeadTypes";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

interface DeleteOrgLeadModalProps {
  isOpen: boolean;
  toggle: () => void;
  leadToDelete: OrgLeadInfo | null;
}

const DeleteOrgLeadModal: React.FC<DeleteOrgLeadModalProps> = ({
  isOpen,
  toggle,
  leadToDelete,
}) => {
  const params = useParams();
  const organisationslug = (params?.OrganisationSlug ||
    (params as any)?.organisationslug) as string;

  const [deleteOrgLead, { isLoading: isDeletingLead }] =
    useDeleteOrgLeadOrApplicantMutation();

  const getErrorMessage = (error: any) => {
    const data = error?.data || error?.error?.data || error;

    if (typeof data?.detail === "string") return data.detail;
    if (typeof data?.message === "string") return data.message;

    if (data && typeof data === "object") {
      const firstField = Object.values(data)[0];
      if (Array.isArray(firstField) && firstField.length > 0) {
        return String(firstField[0]);
      }
      if (typeof firstField === "string") {
        return firstField;
      }
    }

    return "Failed to delete lead. Please try again.";
  };

  const handleDeleteLead = async () => {
    if (!organisationslug || !leadToDelete?.alias) {
      toast.error("Missing lead information.");
      return;
    }

    try {
      await deleteOrgLead({
        organisationslug,
        user_alias: leadToDelete.alias,
      }).unwrap();
      toast.success("Lead deleted successfully.");
      toggle();
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Delete Lead</ModalHeader>
      <ModalBody>
        Are you sure you want to delete the lead "{leadToDelete?.name || ""}"?
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button
          color="danger"
          onClick={handleDeleteLead}
          disabled={isDeletingLead}
        >
          {isDeletingLead ? "Deleting..." : "Delete"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteOrgLeadModal;
