import { useDeletePropertyDetailsMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Portfolio/PortfolioApi";
import { DeletePropertyModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/PortfolioTypes";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

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
      <ModalHeader toggle={toggle}>
        <h3 className="text-danger">Delete Property</h3>
      </ModalHeader>
      <ModalBody>
        <p>
          Are you sure you want to delete the property{" "}
          <strong className="text-danger">
            {propertyLabel || propertyAlias}
          </strong>
          ?
        </p>

        <div className="border border-danger rounded p-3 bg-light">
          <p className="mb-2 fw-semibold text-danger">
            This action is irreversible.
          </p>
          <small className="text-muted">
            Deleting this property will permanently remove it and its details
            from the portfolio. This data cannot be restored.
          </small>
        </div>
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
