import { useDeletePreviousAddressMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/ApplicantsDetails/ApplicantPreviousAddressApi";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

export interface DeletePreviousAddressModalProps {
  isOpen: boolean;
  toggle: () => void;
  // casealias: string;
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
      <ModalHeader toggle={toggle} className="text-danger">
        Confirm Deletion
      </ModalHeader>
      <ModalBody>
        <p className="text-center">
          Are you sure you want to delete this previous address? This action
          cannot be undone.
        </p>
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
