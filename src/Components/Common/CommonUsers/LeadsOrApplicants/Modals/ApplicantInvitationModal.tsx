import {
  useApplicantInvitationMutation,
  useGetApplicantInvitationListQuery,
} from "@/Redux/Reducers/Common/CommonUsers/LeadsOrApplicantsApi";
import { ApplicantInvitationModalProps } from "@/Types/Common/CommonUsers/LeadsOrApplicantsTypes";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Badge, Button, Modal, ModalBody, ModalHeader } from "reactstrap";

const ApplicantInvitationModal: React.FC<ApplicantInvitationModalProps> = ({
  isOpen,
  toggle,
  caseAlias,
}) => {
  const [selectedAliases, setSelectedAliases] = useState<string[]>([]);
  const [ApplicantInvitation, { isLoading }] = useApplicantInvitationMutation();

  const {
    data: invitationCandidates,
    isLoading: isListLoading,
    isFetching,
    isError,
  } = useGetApplicantInvitationListQuery(
    { caseAlias: caseAlias },
    { skip: !caseAlias },
  );

  useEffect(() => {
    if (!isOpen) return;
    setSelectedAliases([]);
  }, [isOpen, caseAlias]);

  const availableUsers = useMemo(() => {
    if (!invitationCandidates) return [];
    if (Array.isArray(invitationCandidates)) return invitationCandidates;

    const users: any[] = [];

    if (invitationCandidates.applicant) {
      users.push({
        alias: invitationCandidates.applicant.alias,
        name:
          invitationCandidates.applicant.name ||
          `${invitationCandidates.applicant.first_name || ""} ${
            invitationCandidates.applicant.last_name || ""
          }`.trim(),
        email: invitationCandidates.applicant.email,
        type: "Applicant",
      });
    }

    if (Array.isArray(invitationCandidates.joint_applicants)) {
      invitationCandidates.joint_applicants.forEach((user: any) => {
        users.push({
          alias: user.alias,
          name:
            user.name ||
            `${user.first_name || ""} ${user.last_name || ""}`.trim(),
          email: user.email,
          type: "Joint Applicant",
        });
      });
    }

    return users;
  }, [invitationCandidates]);

  const handleToggleUser = (alias: string) => {
    setSelectedAliases((prev) =>
      prev.includes(alias)
        ? prev.filter((current) => current !== alias)
        : [...prev, alias],
    );
  };

  const handleInvitationClick = async () => {
    if (!caseAlias) {
      toast.error("Unable to send invitation: missing case alias.");
      return;
    }

    if (selectedAliases.length === 0) {
      toast.error("Select at least one user to invite.");
      return;
    }

    try {
      await ApplicantInvitation({
        caseAlias: caseAlias,
        payload: { applicants: selectedAliases },
      }).unwrap();
      toggle();
      toast.success("Invitation(s) sent successfully!");
    } catch (error) {
      toast.error("Failed to send invitation. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <h3 className="text-primary">Applicants Invitation</h3>
      </ModalHeader>
      <ModalBody>
        <p className="mb-3">Select one or more users to invite.</p>

        {isListLoading || isFetching ? (
          <p className="text-muted">Loading users...</p>
        ) : isError ? (
          <p className="text-danger">Unable to load inviteable users.</p>
        ) : availableUsers.length === 0 ? (
          <p className="text-muted">No users available for invitation.</p>
        ) : (
          <div className="list-group mb-3">
            {availableUsers.map((user: any) => {
              const alias = String(user.alias ?? user.user_alias ?? "");
              const label =
                user.name ||
                `${user.first_name || ""} ${user.last_name || ""}`.trim();
              const isSelected = selectedAliases.includes(alias);

              return (
                <label
                  key={alias}
                  className="list-group-item list-group-item-action d-flex align-items-center justify-content-between gap-3"
                  style={{ cursor: "pointer" }}
                >
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleUser(alias)}
                    />
                    <span className="form-check-label ms-2">
                      <strong>
                        {label || user.email}
                        {user.type === "Joint Applicant" && (
                          <Badge
                            color="info"
                            pill
                            className="ms-2"
                            style={{
                              fontSize: "0.65rem",
                              padding: "0.25rem 0.3rem",
                            }}
                          >
                            Joint Applicant
                          </Badge>
                        )}
                      </strong>
                      <br />
                      <small className="text-muted">{user.email}</small>
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        )}

        <div className="d-flex justify-content-end gap-2">
          <Button color="danger" onClick={toggle}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleInvitationClick}
            disabled={isLoading || selectedAliases.length === 0}
          >
            {isLoading || isFetching ? "Sending..." : "Send Invitation(s)"}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ApplicantInvitationModal;
