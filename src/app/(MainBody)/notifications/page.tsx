"use client";

import {
  useGetNotificationsQuery,
  useGetUnreadNotificationsCountQuery,
  useMakeAllNotificationsReadMutation,
  useReadNotificationMutation,
} from "@/Redux/Reducers/Common/Notification/NotificationApi";
import { UINotification } from "@/Types/Common/Notification/NotificationType";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import { getNotificationTargetUrl } from "@/utils/notificationRedirect";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TbRefresh } from "react-icons/tb";
import {
  Badge,
  Button,
  Col,
  Container,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Spinner,
} from "reactstrap";

const NotificationsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionData, setSessionData] = useState<Session | null>(null);
  const pageSize = 12;
  const [makeAllNotificationsRead, { isLoading: isMarkingAllRead }] =
    useMakeAllNotificationsReadMutation();
  const [readNotification] = useReadNotificationMutation();

  const { data: unreadData, refetch: refetchUnreadCount } =
    useGetUnreadNotificationsCountQuery(undefined, {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    });

  const {
    data: notifications,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetNotificationsQuery(
    { page: currentPage, page_size: pageSize },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const totalCount = notifications?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const session = await getSession();
        if (mounted) {
          setSessionData(session);
        }
      } catch {
        if (mounted) {
          setSessionData(null);
        }
      }
    };

    void loadSession();

    return () => {
      mounted = false;
    };
  }, []);

  const getTruncatedMessage = (message: string) => {
    const words = message.trim().split(/\s+/);
    if (words.length <= 20) return message;
    return `${words.slice(0, 20).join(" ")}...`;
  };

  const handleMakeAllRead = async () => {
    try {
      await makeAllNotificationsRead(undefined).unwrap();
      await refetch();
    } catch {
      // Keep page stable even if mark-all-read fails.
      console.warn("Failed to mark all notifications as read");
    }
  };

  const handleReadNotification = async (item: UINotification) => {
    if (item.is_read) return;

    try {
      await readNotification({
        id: item.id,
        payload: { is_read: true },
      }).unwrap();
      void refetchUnreadCount();
    } catch {
      // Navigation should not be blocked if read state sync fails.
      console.warn(`Failed to mark notification ${item.id} as read`);
    }
  };

  return (
    <Container fluid className="p-0">
      <Row className="align-items-center my-4">
        <Col xs="12" md="8">
          <div className="mb-2">
            <h4 className="mb-1">Notifications</h4>
            <p className="mb-0 text-muted">
              Review everything sent to your account. Click any notification for
              full details.
            </p>
          </div>
        </Col>
      </Row>

      <Row>
        <Col xs="12">
          <div className="card shadow-sm">
            <div className="card-header d-flex align-items-center justify-content-between">
              <div>
                <h5 className="mb-1">All notifications</h5>
              </div>
              <div className="d-flex gap-2">
                <Button
                  color="outline-secondary"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isFetching}
                >
                  <TbRefresh className="me-1" />
                  {isFetching ? "Refreshing..." : "Refresh"}
                </Button>
                <Button
                  color="primary"
                  size="sm"
                  onClick={handleMakeAllRead}
                  disabled={
                    isLoading ||
                    isMarkingAllRead ||
                    unreadData?.unread_count === 0
                  }
                >
                  {isMarkingAllRead ? "Reading..." : "Make All Read"}
                </Button>
              </div>
            </div>
            <div className="card-body">
              {isLoading ? (
                <div className="text-center py-5">
                  <Spinner color="primary" />
                </div>
              ) : isError ? (
                <div className="text-center py-5">
                  <p className="mb-2">
                    Unable to load notifications right now.
                  </p>
                  <p className="text-muted mb-0">Please try again later.</p>
                </div>
              ) : notifications?.results?.length === 0 ? (
                <div className="text-center py-5">
                  <h6 className="mb-2">No notifications yet</h6>
                  <p className="text-muted mb-0">
                    Notifications will appear here as soon as they arrive.
                  </p>
                </div>
              ) : (
                <>
                  <ul className="list-group list-group-flush">
                    {notifications?.results?.map((item: UINotification) => (
                      <li
                        key={item.id}
                        className="list-group-item border-b-light-primary p-0 mb-3"
                      >
                        <Link
                          href={getNotificationTargetUrl(item, sessionData)}
                          className="text-decoration-none text-reset"
                          onClick={() => {
                            void handleReadNotification(item);
                          }}
                        >
                          <div className="d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-start">
                            <div className="flex-grow-1">
                              <h6 className="mb-1 fw-semibold">
                                {item.notification_type}
                              </h6>
                              <p className="mb-0 text-muted">
                                {getTruncatedMessage(item.message)}
                              </p>
                            </div>
                            <div className="text-sm-end text-nowrap">
                              <Badge
                                color={item.is_read ? "primary" : "warning"}
                                className="mb-2"
                              >
                                {item.is_read ? "Read" : "New"}
                              </Badge>
                              <div className="small text-muted">
                                {formatDateAndTime(item.created_at)}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {totalCount > pageSize && (
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 gap-3">
                      <div className="text-muted">
                        Showing{" "}
                        {Math.min((currentPage - 1) * pageSize + 1, totalCount)}{" "}
                        to {Math.min(currentPage * pageSize, totalCount)} of{" "}
                        {totalCount}
                      </div>
                      <Pagination className="mb-0">
                        <PaginationItem disabled={currentPage === 1}>
                          <PaginationLink
                            first
                            onClick={() => setCurrentPage(1)}
                          />
                        </PaginationItem>
                        <PaginationItem disabled={currentPage === 1}>
                          <PaginationLink
                            previous
                            onClick={() => setCurrentPage(currentPage - 1)}
                          />
                        </PaginationItem>
                        {Array.from(
                          { length: totalPages },
                          (_, index) => index + 1,
                        ).map((pageNumber) => (
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
                        <PaginationItem disabled={currentPage === totalPages}>
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
                  )}
                </>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotificationsPage;
