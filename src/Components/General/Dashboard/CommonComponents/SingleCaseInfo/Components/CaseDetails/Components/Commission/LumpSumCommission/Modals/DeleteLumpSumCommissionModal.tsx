import { useDeleteLumpSumCommissionMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Commission/CommissionApi";
import formatChoiceFieldValue from "@/utils/formatters";
import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

interface Props {
  isOpen: boolean;
  toggle: () => void;
  caseAlias: string | undefined | null;
  commissionAlias: string | undefined | null;
  lumpSumAlias?: string | null;
  onDeleted?: () => void;
  policyType?: string | null;
}

const DeleteLumpSumCommissionModal: React.FC<Props> = ({
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
    } catch (err) {
      console.error("Failed to delete lump sum", err);
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
