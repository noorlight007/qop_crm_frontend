import { baseApi } from "@/Redux/Api/BaseApi";

export const NotificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => ({
        url: "/notifications/",
        method: "GET",
      }),
      providesTags: ["Notifications"],
    }),
    getNotificationDetails: builder.query({
      query: (id) => ({
        url: `/notifications/${id}/`,
        method: "GET",
      }),
      providesTags: ["Notifications"],
    }),
    getUnreadNotificationsCount: builder.query({
      query: () => ({
        url: "/notifications/unread-count/",
        method: "GET",
      }),
      providesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationDetailsQuery,
  useGetUnreadNotificationsCountQuery,
} = NotificationApi;
