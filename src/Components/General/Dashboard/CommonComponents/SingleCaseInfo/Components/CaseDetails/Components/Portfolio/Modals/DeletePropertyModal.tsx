import { useDeletePropertyDetailsMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Portfolio/PortfolioApi";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

interface DeletePropertyModalProps {
  isOpen: boolean;
  toggle: () => void;
  propertyAlias: string | null | undefined;
  propertyLabel?: string;
  onDeleteComplete?: () => void;
}

const DeletePropertyModal: React.FC<DeletePropertyModalProps> = ({
  isOpen,
  toggle,
  propertyAlias,
  propertyLabel,
  onDeleteComplete,
}) => {
  const { casealias } = useParams();
  const [deletePropertyDetails, { isLoading }] =
    useDeletePropertyDetailsMutation();

  const handleDelete = async () => {
    if (!propertyAlias) {
      toast.error("No property selected to delete.");
      return;
    }
    try {
      const res = await deletePropertyDetails({
        case_alias: casealias,
        property_alias: propertyAlias,
      });
      if ((res as any).data === null) {
        toast.success("Property deleted successfully");
        if (onDeleteComplete) onDeleteComplete();
        toggle();
      } else {
        console.error("Error deleting property:", res);
        toast.error("Failed to delete property. Please try again.");
      }
    } catch (error) {
      console.error("Failed to delete property:", error);
      toast.error("Failed to delete property");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Delete Property</ModalHeader>
      <ModalBody>
        Are you sure you want to delete the property{" "}
        <strong>{propertyLabel || propertyAlias}</strong>?
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

export default DeletePropertyModal;
