import { useDeleteLumpSumCommissionMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Commission/CommissionApi";
import { DeleteLumpSumAndTrailModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/CommissionTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import React from "react";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const DeleteLumpSumCommissionModal: React.FC<
  DeleteLumpSumAndTrailModalProps
> = ({
  isOpen,
  toggle,
  caseAlias,
  commissionAlias,
  lumpSumAlias,
  onDeleted,
  policyType,
}) => {
  const [deleteLumpSumCommission, { isLoading: isDeleting }] =
    useDeleteLumpSumCommissionMutation();

  const handleConfirm = async () => {
    if (!lumpSumAlias || !caseAlias || !commissionAlias) return;
    try {
      await deleteLumpSumCommission({
        case_alias: caseAlias,
        commission_alias: commissionAlias,
        lump_sum_alias: lumpSumAlias,
      }).unwrap();
      if (onDeleted) onDeleted();
      toggle();
      toast.success("Lump sum commission deleted successfully");
    } catch (err) {
      console.error("Failed to delete lump sum", err);
      toast.error("Failed to delete lump sum commission");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <h3 className="text-danger">Delete Lump Sum Commission</h3>
      </ModalHeader>
      <ModalBody>
        <div>
          Are you sure you want to delete{" "}
          <b className="text-danger">
            {policyType ? `${formatChoiceFieldValue(policyType)} ` : "this"}
          </b>{" "}
          lump sum commission?
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

export default DeleteLumpSumCommissionModal;
