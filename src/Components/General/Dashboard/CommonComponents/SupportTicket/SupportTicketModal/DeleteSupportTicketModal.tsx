import { useDeleteSupportTicketMutation } from "@/Redux/Reducers/CommonComponents/SupportTicket/SupportTicketApi";
import { DeleteSupportTicketModalProps } from "@/Types/CommonComponents/SupportTicket/SupportTicketTypes";
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
      console.log("Storing alias in modal:", ticketAlias);
    }
  }, [isOpen, ticketAlias]);

  const handleDelete = async () => {
    if (!storedAlias) {
      toast.error("Ticket alias is missing");
      return;
    }
    try {
      console.log("Deleting ticket with alias:", storedAlias);
      const response = await deleteSupportTicket({
        ticket_alias: storedAlias,
      }).unwrap();
      console.log("Delete response:", response);
      toast.success("Ticket deleted successfully.");
      setStoredAlias("");
      toggle();
    } catch (error: any) {
      console.error("Delete error:", error);
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
      <ModalBody className="text-center">
        Are you sure you want to delete the Support Ticket? <br />This action cannot be undone.
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
