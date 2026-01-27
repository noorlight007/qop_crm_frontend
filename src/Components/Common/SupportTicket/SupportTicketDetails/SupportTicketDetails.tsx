import LoadingSpinner from "@/app/loading";
import { useFetchSupportTicketDetailsQuery } from "@/Redux/Reducers/Common/SupportTicket/SupportTicketApi";
import { SupportTicketFormData } from "@/Types/Common/SupportTicket/SupportTicketTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  FaDownload,
  FaExclamationCircle,
  FaFileAlt,
  FaSpinner,
} from "react-icons/fa";
import { TbCheck } from "react-icons/tb";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
} from "reactstrap";
import UpdateSupportTicketModal from "../Modals/UpdateSuppotTicketModal";

const SupportTicketDetails: React.FC = () => {
  const { supportticketalias } = useParams();

  const {
    data: ticketDetails,
    isLoading,
    isError,
    error,
  } = useFetchSupportTicketDetailsQuery(
    { ticket_alias: supportticketalias as string },
    { skip: !supportticketalias },
  );

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const toggleUpdateModal = () => setIsUpdateModalOpen(!isUpdateModalOpen);
  const [ticketData, setTicketData] = useState<Partial<SupportTicketFormData>>({
    ticket_type: "",
    subject: "",
    message: "",
    files: [],
  });

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

  type TicketStatus = "OPEN" | "IN_REVIEW" | "RESOLVED";

  const statusColorMap: Record<TicketStatus, string> = {
    OPEN: "danger",
    IN_REVIEW: "warning",
    RESOLVED: "success",
  };

  const statusIconMap: Record<TicketStatus, JSX.Element> = {
    OPEN: <FaExclamationCircle />,
    IN_REVIEW: <FaSpinner />,
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
                  <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
                    <h3 className="mb-0">Subject: {ticketDetails.subject}</h3>
                  </div>
                  <small>
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
                  </small>
                </Col>
                <Col xs="auto">
                  <div className="d-flex justify-content-end">
                    {ticketDetails.status ? (
                      <span>
                        <Badge
                          color={
                            statusColorMap[
                              ticketDetails?.status as TicketStatus
                            ] ?? "dark"
                          }
                          className="d-flex justify-content-center align-items-center gap-1"
                        >
                          {statusIconMap[ticketDetails?.status as TicketStatus]}{" "}
                          {formatChoiceFieldValue(ticketDetails?.status)}
                        </Badge>
                      </span>
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

          {/* Message Card */}
          <Card className="shadow-sm mb-4">
            <CardHeader className="bg-white">
              <h5 className="mb-0">Message</h5>
            </CardHeader>
            <CardBody>
              <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                {ticketDetails.message}
              </p>
            </CardBody>
          </Card>

          {/* Attachments Card */}
          {ticketDetails.files && ticketDetails.files.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="bg-white">
                <h5 className="mb-0">
                  Attachments ({ticketDetails.files.length})
                </h5>
              </CardHeader>
              <CardBody>
                <Row>
                  {ticketDetails.files.map((file: any) => {
                    const fileName =
                      file.ticket_file.split("/").pop() || "Unknown file";
                    return (
                      <Col key={file.alias} sm={12} md={6} className="mb-3">
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
