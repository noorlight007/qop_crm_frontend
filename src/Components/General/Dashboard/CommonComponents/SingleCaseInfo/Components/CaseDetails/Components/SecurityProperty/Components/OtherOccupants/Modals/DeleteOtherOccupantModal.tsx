import { useDeleteOtherOccupantMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/SecurityProperty/OtherOccupantsApi";
import { OtherOccupantModalProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/OtherOccupantsTypes";
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
      toast.error("Failed to delete  Occupant");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        <h3 className="text-primary">Delete Other Occupant</h3>
      </ModalHeader>

      <ModalBody>
        Are you sure you want to delete{" "}
        <strong className="text-danger">{selectedOccupant?.full_name}</strong>?
        This action cannot be undone.
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Deleting..." : "Delete Occupant"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteOtherOccupantModal;
