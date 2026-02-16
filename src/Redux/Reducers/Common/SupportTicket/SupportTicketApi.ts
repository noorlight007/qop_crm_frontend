import { baseApi } from "@/Redux/Api/BaseApi";

export const SupportTicketApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSupportTicket: builder.mutation({
      query: ({ payload }) => ({
        url: `/api/support-ticket/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SupportTicket"],
    }),
    fetchSupportTicket: builder.query({
      query: ({ params }) => ({
        url: `/api/support-ticket/`,
        method: "GET",
        params,
      }),
      providesTags: ["SupportTicket"],
    }),
    updateSupportTicket: builder.mutation({
      query: ({ payload, ticket_alias }) => ({
        url: `/api/support-ticket/${ticket_alias}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["SupportTicket"],
    }),
    deleteSupportTicket: builder.mutation({
      query: ({ ticket_alias }) => ({
        url: `/api/support-ticket/${ticket_alias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["SupportTicket"],
    }),
    fetchSupportTicketDetails: builder.query({
      query: ({ ticket_alias }) => ({
        url: `/api/support-ticket/${ticket_alias}/`,
        method: "GET",
      }),
      providesTags: ["SupportTicket"],
    }),
  }),
});

export const {
  useCreateSupportTicketMutation,
  useFetchSupportTicketQuery,
  useUpdateSupportTicketMutation,
  useDeleteSupportTicketMutation,
  useFetchSupportTicketDetailsQuery,
} = SupportTicketApi;
