import { useDeleteOrgApplicantMutation } from "@/Redux/Reducers/Common/Organisations/OrganisationDetails/OrgApplicantApi";
import { DeleteOrgApplicantModalProps } from "@/Types/Common/Organisations/OrgApplicantType";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const DeleteOrgApplicantModal: React.FC<DeleteOrgApplicantModalProps> = ({
  isOpen,
  toggle,
  applicantToDelete,
  role,
}) => {
  const params = useParams();
  const organisationslug = (params?.OrganisationSlug ||
    (params as any)?.organisationslug) as string;

  const [deleteOrgApplicant, { isLoading: isDeleting }] =
    useDeleteOrgApplicantMutation();

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

  const handleDeleteApplicant = async () => {
    if (!organisationslug || !applicantToDelete?.alias) {
      toast.error("Missing applicant information.");
      return;
    }

    try {
      await deleteOrgApplicant({
        organisationslug,
        user_alias: applicantToDelete.alias,
      }).unwrap();
      toast.success(
        `${applicantToDelete.name || "Applicant"} deleted successfully.`,
      );
      toggle();
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <h3 className="text-danger">
          Delete {role === "APPLICANT" ? "Applicant" : "Lead"}
        </h3>
      </ModalHeader>
      <ModalBody>
        <p>
          Are you sure you want to delete the{" "}
          {role === "APPLICANT" ? "applicant" : "lead"}{" "}
          <strong className="text-danger">
            {applicantToDelete?.name || ""}
          </strong>
          ?
        </p>

        <div className="border border-danger rounded p-3 bg-light">
          <p className="mb-2 fw-semibold text-danger">
            This action is irreversible.
          </p>
          <small className="text-muted">
            Deleting this {role === "APPLICANT" ? "applicant" : "lead"} will
            permanently remove their profile and all associated records. This
            data cannot be restored.
          </small>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button
          color="danger"
          onClick={handleDeleteApplicant}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteOrgApplicantModal;
