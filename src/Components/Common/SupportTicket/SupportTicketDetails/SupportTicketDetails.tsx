import LoadingSpinner from "@/app/loading";
import {
  useFetchSupportTicketDetailsQuery,
  useUpdateSupportTicketMutation,
} from "@/Redux/Reducers/Common/SupportTicket/SupportTicketApi";
import { SupportTicketFormData } from "@/Types/Common/SupportTicket/SupportTicketTypes";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaCheck,
  FaChevronDown,
  FaDownload,
  FaExclamationCircle,
  FaFileAlt,
  FaSpinner,
} from "react-icons/fa";
import { TbCheck } from "react-icons/tb";
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
  Row,
} from "reactstrap";
import Swal from "sweetalert2";
import UpdateSupportTicketModal from "../Modals/UpdateSuppotTicketModal";
import SupportTicketComments from "./SupportTicketComments";

const SupportTicketDetails: React.FC = () => {
  const { supportticketalias } = useParams();
  const { data: session } = useSession();
  const userType = session?.user?.user_type;

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

  // image visibility state must be declared unconditionally (hooks order)
  const [showCreatorImage, setShowCreatorImage] = useState<boolean>(true);

  useEffect(() => {
    // reset image visibility when ticket/creator changes
    setShowCreatorImage(true);
  }, [ticketDetails?.created_by?.profile_image]);

  const statusOptions = [
    { value: "OPEN", label: "Open" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "COMPLETED", label: "Completed" },
    { value: "RESOLVED", label: "Resolved" },
  ];

  const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>(
    {},
  );

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

  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <LoadingSpinner />
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

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
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
    RESOLVED: <TbCheck />,
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
                    <h3 className="mb-0">
                      Subject:{" "}
                      <span className="text-capitalize">
                        {ticketDetails.subject}
                      </span>
                    </h3>
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
                        {getInitials(creatorName)}
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
                      {ticketDetails.created_at && (
                        <div className="text-muted small mt-1">
                          Created {formatDateAndTime(ticketDetails.created_at)}
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
                <Col xs="auto">
                  <div className="d-flex justify-content-end">
                    {ticketDetails.status ? (
                      userType === "ADMIN" ? (
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
                                {formatChoiceFieldValue(ticketDetails?.status)}
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
                                statusColorMap[option.value as TicketStatus] ||
                                "secondary";

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
                      ) : (
                        <Badge
                          color={
                            statusColorMap[
                              ticketDetails?.status as TicketStatus
                            ] ?? "dark"
                          }
                          className="d-flex justify-content-center align-items-center gap-1"
                        >
                          {statusIconMap[ticketDetails?.status as TicketStatus]}{" "}
                          <span style={{ marginTop: "2.5px" }}>
                            {formatChoiceFieldValue(ticketDetails?.status)}
                          </span>
                        </Badge>
                      )
                    ) : (
                      <small className="text-muted">Not Found</small>
                    )}
                  </div>
                  <div className="mt-1 bg-light-primary px-2 py-1 rounded-2">
                    <div className="small text-end text-muted fw-bold">
                      Ticket ID
                    </div>
                    <div className="text-end small">
                      {ticketDetails?.ticket_id}
                    </div>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Row>
            {/* Message Card */}
            <Col md={6} className="mb-3">
              <Card className="shadow-sm mb-4">
                <CardHeader className="bg-white">
                  <h5 className="mb-0">Ticket Description</h5>
                </CardHeader>
                <CardBody style={{ height: "200px", overflowY: "auto" }}>
                  <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                    {ticketDetails.message}
                  </p>
                </CardBody>
              </Card>
            </Col>
            <Col md={6} className="mb-3">
              {/* Attachments Card */}
              {ticketDetails.files && ticketDetails.files.length > 0 && (
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
                          (file?.ticket_file &&
                            String(file.ticket_file).split("/").pop()) ||
                          file?.alias ||
                          "Unknown file";
                        return (
                          <Col
                            key={file.alias || file.ticket_file || idx}
                            sm={12}
                            md={6}
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
                                      handleDownload(file.ticket_file, fileName)
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
