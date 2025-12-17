import { useGetLoginHistoryQuery } from "@/Redux/Reducers/CommonComponents/LoginHistory/LoginHistoryApi";
import formatChoiceFieldValue from "@/utils/formatters";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { FaClock, FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import { Badge, Card, CardBody, Col, Row } from "reactstrap";

interface LoginHistoryItem {
  id?: number;
  user: {
    id: number;
    alias: string;
    name: string;
    email: string;
    phone: string;
    profile_image: string;
    user_type: string;
  };
  ip_address: string;
  device_type: string;
  browser_name: string;
  os: string;
  status: "SUCCESS" | "FAILED" | string;
  logged_in_at: string;
}

const LoginHistory: React.FC = () => {
  const { data: loginHistoryData, isLoading } =
    useGetLoginHistoryQuery(undefined);

  const getStatusBadge = (status: string) => {
    if (status === "SUCCESS") {
      return {
        icon: "✓",
      };
    } else if (status === "FAILED") {
      return {
        icon: "✕",
      };
    }
    return {
      className: "badge bg-light-secondary text-secondary",
      icon: "?",
    };
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType?.toUpperCase()) {
      case "MOBILE":
        return "📱";
      case "TABLET":
        return "📱";
      case "PC":
        return "🖥️";
      default:
        return "💻";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow h-100">
        <CardBody className="p-4">
          <div className="d-flex align-items-center mb-4">
            <div className="bg-primary bg-opacity-10 p-3 rounded-3 me-3">
              <i className="fa fa-history text-primary fs-4"></i>
            </div>
            <h4 className="mb-0 fw-bold text-dark">Login History</h4>
          </div>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow h-100">
      <CardBody className="p-4">
        {/* Header Section */}
        <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
          <div className="d-flex align-items-center">
            <div className="bg-light-primary bg-opacity-10 p-3 rounded-3 me-3">
              <i className="fa fa-history text-primary fs-4"></i>
            </div>
            <div>
              <h4 className="mb-0 fw-bold text-dark">Login History</h4>
              <small className="text-muted">
                Recent authentication activity
              </small>
            </div>
          </div>
          {loginHistoryData && loginHistoryData.length > 0 && (
            <Badge color="primary" pill className="px-3 py-2">
              {loginHistoryData.length}{" "}
              {loginHistoryData.length === 1 ? "Record" : "Records"}
            </Badge>
          )}
        </div>

        {/* Login History Items */}
        <div
          className="login-history-container"
          style={{
            maxHeight: "500px",
            overflowY: "auto",
            overflowX: "hidden",
            paddingRight: "8px",
          }}
        >
          {loginHistoryData && loginHistoryData.length > 0 ? (
            loginHistoryData?.map(
              (history: LoginHistoryItem, index: number) => {
                const badge = getStatusBadge(history.status);
                const icon = getDeviceIcon(history.device_type);

                return (
                  <div
                    key={index}
                    className={`login-history-item mb-3 p-0 border rounded-4 overflow-hidden position-relative transition-all`}
                    style={{
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 16px rgba(0,0,0,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {/* Status Indicator Bar */}
                    <div
                      className={`${
                        history.status === "SUCCESS"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                      style={{ height: "4px" }}
                    ></div>

                    <div className="p-3">
                      {/* User Info Section */}
                      <div className="d-flex align-items-start mb-3">
                        <div className="position-relative me-3">
                          {history.user?.profile_image ? (
                            <Image
                              src={history.user.profile_image}
                              alt={history.user.name || "User"}
                              width={50}
                              height={50}
                              className="object-fit-cover rounded-circle shadow-sm"
                            />
                          ) : (
                            <div
                              className="rounded-circle shadow-sm bg-light-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                              style={{ width: "50px", height: "50px" }}
                            >
                              <i className="fa fa-user text-primary"></i>
                            </div>
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center justify-content-between mb-1">
                            <h6 className="mb-0 fw-bold text-dark">
                              {history.user.name || history.user.alias || "Unknown User"}
                            </h6>
                            <Badge
                              color={
                                history.status === "SUCCESS"
                                  ? "success"
                                  : "danger"
                              }
                              className={`${badge.className} p-2 shadow `}
                            >
                              {badge.icon}{" "}
                              {formatChoiceFieldValue(history.status) || "Unknown"}
                            </Badge>
                          </div>
                          <div className="d-flex flex-wrap gap-2 mb-2">
                            <small className="text-muted d-flex align-items-center">
                              <i className="fa fa-envelope me-1"></i>
                              {history.user.email || "Not Provided"}
                            </small>
                            {history.user.phone && (
                              <small className="text-muted d-flex align-items-center">
                                <i className="fa fa-phone me-1"></i>
                                {history.user.phone || "Not Provided"}
                              </small>
                            )}
                          </div>
                          <Badge
                            color="info"
                            className="bg-opacity-10 text-info border border-info px-2 py-1"
                            style={{ fontSize: "0.7rem" }}
                          >
                            {formatChoiceFieldValue(history.user.user_type) ||
                              "Not Found"}
                          </Badge>
                        </div>
                      </div>

                      <Row>
                        <Col md="4">
                          <Card className="mb-0">
                            <CardBody className="d-flex align-items-center gap-3 bg-light-dark rounded">
                              <div className="bg-white rounded-3 p-2 shadow-sm d-flex align-items-center justify-content-center">
                                <span>{icon}</span>
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="mb-1 fw-bold text-dark text-capitalize">
                                  {history.device_type || "Unknown Device"}
                                </h6>
                                <small className="text-muted d-flex align-items-center">
                                  <FaGlobe className="me-1" />
                                  {history.browser_name || "Unknown"} •{" "}
                                  {history.os || "Unknown"}
                                </small>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col md="4">
                          <Card className="mb-0">
                            <CardBody className="d-flex align-items-center gap-3 bg-light-dark rounded">
                              <div className="bg-white rounded-2 p-2 me-2">
                                <FaMapMarkerAlt className="text-primary" />
                              </div>
                              <div>
                                <small
                                  className="text-muted d-block"
                                  style={{ fontSize: "0.7rem" }}
                                >
                                  IP Address
                                </small>
                                <small className="fw-semibold text-dark">
                                  {history.ip_address || "Unknown"}
                                </small>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col md="4">
                          <Card className="mb-0">
                            <CardBody className="d-flex align-items-center gap-3 bg-light-dark rounded">
                              <div className="bg-white rounded-2 p-2 me-2">
                                <FaClock className="text-info" />
                              </div>
                              <div>
                                <small
                                  className="text-muted d-block"
                                  style={{ fontSize: "0.7rem" }}
                                >
                                  Login Time
                                </small>
                                <small className="fw-semibold text-dark">
                                  {formatDate(history.logged_in_at) || "Unknown"}
                                </small>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  </div>
                );
              }
            )
          ) : (
            <div className="text-center py-5">
              <div className="bg-light-dark rounded-circle p-4 d-inline-flex mb-3">
                <i
                  className="fa fa-history text-muted"
                  style={{ fontSize: "3rem" }}
                ></i>
              </div>
              <h6 className="text-muted mb-2">No Login History</h6>
              <p className="text-muted small mb-0">
                No authentication records found
              </p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default LoginHistory;
