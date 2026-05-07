"use client";
import { useDeleteOrgMemberMutation } from "@/Redux/Reducers/Common/Organisations/OrganisationDetails/OrgMembersApi";
import { DeleteOrgMemberModalProps } from "@/Types/Common/Organisations/OrgMembersTypes";
import formatChoiceFieldValue from "@/utils/formatters";

import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const DeleteOrgMemberModal: React.FC<DeleteOrgMemberModalProps> = ({
  isOpen,
  toggle,
  organisationslug,
  selectedMember,
  role,
}) => {
  const [deleteMember, { isLoading }] = useDeleteOrgMemberMutation();

  const handleDelete = async () => {
    const memberAlias = selectedMember?.alias;
    if (!memberAlias) {
      toast.error(`${formatChoiceFieldValue(role)} alias not found.`);
      return;
    }

    try {
      await deleteMember({
        organisationslug,
        memberAlias: memberAlias,
      }).unwrap();

      toggle();
      toast.success(`${formatChoiceFieldValue(role)} deleted successfully!`);
    } catch (error) {
      console.error("Failed to delete " + formatChoiceFieldValue(role), error);
      toast.error(
        `Failed to delete ${formatChoiceFieldValue(role)}. Please try again.`,
      );
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        <h3 className="text-danger">Confirm Deletion</h3>
      </ModalHeader>
      <ModalBody>
        <p>
          Are you sure you want to delete:{" "}
          <strong className="text-danger">{selectedMember?.name}</strong>?
        </p>

        <div className="border border-danger rounded p-3 bg-light text-center">
          <p className="mb-2 fw-semibold text-danger">
            This action is irreversible.
          </p>
          <small className="text-muted">
            Deleting this {formatChoiceFieldValue(role)} will permanently remove
            all associated data and historical records. This data cannot be
            restored.
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

export default DeleteOrgMemberModal;
