import { useDeletePreviousAddressMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/ApplicantsDetails/ApplicantPreviousAddressApi";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

export interface DeletePreviousAddressModalProps {
  isOpen: boolean;
  toggle: () => void;
  applicantDetails_alias: string;
  previousAddress_alias: string;
}

const DeletePreviousAddressModal: React.FC<DeletePreviousAddressModalProps> = ({
  isOpen,
  toggle,
  // casealias,
  applicantDetails_alias,
  previousAddress_alias,
}) => {
  const params = useParams();
  const { casealias } = params;
  const [deletePreviousAddress, { isLoading: isDeleting }] =
    useDeletePreviousAddressMutation();

  const handleDelete = async () => {
    try {
      const res = await deletePreviousAddress({
        case_alias: casealias,
        applicantDetails_alias: applicantDetails_alias,
        previousAddress_alias: previousAddress_alias,
      });
      if (res) {
        toggle();
        toast.success("Previous address deleted successfully");
      } else {
        toast.error("Failed to delete previous address!!");
      }
    } catch (error) {
      toast.error("Failed to delete previous address!");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="md">
      <ModalHeader toggle={toggle}>
        <h3 className="text-danger">Confirm Deletion</h3>
      </ModalHeader>
      <ModalBody>
        <p>Are you sure you want to delete this previous address?</p>

        <div className="border border-danger rounded p-3 bg-light">
          <p className="mb-2 fw-semibold text-danger">
            This action is irreversible.
          </p>
          <small className="text-muted">
            Deleting this address will permanently remove it from the
            applicant&apos;s address history. This data cannot be restored.
          </small>
        </div>
      </ModalBody>
      <ModalFooter className="justify-content-center">
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button color="danger" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? " Deleting..." : "Delete"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeletePreviousAddressModal;
