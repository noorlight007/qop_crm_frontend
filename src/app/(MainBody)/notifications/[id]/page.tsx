"use client";

import { useGetNotificationDetailsQuery } from "@/Redux/Reducers/Common/Notification/NotificationApi";
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
                    <div>
                      <h5 className="mb-2">{notification.name}</h5>
                      {/* <p className="mb-0 text-muted">{notification.message}</p> */}
                    </div>
                    <div className="text-md-end">
                      <Badge color={notification.dotColor} className="mb-2">
                        {notification.dotColor === "primary"
                          ? "Unread"
                          : "Read"}
                      </Badge>
                      <div className={`text-${notification.fontColor} small`}>
                        <div>{notification.date}</div>
                        <div>{notification.time}</div>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-sm-6">
                      <div className="border rounded p-3 h-100">
                        <h6 className="mb-2">Notification ID</h6>
                        <p className="mb-0 text-break">{notification.id}</p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="border rounded p-3 h-100">
                        <h6 className="mb-2">Status</h6>
                        <p className="mb-0 text-capitalize">
                          {notification.dotColor === "primary"
                            ? "Unread"
                            : "Read"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded p-4 mb-4 bg-light-primary">
                    <h6 className="mb-3">Message</h6>
                    <p className="mb-0">{notification.message}</p>
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
