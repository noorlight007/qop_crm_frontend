import { useDeleteDependantsMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/ApplicantsDetails/ApplicantsDetailsApi";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

type Props = {
  isOpen: boolean;
  dependantId: string;
  applicantAlias: string;
  onClose: () => void;
};

const DeleteApplicantDependantModal: React.FC<Props> = ({
  isOpen,
  onClose,
  dependantId,
  applicantAlias,
}) => {
  const params = useParams();
  const { casealias } = (params as any) || { casealias: "" };

  const [deleteDependants, { isLoading }] = useDeleteDependantsMutation();

  const handleDeleteDependant = async () => {
    try {
      await deleteDependants({
        case_alias: casealias,
        applicantDetails_alias: applicantAlias,
        dependant_id: dependantId,
      }).unwrap();

      toast.success("Dependant deleted successfully!");
      onClose();
    } catch (error: any) {
      const errorMessage =
        (error?.data as any)?.detail ||
        error?.message ||
        "Failed to delete dependant";
      toast.error(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered>
      <ModalHeader toggle={onClose}>
        <h3 className="text-danger">Delete Dependant</h3>
      </ModalHeader>
      <ModalBody>
        <p>Are you sure you want to delete this dependant?</p>

        <div className="border border-danger rounded p-3 bg-light">
          <p className="mb-2 fw-semibold text-danger">
            This action is irreversible.
          </p>
          <small className="text-muted">
            Deleting this dependant will permanently remove their details from
            the applicant&apos;s record. This data cannot be restored.
          </small>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          color="danger"
          onClick={handleDeleteDependant}
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteApplicantDependantModal;
