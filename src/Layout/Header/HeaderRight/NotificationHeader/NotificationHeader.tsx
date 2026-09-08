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
import { Badge, Button } from 'reactstrap';
import PaginationBar from './PaginationBar';

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

// NEW: pull the server-side total out of the paginated response
// (falls back gracefully if the API ever returns a bare array)
const readCount = (data: unknown): number => {
  if (Array.isArray(data)) return data.length;

  if (typeof data !== 'object' || data === null) return 0;

  const source = data as Record<string, unknown>;
  const count = source.count ?? source.total ?? source.total_count;
  return typeof count === 'number' ? count : 0;
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

// Builds a compact page list with ellipses, e.g. [1, '…', 4, 5, 6, '…', 12]
type PageToken = number | 'ellipsis-start' | 'ellipsis-end';

const buildPageTokens = (
  currentPage: number,
  totalPages: number,
): PageToken[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const tokens: PageToken[] = [1];

  if (currentPage > 3) tokens.push('ellipsis-start');

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let page = start; page <= end; page += 1) {
    tokens.push(page);
  }

  if (currentPage < totalPages - 2) tokens.push('ellipsis-end');

  tokens.push(totalPages);

  return tokens;
};

const NotificationHeader = () => {
  const [show, setShow] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0); // NEW
  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const wrapperRef = useRef<HTMLLIElement>(null);

  // CHANGED: pass currentPage so RTK Query refetches per page automatically
  const { data: notificationsData, refetch: refetchNotifications } =
    useGetNotificationsQuery(
      { page: currentPage, limit: NOTIFICATIONS_LIMIT },
      {
        refetchOnFocus: true,
        refetchOnReconnect: true,
      },
    );

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
    setTotalCount(readCount(notificationsData)); // NEW
  }, [notificationsData]);

  useEffect(() => {
    setUnreadCount(readUnreadCount(unreadData));
  }, [unreadData]);

  // CHANGED: only reset the page when the dropdown opens; the actual
  // refetch now happens automatically because currentPage is a query arg
  useEffect(() => {
    if (!show) {
      setCurrentPage(1);
      return;
    }

    void refetchNotifications();
    void refetchUnreadCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

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
              // Only splice sockets pushes into page 1's view; a full
              // re-sync for other pages happens next time they're opened.
              if (currentPage === 1) {
                setItems((prev) => {
                  const incomingIds = new Set(incoming.map((i) => i.id));
                  const rest = prev.filter((i) => !incomingIds.has(i.id));
                  return [...incoming, ...rest].slice(0, NOTIFICATIONS_LIMIT);
                });
              }

              setTotalCount((prev) => prev + incoming.length); // NEW

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // CHANGED: no local pagination anymore — `items` is already the current
  // page's data from the API. Fallback still applies when there's nothing.
  const usingFallback = items.length === 0 && totalCount === 0;
  const visibleNotifications = usingFallback ? fallbackItems : items;
  const totalPages = usingFallback
    ? Math.max(1, Math.ceil(fallbackItems.length / NOTIFICATIONS_LIMIT))
    : Math.max(1, Math.ceil(totalCount / NOTIFICATIONS_LIMIT));

  // Fallback items still need local slicing since they never came from the API
  const pagedFallback = usingFallback
    ? fallbackItems.slice(
        (currentPage - 1) * NOTIFICATIONS_LIMIT,
        currentPage * NOTIFICATIONS_LIMIT,
      )
    : visibleNotifications;

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

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
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
          {pagedFallback.map((item) => {
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

                  {isDeleted ? (
                    <p className='text-danger'>
                      This notification related content has been deleted.
                    </p>
                  ) : (
                    <p>{item.message || ''}</p>
                  )}
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

        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </li>
  );
};

export default NotificationHeader;
