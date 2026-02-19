import { useClientInvitationMutation } from "@/Redux/Reducers/Common/CommonUsers/AuthUsersApi";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";

export interface ClientInvitationModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedClient: any;
}

const ClientInvitationModal: React.FC<ClientInvitationModalProps> = ({
  isOpen,
  toggle,
  selectedClient,
}) => {
  const [clientInvitation, { isLoading }] = useClientInvitationMutation();

  const handleInvitationClick = async () => {
    try {
      await clientInvitation({
        userAlias: selectedClient?.user?.alias || selectedClient?.alias,
      }).unwrap();
      toggle();
      toast.success("Invitation sent successfully!");
    } catch (error) {
      toast.error("Failed to send invitation. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <h3 className="text-primary">Client Invitation</h3>
      </ModalHeader>
      <ModalBody>
        <p>
          Send invitation to{" "}
          <b className="text-primary">{selectedClient?.user.email}</b>{" "}
        </p>
        <div className="d-flex justify-content-end gap-2">
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button
            color="success"
            onClick={handleInvitationClick}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Send Invitation"}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ClientInvitationModal;
