import SVG from '@/CommonComponent/SVG';
import { notificationData } from '@/Data/Layout/HeaderData';
import {
  useGetNotificationsQuery,
  useGetUnreadNotificationsCountQuery,
  useMakeAllNotificationsReadMutation,
  useReadNotificationMutation,
} from '@/Redux/Reducers/Common/Notification/NotificationApi';
import { Notification } from '@/Types/Common/Notification/NotificationType';
import { formatDate, formatTime } from '@/utils/dateAndTimeFormatter';
import { getNotificationTargetUrl } from '@/utils/notificationRedirect';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import {
  Badge,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
} from 'reactstrap';

const isNotification = (value: unknown): value is Notification =>
  typeof value === 'object' &&
  value !== null &&
  'id' in value &&
  'message' in value;

const readList = (data: unknown): Notification[] => {
  if (Array.isArray(data)) {
    return data.filter(isNotification);
  }

  if (typeof data === 'object' && data !== null) {
    const source = data as Record<string, unknown>;
    const candidate = source.results ?? source.notifications ?? source.data;

    if (Array.isArray(candidate)) {
      return candidate.filter(isNotification);
    }
  }

  return [];
};

const readUnreadCount = (data: unknown): number => {
  if (typeof data === 'number') return data;
  if (typeof data !== 'object' || data === null) return 0;

  const source = data as Record<string, unknown>;
  const count = source.unread_count ?? source.unreadCount ?? source.count;
  return typeof count === 'number' ? count : 0;
};

const socketUrlsFromApiBase = (baseUrl: string, token: string) => {
  const normalizedBase =
    baseUrl.startsWith('http://') || baseUrl.startsWith('https://')
      ? baseUrl
      : `https://${baseUrl}`;
  const parsed = new URL(normalizedBase);
  const wsProtocol = parsed.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsBase = `${wsProtocol}//${parsed.host}`;
  const pathPrefix = parsed.pathname.replace(/\/+$/, '');

  const candidates = [
    `${wsBase}/ws/notifications/?token=${encodeURIComponent(token)}`,
    `${wsBase}${pathPrefix}/ws/notifications/?token=${encodeURIComponent(token)}`,
  ];

  const unique: string[] = [];
  const seen: Record<string, true> = {};

  for (let i = 0; i < candidates.length; i += 1) {
    const url = candidates[i];
    if (!seen[url]) {
      seen[url] = true;
      unique.push(url);
    }
  }

  return unique;
};

// Negative ids mark client-side fallback notifications that never sync to the API.
const isFallbackNotification = (item: Notification) => item.id < 0;

const NOTIFICATIONS_LIMIT = 4;

