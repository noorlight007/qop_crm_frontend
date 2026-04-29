import { useUpdateCaseMutation } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { ApplicantEditAccessModalProps } from "@/Types/Common/Cases/CaseTypes";
import { useEffect, useState } from "react";
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
}) => {
  const [updateCaseDetails, { isLoading: isUpdating }] =
    useUpdateCaseMutation();

  const [isEditable, setIsEditable] = useState(caseInfo?.is_editable ?? false);

  useEffect(() => {
    setIsEditable(caseInfo?.is_editable ?? false);
  }, [caseInfo?.is_editable]);

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
        setIsEditable((prev: boolean) => !prev);
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
      <ModalHeader toggle={toggle}>
        <h4 className="text-primary">Applicant Edit Access</h4>
      </ModalHeader>
      <ModalBody>
        <div className="text-center py-3">
          {/* Icon */}
          <div
            className="mb-3 rounded-circle d-inline-flex align-items-center justify-content-center"
            style={{
              width: 64,
              height: 64,
              backgroundColor: isEditable
                ? "rgba(220, 53, 69)"
                : "rgba(25, 135, 84)",
            }}
          >
            <i
              className={`fa-solid text-white ${isEditable ? "fa-lock-open" : "fa-lock"} fa-xl`}
            />
          </div>

          <h5
            className={`fw-semibold mb-2 ${isEditable ? "text-danger" : "text-success"}`}
          >
            {isEditable
              ? "Status: Edit access enabled"
              : "Status: Edit access disabled"}
          </h5>

          {/* Dynamic description */}
          <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
            {isEditable ? (
              <>
                The applicant currently has permission to edit their form data.{" "}
                <br />
                <strong className="text-success">
                  Removing access will prevent them from making further changes.
                </strong>
              </>
            ) : (
              <>
                The applicant currently cannot edit their form data. <br />
                <strong className="text-danger">
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
          color={isEditable ? "success" : "danger"}
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
