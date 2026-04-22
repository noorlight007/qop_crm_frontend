import { baseApi } from "@/Redux/Api/BaseApi";

export const NotificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (params) => ({
        url: "/notifications/",
        method: "GET",
        params,
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
    makeAllNotificationsRead: builder.mutation({
      query: () => ({
        url: "/notifications/make-all-read/",
        method: "POST",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationDetailsQuery,
  useGetUnreadNotificationsCountQuery,
  useMakeAllNotificationsReadMutation,
} = NotificationApi;
