import { useDeleteFeesInOutMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Fees/FeesApi";
import { DeleteFeeModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/FeeTypes";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { Button, Modal, ModalHeader } from "reactstrap";

const DeleteFeeModal: React.FC<DeleteFeeModalProps> = ({
  isOpen,
  toggle,
  feeData,
}) => {
  const { casealias } = useParams();
  const [deleteFee, { isLoading }] = useDeleteFeesInOutMutation();

  const deleteFeeHandler = async () => {
    const feeAlias = feeData?.alias;
    if (!feeAlias) {
      toast.error("Fee data not found");
      return;
    }
    try {
      await deleteFee({ case_alias: casealias, fee_alias: feeAlias }).unwrap();
      toggle();
      toast.success("Fee deleted successfully");
    } catch (error) {
      console.error("Failed to delete fee:", error);
      toast.error("Failed to delete fee");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <h3 className="text-danger">Delete Fee</h3>
      </ModalHeader>
      <div className="modal-body">
        <p>
          Are you sure you want to delete{" "}
          <b className="text-danger">
            £{feeData?.fee ?? feeData?.amount ?? "-"}
          </b>{" "}
          fee?
        </p>
        <div className="d-flex justify-content-end gap-2">
          <Button color="secondary" onClick={toggle} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            color="danger"
            onClick={deleteFeeHandler}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteFeeModal;
