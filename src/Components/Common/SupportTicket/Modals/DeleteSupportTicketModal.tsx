import { useDeleteSupportTicketMutation } from "@/Redux/Reducers/Common/SupportTicket/SupportTicketApi";
import { DeleteSupportTicketModalProps } from "@/Types/Common/SupportTicket/SupportTicketTypes";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const DeleteSupportTicketModal: React.FC<DeleteSupportTicketModalProps> = ({
  isOpen,
  toggle,
  ticketAlias,
}) => {
  const [storedAlias, setStoredAlias] = useState<string>("");
  const [deleteSupportTicket, { isLoading }] = useDeleteSupportTicketMutation();

  useEffect(() => {
    if (isOpen && ticketAlias) {
      setStoredAlias(ticketAlias);
    }
  }, [isOpen, ticketAlias]);

  const handleDelete = async () => {
    if (!storedAlias) {
      toast.error("Ticket alias is missing");
      return;
    }
    try {
      const response = await deleteSupportTicket({
        ticket_alias: storedAlias,
      }).unwrap();
      toast.success("Ticket deleted successfully.");
      setStoredAlias("");
      toggle();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Failed to delete the ticket";
      toast.error(errorMessage);
    }
  };
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <h3 className="text-danger">Delete Ticket</h3>
      </ModalHeader>
      <ModalBody>
        <p>Are you sure you want to delete this support ticket?</p>

        <div className="border border-danger rounded p-3 bg-light">
          <p className="mb-2 fw-semibold text-danger">
            This action is irreversible.
          </p>
          <small className="text-muted">
            Deleting this ticket will permanently remove it along with its
            comments, replies, and attachments. This data cannot be restored.
          </small>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button color="danger" onClick={handleDelete}>
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteSupportTicketModal;
