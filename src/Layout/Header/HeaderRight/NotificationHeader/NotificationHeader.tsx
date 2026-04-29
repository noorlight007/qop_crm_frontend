import SVG from "@/CommonComponent/SVG";
import { Href } from "@/Constant";
import { notificationData } from "@/Data/Layout/HeaderData";
import {
  useGetNotificationsQuery,
  useGetUnreadNotificationsCountQuery,
  useMakeAllNotificationsReadMutation,
  useReadNotificationMutation,
} from "@/Redux/Reducers/Common/Notification/NotificationApi";
import { UINotification } from "@/Types/Common/Notification/NotificationType";
import { getNotificationTargetUrl } from "@/utils/notificationRedirect";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Badge } from "reactstrap";

const toSafeDateTime = (input?: string) => {
  const parsed = input ? new Date(input) : new Date();
  const validDate = Number.isNaN(parsed.getTime()) ? new Date() : parsed;

  return {
    date: validDate.toLocaleDateString(),
    time: validDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

const normalizeNotification = (
  item: Record<string, unknown>,
  fallbackKey: string,
): UINotification => {
  const createdAt =
    (item.created_at as string | undefined) ||
    (item.createdAt as string | undefined) ||
    (item.timestamp as string | undefined) ||
    (item.date as string | undefined);

  const { date, time } = toSafeDateTime(createdAt);
  const payloadData =
    typeof item.data === "object" && item.data !== null
      ? (item.data as Record<string, unknown>)
      : null;

  const isUnread =
    item.is_read === false || item.read === false || item.unread === true;

  const eventTimePart =
    typeof item.timestamp === "string"
      ? item.timestamp
      : typeof item.created_at === "string"
        ? item.created_at
        : typeof item.createdAt === "string"
          ? item.createdAt
          : "";
  const eventMessagePart =
    typeof item.message === "string"
      ? item.message
      : typeof item.body === "string"
        ? item.body
        : "";

  const eventKeySource =
    (item.notification_id as string | undefined) ||
    (item.uuid as string | undefined) ||
    (item.id as string | undefined);

  const derivedEventId =
    eventKeySource && (eventTimePart || eventMessagePart)
      ? `${eventKeySource}-${eventTimePart}-${eventMessagePart}`
      : undefined;

  return {
    id: String(
      item.id ??
        item.uuid ??
        item.notification_id ??
        derivedEventId ??
        fallbackKey,
    ),
    date,
    time,
    dotColor: isUnread ? "warning" : "primary",
    fontColor: isUnread ? "warning" : "primary",
    notification_type: String(
      item.title ??
        item.notification_type ??
        payloadData?.subject ??
        item.sender_name ??
        "Notification",
    ),
    message: String(item.message ?? item.body ?? item.description ?? ""),
    is_read: item.is_read === true,
    dataType:
      typeof payloadData?.type === "string" ? payloadData.type : undefined,
    dataAlias:
      typeof payloadData?.alias === "string" ? payloadData.alias : undefined,
  };
};

const readList = (data: unknown): Record<string, unknown>[] => {
  if (Array.isArray(data)) {
    return data.filter(
      (item): item is Record<string, unknown> =>
        typeof item === "object" && item !== null,
    );
  }

  if (typeof data === "object" && data !== null) {
    const source = data as Record<string, unknown>;
    const candidate = source.results ?? source.notifications ?? source.data;

    if (Array.isArray(candidate)) {
      return candidate.filter(
        (item): item is Record<string, unknown> =>
          typeof item === "object" && item !== null,
      );
    }
  }

  return [];
};

const readUnreadCount = (data: unknown): number => {
  if (typeof data === "number") return data;
  if (typeof data !== "object" || data === null) return 0;

  const source = data as Record<string, unknown>;
  const count = source.unread_count ?? source.unreadCount ?? source.count;
  return typeof count === "number" ? count : 0;
};

const socketUrlsFromApiBase = (baseUrl: string, token: string) => {
  const normalizedBase =
    baseUrl.startsWith("http://") || baseUrl.startsWith("https://")
      ? baseUrl
      : `https://${baseUrl}`;
  const parsed = new URL(normalizedBase);
  const wsProtocol = parsed.protocol === "https:" ? "wss:" : "ws:";
  const wsBase = `${wsProtocol}//${parsed.host}`;
  const pathPrefix = parsed.pathname.replace(/\/+$/, "");

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

const NotificationHeader = () => {
  const [show, setShow] = useState(false);
  const [items, setItems] = useState<UINotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [sessionData, setSessionData] = useState<Session | null>(null);
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
    const list = readList(notificationsData);
    setItems(
      list.map((item, idx) =>
        normalizeNotification(item, `api-${idx}-${Date.now()}`),
      ),
    );
  }, [notificationsData]);

  useEffect(() => {
    setUnreadCount(readUnreadCount(unreadData));
  }, [unreadData]);

  useEffect(() => {
    if (!show) {
      setVisibleCount(4);
      return;
    }

    void refetchNotifications();
    void refetchUnreadCount();
  }, [show, refetchNotifications, refetchUnreadCount]);

  useEffect(() => {
    if (typeof window === "undefined") return;

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
      const localToken = localStorage.getItem("token");
      if (localToken) return localToken;

      try {
        const session = await getSession();
        const sessionToken = session?.user?.accessToken;
        return typeof sessionToken === "string" ? sessionToken : null;
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
          "Missing NEXT_PUBLIC_API_BASE_URL for notifications socket",
        );
        scheduleReconnect(5000);
        return;
      }

      let socketUrls: string[] = [];
      try {
        socketUrls = socketUrlsFromApiBase(baseUrl, token);
      } catch (error) {
        console.error("Invalid websocket base URL", error);
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
          console.log("Notification socket connected");
        };

        socket.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data) as unknown;
            let incoming: Record<string, unknown>[] = [];
            let hasUnreadFromPayload = false;

            if (
              typeof payload === "object" &&
              payload !== null &&
              "notification" in payload
            ) {
              const source = payload as Record<string, unknown>;
              const notification = source.notification;
              if (typeof notification === "object" && notification !== null) {
                incoming = [notification as Record<string, unknown>];
              }

              if (typeof source.unread_count === "number") {
                hasUnreadFromPayload = true;
                setUnreadCount(source.unread_count);
              }
            } else {
              incoming = readList(payload);
              if (
                incoming.length === 0 &&
                typeof payload === "object" &&
                payload !== null
              ) {
                incoming = [payload as Record<string, unknown>];
              }
            }

            if (incoming.length > 0) {
              const mapped = incoming.map((item, index) =>
                normalizeNotification(item, `ws-${Date.now()}-${index}`),
              );

              setItems((prev) => {
                const incomingIds = new Set(mapped.map((i) => i.id));
                const rest = prev.filter((i) => !incomingIds.has(i.id));
                return [...mapped, ...rest].slice(0, 30);
              });

              if (!hasUnreadFromPayload) {
                setUnreadCount((prev) => prev + mapped.length);
              }
            }
          } catch (error) {
            console.error("Notification socket parse error", error);
          }
        };

        socket.onerror = (error) => {
          console.error("Notification socket error", error);
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
      if (event.key !== "token") return;
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

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleWindowFocus);

    void connect();

    return () => {
      shouldReconnect = false;
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleWindowFocus);
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
      if (e.key === "Escape" && show) {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [show]);
  const fallbackItems: UINotification[] = notificationData.map(
    (item, index) => ({
      id: `fallback-${index}`,
      date: item.date,
      time: item.time,
      dotColor: item.dotColor === "secondary" ? "warning" : "primary",
      fontColor: item.fontColor === "secondary" ? "warning" : "primary",
      message: item.message,
      is_read: false,
    }),
  );

  const notificationsToShow = items.length > 0 ? items : fallbackItems;
  const visibleNotifications = notificationsToShow.slice(0, visibleCount);
  const hasMoreNotifications = notificationsToShow.length > visibleCount;

  const handleMakeAllRead = async () => {
    try {
      await makeAllNotificationsRead(undefined).unwrap();
      setUnreadCount(0);
      setItems((prev) =>
        prev.map((item) => ({
          ...item,
          is_read: true,
          dotColor: "primary",
          fontColor: "primary",
        })),
      );
      void refetchNotifications();
      void refetchUnreadCount();
    } catch {
      // No-op on failure; leave state unchanged.
      console.warn("Failed to mark all notifications as read");
    }
  };

  const handleReadNotification = async (item: UINotification) => {
    if (item.id.startsWith("fallback-") || item.is_read) return;

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
    <li className="custom-dropdown" ref={wrapperRef}>
      <a
        href={Href}
        onClick={(e) => {
          e.preventDefault();
          setShow(!show);
        }}
      >
        <SVG iconId="notification" />
      </a>
      {unreadCount > 0 && (
        <Badge pill color="warning">
          {unreadCount}
        </Badge>
      )}
      <div
        className={`custom-menu notification-dropdown py-0 overflow-hidden shadow ${
          show ? "show" : ""
        }`}
      >
        <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
          <span className="fw-semibold">Notifications</span>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={handleMakeAllRead}
            disabled={isMarkingAllRead || unreadCount === 0}
          >
            {isMarkingAllRead ? "Reading..." : "Make All Read"}
          </button>
        </div>
        <ul className="activity-timeline">
          {visibleNotifications.map((item) => (
            <li className="d-flex align-items-start" key={item.id}>
              <Link
                href={getNotificationTargetUrl(item, sessionData)}
                className="d-flex align-items-start text-decoration-none text-reset w-100"
                onClick={() => {
                  setShow(false);

                  if (!item.id.startsWith("fallback-") && !item.is_read) {
                    setUnreadCount((prev) => Math.max(0, prev - 1));
                  }

                  setItems((prev) =>
                    prev.map((n) =>
                      n.id === item.id
                        ? {
                            ...n,
                            is_read: true,
                            dotColor: "primary",
                            fontColor: "primary",
                          }
                        : n,
                    ),
                  );

                  void handleReadNotification(item);
                  void refetchNotifications();
                  void refetchUnreadCount();
                }}
              >
                <div className="activity-line" />
                <div className={`activity-dot-${item.dotColor}`} />
                <div className="flex-grow-1">
                  <h6
                    className={`f-w-600 font-${item.fontColor} text-${item.fontColor}`}
                  >
                    {item.date}
                    <span>{item.time}</span>
                    {/* <span className={`circle-dot-${item.dotColor} float-end`}>
                      <SVG className="circle-color" iconId="circle" />
                    </span> */}
                  </h6>
                  <h5>{item.notification_type || ""}</h5>
                  <p>{item.message}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        {hasMoreNotifications && (
          <div className="text-center p-2 border-top">
            <Link
              href="/notifications"
              className="btn btn-outline-primary btn-sm"
              onClick={() => {
                setShow(false);
              }}
            >
              Show More
            </Link>
          </div>
        )}
      </div>
    </li>
  );
};

export default NotificationHeader;
