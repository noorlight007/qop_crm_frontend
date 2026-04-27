import { ApplicantEditAccessModalProps } from "@/Types/Common/Cases/CaseTypes";
import { toast } from "react-toastify";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";

const ApplicantEditAccessModal: React.FC<ApplicantEditAccessModalProps> = ({
  isOpen,
  toggle,
  caseInfo,
  updateCaseDetails,
  isUpdating,
}) => {
  const isEditable = caseInfo?.is_editable ?? false;

  const handleSubmit = async () => {
    if (!caseInfo) {
      toast.error("Case information is not available.");
      return;
    }

    try {
      const payload = { ...caseInfo, is_editable: !isEditable };
      const res = await updateCaseDetails({
        caseAlias: caseInfo.alias,
        payload,
      });

      if ((res as any).data) {
        toast.success(
          isEditable
            ? "Edit access removed from applicant."
            : "Edit access granted to applicant.",
        );
        toggle();
      } else {
        const errorMessage =
          (res as any)?.error?.data?.detail || "Failed to update access.";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error updating applicant edit access:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Applicant Edit Access</ModalHeader>
      <ModalBody>
        <div className="text-center py-3">
          {/* Icon */}
          <div
            className="mb-3 rounded-circle d-inline-flex align-items-center justify-content-center"
            style={{
              width: 64,
              height: 64,
              backgroundColor: isEditable
                ? "rgba(220, 53, 69, 0.12)"
                : "rgba(13, 110, 253, 0.12)",
            }}
          >
            <i
              className={`fa-solid ${isEditable ? "fa-lock" : "fa-lock-open"} fa-xl`}
              style={{
                color: isEditable
                  ? "rgba(220, 53, 69, 0.85)"
                  : "rgba(13, 110, 253, 0.85)",
              }}
            />
          </div>

          {/* Dynamic heading */}
          <h5 className="fw-semibold mb-2">
            {isEditable ? "Remove Edit Access" : "Grant Edit Access"}
          </h5>

          {/* Dynamic description */}
          <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
            {isEditable ? (
              <>
                The applicant currently has permission to edit their form data.{" "}
                <br />
                <strong className="text-danger">
                  Removing access will prevent them from making further changes.
                </strong>
              </>
            ) : (
              <>
                The applicant currently cannot edit their form data. <br />
                <strong className="text-primary">
                  Granting access will allow them to update their information
                  directly.
                </strong>
              </>
            )}
          </p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="secondary"
          outline
          onClick={toggle}
          disabled={isUpdating}
        >
          Cancel
        </Button>
        <Button
          color={isEditable ? "danger" : "primary"}
          onClick={handleSubmit}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <Spinner size="sm" className="me-1" />
          ) : (
            <i
              className={`fa-solid ${isEditable ? "fa-lock" : "fa-unlock"} me-1`}
            />
          )}
          {isUpdating
            ? "Saving..."
            : isEditable
              ? "Remove Access"
              : "Grant Access"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ApplicantEditAccessModal;
