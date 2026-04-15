"use client";

import { useGetNotificationDetailsQuery } from "@/Redux/Reducers/Common/Notification/NotificationApi";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import Link from "next/link";
import { TbArrowBack } from "react-icons/tb";
import { Badge, Col, Container, Row, Spinner } from "reactstrap";

interface NotificationDetailsPageProps {
  params: {
    id: string;
  };
}

const NotificationDetailsPage = ({
  params: { id },
}: NotificationDetailsPageProps) => {
  const {
    data: notification,
    isLoading,
    isError,
  } = useGetNotificationDetailsQuery(id);

  const formatDataKey = (key: string) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  const renderDataValue = (value: unknown) => {
    if (value === null || value === undefined) {
      return "-";
    }

    if (typeof value === "object") {
      return (
        <pre
          className="mb-0 small text-muted"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }

    return String(value);
  };

  const dataEntries = notification?.data
    ? Object.entries(notification.data as Record<string, unknown>)
    : [];

  return (
    <Container fluid className="p-0">
      <Row className="align-items-center my-4">
        <Col xs="12" md="8">
          <div className="mb-2">
            <h4 className="mb-1">Notification details</h4>
            <p className="mb-0 text-muted">
              View the full message and metadata for this notification.
            </p>
          </div>
        </Col>
        <Col xs="12" md="4" className="text-md-end">
          <Link
            href="/notifications"
            className="btn btn-outline-secondary btn-sm"
          >
            <TbArrowBack className="me-1" />
            Back to notifications
          </Link>
        </Col>
      </Row>

      <Row>
        <Col xs="12">
          <div className="card shadow-sm">
            <div className="card-body">
              {isLoading ? (
                <div className="text-center py-5">
                  <Spinner color="primary" />
                </div>
              ) : isError || !notification ? (
                <div className="text-center py-5">
                  <h5 className="mb-2">Notification not found</h5>
                  <p className="text-muted mb-0">
                    We could not load details for this notification. Try
                    returning to the notification list.
                  </p>
                </div>
              ) : (
                <>
                  <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                    <div className="flex-grow-1">
                      <Badge
                        color={notification.is_read ? "success" : "warning"}
                        pill
                        className="mb-3"
                      >
                        {notification.is_read ? "Read" : "Unread"}
                      </Badge>
                      <h5 className="mb-2 text-capitalize">
                        {notification.notification_type?.replace(/_/g, " ")}
                      </h5>
                      <p className="mb-0 text-muted">{notification.message}</p>
                    </div>
                    <div className="text-md-end">
                      <div className="small text-muted">
                        <div>
                          Created: {formatDateAndTime(notification.created_at)}
                        </div>
                        <div>
                          Read:{" "}
                          {notification.read_at
                            ? formatDateAndTime(notification.read_at)
                            : "Not read yet"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {dataEntries.length > 0 && (
                    <div className="row g-3 mb-4">
                      {dataEntries.map(([key, value], index) => (
                        <div className="col-sm-6" key={`${key}-${index}`}>
                          <div className="border rounded p-3 h-100 bg-white">
                            <h6 className="mb-2">{formatDataKey(key)}</h6>
                            <p className="mb-0">{renderDataValue(value)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border rounded p-4 bg-light">
                    <h6 className="mb-3">Raw payload</h6>
                    <pre
                      className="mb-0 small text-muted"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {JSON.stringify(notification.data ?? {}, null, 2)}
                    </pre>
                  </div>
                </>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotificationDetailsPage;
