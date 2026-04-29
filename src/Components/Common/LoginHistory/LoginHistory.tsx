import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";
import { useGetLoginHistoryQuery } from "@/Redux/Reducers/Common/LoginHistory/LoginHistoryApi";
import { LoginHistoryItem } from "@/Types/Common/LoginHistory/LoginHistoryTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaClock, FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import {
  Badge,
  Card,
  CardBody,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
} from "reactstrap";

const LoginHistory: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  // track elapsed time while a fetch is in-flight
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  // countdown (in seconds) until the next polling refresh
  const [nextRefreshIn, setNextRefreshIn] = useState<number | null>(null);
  const timeInterval = 20000; // 20 seconds

  const formatSeconds = (seconds: number | null) => {
    if (seconds === null || Number.isNaN(seconds)) return "--";
    const safeSeconds = Math.max(0, Math.floor(seconds));
    return `${String(safeSeconds).padStart(2, "0")}s`;
  };

  const {
    data: loginHistoryData,
    isLoading,
    isFetching,
    fulfilledTimeStamp,
  } = useGetLoginHistoryQuery(
    { page: currentPage },
    {
      pollingInterval: timeInterval,
    },
  );

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

  // keep an interval running while we fetch to show elapsed time
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isFetching) {
      const start = Date.now();
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - start) / 1000));
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isFetching]);

  // countdown until the next poll based on the last successful fetch time
  useEffect(() => {
    if (!fulfilledTimeStamp) {
      setNextRefreshIn(null);
      return;
    }

    const tick = () => {
      if (isFetching) {
        setNextRefreshIn(0);
        return;
      }

      const elapsedSinceFulfilled = Date.now() - fulfilledTimeStamp;
      const remainingMs = Math.max(0, timeInterval - elapsedSinceFulfilled);
      setNextRefreshIn(Math.ceil(remainingMs / 1000));
    };

    tick();
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, [fulfilledTimeStamp, isFetching, timeInterval]);

  // Pagination logic from API
  const totalCount = loginHistoryData?.count || 0;
  const currentResults = loginHistoryData?.results || [];
  const hasNextPage = !!loginHistoryData?.next;
  const hasPreviousPage = !!loginHistoryData?.previous;
  const pageSize = 12;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  if (isLoading) {
    return (
      <Card className="border-0 shadow h-100">
        <CardBody className="p-4">
          <div className="d-flex align-items-center mb-4">
            <div className="bg-light-primary bg-opacity-10 p-3 rounded-3 me-3 position-relative">
              <i
                className="fa fa-history text-primary fs-4"
                style={{
                  animation: isFetching ? "rotate360 0.6s ease-in-out" : "none",
                }}
              ></i>
              <small
                className="position-absolute top-0 end-1 translate-middle bg-primary text-white rounded-circle px-1"
                style={{ fontSize: "0.6rem" }}
              >
                {formatSeconds(nextRefreshIn)}
              </small>
            </div>
            <div>
              <h4 className="mb-0 fw-bold text-dark">Login History</h4>
            </div>
          </div>
          <div className="text-center py-5">
            <div className="text-center py-5">
              <LoadingGrow />
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
            <div className="bg-light-primary bg-opacity-10 p-3 rounded-3 me-3 position-relative">
              <i
                className="fa fa-history text-primary fs-4"
                style={{
                  animation: isFetching ? "rotate360 0.6s ease-in-out" : "none",
                }}
              ></i>
              <small
                className="position-absolute top-0 end-1 translate-middle bg-primary text-white rounded-circle px-1"
                style={{ fontSize: "0.6rem" }}
              >
                {formatSeconds(nextRefreshIn)}
              </small>
            </div>
            <div>
              <h4 className="mb-0 fw-bold text-dark">Login History</h4>
              <small className="text-muted">
                Recent authentication activity
              </small>
            </div>
          </div>
        </div>

        {/* Login History Items */}
        <div
          className="login-history-container"
          style={{
            maxHeight: "700px",
            overflowY: "auto",
            overflowX: "hidden",
            paddingRight: "8px",
          }}
        >
          {loginHistoryData?.results && loginHistoryData.results.length > 0 ? (
            currentResults?.map((history: LoginHistoryItem, index: number) => {
              const badge = getStatusBadge(history.status);
              const icon = getDeviceIcon(history.device_type);

              return (
                <div
                  key={index}
                  className={`login-history-item mt-1 mb-3 p-0 border rounded-4 overflow-hidden position-relative transition-all ${
                    history.status === "SUCCESS"
                      ? "border-success"
                      : "border-danger"
                  } shadow-sm bg-white`}
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
                            {history.user.name ||
                              history.user.alias ||
                              "Unknown User"}
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
                            {formatChoiceFieldValue(history.status) ||
                              "Unknown"}
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
                      </div>
                    </div>

                    <Row>
                      <Col md="4">
                        <Card className="mb-0 shadow">
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
                        <Card className="mb-0 shadow">
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
                        <Card className="mb-0 shadow">
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
            })
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

        {/* Pagination Section */}
        {totalCount > pageSize && (
          <Row className="mt-4">
            <div className="d-flex justify-content-between align-items-center p-3">
              <div className="px-2">
                <p className="text-primary mb-0">
                  Showing{" "}
                  {totalCount === 0 ? "0" : (currentPage - 1) * pageSize + 1} to{" "}
                  {currentResults.length === 0
                    ? 0
                    : (currentPage - 1) * pageSize + currentResults.length}{" "}
                  of {totalCount} Records
                </p>
              </div>
              <Pagination className="d-flex justify-content-end p-2 mb-0">
                <PaginationItem disabled={currentPage === 1}>
                  <PaginationLink first onClick={() => setCurrentPage(1)} />
                </PaginationItem>
                <PaginationItem disabled={!hasPreviousPage}>
                  <PaginationLink
                    previous
                    onClick={() => setCurrentPage(currentPage - 1)}
                  />
                </PaginationItem>

                {totalPages <= 7 ? (
                  Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNumber) => (
                      <PaginationItem
                        key={pageNumber}
                        active={pageNumber === currentPage}
                      >
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )
                ) : (
                  <>
                    <PaginationItem active={currentPage === 1}>
                      <PaginationLink onClick={() => setCurrentPage(1)}>
                        1
                      </PaginationLink>
                    </PaginationItem>

                    {currentPage > 3 && (
                      <PaginationItem disabled>
                        <PaginationLink>...</PaginationLink>
                      </PaginationItem>
                    )}

                    {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                      .filter(
                        (pageNumber) =>
                          pageNumber > 1 && pageNumber < totalPages,
                      )
                      .map((pageNumber) => (
                        <PaginationItem
                          key={pageNumber}
                          active={pageNumber === currentPage}
                        >
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                    {currentPage < totalPages - 2 && (
                      <PaginationItem disabled>
                        <PaginationLink>...</PaginationLink>
                      </PaginationItem>
                    )}

                    <PaginationItem active={currentPage === totalPages}>
                      <PaginationLink
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem disabled={!hasNextPage}>
                  <PaginationLink
                    next
                    onClick={() => setCurrentPage(currentPage + 1)}
                  />
                </PaginationItem>
                <PaginationItem disabled={currentPage === totalPages}>
                  <PaginationLink
                    last
                    onClick={() => setCurrentPage(totalPages)}
                  />
                </PaginationItem>
              </Pagination>
            </div>
          </Row>
        )}
      </CardBody>
    </Card>
  );
};

export default LoginHistory;
