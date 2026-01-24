import { useDeleteCreditCommitmentsDetailsMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CreditCommitmentsDetails/CreditCommitmentsDetailsApi";
import { DeleteCreditCommitmentModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/CreditCommitmentsTypes";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const DeleteCreditCommitmentModal: React.FC<
  DeleteCreditCommitmentModalProps
> = ({
  isOpen,
  toggle,
  casealias,
  creditCommitmentAlias,
  creditCommitmentName,
  onDelete,
}) => {
  // rtk hooks
  const [deleteCreditCommitmentsDetails, { isLoading }] =
    useDeleteCreditCommitmentsDetailsMutation();

  // handle delete
  const handleDelete = async () => {
    try {
      const res = await deleteCreditCommitmentsDetails({
        case_alias: casealias,
        creditCommitment_alias: creditCommitmentAlias,
      });
      if (res.data || !("error" in res)) {
        toast.success("Credit Commitment deleted successfully");
        toggle();
        if (onDelete) {
          onDelete();
        }
      } else if ("error" in res) {
        const errorMessage =
          (res.error as any)?.data?.detail ||
          "Failed to delete Credit Commitment";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error deleting credit commitment:", error);
      toast.error("Failed to delete Credit Commitment");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">Credit Commitment</span>
      </ModalHeader>
      <ModalBody>
        <p>
          Are you sure you want to delete this credit{" "}
          <strong className="text-danger">{creditCommitmentName}</strong>{" "}
          commitment? This action cannot be undone.
        </p>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={handleDelete} disabled={isLoading}>
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteCreditCommitmentModal;
