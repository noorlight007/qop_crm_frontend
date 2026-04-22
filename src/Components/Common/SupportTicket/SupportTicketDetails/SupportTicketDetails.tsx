import { LoadingSpinner2 } from "@/app/loading";
import {
  useFetchSupportTicketDetailsQuery,
  useUpdateSupportTicketMutation,
} from "@/Redux/Reducers/Common/SupportTicket/SupportTicketApi";
import { SupportTicketFormData } from "@/Types/Common/SupportTicket/SupportTicketTypes";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import {
  FaCheck,
  FaCheckCircle,
  FaChevronDown,
  FaDownload,
  FaExclamationCircle,
  FaFileAlt,
  FaRegQuestionCircle,
  FaSpinner,
} from "react-icons/fa";
import { TbChecks, TbCopy } from "react-icons/tb";
import { toast } from "react-toastify";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  PopoverBody,
  Row,
  Spinner,
  UncontrolledPopover,
} from "reactstrap";
import Swal from "sweetalert2";
import UpdateSupportTicketModal from "../Modals/UpdateSuppotTicketModal";
import SupportTicketComments from "./SupportTicketComments";

const SupportTicketDetails: React.FC = () => {
  const { supportticketalias } = useParams();
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const {
    data: ticketDetails,
    isLoading,
    isError,
    error,
  } = useFetchSupportTicketDetailsQuery(
    { ticket_alias: supportticketalias as string },
    { skip: !supportticketalias },
  );

  const [updateSupportTicket, { isLoading: updateSupTicketLoading }] =
    useUpdateSupportTicketMutation();

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const toggleUpdateModal = () => setIsUpdateModalOpen(!isUpdateModalOpen);
  const [ticketData, setTicketData] = useState<Partial<SupportTicketFormData>>({
    ticket_type: "",
    subject: "",
    message: "",
    files: [],
  });
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [messageDraft, setMessageDraft] = useState("");
  const [localMessage, setLocalMessage] = useState(
    ticketDetails?.message || "",
  );

  useEffect(() => {
    setLocalMessage(ticketDetails?.message || "");
  }, [ticketDetails?.message]);

  // image visibility state must be declared unconditionally (hooks order)
  const [showCreatorImage, setShowCreatorImage] = useState<boolean>(true);

  useEffect(() => {
    // reset image visibility when ticket/creator changes
    setShowCreatorImage(true);
  }, [ticketDetails?.created_by?.profile_image]);

  const statusOptions = [
    {
      value: "OPEN" as TicketStatus,
      label: "Open",
      description: "Ticket has been submitted and is awaiting action.",
    },
    {
      value: "IN_PROGRESS" as TicketStatus,
      label: "In Progress",
      description: "Ticket is currently being worked on by our team.",
    },
    {
      value: "COMPLETED" as TicketStatus,
      label: "Completed",
      description: "The issue has been fixed and is under review.",
    },
    {
      value: "RESOLVED" as TicketStatus,
      label: "Resolved",
      description: "The issue has been fixed and everything is working.",
    },
  ];

  const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>(
    {},
  );

  // copy ticket id state
  const [copiedTicketId, setCopiedTicketId] = useState(false);

  const handleCopyTicketId = () => {
    if (!ticketDetails?.ticket_id) return;
    const text = String(ticketDetails.ticket_id);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopiedTicketId(true);
          setTimeout(() => setCopiedTicketId(false), 2000);
        })
        .catch((err) => {
          console.error("Failed to copy ticket id:", err);
        });
    } else {
      // fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setCopiedTicketId(true);
        setTimeout(() => setCopiedTicketId(false), 2000);
      } catch (err) {
        console.error("Fallback copy failed:", err);
      }
      document.body.removeChild(textarea);
    }
  };

  const toggleDropdown = (ticketId: string) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [ticketId]: !prev[ticketId],
    }));
  };

  const handleStatusChange = async (ticketAlias: string, newStatus: string) => {
    try {
      await updateSupportTicket({
        ticket_alias: ticketAlias,
        payload: { status: newStatus },
      }).unwrap();

      Swal.fire("Success", "Status Updated Successfully!", "success");
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status. Please try again.");
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleEditMessage = () => {
    setMessageDraft(localMessage);
    setIsEditingMessage(true);
  };

  const handleCancelEditMessage = () => {
    setIsEditingMessage(false);
    setMessageDraft("");
  };

  const getErrorMessage = (err: any) => {
    if (!err) return "Unknown error";
    if (typeof err === "string") return err;
    if (typeof err?.data === "string") return err.data;

    const collect = (value: any): string[] => {
      if (value == null) return [];
      if (typeof value === "string") return [value];
      if (Array.isArray(value))
        return value.map((v) =>
          typeof v === "string" ? v : JSON.stringify(v),
        );
      if (typeof value === "object") {
        try {
          return Object.values(value).flatMap((v) => collect(v));
        } catch {
          return [String(value)];
        }
      }
      return [String(value)];
    };

    if (err?.data?.message) return String(err.data.message);

    if (err?.data && typeof err.data === "object") {
      const msgs = collect(err.data);
      if (msgs.length) return msgs.join(", ");
    }

    if (err?.error) return String(err.error);
    if (err?.message) {
      if (/status code/i.test(err.message)) return "Server returned an error";
      return String(err.message);
    }

    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  };

  const handleSaveMessage = async () => {
    try {
      await updateSupportTicket({
        ticket_alias: ticketDetails.alias,
        payload: { message: messageDraft },
      }).unwrap();
      setLocalMessage(messageDraft);
      setIsEditingMessage(false);
      Swal.fire("Success", "Message Updated Successfully!", "success");
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <LoadingSpinner2 />
      </div>
    );
  }

  if (isError) {
    return (
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <Alert
          color="danger"
          className="text-center"
          style={{ maxWidth: "500px" }}
        >
          <FaExclamationCircle className="h3 mb-3" />
          <h5 className="alert-heading">Error Loading Ticket</h5>
          <p className="mb-0">
            {(error as any)?.data?.message ||
              "Failed to load support ticket details"}
          </p>
        </Alert>
      </Container>
    );
  }
  const openUpdateModal = (ticketDetails: SupportTicketFormData) => {
    setTicketData(ticketDetails);
    toggleUpdateModal();
  };

  if (!ticketDetails) {
    return (
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <p className="text-muted">No ticket found</p>
      </Container>
    );
  }

  // Creator info (used for display under the subject)
  const _creator = ticketDetails.created_by as any;
  const creatorName =
    _creator?.name ||
    [
      _creator?.title,
      _creator?.first_name,
      _creator?.middle_name,
      _creator?.last_name,
    ]
      .filter(Boolean)
      .join(" ") ||
    "Unknown User";
  const creatorEmail = _creator?.email || "";
  const creatorUserType = _creator?.user_type || "USER";

  const getInitials = () => {
    const first_name = _creator?.first_name || "";
    const last_name = _creator?.last_name || "";
    return (
      first_name.charAt(0).toUpperCase() + last_name.charAt(0).toUpperCase() ||
      "U"
    );
  };

  type TicketStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED" | "RESOLVED";

  const statusColorMap: Record<TicketStatus, string> = {
    OPEN: "danger",
    IN_PROGRESS: "warning",
    COMPLETED: "info",
    RESOLVED: "success",
  };

  type Priority = "URGENT" | "MEDIUM" | "NORMAL" | "WHEN_POSSIBLE";

  const priorityColorMap: Record<Priority, string> = {
    URGENT: "danger",
    MEDIUM: "warning",
    NORMAL: "info",
    WHEN_POSSIBLE: "dark",
  };

  const statusIconMap: Record<TicketStatus, JSX.Element> = {
    OPEN: <FaExclamationCircle />,
    IN_PROGRESS: <FaSpinner />,
    COMPLETED: <FaCheck />,
    RESOLVED: <TbChecks size={14} />,
  };
  return (
    <>
      <Row>
        <Col>
          <div className="d-flex justify-content-end mb-3">
            <Button
              color="primary"
              className="d-flex justify-content-between align-content-center gap-2"
              onClick={() => openUpdateModal(ticketDetails)}
              title="Edit Ticket"
            >
              <i className="icon-pencil-alt pr-1"></i>
              <span>Edit Ticket Details</span>
            </Button>
          </div>
          {/* Header Card */}
          <Card className="shadow-sm mb-4">
            <CardBody className="p-4">
              <Row className="align-items-start">
                <Col>
                  <div className="d-flex align-items-center gap-2 flex-wrap mb-2 ">
                    <h4 className="mb-0">
                      <strong className="fs-5">Subject:</strong>{" "}
                      {ticketDetails.subject}
                    </h4>
                  </div>
                  <div className="d-flex flex-column ">
                    <span className="py-1">
                      Ticket Type:{" "}
                      <Badge
                        className={`me-1 ${
                          ticketDetails.ticket_type === "BUG_REPORT"
                            ? "bg-danger"
                            : ticketDetails.ticket_type === "FEATURE_REQUEST"
                              ? "bg-info"
                              : "bg-success"
                        }`}
                      >
                        {formatChoiceFieldValue(ticketDetails.ticket_type)}
                      </Badge>
                    </span>
                    <span className="py-1">
                      Priority:{" "}
                      <Badge
                        color={
                          priorityColorMap[
                            ticketDetails?.priority as Priority
                          ] ?? "dark"
                        }
                      >
                        {formatChoiceFieldValue(ticketDetails?.priority)}
                      </Badge>
                    </span>
                  </div>
                </Col>
                <Col>
                  {/* Created by (avatar + name + email + timestamp) */}
                  <div className="d-flex align-items-start gap-3">
                    {_creator?.profile_image && showCreatorImage ? (
                      <img
                        src={String(_creator.profile_image)}
                        alt={creatorName}
                        onError={() => setShowCreatorImage(false)}
                        className="rounded-circle"
                        style={{
                          width: 48,
                          height: 48,
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                        title={creatorName}
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                        style={{ width: 48, height: 48, fontSize: 14 }}
                        title={creatorName}
                      >
                        {getInitials()}
                      </div>
                    )}

                    <div style={{ minWidth: 0 }}>
                      <small className="text-muted">Created by</small>
                      <div
                        className="fw-medium text-truncate"
                        title={creatorName}
                      >
                        {creatorName}
                      </div>
                      {creatorEmail && (
                        <div className="text-muted small text-truncate">
                          {creatorEmail}
                        </div>
                      )}
                      {creatorUserType && (
                        <div
                          className="text-muted text-truncate"
                          style={{ fontSize: "9px" }}
                        >
                          ({formatChoiceFieldValue(creatorUserType)})
                        </div>
                      )}
                      {ticketDetails.created_at && (
                        <div className="text-muted small mt-1">
                          Created: {formatDateAndTime(ticketDetails.created_at)}
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
                <Col xs="auto">
                  <div className="d-flex justify-content-end">
                    {ticketDetails.status ? (
                      userRole === "SUPER_ADMIN" ? (
                        <div className="d-flex align-items-center gap-1">
                          <Dropdown
                            isOpen={dropdownOpen[ticketDetails.id] || false}
                            toggle={() => toggleDropdown(ticketDetails.id)}
                          >
                            <DropdownToggle
                              tag="span"
                              style={{ cursor: "pointer" }}
                              caret={false}
                            >
                              <Badge
                                color={
                                  statusColorMap[
                                    ticketDetails?.status as TicketStatus
                                  ] ?? "dark"
                                }
                                className="d-flex justify-content-center align-items-center gap-1"
                                style={{ cursor: "pointer" }}
                              >
                                {
                                  statusIconMap[
                                    ticketDetails?.status as TicketStatus
                                  ]
                                }
                                <span style={{ marginTop: "2.5px" }}>
                                  {formatChoiceFieldValue(
                                    ticketDetails?.status,
                                  )}
                                </span>
                                <FaChevronDown size={10} />
                              </Badge>
                            </DropdownToggle>
                            <DropdownMenu
                              className="shadow-sm py-2"
                              style={{ minWidth: "160px" }}
                            >
                              {statusOptions.map((option) => {
                                const isActive =
                                  ticketDetails.status === option.value;
                                const colorClass =
                                  statusColorMap[
                                    option.value as TicketStatus
                                  ] || "secondary";

                                return (
                                  <DropdownItem
                                    key={option.value}
                                    onClick={() =>
                                      handleStatusChange(
                                        ticketDetails.alias,
                                        option.value,
                                      )
                                    }
                                    className="d-flex align-items-center gap-3 px-3 py-2"
                                    active={isActive}
                                  >
                                    <span
                                      className={`rounded-circle bg-${colorClass}`}
                                      style={{
                                        width: "8px",
                                        height: "8px",
                                      }}
                                    />
                                    <span className={isActive ? "fw-bold" : ""}>
                                      {option.label}
                                    </span>
                                    {isActive && (
                                      <span className="ms-auto">
                                        <FaCheck />
                                      </span>
                                    )}
                                  </DropdownItem>
                                );
                              })}
                            </DropdownMenu>
                          </Dropdown>
                          <span
                            id="orgAdminSearch"
                            className="bg-secondary rounded d-inline-flex align-items-center justify-content-center"
                            style={{
                              cursor: "pointer",
                              width: "23px",
                              height: "23px",
                            }}
                          >
                            <FaRegQuestionCircle />
                          </span>

                          <>
                            <style>{`
                              .status-popover {
                                max-width: 380px !important;
                                width: 380px !important;
                              }
                            `}</style>

                            <UncontrolledPopover
                              placement="left"
                              target="orgAdminSearch"
                              trigger="hover"
                              popperClassName="status-popover"
                            >
                              <PopoverBody className="bg-white rounded text-dark p-3 small">
                                {statusOptions.map((status) => (
                                  <div
                                    key={status.value}
                                    className="d-flex align-items-start mb-2"
                                  >
                                    <span
                                      className={`me-2 text-${statusColorMap[status.value]}`}
                                    >
                                      {statusIconMap[status.value]}
                                    </span>
                                    <div>
                                      <strong
                                        className={`text-${statusColorMap[status.value]}`}
                                      >
                                        {status.label}:
                                      </strong>{" "}
                                      {status.description}
                                    </div>
                                  </div>
                                ))}
                              </PopoverBody>
                            </UncontrolledPopover>
                          </>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center gap-1 position-relative">
                          <Badge
                            color={
                              statusColorMap[
                                ticketDetails?.status as TicketStatus
                              ] ?? "dark"
                            }
                            className="d-flex justify-content-center align-items-center gap-1"
                          >
                            {
                              statusIconMap[
                                ticketDetails?.status as TicketStatus
                              ]
                            }{" "}
                            <span style={{ marginTop: "2.5px" }}>
                              {formatChoiceFieldValue(ticketDetails?.status)}
                            </span>
                          </Badge>

                          <span
                            id="orgAdminSearch"
                            className="bg-secondary rounded d-inline-flex align-items-center justify-content-center"
                            style={{
                              cursor: "pointer",
                              width: "23px",
                              height: "23px",
                            }}
                          >
                            <FaRegQuestionCircle style={{ fontSize: "12px" }} />
                          </span>

                          <>
                            <style>{`
                              .status-popover {
                                max-width: 380px !important;
                                width: 380px !important;
                              }
                            `}</style>

                            <UncontrolledPopover
                              placement="left"
                              target="orgAdminSearch"
                              trigger="hover"
                              popperClassName="status-popover"
                            >
                              <PopoverBody className="bg-white rounded text-dark p-3 small">
                                {statusOptions.map((status) => (
                                  <div
                                    key={status.value}
                                    className="d-flex align-items-start mb-2"
                                  >
                                    <span
                                      className={`me-2 text-${statusColorMap[status.value]}`}
                                    >
                                      {statusIconMap[status.value]}
                                    </span>
                                    <div>
                                      <strong
                                        className={`text-${statusColorMap[status.value]}`}
                                      >
                                        {status.label}:
                                      </strong>{" "}
                                      {status.description}
                                    </div>
                                  </div>
                                ))}
                              </PopoverBody>
                            </UncontrolledPopover>
                          </>
                        </div>
                      )
                    ) : (
                      <small className="text-muted">Not Found</small>
                    )}
                  </div>
                  <div className="mt-1 bg-light-primary px-2 py-1 rounded-2">
                    <div className="small text-end text-muted fw-bold">
                      Ticket ID
                    </div>
                    <div className="text-end d-flex align-items-center justify-content-end gap-1">
                      <span className="small">{ticketDetails?.ticket_id}</span>
                      <span
                        role="button"
                        style={{ cursor: "pointer" }}
                        onClick={handleCopyTicketId}
                        title={copiedTicketId ? "Copied" : "Copy Ticket ID"}
                      >
                        {copiedTicketId ? (
                          <FaCheckCircle className="text-success" />
                        ) : (
                          <TbCopy className="text-secondary" />
                        )}
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Row>
            {/* Message Card */}
            <Col md={8} className="mb-3">
              <Card className="shadow-sm mb-4">
                <CardHeader className="bg-white d-flex align-items-center justify-content-between">
                  <h5 className="mb-0">Ticket Description</h5>
                  {!isEditingMessage && (
                    <Button
                      color="primary"
                      size="sm"
                      onClick={handleEditMessage}
                      disabled={isLoading}
                    >
                      <i className="icon-pencil-alt me-1" /> Edit
                    </Button>
                  )}
                </CardHeader>
                <CardBody style={{ height: "200px", overflowY: "auto" }}>
                  {isEditingMessage ? (
                    <>
                      <Input
                        type="textarea"
                        value={messageDraft}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setMessageDraft(e.target.value)
                        }
                        rows={5}
                        style={{ resize: "none", height: "120px" }}
                      />
                      <div className="mt-2 text-end">
                        <Button
                          color="primary"
                          size="sm"
                          onClick={handleSaveMessage}
                          disabled={updateSupTicketLoading}
                        >
                          {updateSupTicketLoading ? (
                            <Spinner size="sm" />
                          ) : (
                            "Save"
                          )}
                        </Button>{" "}
                        <Button
                          color="secondary"
                          size="sm"
                          onClick={handleCancelEditMessage}
                          disabled={updateSupTicketLoading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                      {localMessage || (
                        <span className="text-muted">
                          No description available
                        </span>
                      )}
                    </p>
                  )}
                </CardBody>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              {/* Attachments Card */}
              {ticketDetails.files && ticketDetails.files.length > 0 ? (
                <Card className="shadow-sm">
                  <CardHeader className="bg-white">
                    <h5 className="mb-0">
                      Attachments({ticketDetails.files.length})
                    </h5>
                  </CardHeader>
                  <CardBody style={{ height: "200px", overflowY: "auto" }}>
                    <Row>
                      {ticketDetails.files.map((file: any, idx: number) => {
                        const fileName =
                          (file?.file && String(file.file).split("/").pop()) ||
                          file?.alias ||
                          "Unknown file";
                        return (
                          <Col
                            key={file.alias || file.file || idx}
                            sm={12}
                            className="mb-3"
                          >
                            <Card className="border h-100">
                              <CardBody
                                className="d-flex align-items-center p-3"
                                style={{ gap: "12px" }}
                              >
                                <div className="flex-shrink-0">
                                  <FaFileAlt
                                    className="text-muted"
                                    style={{ fontSize: "1.5rem" }}
                                  />
                                </div>
                                <div
                                  className="flex-grow-1"
                                  style={{ minWidth: 0, overflow: "hidden" }}
                                >
                                  <p
                                    className="mb-0 fw-medium text-truncate"
                                    style={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {fileName}
                                  </p>
                                  <small className="text-muted">
                                    Click to download
                                  </small>
                                </div>
                                <div className="flex-shrink-0">
                                  <Button
                                    color="primary"
                                    outline
                                    size="sm"
                                    onClick={() =>
                                      handleDownload(file.file, fileName)
                                    }
                                    title="Download file"
                                  >
                                    <FaDownload />
                                  </Button>
                                </div>
                              </CardBody>
                            </Card>
                          </Col>
                        );
                      })}
                    </Row>
                  </CardBody>
                </Card>
              ) : (
                <Card className="shadow-sm">
                  <CardHeader className="bg-white">
                    <h5 className="mb-0">Attachments</h5>
                  </CardHeader>
                  <CardBody
                    className="d-flex align-items-center justify-content-center"
                    style={{ height: "200px" }}
                  >
                    <p className="text-muted mb-0">No attachments found.</p>
                  </CardBody>
                </Card>
              )}
            </Col>
          </Row>

          {/* Comments Card */}
          <Card className="shadow-sm mb-4">
            <CardHeader className="bg-white">
              <h5 className="mb-0">Comments</h5>
            </CardHeader>
            <CardBody>
              <SupportTicketComments />
            </CardBody>
          </Card>
        </Col>
      </Row>
      <UpdateSupportTicketModal
        isOpen={isUpdateModalOpen}
        toggle={toggleUpdateModal}
        onSave={() => {
          toggleUpdateModal();
        }}
        selected={ticketData}
      />
    </>
  );
};

export default SupportTicketDetails;