const NotificationHeader = () => {
  const [show, setShow] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const wrapperRef = useRef<HTMLLIElement>(null);

  const { data: notificationsData, refetch: refetchNotifications } =
    useGetNotificationsQuery(undefined, {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    });

  const { data: unreadData, refetch: refetchUnreadCount } =
    useGetUnreadNotificationsCountQuery(undefined, {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    });

  const [makeAllNotificationsRead, { isLoading: isMarkingAllRead }] =
    useMakeAllNotificationsReadMutation();
  const [readNotification] = useReadNotificationMutation();

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

  useEffect(() => {
    setItems(readList(notificationsData));
  }, [notificationsData]);

  useEffect(() => {
    setUnreadCount(readUnreadCount(unreadData));
  }, [unreadData]);

  useEffect(() => {
    if (!show) {
      setCurrentPage(1);
      return;
    }

    void refetchNotifications();
    void refetchUnreadCount();
  }, [show, refetchNotifications, refetchUnreadCount]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let shouldReconnect = true;

    const scheduleReconnect = (delay = 3000) => {
      if (!shouldReconnect) return;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      reconnectTimer = setTimeout(connect, delay);
    };

    const getAuthToken = async () => {
      const localToken = localStorage.getItem('token');
      if (localToken) return localToken;

      try {
        const session = await getSession();
        const sessionToken = session?.user?.accessToken;
        return typeof sessionToken === 'string' ? sessionToken : null;
      } catch {
        return null;
      }
    };

    const connect = async () => {
      const token = await getAuthToken();
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      if (!token) {
        scheduleReconnect(1500);
        return;
      }

      if (!baseUrl) {
        console.error(
          'Missing NEXT_PUBLIC_API_BASE_URL for notifications socket',
        );
        scheduleReconnect(5000);
        return;
      }

      let socketUrls: string[] = [];
      try {
        socketUrls = socketUrlsFromApiBase(baseUrl, token);
      } catch (error) {
        console.error('Invalid websocket base URL', error);
        scheduleReconnect(5000);
        return;
      }

      let currentUrlIndex = 0;
      let connectedAtLeastOnce = false;

      const openSocket = () => {
        const currentUrl = socketUrls[currentUrlIndex];
        socket = new WebSocket(currentUrl);

        socket.onopen = () => {
          connectedAtLeastOnce = true;
          // console.log("Notification socket connected");
        };

        socket.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data) as unknown;
            let incoming: Notification[] = [];
            let hasUnreadFromPayload = false;

            if (
              typeof payload === 'object' &&
              payload !== null &&
              'notification' in payload
            ) {
              const source = payload as Record<string, unknown>;
              const notification = source.notification;
              if (isNotification(notification)) {
                incoming = [notification];
              }

              if (typeof source.unread_count === 'number') {
                hasUnreadFromPayload = true;
                setUnreadCount(source.unread_count);
              }
            } else {
              incoming = readList(payload);
              if (incoming.length === 0 && isNotification(payload)) {
                incoming = [payload];
              }
            }

            if (incoming.length > 0) {
              setItems((prev) => {
                const incomingIds = new Set(incoming.map((i) => i.id));
                const rest = prev.filter((i) => !incomingIds.has(i.id));
                return [...incoming, ...rest].slice(0, 30);
              });

              if (!hasUnreadFromPayload) {
                setUnreadCount((prev) => prev + incoming.length);
              }
            }
          } catch (error) {
            console.error('Notification socket parse error', error);
          }
        };

        socket.onerror = (error) => {
          console.error('Notification socket error', error);
        };

        socket.onclose = () => {
          if (!shouldReconnect) return;

          if (
            !connectedAtLeastOnce &&
            currentUrlIndex < socketUrls.length - 1
          ) {
            currentUrlIndex += 1;
            openSocket();
            return;
          }

          scheduleReconnect(3000);
        };
      };

      openSocket();
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== 'token') return;
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      } else {
        scheduleReconnect(100);
      }
    };

    const handleWindowFocus = () => {
      if (!socket || socket.readyState === WebSocket.CLOSED) {
        scheduleReconnect(100);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleWindowFocus);

    void connect();

    return () => {
      shouldReconnect = false;
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleWindowFocus);
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      socket?.close();
    };
  }, []);

  // close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        show &&
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShow(false);
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && show) {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [show]);

  const fallbackItems: Notification[] = notificationData.map((item, index) => ({
    id: -(index + 1),
    notification_type: '',
    message: item.message,
    data: { type: '', alias: '', is_deleted: false },
    is_read: false,
    read_at: null,
    created_at: `${item.date} ${item.time}`,
  }));

  const notificationsToShow = items.length > 0 ? items : fallbackItems;
  const totalPages = Math.max(
    1,
    Math.ceil(notificationsToShow.length / NOTIFICATIONS_LIMIT),
  );
  const visibleNotifications = notificationsToShow.slice(
    (currentPage - 1) * NOTIFICATIONS_LIMIT,
    currentPage * NOTIFICATIONS_LIMIT,
  );

  const handleMakeAllRead = async () => {
    try {
      await makeAllNotificationsRead(undefined).unwrap();
      setUnreadCount(0);
      setItems((prev) => prev.map((item) => ({ ...item, is_read: true })));
      void refetchNotifications();
      void refetchUnreadCount();
    } catch {
      // No-op on failure; leave state unchanged.
      console.warn('Failed to mark all notifications as read');
    }
  };

  const handleReadNotification = async (item: Notification) => {
    if (isFallbackNotification(item) || item.is_read) return;

    try {
      await readNotification({
        id: item.id,
        payload: { is_read: true },
      }).unwrap();
    } catch {
      // Do not block navigation on read sync failure.
      console.warn(`Failed to mark notification ${item.id} as read`);
    }
  };

  return (
    <li className='custom-dropdown' ref={wrapperRef}>
      <a
        href='#javascript'
        onClick={(e) => {
          e.preventDefault();
          setShow(!show);
        }}
      >
        <SVG iconId='notification' />
      </a>
      {unreadCount > 0 && (
        <Badge pill color='warning'>
          {unreadCount}
        </Badge>
      )}
      <div
        className={`custom-menu notification-dropdown py-0 overflow-hidden shadow ${
          show ? 'show' : ''
        }`}
      >
        <div className='d-flex align-items-center justify-content-between px-3 py-2 border-bottom'>
          <span className='fw-semibold'>Notifications</span>
          <Button
            color='primary'
            size='sm'
            onClick={handleMakeAllRead}
            disabled={isMarkingAllRead || unreadCount === 0}
          >
            {isMarkingAllRead ? 'Reading...' : 'Make All Read'}
          </Button>
        </div>
        <ul className='activity-timeline'>
          {visibleNotifications.map((item) => {
            const { date, time } = (() => {
              const input = item.created_at || new Date().toISOString();
              return { date: formatDate(input), time: formatTime(input) };
            })();
            const colorVariant = item.is_read ? 'primary' : 'warning';
            const isDeleted = item.data?.is_deleted === true;

            const content = (
              <>
                <div className='activity-line' />
                <div className={`activity-dot-${colorVariant}`} />
                <div className='flex-grow-1'>
                  <h6
                    className={`f-w-600 font-${colorVariant} text-${colorVariant}`}
                  >
                    {date}
                    {','}
                    <span>{time}</span>
                  </h6>
                  <h5>{item.notification_type || ''}</h5>
                  <p>
                    {isDeleted
                      ? 'This notification related content has been deleted.'
                      : item.message}
                  </p>
                </div>
              </>
            );

            // Deleted notifications render without a redirect link.
            if (isDeleted) {
              return (
                <li className='d-flex align-items-start' key={item.id}>
                  <div className='d-flex align-items-start text-reset w-100'>
                    {content}
                  </div>
                </li>
              );
            }

            return (
              <li className='d-flex align-items-start' key={item.id}>
                <a
                  href={getNotificationTargetUrl(item.data, sessionData)}
                  className='d-flex align-items-start text-decoration-none text-reset w-100'
                  onClick={() => {
                    setShow(false);

                    if (!isFallbackNotification(item) && !item.is_read) {
                      setUnreadCount((prev) => Math.max(0, prev - 1));
                    }

                    setItems((prev) =>
                      prev.map((n) =>
                        n.id === item.id ? { ...n, is_read: true } : n,
                      ),
                    );

                    void handleReadNotification(item);
                    void refetchNotifications();
                    void refetchUnreadCount();
                  }}
                >
                  {content}
                </a>
              </li>
            );
          })}
        </ul>
        {totalPages > 1 && (
          <Pagination className='d-flex justify-content-end p-2'>
            <PaginationItem disabled={currentPage === 1}>
              <PaginationLink first onClick={() => setCurrentPage(1)} />
            </PaginationItem>
            <PaginationItem disabled={currentPage === 1}>
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
                    <PaginationLink onClick={() => setCurrentPage(pageNumber)}>
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
                    (pageNumber) => pageNumber > 1 && pageNumber < totalPages,
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
                  <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem disabled={currentPage === totalPages}>
              <PaginationLink
                next
                onClick={() => setCurrentPage(currentPage + 1)}
              />
            </PaginationItem>
            <PaginationItem disabled={currentPage === totalPages}>
              <PaginationLink last onClick={() => setCurrentPage(totalPages)} />
            </PaginationItem>
          </Pagination>
        )}
      </div>
    </li>
  );
};

export default NotificationHeader;
