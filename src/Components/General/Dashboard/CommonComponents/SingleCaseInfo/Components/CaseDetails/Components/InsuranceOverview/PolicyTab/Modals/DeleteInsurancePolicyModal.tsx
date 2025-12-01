import { useDeleteInsurancePolicyMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/InsuranceOverview/InsuranceOverviewApi";
import React from "react";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

interface DeleteInsurancePolicyModalProps {
  isOpen: boolean;
  toggle: () => void;
  caseAlias: string | string[];
  insuranceOverviewAlias: string | undefined;
  policyAlias: string | undefined;
  policyType?: string;
}

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
      <ModalHeader toggle={toggle}>Delete Insurance Policy</ModalHeader>
      <ModalBody>
        <p>
          Are you sure you want to delete{" "}
          <strong>{policyType || "this insurance policy"}</strong>?
        </p>
        <p className="text-muted mb-0">This action cannot be undone.</p>
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
