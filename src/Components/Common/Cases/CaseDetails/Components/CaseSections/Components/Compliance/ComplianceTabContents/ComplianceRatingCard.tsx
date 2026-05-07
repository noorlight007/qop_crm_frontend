import { DATE_FIELDS, GRADE_OPTIONS, TABS } from "@/Data/Cases/ComplianceData";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import {
  useComplianceSendRequestMutation,
  useCreateAssignedComplianceMutation,
  useGetAssignedComplianceQuery,
  useGetComplianceQuery,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Compliance/ComplianceApi";
import {
  ComplianceStage,
  hydrateReviews,
  ReviewStageState,
  updateReviewField,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Compliance/ComplianceSlice";
import { useGetUserListQuery } from "@/Redux/Reducers/Common/Cases/UserFiltersListApi";
import { RootState } from "@/Redux/Store";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  Spinner,
} from "reactstrap";

// ─── Main Component ───────────────────────────────────────────────────────────

export const ComplianceRatingCard: FC = () => {
  const { casealias } = useParams();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const allowedRoles = ["ADVISER", "COMPLIANCE"];

  const [activeStage, setActiveStage] =
    useState<ComplianceStage>("PRE_SUBMISSION");

  // ─── Modal State ──────────────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen((prev) => !prev);

  // ─── Queries & Mutations ──────────────────────────────────────────────────

  const { data: complianceData } = useGetComplianceQuery({
    case_alias: casealias,
  });

  const { data: complianceList, isLoading: isComplianceListLoading } =
    useGetUserListQuery({ role: "COMPLIANCE" });

  const {
    data: getAssignedCompliance,
    isLoading: isAssignedComplianceLoading,
  } = useGetAssignedComplianceQuery({ undefined });

  const [
    createAssignedCompliance,
    { isLoading: isCreatingAssignedCompliance },
  ] = useCreateAssignedComplianceMutation();

  const [complianceSendRequest, { isLoading: isSendingRequest }] =
    useComplianceSendRequestMutation();

  // ─── Multi-select State ───────────────────────────────────────────────────
  const [selectedComplianceAliases, setSelectedComplianceAliases] = useState<
    string[]
  >([]);

  // Pre-select on load — match by email since GET doesn't return alias
  useEffect(() => {
    if (getAssignedCompliance?.results?.length && complianceList?.length) {
      const assignedEmails = getAssignedCompliance.results[0].compliance.map(
        (c: any) => c.email,
      );
      const matchedAliases = complianceList
        .filter((user: any) => assignedEmails.includes(user.email))
        .map((user: any) => user.alias);

      setSelectedComplianceAliases(matchedAliases);
    }
  }, [getAssignedCompliance, complianceList]);

  // Hydrate Redux with API data on load
  useEffect(() => {
    if (complianceData?.reviews) {
      dispatch(hydrateReviews(complianceData.reviews));
    }
  }, [complianceData, dispatch]);

  const reviews = useAppSelector(
    (state: RootState) => state.compliance.reviews,
  );

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleToggleCompliance = (alias: string) => {
    setSelectedComplianceAliases((prev) =>
      prev.includes(alias) ? prev.filter((a) => a !== alias) : [...prev, alias],
    );
  };

  const handleSaveAssignedCompliance = async () => {
    if (!selectedComplianceAliases.length) return;
    try {
      const selectedIds = complianceList
        .filter((user: any) => selectedComplianceAliases.includes(user.alias))
        .map((user: any) => user.id);

      await createAssignedCompliance({
        compliance: selectedIds,
      }).unwrap();
      toast.success("Compliance assigned successfully!");
      toggleModal();
    } catch (err) {
      console.error("Failed to save assigned compliance:", err);
      toast.error("Failed to assign compliance.");
    }
  };

  const getStageData = (stage: ComplianceStage): ReviewStageState => {
    const reduxStage = reviews[stage];
    const apiStage = complianceData?.reviews?.[stage];
    if (!apiStage) return reduxStage;
    if (reduxStage._touched) return reduxStage;
    return { ...apiStage, _touched: false };
  };

  const stageData = getStageData(activeStage);

  const handleDateChange = (
    field: keyof Pick<
      ReviewStageState,
      | "file_review_request_date"
      | "file_reviewed_date"
      | "remedial_actions_due_date"
      | "compliance_sign_off_date"
    >,
    value: string,
  ) => {
    dispatch(
      updateReviewField({ stage: activeStage, field, value: value || null }),
    );
  };

  const handleFieldChange = (
    field: keyof Omit<ReviewStageState, "_touched">,
    value: any,
  ) => {
    dispatch(updateReviewField({ stage: activeStage, field, value }));
  };

  const getDisabledFields = (role: string | undefined): Set<string> => {
    if (role === "ADVISER") {
      return new Set([
        "file_reviewed_date",
        "remedial_actions_due_date",
        "compliance_sign_off_date",
        "admin_grade",
        "advice_grade",
      ]);
    }
    if (role === "COMPLIANCE") {
      return new Set(["file_review_request_date"]);
    }
    return new Set(); // DIRECTOR or others — full access
  };

  const disabledFields = getDisabledFields(userRole);

  const handleSendRequest = async () => {
    try {
      await complianceSendRequest({
        case_alias: casealias,
      }).unwrap();
      toast.success("Compliance request sent successfully!");
    } catch (err) {
      console.error("Failed to send compliance request:", err);
      toast.error("Failed to send compliance request.");
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <Container className="p-0">
      {/* ══════════════════════════════════════════════
          TOP ACTIONS ROW
      ══════════════════════════════════════════════ */}
      <Row className="mb-4 align-items-center border-bottom pb-3">
        <Col xs={12} className="d-flex justify-content-end gap-2">
          {/* Assign Compliance Button */}
          {session?.user?.role === "DIRECTOR" && (
            <Button color="primary" onClick={toggleModal}>
              Assign Compliance
            </Button>
          )}

          {/* Send Request Button */}
          {allowedRoles.includes(userRole ?? "") && (
            <Button
              color="secondary"
              outline
              onClick={handleSendRequest}
              disabled={isSendingRequest}
            >
              {isSendingRequest ? (
                <>
                  <Spinner size="sm" className="me-1" />
                  Sending...
                </>
              ) : userRole === "COMPLIANCE" ? (
                "Complete Review"
              ) : (
                "Request Compliance Review"
              )}
            </Button>
          )}
        </Col>
      </Row>

      {/* ══════════════════════════════════════════════
          ASSIGN COMPLIANCE MODAL
      ══════════════════════════════════════════════ */}
      <Modal isOpen={isModalOpen} toggle={toggleModal} centered scrollable>
        <ModalHeader toggle={toggleModal}>
          All Compliances of this Network
        </ModalHeader>

        <ModalBody>
          {isComplianceListLoading || isAssignedComplianceLoading ? (
            <div className="d-flex justify-content-center py-4">
              <Spinner size="sm" color="primary" />
              <span className="ms-2 text-muted small">Loading...</span>
            </div>
          ) : !complianceList?.length ? (
            <p className="text-muted small mb-0 py-2">
              No compliance users found.
            </p>
          ) : (
            <div className="d-flex flex-column gap-2">
              {complianceList.map((user: any) => {
                const isChecked = selectedComplianceAliases.includes(
                  user.alias,
                );

                return (
                  <div
                    key={user.alias}
                    onClick={() => handleToggleCompliance(user.alias)}
                    className={`w-100 d-flex align-items-center gap-3 px-2 py-2 rounded ${
                      isChecked ? "bg-light" : ""
                    }`}
                    style={{
                      cursor: "pointer",
                      border: "1px solid #e9ecef",
                    }}
                  >
                    {/* Avatar */}
                    <div
                      className="rounded-circle bg-light d-flex align-items-center justify-content-center border flex-shrink-0"
                      style={{ width: "42px", height: "42px" }}
                    >
                      {user.profile_image ? (
                        <img
                          src={user.profile_image}
                          alt={user.name}
                          className="rounded-circle w-100 h-100"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="text-muted"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.029 10 8 10c-2.03 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                        </svg>
                      )}
                    </div>

                    {/* Name + Email */}
                    <div className="flex-grow-1">
                      <div className="fw-semibold text-dark small">
                        {user.name}
                      </div>
                      <div
                        className="d-flex align-items-center gap-1 text-muted"
                        style={{ fontSize: "0.75rem" }}
                      >
                        <span
                          className="rounded-circle d-inline-block bg-primary flex-shrink-0"
                          style={{ width: "7px", height: "7px" }}
                        />
                        {user.email}
                      </div>
                    </div>

                    {/* Checkbox */}
                    <Input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleCompliance(user.alias)}
                      onClick={(e) => e.stopPropagation()}
                      className="form-check-input mt-0 flex-shrink-0 border-2"
                      style={{
                        width: "18px",
                        height: "18px",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button color="secondary" outline onClick={toggleModal}>
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={
              !selectedComplianceAliases.length || isCreatingAssignedCompliance
            }
            onClick={handleSaveAssignedCompliance}
          >
            {isCreatingAssignedCompliance ? (
              <>
                <Spinner size="sm" className="me-1" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </ModalFooter>
      </Modal>

      {/* ── Stage Tabs ── */}
      <Nav
        className="nav-primary d-flex justify-content-center align-items-center flex-wrap gap-1 pb-2 mb-4"
        pills
      >
        {TABS.map((tab) => (
          <NavItem
            key={tab.id}
            className="d-flex justify-content-center"
            style={{ flex: "1 1 auto", maxWidth: "250px", cursor: "pointer" }}
          >
            <NavLink
              className={`${activeStage === tab.id ? "active" : ""} m-2 border border-primary d-flex justify-content-center rounded p-2 text-center w-100`}
              onClick={() => setActiveStage(tab.id)}
              style={{ cursor: "pointer" }}
            >
              {tab.label}
            </NavLink>
          </NavItem>
        ))}
      </Nav>

      {/* ── Tab Content ── */}
      <div
        style={{
          border: "1px solid #dee2e6",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        {/* ── Date Pickers Row ── */}
        <Row className="g-3 mb-4">
          {DATE_FIELDS.map(({ field, label }) => (
            <Col key={field} xs={12} sm={6} lg={3}>
              <FormGroup className="mb-0">
                <Label
                  for={`${activeStage}_${field}`}
                  className="fw-medium text-muted small mb-1"
                >
                  {label}
                </Label>
                <Input
                  type="date"
                  bsSize="sm"
                  id={`${activeStage}_${field}`}
                  value={stageData[field] ?? ""}
                  onChange={(e) => handleDateChange(field, e.target.value)}
                  disabled={disabledFields.has(field)}
                />
              </FormGroup>
            </Col>
          ))}
        </Row>

        {/* ── Grades + Comments ── */}
        <div className="d-flex gap-4">
          <div style={{ flex: "1 1 280px", maxWidth: "300px" }}>
            <FormGroup className="mb-3">
              <Label
                for={`${activeStage}_admin_grade`}
                className="fw-medium text-muted small mb-1"
              >
                Admin Grade
              </Label>
              <Input
                type="select"
                bsSize="sm"
                id={`${activeStage}_admin_grade`}
                value={stageData.admin_grade ?? ""}
                onChange={(e) =>
                  handleFieldChange(
                    "admin_grade",
                    e.target.value === "" ? null : e.target.value,
                  )
                }
                disabled={disabledFields.has("admin_grade")}
              >
                {GRADE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Input>
            </FormGroup>

            <FormGroup className="mb-0">
              <Label
                for={`${activeStage}_advice_grade`}
                className="fw-medium text-muted small mb-1"
              >
                Adviser Grade
              </Label>
              <Input
                type="select"
                bsSize="sm"
                id={`${activeStage}_advice_grade`}
                value={stageData.advice_grade ?? ""}
                onChange={(e) =>
                  handleFieldChange(
                    "advice_grade",
                    e.target.value === "" ? null : e.target.value,
                  )
                }
                disabled={disabledFields.has("advice_grade")}
              >
                {GRADE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </div>

          <div style={{ flex: "3 1 320px" }}>
            <FormGroup className="mb-0">
              <Label
                for={`${activeStage}_comments`}
                className="fw-medium text-muted small mb-1"
              >
                Comments &amp; Any Remedial Action
              </Label>
              <Input
                type="textarea"
                id={`${activeStage}_comments`}
                value={stageData.comments ?? ""}
                onChange={(e) =>
                  handleFieldChange("comments", e.target.value || null)
                }
                className="form-control"
                style={{ minHeight: "120px", resize: "vertical" }}
                placeholder="Enter comments here..."
              />
            </FormGroup>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ComplianceRatingCard;
