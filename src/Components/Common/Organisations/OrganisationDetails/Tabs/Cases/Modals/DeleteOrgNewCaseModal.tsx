"use client";
import { useDeleteOrgCaseMutation } from "@/Redux/Reducers/Common/Organisations/OrganisationDetails/OrgCasesApi";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

interface DeleteOrgNewCaseModalProps {
  isOpen: boolean;
  toggle: () => void;
  caseToDelete: {
    alias: string;
    name: string;
  } | null;
}
const DeleteOrgNewCaseModal: React.FC<DeleteOrgNewCaseModalProps> = ({
  isOpen,
  toggle,
  caseToDelete,
}) => {
  const params = useParams();
  const organisationslug = (params?.OrganisationSlug ||
    (params as any)?.organisationslug) as string;

  const [deleteOrgCase, { isLoading: isDeletingCase }] =
    useDeleteOrgCaseMutation();

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

    return "Failed to delete case. Please try again.";
  };

  const handleDeleteCase = async () => {
    if (!organisationslug || !caseToDelete?.alias) {
      toast.error("Missing case information.");
      return;
    }

    try {
      await deleteOrgCase({
        organisationslug,
        case_alias: caseToDelete.alias,
      }).unwrap();
      toast.success("Case deleted successfully.");
      toggle();
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Delete Case</ModalHeader>
      <ModalBody>
        Are you sure you want to delete the case "{caseToDelete?.name || ""}"?
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button color="danger" onClick={handleDeleteCase}>
          {isDeletingCase ? "Deleting..." : "Delete"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteOrgNewCaseModal;
