import { useDeleteDependantsMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/ApplicantsDetails/ApplicantsDetailsApi";
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
        <p>
          Are you sure you want to delete this dependant? This action cannot be
          undone.
        </p>
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
