import { useDeleteInsurancePolicyMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/InsuranceOverview/InsuranceOverviewApi";
import { DeleteInsurancePolicyModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/InsuranceOverviewTypes";
import React from "react";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const DeleteInsurancePolicyModal: React.FC<DeleteInsurancePolicyModalProps> = ({
  isOpen,
  toggle,
  caseAlias,
  insuranceOverviewAlias,
  policyAlias,
  policyType,
}) => {
  const [deleteInsurancePolicy, { isLoading }] =
    useDeleteInsurancePolicyMutation();

  const handleDelete = async () => {
    if (!caseAlias || !insuranceOverviewAlias || !policyAlias) {
      toast.error("Missing required information for deletion");
      return;
    }

    try {
      await deleteInsurancePolicy({
        case_alias: caseAlias,
        insurance_overview_alias: insuranceOverviewAlias,
        policy_alias: policyAlias,
      }).unwrap();
      toast.success("Insurance policy deleted successfully");
      toggle();
    } catch (err) {
      console.error("Failed to delete insurance policy", err);
      toast.error("Failed to delete insurance policy");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        <h3 className="text-danger">Delete Insurance Policy</h3>
      </ModalHeader>
      <ModalBody>
        <p>
          Are you sure you want to delete{" "}
          <strong className="text-danger">
            {policyType || "this insurance policy"}
          </strong>
          ?
        </p>

        <div className="border border-danger rounded p-3 bg-light">
          <p className="mb-2 fw-semibold text-danger">
            This action is irreversible.
          </p>
          <small className="text-muted">
            Deleting this policy will permanently remove it and its cover
            details from this case. This data cannot be restored.
          </small>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle} disabled={isLoading}>
          Cancel
        </Button>
        <Button color="danger" onClick={handleDelete} disabled={isLoading}>
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteInsurancePolicyModal;
