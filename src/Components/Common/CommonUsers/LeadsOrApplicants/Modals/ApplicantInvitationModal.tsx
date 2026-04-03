import { useApplicantInvitationMutation } from "@/Redux/Reducers/Common/CommonUsers/LeadsOrApplicantsApi";
import { ApplicantInvitationModalProps } from "@/Types/Common/CommonUsers/LeadsOrApplicantsTypes";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";

const ApplicantInvitationModal: React.FC<ApplicantInvitationModalProps> = ({
  isOpen,
  toggle,
  selectedApplicant,
}) => {
  const [ApplicantInvitation, { isLoading }] = useApplicantInvitationMutation();

  const handleInvitationClick = async () => {
    try {
      await ApplicantInvitation({
        userAlias: selectedApplicant?.user?.alias || selectedApplicant?.alias,
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
        <h3 className="text-primary">Applicant Invitation</h3>
      </ModalHeader>
      <ModalBody>
        <p>
          Send invitation to{" "}
          <b className="text-primary">{selectedApplicant?.user.email}</b>{" "}
        </p>
        <div className="d-flex justify-content-end gap-2">
          <Button color="danger" onClick={toggle}>
            Cancel
          </Button>
          <Button
            color="primary"
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

export default ApplicantInvitationModal;
