import { useDeleteTrailCommissionMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Commission/CommissionApi";
import { DeleteLumpSumAndTrailModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/CommissionTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import React from "react";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const DeleteTrailCommissionModal: React.FC<DeleteLumpSumAndTrailModalProps> = ({
  isOpen,
  toggle,
  caseAlias,
  commissionAlias,
  trailCommissionAlias,
  onDeleted,
  policyType,
}) => {
  const [deleteTrailCommission, { isLoading: isDeleting }] =
    useDeleteTrailCommissionMutation();

  const handleConfirm = async () => {
    if (!trailCommissionAlias || !caseAlias || !commissionAlias) return;
    try {
      await deleteTrailCommission({
        case_alias: caseAlias,
        commission_alias: commissionAlias,
        trail_commission_alias: trailCommissionAlias,
      }).unwrap();
      if (onDeleted) onDeleted();
      toggle();
      toast.success("Trail commission deleted successfully");
    } catch (err) {
      console.error("Failed to delete trail commission", err);
      toast.error("Failed to delete trail commission");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <h3 className="text-danger">Delete Trail Commission</h3>
      </ModalHeader>
      <ModalBody>
        <div>
          Are you sure you want to delete{" "}
          <b className="text-danger">
            {policyType ? `${formatChoiceFieldValue(policyType)} ` : "this"}
          </b>{" "}
          trail commission?
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle} disabled={isDeleting}>
          Cancel
        </Button>
        <Button color="danger" onClick={handleConfirm} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteTrailCommissionModal;
