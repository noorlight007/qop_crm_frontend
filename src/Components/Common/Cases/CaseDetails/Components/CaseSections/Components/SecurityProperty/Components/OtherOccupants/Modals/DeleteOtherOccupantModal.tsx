import { useDeleteOtherOccupantMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SecurityProperty/OtherOccupantsApi";
import { OtherOccupantModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/OtherOccupantsTypes";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const DeleteOtherOccupantModal: React.FC<OtherOccupantModalProps> = ({
  isOpen,
  toggle,
  selectedOccupant,
}) => {
  const { casealias } = useParams();
  const [deleteOtherOccupant, { isLoading }] = useDeleteOtherOccupantMutation();
  const handleSubmit = async () => {
    if (!selectedOccupant) return;
    try {
      await deleteOtherOccupant({
        case_alias: casealias,
        occupant_alias: selectedOccupant.alias,
      }).unwrap();
      toast.success("Occupant deleted successfully");
      toggle();
    } catch (error) {
      console.error("Failed to delete Occupant:", error);
      toast.error("Failed to delete Occupant");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        <h3 className="text-danger">Delete Other Occupant</h3>
      </ModalHeader>

      <ModalBody>
        <p>
          Are you sure you want to delete{" "}
          <strong className="text-danger">{selectedOccupant?.full_name}</strong>
          ?
        </p>

        <div className="border border-danger rounded p-3 bg-light">
          <p className="mb-2 fw-semibold text-danger">
            This action is irreversible.
          </p>
          <small className="text-muted">
            Deleting this occupant will permanently remove their details from
            the security property. This data cannot be restored.
          </small>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button color="danger" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Deleting..." : "Delete Occupant"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteOtherOccupantModal;
